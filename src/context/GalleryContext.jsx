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
    // Use the production backend URL
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
      console.log('Raw API response:', response);

      if (!response.data) {
        throw new Error('No data received from API');
      }

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

        let imageUrl = item.image;
        console.log('Processing gallery item:', {
          title: item.title,
          originalImageUrl: imageUrl
        });
        
        // If the image URL is relative, make it absolute
        if (imageUrl && !imageUrl.startsWith('http')) {
          // Ensure the path starts with /uploads/
          if (!imageUrl.startsWith('/uploads/')) {
            imageUrl = `/uploads/${imageUrl.replace(/^\/+/, '')}`;
          }
          // Make the URL absolute with backend URL
          imageUrl = `${backendUrl}${imageUrl}`.replace(/([^:]\/)\/+/g, '$1');
          console.log('Constructed image URL:', imageUrl);
        }

        return {
          _id: item._id,
          title: item.title || 'Untitled',
          description: item.description || '',
          imageUrl: imageUrl,
          alt: item.title || 'Gallery image',
          timestamp: item.createdAt || Date.now()
        };
      }).filter(Boolean); // Remove any null items

      console.log('Final processed gallery items:', processedGallery);
      setGallery(processedGallery);
      setError(null);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load gallery items';
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
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
