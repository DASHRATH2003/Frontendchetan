import React, { useState, useContext, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import GalleryContext, { validCategories } from '../../context/GalleryContext';

const GalleryAdmin = () => {
  const {
    gallery,
    fetchGallery,
    addGalleryItem,
    deleteGalleryItem
  } = useContext(GalleryContext);

  const [error, setError] = useState(null);
  const initialFormState = {
    title: '',
    category: '',
    year: new Date().getFullYear().toString(),
    image: null
  };
  const [formData, setFormData] = useState(initialFormState);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setFormData(prev => ({ ...prev, image: null }));
      setPreview('');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('Image file is too large. Maximum size is 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    setFormData(prev => ({ ...prev, image: file }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (!formData.title.trim()) {
        setError('Title is required');
        return;
      }

      if (!formData.category.trim()) {
        setError('Please select a category');
        return;
      }

      if (!formData.image) {
        setError('Image file is required');
        return;
      }

      const data = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === 'image') {
            data.append(key, formData[key]);
          } else {
            data.append(key, formData[key].toString().trim());
          }
        }
      });

      const result = await addGalleryItem(data);
      
      if (result.success) {
        setFormData(initialFormState);
        setPreview('');
        setError(null);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to add gallery item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      setLoading(true);
      await deleteGalleryItem(id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get image URL
  const getImageUrl = (item) => {
    if (!item) return '/placeholder.webp';
    return item.imageUrl || item.image || '/placeholder.webp';
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Gallery Management</h1>

        {/* Add Gallery Item Form */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Gallery Item</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                required
              >
                <option value="">Select a category</option>
                {validCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Image *
              </label>
              <input
                type="file"
                id="image"
                name="image"
                onChange={handleFileChange}
                accept="image/*"
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:text-gray-400 dark:file:bg-gray-700 dark:file:text-gray-300"
                required
              />
            </div>

            {preview && (
              <div className="mt-4">
                <img src={preview} alt="Preview" className="h-32 w-auto object-cover rounded-lg" />
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add Gallery Item'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Gallery Items Grid */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Gallery Items</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <div key={item._id} className="relative bg-white dark:bg-gray-700 rounded-lg shadow overflow-hidden">
                <div className="aspect-w-3 aspect-h-2">
                  <img
                    src={getImageUrl(item)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', getImageUrl(item));
                      e.target.src = '/placeholder.webp';
                    }}
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={loading}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-100 dark:bg-red-800 dark:hover:bg-red-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default GalleryAdmin;