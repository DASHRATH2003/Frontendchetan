// import React, { createContext, useState, useEffect, useCallback } from 'react';
// import PropTypes from 'prop-types';
// import axios from 'axios';

// const GalleryContext = createContext();

// export const GalleryProvider = ({ children }) => {
//   const [gallery, setGallery] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 1
//   });

//   const backendUrl = import.meta.env.MODE === 'development' 
//     ? 'http://localhost:5000'  // or whatever port your backend runs on
//     : 'https://backendchetan.onrender.com';

//   const fetchGallery = useCallback(async (params = {}) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await axios.get(`${backendUrl}/api/gallery`, {
//         params: {
//           page: params.page || 1,
//           limit: params.limit || 20,
//           category: params.category,
//           section: params.section,
//           year: params.year,
//           search: params.search
//         },
//         timeout: 10000
//       });

//       if (!response.data || !response.data.success) {
//         throw new Error(response.data?.message || 'Invalid response format');
//       }

//       setGallery(response.data.data);
//       setPagination({
//         page: response.data.page,
//         limit: response.data.limit,
//         total: response.data.total,
//         pages: response.data.pages
//       });
//     } catch (err) {
//       console.error('Error fetching gallery:', err);
//       setError(err.response?.data?.message || err.message || 'Failed to load gallery');
//       setGallery([]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchGallery();
//   }, [fetchGallery]);

//   const addGalleryItem = async (formData) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const token = localStorage.getItem('token');

//       // Log the formData contents for debugging (excluding the actual file data)
//       console.log('FormData being sent:', {
//         title: formData.get('title'),
//         description: formData.get('description'),
//         category: formData.get('category'),
//         section: formData.get('section'),
//         year: formData.get('year'),
//         hasImage: formData.get('image') !== null
//       });

//       // Add Cloudinary configuration to formData
//       formData.append('cloud_name', 'dqspnxe8q');

//       const response = await axios.post(`${backendUrl}/api/gallery`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           'x-auth-token': token,
//           'x-cloudinary-cloud-name': 'dqspnxe8q'
//         },
//         timeout: 30000,
//         validateStatus: function (status) {
//           return status < 500; // Resolve only if the status code is less than 500
//         }
//       });

//       // Log the complete response for debugging
//       console.log('Server response:', {
//         status: response.status,
//         data: response.data,
//         headers: response.headers
//       });

//       if (!response.data.success) {
//         // Handle specific error cases
//         if (response.data.message?.includes('cloud_name')) {
//           throw new Error('Cloudinary configuration error. Please check your Cloudinary settings: cloud_name=dqspnxe8q');
//         } else if (response.status === 400) {
//           throw new Error(response.data.message || 'Invalid request data');
//         } else {
//           throw new Error(response.data.message || 'Upload failed');
//         }
//       }

//       await fetchGallery();
//       return {
//         success: true,
//         data: response.data.data,
//         message: response.data.message || 'Image uploaded successfully'
//       };
//     } catch (err) {
//       console.error('Upload error details:', {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//         statusText: err.response?.statusText,
//         config: {
//           url: err.config?.url,
//           method: err.config?.method,
//           headers: err.config?.headers
//         }
//       });

//       let errorMsg;
//       if (err.response?.status === 400) {
//         if (err.response?.data?.message?.includes('cloud_name')) {
//           errorMsg = `Cloudinary configuration error. Current cloud_name: dqspnxe8q. Please verify server settings.`;
//         } else if (err.response?.data?.message) {
//           errorMsg = err.response.data.message;
//         } else {
//           errorMsg = 'Invalid request data. Please check your input and try again.';
//         }
//       } else if (err.code === 'ECONNABORTED') {
//         errorMsg = 'Upload timed out. Please try again.';
//       } else if (!err.response) {
//         errorMsg = 'Network error. Please check your connection and try again.';
//       } else {
//         errorMsg = err.message || 'Failed to upload image';
//       }

//       setError(errorMsg);
//       throw new Error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateGalleryItem = async (id, updates) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const token = localStorage.getItem('token');

//       const response = await axios.put(`${backendUrl}/api/gallery/${id}`, updates, {
//         headers: {
//           'x-auth-token': token
//         }
//       });

//       if (!response.data.success) {
//         throw new Error(response.data.message || 'Update failed');
//       }

//       await fetchGallery();
//       return {
//         success: true,
//         data: response.data.data,
//         message: response.data.message || 'Item updated successfully'
//       };
//     } catch (err) {
//       console.error('Update error:', err);
//       const errorMsg = err.response?.data?.message || err.message || 'Update failed';
//       setError(errorMsg);
//       throw new Error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteGalleryItem = async (id) => {
//     try {
//       setLoading(true);
//       setError(null);
//       const token = localStorage.getItem('token');

//       const response = await axios.delete(`${backendUrl}/api/gallery/${id}`, {
//         headers: {
//           'x-auth-token': token
//         }
//       });

//       if (!response.data.success) {
//         throw new Error(response.data.message || 'Deletion failed');
//       }

//       await fetchGallery();
//       return {
//         success: true,
//         message: response.data.message || 'Item deleted successfully'
//       };
//     } catch (err) {
//       console.error('Deletion error:', err);
//       const errorMsg = err.response?.data?.message || err.message || 'Deletion failed';
//       setError(errorMsg);
//       throw new Error(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <GalleryContext.Provider
//       value={{
//         gallery,
//         loading,
//         error,
//         pagination,
//         fetchGallery,
//         addGalleryItem,
//         updateGalleryItem,
//         deleteGalleryItem
//       }}
//     >
//       {children}
//     </GalleryContext.Provider>
//   );
// };

