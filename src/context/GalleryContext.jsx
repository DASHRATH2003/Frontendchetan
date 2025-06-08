import React, { createContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const GalleryContext = createContext();

export const validCategories = ['events', 'movies', 'celebrations', 'awards', 'behind-the-scenes', 'other'];

export const GalleryProvider = ({ children }) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get backend URL - memoized to prevent unnecessary recalculations
  const backendUrl = useMemo(() => {
    const isProduction = window.location.hostname === 'chethancinemas.com' || 
                        window.location.hostname === 'www.chethancinemas.com' ||
                        window.location.hostname === 'frontendchetan.vercel.app';
    
    return isProduction 
      ? 'https://backendchetan.onrender.com'
      : 'http://localhost:5000';
  }, []);

  // Process gallery items to ensure they have imageUrl
  const processGalleryItems = (items) => {
    return items.map(item => ({
      ...item,
      imageUrl: item.image // Use the Cloudinary URL directly
    }));
  };

  // Fetch gallery items
  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/gallery`);
      
      // Process and set the gallery items
      const items = Array.isArray(response.data) ? response.data : (response.data.data || []);
      setGallery(processGalleryItems(items));
      setError(null);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError('Failed to fetch gallery items');
      setGallery([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const addGalleryItem = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      // Log the formData contents for debugging
      console.log('FormData being sent:', {
        title: formData.get('title'),
        category: formData.get('category'),
        hasImage: formData.get('image') !== null
      });

      const response = await axios.post(`${backendUrl}/api/gallery`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to add gallery item');
      }

      // Process the new item and update the gallery
      const newItem = processGalleryItems([response.data.data])[0];
      setGallery(prev => [newItem, ...prev]);

      return {
        success: true,
        data: newItem,
        message: response.data.message || 'Gallery item added successfully'
      };
    } catch (err) {
      console.error('Error adding gallery item:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to add gallery item';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteGalleryItem = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      const response = await axios.delete(`${backendUrl}/api/gallery/${id}`, {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete gallery item');
      }

      // Update the local state immediately
      setGallery(prev => prev.filter(item => item._id !== id));

      return {
        success: true,
        message: response.data.message || 'Gallery item deleted successfully'
      };
    } catch (err) {
      console.error('Error deleting gallery item:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete gallery item';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GalleryContext.Provider value={{
      gallery,
      loading,
      error,
      fetchGallery,
      addGalleryItem,
      deleteGalleryItem
    }}>
      {children}
    </GalleryContext.Provider>
  );
};

GalleryProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default GalleryContext;