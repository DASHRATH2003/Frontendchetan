import React, { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const GalleryContext = createContext();

// Base64 encoded placeholder image
const PLACEHOLDER_IMAGE = 'data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAIAAAABBxAREYiI/gcAAABWUDggGAAAADABAJ0BKgEAAQABABwlpAADcAD+/gbQAA==';

export const GalleryProvider = ({ children }) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processedUrls] = useState(new Map());

  const getBackendUrl = () => {
    return import.meta.env.PROD
      ? 'https://backendchetan.onrender.com'
      : 'http://localhost:5000';
  };

  const processImageUrl = (imageUrl) => {
    if (!imageUrl) {
      console.log('No image URL provided');
      return PLACEHOLDER_IMAGE;
    }

    // Check cache first
    if (processedUrls.has(imageUrl)) {
      return processedUrls.get(imageUrl);
    }

    // If it's already a full URL, cache and return it
    if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
      processedUrls.set(imageUrl, imageUrl);
      return imageUrl;
    }

    // For uploads or relative paths, construct the full URL
    const backendUrl = getBackendUrl();
    
    // Clean up the path and ensure it starts with /uploads/
    const cleanPath = imageUrl.replace(/^\/+/, '').replace(/^uploads\//, '');
    const finalPath = `/uploads/${cleanPath}`;
    const fullUrl = `${backendUrl}${finalPath}`;
    
    // Cache the processed URL
    processedUrls.set(imageUrl, fullUrl);
    
    // Log the constructed URL for debugging
    console.log('Image URL details:', {
      original: imageUrl,
      cleaned: cleanPath,
      final: fullUrl,
      backendUrl,
      isProduction: import.meta.env.PROD
    });
    
    return fullUrl;
  };

  // Function to fetch gallery with retry
  const fetchGalleryWithRetry = async (retries = 3, delay = 2000) => {
    let lastError;
    
    for (let i = 0; i < retries; i++) {
      try {
        const backendUrl = getBackendUrl();
        console.log(`Attempt ${i + 1}/${retries} - Fetching gallery from:`, backendUrl);
        
        const response = await axios.get(`${backendUrl}/api/gallery`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout for production
        });

        if (!response.data) {
          throw new Error('No data received from API');
        }

        return response;
      } catch (err) {
        lastError = err;
        console.error(`Attempt ${i + 1} failed:`, {
          message: err.message,
          code: err.code,
          response: err.response?.data
        });
        
        if (i === retries - 1) {
          break; // Last attempt failed
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // If we get here, all retries failed
    throw lastError;
  };

  // Function to fetch gallery data from backend
  const fetchGalleryFromBackend = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchGalleryWithRetry();
      console.log('Raw API response:', response);

      // Handle both the old array format and new object format
      let galleryData;
      if (Array.isArray(response.data)) {
        // Old format - direct array
        galleryData = response.data;
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        // New format - wrapped in success object
        galleryData = response.data.data;
      } else if (response.data && Array.isArray(response.data.gallery)) {
        // Alternative format
        galleryData = response.data.gallery;
      } else {
        console.error('Invalid gallery data format:', response.data);
        throw new Error('Invalid gallery data format received');
      }
      
      console.log('Gallery data received:', galleryData);

      // Process the gallery data
      const processedGallery = galleryData.map(item => {
        if (!item || typeof item !== 'object') {
          console.error('Invalid gallery item:', item);
          return null;
        }
        
        // Ensure we have a valid image path
        const imagePath = item.image || item.imageUrl || '';
        if (!imagePath) {
          console.error('Gallery item has no image path:', item);
          return null;
        }

        return {
          _id: item._id || item.id,
          title: item.title || 'Untitled',
          description: item.description || '',
          image: imagePath,
          imageUrl: processImageUrl(imagePath),
          alt: item.title || 'Gallery image',
          timestamp: item.createdAt || item.timestamp || Date.now()
        };
      }).filter(Boolean); // Remove any null items

      console.log('Final processed gallery items:', processedGallery);
      setGallery(processedGallery);
      setError(null);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load gallery items';
      setError(errorMessage);
      setGallery([]); // Clear gallery on error
    } finally {
      setLoading(false);
    }
  };

  // Initialize gallery data
  useEffect(() => {
    fetchGalleryFromBackend();
  }, []);

  // Add gallery item with better error handling
  const addGalleryItem = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const backendUrl = getBackendUrl();

      // Validate input
      const title = formData.get('title');
      const image = formData.get('image');

      if (!title) {
        throw new Error('Title is required');
      }

      if (!image || !(image instanceof File)) {
        throw new Error('Valid image file is required');
      }

      console.log('Uploading gallery item:', {
        title: formData.get('title'),
        description: formData.get('description'),
        fileName: image.name,
        fileType: image.type,
        fileSize: image.size,
        backendUrl
      });

      // Upload to backend
      const token = localStorage.getItem('token');
      console.log('Using auth token:', token ? 'Present' : 'Not present');

      const response = await axios.post(`${backendUrl}/api/gallery`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token || '',
          'Accept': 'application/json'
        },
        withCredentials: true,
        timeout: 30000, // 30 second timeout
        validateStatus: null // Allow all status codes
      });

      console.log('Upload response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });

      // Check if the response has the expected structure
      if (!response.data || !response.data.success || !response.data.data) {
        console.error('Invalid server response:', response.data);
        throw new Error(response.data?.message || 'Invalid response from server');
      }

      // The server now provides the complete item with imageUrl
      const newItem = response.data.data;
      
      // Add the new item to the local state immediately
      setGallery(prevItems => [newItem, ...prevItems]);

      setError(null);
      return {
        success: true,
        message: response.data.message || 'Image uploaded successfully',
        data: newItem
      };
    } catch (err) {
      console.error('Error adding gallery item:', {
        message: err.message,
        code: err.code,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });

      let errorMessage;
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Upload timed out. Please try again.';
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (err.response?.status === 413) {
        errorMessage = 'Image file is too large. Maximum size is 5MB.';
      } else {
        errorMessage = err.response?.data?.message || err.message || 'Failed to add gallery item';
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete gallery item
  const deleteGalleryItem = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const backendUrl = getBackendUrl();

      await axios.delete(`${backendUrl}/api/gallery/${id}`);

      // Refresh the gallery after deletion
      await fetchGalleryFromBackend();
      setError(null);
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete gallery item';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete all gallery items
  const deleteAllGalleryItems = async () => {
    try {
      setLoading(true);
      const backendUrl = getBackendUrl();

      await axios.delete(`${backendUrl}/api/gallery/all`);
      setGallery([]); // Clear the local state
      setError(null);
    } catch (error) {
      console.error('Error deleting all gallery items:', error);
      setError('Failed to delete all gallery items');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <GalleryContext.Provider value={{
      gallery,
      loading,
      error,
      addGalleryItem,
      deleteGalleryItem,
      deleteAllGalleryItems,
      processImageUrl,
      refreshGallery: fetchGalleryFromBackend
    }}>
      {children}
    </GalleryContext.Provider>
  );
};

GalleryProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default GalleryContext;
