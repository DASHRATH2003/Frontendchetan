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
    // Always use production URL for deployed site
    return 'https://chetanbackend.onrender.com';
  };

  // Function to fetch gallery data from backend
  const fetchGalleryFromBackend = async () => {
    try {
      setLoading(true);
      setError(null);
      const backendUrl = getBackendUrl();
      console.log('Fetching gallery from:', backendUrl);
      
      const response = await axios.get(`${backendUrl}/api/gallery`);
      const galleryData = response.data;

      // If no gallery items found in backend, use default gallery
      if (!galleryData || galleryData.length === 0) {
        console.log('No gallery items found in backend, using default gallery');
        setGallery(defaultGallery);
        setError(null);
        return defaultGallery;
      }

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

      setGallery(processedGallery);
      setError(null);
      return processedGallery;
    } catch (err) {
      console.error('Error fetching gallery:', err);
      console.log('Using default gallery due to error');
      setGallery(defaultGallery); // Use default gallery on error
      setError(null); // Don't show error since we have fallback data
      return defaultGallery;
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

      // Upload to backend
      const response = await axios.post(`${backendUrl}/api/gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Refresh the gallery after adding new item
      await fetchGalleryFromBackend();
      setError(null);
      return response.data;
    } catch (err) {
      console.error('Error adding gallery item:', err);
      setError('Failed to add gallery item');
      throw err;
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