// GalleryProvider.propTypes = {
//   children: PropTypes.node.isRequired
// };

// export default GalleryContext;
// src/context/GalleryContext.js
// src/context/GalleryContext.js
import React, { createContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const GalleryContext = createContext();

// Valid categories and sections
export const validCategories = ['events', 'movies', 'celebrations', 'awards', 'behind-the-scenes', 'other'];
export const validSections = ['home', 'gallery', 'about', 'events'];

export const GalleryProvider = ({ children }) => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1
  });

  const backendUrl = import.meta.env.MODE === 'development' 
    ? 'http://localhost:5000'
    : 'https://backendchetan.onrender.com';

  const fetchGallery = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${backendUrl}/api/gallery`, {
        params: {
          page: params.page || pagination.page,
          limit: params.limit || pagination.limit,
          ...params
        },
        timeout: 10000
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Invalid response format');
      }

      setGallery(response.data.data);
      setPagination({
        page: response.data.page,
        limit: response.data.limit,
        total: response.data.total,
        pages: response.data.pages
      });
    } catch (err) {
      console.error('Gallery fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load gallery');
      setGallery([]);
    } finally {
      setLoading(false);
    }
  }, [backendUrl, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const validateGalleryItem = (formData) => {
    const category = formData.get ? formData.get('category') : formData.category;
    const section = formData.get ? formData.get('section') : formData.section;
    
    if (!category || category.trim() === '') {
      throw new Error('Category is required. Please select a category.');
    }

    const normalizedCategory = category.toLowerCase().trim();
    if (!validCategories.includes(normalizedCategory)) {
      throw new Error(`Invalid category. Please select one of: ${validCategories.join(', ')}`);
    }

    if (!section || section.trim() === '') {
      throw new Error('Section is required. Please select a section.');
    }

    const normalizedSection = section.toLowerCase().trim();
    if (!validSections.includes(normalizedSection)) {
      throw new Error(`Invalid section. Please select one of: ${validSections.join(', ')}`);
    }

    return true;
  };

  const addGalleryItem = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      // Log FormData contents for debugging
      const formDataDebug = {};
      for (let [key, value] of formData.entries()) {
        formDataDebug[key] = value instanceof File ? {
          name: value.name,
          type: value.type,
          size: value.size
        } : value;
      }
      console.log('Sending form data:', formDataDebug);

      // Validate the form data
      validateGalleryItem(formData);

      const response = await axios.post(`${backendUrl}/api/gallery`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        timeout: 30000,
        validateStatus: null // Allow any status code to handle errors manually
      });

      console.log('Server response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });

      if (response.status === 400) {
        throw new Error(response.data.message || 'Invalid request. Please check your input.');
      }

      if (response.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
        throw new Error('Authentication failed. Please login again.');
      }

      if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      }

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Upload failed');
      }

      await fetchGallery();
      return response.data;
    } catch (err) {
      console.error('Upload error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        headers: err.response?.headers,
        stack: err.stack
      });

      let errorMsg;
      if (err.response?.status === 400) {
        errorMsg = err.response.data.message || 'Invalid request data. Please check all required fields.';
      } else if (err.response?.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
        errorMsg = 'Authentication failed. Please login again.';
      } else if (err.response?.status === 500) {
        errorMsg = 'Server error. Please try again later.';
      } else if (err.code === 'ECONNABORTED') {
        errorMsg = 'Upload timed out. Please try again.';
      } else if (!err.response) {
        errorMsg = 'Network error. Please check your connection and try again.';
      } else {
        errorMsg = err.message || 'Failed to upload image';
      }

      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateGalleryItem = async (id, updates) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Validate updates if category is being changed
      if (updates.category) {
        validateGalleryItem(updates);
      }

      const response = await axios.put(`${backendUrl}/api/gallery/${id}`, updates, {
        headers: {
          'x-auth-token': token
        }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Update failed');
      }

      await fetchGallery();
      return response.data;
    } catch (err) {
      console.error('Update error:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Update failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteGalleryItem = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication token not found');
      }

      console.log('Attempting to delete gallery item:', { id });

      const response = await axios.delete(`${backendUrl}/api/gallery/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        validateStatus: null // Allow any status code to handle errors manually
      });

      console.log('Delete response:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      });

      if (response.status === 404) {
        throw new Error('Gallery item not found');
      }

      if (response.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
        throw new Error('Authentication failed. Please login again.');
      }

      if (response.status === 500) {
        throw new Error('Server error. Please try again later.');
      }

      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Deletion failed');
      }

      await fetchGallery();
      return response.data;
    } catch (err) {
      console.error('Deletion error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText
      });

      let errorMsg;
      if (err.response?.status === 404) {
        errorMsg = 'Gallery item not found';
      } else if (err.response?.status === 401) {
        localStorage.removeItem('token');
        errorMsg = 'Authentication failed. Please login again.';
      } else if (err.response?.status === 500) {
        errorMsg = 'Server error. Please try again later.';
      } else if (!err.response) {
        errorMsg = 'Network error. Please check your connection and try again.';
      } else {
        errorMsg = err.message || 'Failed to delete image';
      }

      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <GalleryContext.Provider
      value={{
        gallery,
        loading,
        error,
        pagination,
        validCategories,
        validSections,
        fetchGallery,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

GalleryProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default GalleryContext;