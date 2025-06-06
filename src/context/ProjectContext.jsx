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

  // Process image URL - memoized to prevent unnecessary recalculations
  const processImageUrl = useMemo(() => (imageUrl) => {
    if (!imageUrl) {
      return '/placeholder.webp';
    }

    // If it's already a full URL, return it as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    // Clean up the path and ensure it starts with /uploads/
    const cleanPath = imageUrl.replace(/^\/+/, '').replace(/^uploads\//, '');
    const finalPath = `/uploads/${cleanPath}`;

    // Always use HTTPS for production backend
    const finalUrl = `${backendUrl}${finalPath}`;
    
    return finalUrl;
  }, [backendUrl]);

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

      // Process the projects data with stable URLs
      const processedProjects = projectsData.map(project => {
        if (!project || typeof project !== 'object') {
          console.error('Invalid project item:', project);
          return null;
        }

        // Use the memoized processImageUrl function
        const imageUrl = processImageUrl(project.image);
        
        return {
          ...project,
          imageUrl // Store the processed URL
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

  // Add project with better error handling
  const addProject = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      // Validate input
      const title = formData.get('title');
      const image = formData.get('image');

      if (!title) {
        throw new Error('Title is required');
      }

      if (!image || !(image instanceof File)) {
        throw new Error('Valid image file is required');
      }

      // Upload to backend
      const response = await axios.post(`${backendUrl}/api/projects`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Validate response
      if (!response.data || !response.data._id || !response.data.image) {
        console.error('Invalid server response:', response.data);
        throw new Error('Invalid response from server - missing required fields');
      }

      // Process the new project with stable URL
      const newProject = {
        ...response.data,
        imageUrl: processImageUrl(response.data.image)
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

      // Process the updated project with stable URL
      const updatedProject = {
        ...response.data,
        imageUrl: processImageUrl(response.data.image)
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
    processImageUrl
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
