import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default gallery data
  const defaultGallery = [
    {
      _id: '1',
      title: 'Behind the Scenes 1',
      description: 'Shooting day at location',
      imageUrl: '/images/gallery/bts1.jpg',
      alt: 'Behind the scenes photo 1',
      timestamp: new Date('2024-01-15').getTime()
    },
    {
      _id: '2',
      title: 'Production Meeting',
      description: 'Team discussion for upcoming project',
      imageUrl: '/images/gallery/meeting.jpg',
      alt: 'Production meeting photo',
      timestamp: new Date('2024-02-20').getTime()
    },
    {
      _id: '3',
      title: 'Location Scouting',
      description: 'Finding perfect locations for the shoot',
      imageUrl: '/images/gallery/location.jpg',
      alt: 'Location scouting photo',
      timestamp: new Date('2024-03-10').getTime()
    }
  ];

  const getBackendUrl = () => {
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:5000' 
      : 'https://backendchetan.onrender.com';
  };

  const processImageUrl = (imageUrl) => {
    if (!imageUrl) {
      console.log('No image URL provided');
      return '/placeholder.webp';
    }

    // If it's already a full URL, return it as is
    if (imageUrl.startsWith('http')) {
      console.log('Using full URL:', imageUrl);
      return imageUrl;
    }

    // For uploads or relative paths, construct the full URL
    const backendUrl = getBackendUrl();
    
    // Clean up the path and ensure it starts with /uploads/
    const cleanPath = imageUrl.replace(/^\/+/, '').replace(/^uploads\//, '');
    const finalPath = `/uploads/${cleanPath}`;
    const fullUrl = `${backendUrl}${finalPath}`;
    
    console.log('Constructed image URL:', fullUrl);
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

      const galleryData = response.data;
      console.log('Gallery data received:', galleryData);

      if (!Array.isArray(galleryData)) {
        console.error('Invalid gallery data format:', galleryData);
        throw new Error('Invalid gallery data format received');
      }

      // Process the gallery data
      const processedGallery = galleryData.map(item => {
        if (!item || typeof item !== 'object') {
          console.error('Invalid gallery item:', item);
          return null;
        }

        // Use the processImageUrl function for consistent URL handling
        const imageUrl = processImageUrl(item.image);
        
        return {
          _id: item._id,
          title: item.title || 'Untitled',
          description: item.description || '',
          image: item.image,
          imageUrl: imageUrl,
          alt: item.title || 'Gallery image',
          timestamp: item.createdAt || Date.now()
        };
      }).filter(Boolean);

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
        fileSize: image.size
      });

      // Upload to backend
      const response = await axios.post(`${backendUrl}/api/gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Upload response:', response.data);

      // Add the new item to the local state immediately
      const newItem = response.data;
      
      setGallery(prevItems => [newItem, ...prevItems]);

      // Also refresh the full list to ensure consistency
      await fetchGalleryFromBackend();
      
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error adding gallery item:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add gallery item';
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
      refreshGallery: fetchGalleryFromBackend
    }}>
      {children}
    </GalleryContext.Provider>
  );
};

export default GalleryContext;
