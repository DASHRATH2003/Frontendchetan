import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBackendUrl = () => {
    // Always use the production URL for deployed site
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:5000';
    }
    return 'https://chetanbackend.onrender.com';
  };

  // Function to fetch gallery data from backend
  const fetchGalleryFromBackend = async () => {
    try {
      setLoading(true);
      setError(null);
      const backendUrl = getBackendUrl();
      console.log('Fetching gallery from:', backendUrl);
      
      const response = await axios.get(`${backendUrl}/api/gallery`, {
        timeout: 5000, // 5 second timeout
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      const galleryData = response.data;
      console.log('Received gallery data:', galleryData);

      // Process the gallery data and ensure image URLs are absolute
      const processedGallery = galleryData.map(item => {
        let imageUrl = item.image;
        
        // If the image URL is relative, make it absolute
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `${backendUrl}${imageUrl}`;
        }

        return {
          _id: item._id,
          title: item.title || 'Untitled',
          description: item.description || '',
          imageUrl: imageUrl,
          alt: item.title || 'Gallery image',
          timestamp: item.createdAt || Date.now()
        };
      });

      console.log('Processed gallery:', processedGallery);
      setGallery(processedGallery);
      setError(null);
      return processedGallery;
    } catch (error) {
      console.error('Error fetching gallery from backend:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load gallery';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Initialize gallery data
  useEffect(() => {
    fetchGalleryFromBackend();
  }, []);

  // Add gallery item
  const addGalleryItem = async (item) => {
    try {
      setLoading(true);
      setError(null);
      const backendUrl = getBackendUrl();

      // Validate input
      if (!item.title) {
        throw new Error('Title is required');
      }

      if (!item.imageUrl || !(item.imageUrl instanceof File)) {
        throw new Error('Valid image file is required');
      }

      // Create form data for the upload
      const formData = new FormData();
      formData.append('title', item.title);
      formData.append('description', item.description || '');
      formData.append('image', item.imageUrl);

      console.log('Uploading to:', `${backendUrl}/api/gallery`);
      console.log('Form data:', {
        title: item.title,
        description: item.description,
        imageFile: item.imageUrl.name
      });

      // Upload to backend
      const response = await axios.post(`${backendUrl}/api/gallery`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        },
        timeout: 10000, // 10 second timeout
        withCredentials: true // Include credentials
      });

      // Get the new item from the response
      const newItem = response.data;
      console.log('Upload successful:', newItem);

      // Refresh the entire gallery to ensure consistency
      await fetchGalleryFromBackend();

      setError(null);
      return response.data;
    } catch (error) {
      console.error('Error adding gallery item:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add gallery item';
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

      await axios.delete(`${backendUrl}/api/gallery/${id}`, {
        timeout: 5000,
        withCredentials: true
      });

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
      refreshGallery: fetchGalleryFromBackend
    }}>
      {children}
    </GalleryContext.Provider>
  );
};

export default GalleryContext;
