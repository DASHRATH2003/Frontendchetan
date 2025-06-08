import React, { createContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get backend URL - memoized to prevent unnecessary recalculations
  const backendUrl = useMemo(() => {
    // Check if we're in the production domain
    const isProduction = window.location.hostname === 'chethancinemas.com' || 
                        window.location.hostname === 'www.chethancinemas.com' ||
                        window.location.hostname === 'frontendchetan.vercel.app';
    
    // Use the appropriate backend URL
    return isProduction 
      ? 'https://backendchetan.onrender.com'
      : 'http://localhost:5000';
  }, []);

  // Helper function to get the full image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return '/placeholder.webp';
    }

    // If it's a Cloudinary URL, return it as is
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl;
    }

    // If it's already an absolute URL, return it as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // For local development with /uploads/ paths
    if (imageUrl.startsWith('/uploads/')) {
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : 'https://backendchetan.onrender.com';
      return `${backendUrl}${imageUrl}`;
    }

    return '/placeholder.webp';
  };

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/projects`);
      const projectsData = response.data;

      if (!Array.isArray(projectsData)) {
        console.error('Invalid projects data:', projectsData);
        throw new Error('Invalid response format');
      }

      // Process the projects data
      const processedProjects = projectsData.map(project => {
        if (!project || typeof project !== 'object') {
          console.error('Invalid project item:', project);
          return null;
        }

        return {
          ...project,
          imageUrl: getImageUrl(project.image)
        };
      }).filter(Boolean);

      setProjects(processedProjects);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load projects';
      setError(errorMessage);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Add project
  const addProject = async (projectData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', projectData.title);
      formData.append('description', projectData.description);
      formData.append('image', projectData.image);
      formData.append('completed', projectData.completed);

      const response = await axios.post(`${backendUrl}/api/projects`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newProject = {
        ...response.data,
        imageUrl: getImageUrl(response.data.image)
      };

      setProjects([...projects, newProject]);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      console.error('Error adding project:', error);
      throw error;
    }
  };

  // Update project
  const updateProject = async (id, projectData) => {
    try {
      setLoading(true);

      const formData = new FormData();
      Object.keys(projectData).forEach(key => {
        if (key === 'image' && projectData[key] instanceof File) {
          formData.append('image', projectData[key]);
        } else if (key !== 'image') {
          formData.append(key, projectData[key]);
        }
      });

      const response = await axios.put(`${backendUrl}/api/projects/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Process the updated project with stable URL
      const updatedProject = {
        ...response.data,
        imageUrl: getImageUrl(response.data.image)
      };

      // Update the projects list with the new data
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project._id === id ? updatedProject : project
        )
      );

      return updatedProject;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/projects/${id}`);
      setProjects(prevProjects => prevProjects.filter(project => project._id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  // Delete all projects
  const deleteAllProjects = async () => {
    try {
      await axios.delete(`${backendUrl}/api/projects`);
      setProjects([]);
    } catch (err) {
      console.error('Error deleting all projects:', err);
      throw err;
    }
  };

  // Add Same To Same project
  const addSameToSameProject = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the image from the gallery
      const imageResponse = await fetch(`${backendUrl}/uploads/gallery/1749376234661-620282039.jpeg`);
      const imageBlob = await imageResponse.blob();
      const imageFile = new File([imageBlob], 'project-clothnearya.jpeg', { type: 'image/jpeg' });

      // Create form data
      const formData = new FormData();
      formData.append('title', 'Same To Same');
      formData.append('description', 'Same To Same - A captivating advertisement for Clothnearya');
      formData.append('category', 'Advertisement');
      formData.append('section', 'Featured');
      formData.append('completed', 'true');
      formData.append('year', new Date().getFullYear().toString());
      formData.append('image', imageFile);

      // Upload to backend
      const response = await axios.post(`${backendUrl}/api/projects`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Process the new project with stable URL
      const newProject = {
        ...response.data.data,
        imageUrl: getImageUrl(response.data.data.image)
      };
      
      // Update state with the new project
      setProjects(prevProjects => [newProject, ...prevProjects]);
      
      setError(null);
      return newProject;
    } catch (err) {
      console.error('Error adding Same To Same project:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add project';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const value = {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    deleteAllProjects,
    fetchProjects,
    getImageUrl,
    addSameToSameProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

ProjectProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProjectContext;
