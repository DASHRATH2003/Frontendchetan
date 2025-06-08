import React, { useState, useContext, useEffect } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import AdminLayout from './AdminLayout';
import GalleryContext, { validCategories, validSections } from '../../context/GalleryContext';
import ImagePreview from '../ui/ImagePreview';

const GalleryAdmin = () => {
  const {
    gallery,
    loading,
    pagination,
    fetchGallery,
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem
  } = useContext(GalleryContext);

  const [error, setError] = useState(null);
  const initialFormState = {
    title: '',
    description: '',
    category: '',
    section: 'gallery',
    year: new Date().getFullYear().toString(),
    image: null
  };
  const [formData, setFormData] = useState(initialFormState);
  const [preview, setPreview] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    section: '',
    year: ''
  });
  const [editingId, setEditingId] = useState(null);

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
    
    try {
      console.log('Current form state:', formData);

      if (!formData.title.trim()) {
        setError('Title is required');
        return;
      }

      if (!formData.category.trim()) {
        setError('Please select a category');
        return;
      }

      if (!formData.section || !validSections.includes(formData.section)) {
        setError(`Section must be one of: ${validSections.join(', ')}`);
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

      console.log('FormData contents:');
      for (let [key, value] of data.entries()) {
        console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
      }

      const result = await addGalleryItem(data);
      
      if (result.success) {
        setFormData(initialFormState);
        setPreview('');
        setError(null);
      }
    } catch (err) {
      console.error('Upload failed:', {
        error: err,
        message: err.message,
        formData: {
          ...formData,
          image: formData.image ? {
            name: formData.image.name,
            type: formData.image.type,
            size: formData.image.size
          } : null
        }
      });
      setError(err.message || 'Failed to upload image. Please try again.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      section: item.section,
      year: item.year,
      image: null
    });
    setPreview(item.imageUrl);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.category) {
        setError('Category is required');
        return;
      }

      if (!validCategories.includes(formData.category)) {
        setError(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
        return;
      }

      await updateGalleryItem(editingId, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        section: formData.section,
        year: formData.year
      });
      
      setEditingId(null);
      setFormData(initialFormState);
      setPreview('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await deleteGalleryItem(id);
    } catch (err) {
      setError(err.message);
    }
  };

  const applyFilters = () => {
    fetchGallery({
      ...filters,
      page: 1
    });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      section: '',
      year: ''
    });
    fetchGallery();
  };

  const handlePageChange = (newPage) => {
    fetchGallery({
      ...filters,
      page: newPage
    });
  };

  const categoryField = (
    <div>
      <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Category *
      </label>
      <select
        id="category"
        name="category"
        value={formData.category}
        onChange={handleInputChange}
        required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="">Select a category</option>
        {validCategories.map(cat => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')}
          </option>
        ))}
      </select>
    </div>
  );

  const sectionField = (
    <div>
      <label htmlFor="section" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Section *
      </label>
      <select
        id="section"
        name="section"
        value={formData.section}
        onChange={handleInputChange}
        required
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        {validSections.map(section => (
          <option key={section} value={section}>
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-500">
        Current section: {formData.section}
      </p>
    </div>
  );

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Gallery Management</h1>
        
        {/* Upload/Edit Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Gallery Item' : 'Upload New Image'}
          </h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={editingId ? handleUpdate : handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
              
              {categoryField}
              
              {sectionField}
              
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              {!editingId && (
                <div>
                  <label className="block text-sm font-medium mb-1">Image *</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                    required={!editingId}
                  />
                </div>
              )}
            </div>
            
            {preview && (
              <div className="mb-4">
                <ImagePreview src={preview} alt="Preview" className="max-h-64" />
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData(initialFormState);
                    setPreview('');
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
              
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : editingId ? 'Update' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full p-2 border rounded pl-8"
                />
                <FaSearch className="absolute left-2 top-3 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full p-2 border rounded"
              >
                <option value="">All Categories</option>
                {validCategories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.split('-').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Section</label>
              <input
                type="text"
                value={filters.section}
                onChange={(e) => setFilters({...filters, section: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Year</label>
              <input
                type="text"
                value={filters.year}
                onChange={(e) => setFilters({...filters, year: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Reset
            </button>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <FaFilter className="inline mr-1" /> Apply
            </button>
          </div>
        </div>
        
        {/* Gallery Items */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Gallery Items</h2>
          
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : gallery.length === 0 ? (
            <div className="text-center py-4">No gallery items found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map(item => (
                <div key={item._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden shadow">
                  <div className="aspect-w-16 aspect-h-9">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded text-xs">
                        {item.category}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-100 rounded text-xs">
                        {item.section}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded text-xs">
                        {item.year}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded ${
                    page === pagination.page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default GalleryAdmin;