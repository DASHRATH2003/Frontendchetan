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
    return imageUrl; // Return the Cloudinary URL directly
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
          imageUrl: project.image // Use the Cloudinary URL directly
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
  const addProject = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate input
      if (!formData.get('title')) {
        throw new Error('Title is required');
      }

      if (!formData.get('category')) {
        throw new Error('Category is required');
      }

      const image = formData.get('image');
      if (!image || !(image instanceof File)) {
        throw new Error('Valid image file is required');
      }

      // Upload to backend
      const response = await axios.post(`${backendUrl}/api/projects`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Validate response
      if (!response.data || !response.data.success || !response.data.data) {
        console.error('Invalid server response:', response.data);
        throw new Error('Invalid response from server');
      }

      // Use the new project data from the nested response
      const newProject = {
        ...response.data.data,
        imageUrl: response.data.data.image // Use the Cloudinary URL directly
      };
      
      // Update state with the new project
      setProjects(prevProjects => [newProject, ...prevProjects]);
      
      setError(null);
      return newProject;
    } catch (err) {
      console.error('Error adding project:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add project';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
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

      // Process the updated project with Cloudinary URL
      const updatedProject = {
        ...response.data,
        imageUrl: response.data.image // Use the Cloudinary URL directly
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

      // Create form data with direct image URL
      const formData = new FormData();
      formData.append('title', 'Same To Same');
      formData.append('description', 'Same To Same - A captivating advertisement for Clothnearya');
      formData.append('category', 'Advertisement');
      formData.append('section', 'Featured');
      formData.append('completed', 'true');
      formData.append('year', new Date().getFullYear().toString());

      // Upload to backend
      const response = await axios.post(`${backendUrl}/api/projects`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Process the new project with Cloudinary URL
      const newProject = {
        ...response.data.data,
        imageUrl: response.data.data.image // Use the Cloudinary URL directly
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

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, []);

  // Context value
  const value = {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    deleteProject,
    deleteAllProjects,
    addSameToSameProject,
    fetchProjects
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
