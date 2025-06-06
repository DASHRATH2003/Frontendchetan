import React, { useContext } from 'react';
import ProjectContext from '../../context/ProjectContext';

const Projects = () => {
  const { projects, loading, error } = useContext(ProjectContext);

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    // Only set placeholder if the current src is not already the placeholder
    if (!e.target.src.includes('placeholder.webp')) {
      e.target.src = '/placeholder.webp';
    }
  };

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/placeholder.webp';
    
    // If it's already a full URL, return it
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // For uploads or relative paths, construct the full URL
    const backendUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000' 
      : 'https://backendchetan.onrender.com';

    // Clean up the path to ensure proper format
    const cleanPath = imageUrl.replace(/^\/+/, '').replace(/^uploads\//, '');
    return `${backendUrl}/uploads/${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
      {projects.map((project) => (
        <div key={project._id} className="relative group overflow-hidden rounded-lg shadow-lg">
          <div className="aspect-w-16 aspect-h-9">
            <img
              src={getImageUrl(project.image)}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={handleImageError}
              loading="lazy"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-lg font-semibold">{project.title}</h3>
            {project.description && (
              <p className="mt-2 text-sm">{project.description}</p>
            )}
            {project.category && (
              <p className="mt-1 text-xs text-gray-300">{project.category}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Projects; 