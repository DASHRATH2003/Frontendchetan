import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const GalleryContext = createContext();

export const GalleryProvider = ({ children }) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getBackendUrl = () => {
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:5000' 
      : process.env.REACT_APP_BACKEND_URL || 'https://your-backend-url.com';
  };

  // Function to fetch gallery data from backend
  const fetchGalleryFromBackend = async () => {
    try {
      const backendUrl = getBackendUrl();
      const response = await axios.get(`${backendUrl}/api/gallery`);
      const galleryData = response.data;

      // Process the gallery data and ensure image URLs are absolute
      const processedGallery = galleryData.map(item => {
        let imageUrl = item.image;
        
        // If the image URL is relative, make it absolute
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `${backendUrl}${imageUrl}`;
        }

        return {
          _id: item._id,
          title: item.caption || 'Untitled',
          description: item.description || '',
          imageUrl: imageUrl,
          alt: item.caption || 'Gallery image',
          timestamp: item.createdAt || Date.now()
        };
      });

      setGallery(processedGallery);
      setError(null);
      return processedGallery;
    } catch (error) {
      console.error('Error fetching gallery from backend:', error);
      setError('Failed to load gallery');
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
      formData.append('caption', item.title);
      formData.append('description', item.description || '');
      formData.append('image', item.imageUrl);

      // Upload to backend
      const response = await axios.post(`${backendUrl}/api/gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Get the new item from the response
      const newItem = response.data;

      // Update state with the new item
      setGallery(prevGallery => {
        // Filter out any potential duplicates (same image path)
        const filteredGallery = prevGallery.filter(g => g.image !== newItem.image);
        return [
          {
            _id: newItem._id,
            title: newItem.caption || 'Untitled',
            description: newItem.description || '',
            imageUrl: `${backendUrl}${newItem.image}`,
            alt: newItem.caption || 'Gallery image',
            timestamp: newItem.createdAt || Date.now()
          },
          ...filteredGallery
        ];
      });

      setError(null);
      return response.data;
    } catch (error) {
      console.error('Error adding gallery item:', error);
      setError(error.message || 'Failed to add gallery item');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete gallery item
  const deleteGalleryItem = async (id) => {
    try {
      setLoading(true);
      const backendUrl = getBackendUrl();

      await axios.delete(`${backendUrl}/api/gallery/${id}`);

      // Update state by removing the deleted item
      setGallery(prevGallery => prevGallery.filter(item => item._id !== id));
      setError(null);
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      setError('Failed to delete gallery item');
      throw error;
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
