import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import timepass2025 from "../assets/Projects/ChethanJodidharProjects/timepass2025.webp";
import project1 from "../assets/Projects/ChethanJodidharProjects/project1.webp";
import cameo from "../assets/Projects/ChethanJodidharProjects/chethanjodidharprojects.webp";

export const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default projects data
  const defaultProjects = [
    {
      _id: '1',
      title: 'Timepass 2025',
      description: 'Upcoming project',
      image: timepass2025,
      category: 'Feature Film',
      section: 'Banner',
      completed: false,
      year: '2025'
    },
    {
      _id: '2',
      title: 'Project One',
      description: 'First major project',
      image: project1,
      category: 'Short Film',
      section: 'Banner',
      completed: true,
      year: '2024'
    },
    {
      _id: '3',
      title: 'Cameo Productions',
      description: 'Production house project',
      image: cameo,
      category: 'Production',
      section: 'Banner',
      completed: true,
      year: '2023'
    }
  ];

  const getBackendUrl = () => {
    // Check if we're running locally
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Use localhost:5000 for development, production URL for deployment
    const url = isLocalhost 
      ? 'http://localhost:5000'
      : 'https://chetanbackend.onrender.com';
    
    console.log('Using backend URL:', url);
    return url;
  };

  // Function to fetch projects with retry
  const fetchProjectsWithRetry = async (retries = 3, delay = 2000) => {
    let lastError;
    
    for (let i = 0; i < retries; i++) {
      try {
        const backendUrl = getBackendUrl();
        console.log(`Attempt ${i + 1}/${retries} - Fetching projects from:`, backendUrl);
        
        const response = await axios.get(`${backendUrl}/api/projects`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          timeout: 5000 // 5 second timeout
        });

        if (!response.data) {
          throw new Error('No data received from API');
        }

        return response;
      } catch (err) {
        lastError = err;
        console.error(`Attempt ${i + 1} failed:`, {
          message: err.message,
          code: err.code,
          response: err.response?.data
        });
        
        if (i === retries - 1) {
          break; // Last attempt failed
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // If we get here, all retries failed
    throw lastError;
  };

  // Function to fetch projects from backend
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchProjectsWithRetry();
      console.log('Raw API response:', response);

      const projectsData = response.data;
      console.log('Projects data received:', projectsData);

      if (!Array.isArray(projectsData)) {
        console.error('Invalid projects data format:', projectsData);
        throw new Error('Invalid projects data format received');
      }

      // Process the projects data
      const processedProjects = projectsData.map(item => {
        if (!item || typeof item !== 'object') {
          console.error('Invalid project item:', item);
          return null;
        }

        let imageUrl = item.image;
        console.log('Processing project:', {
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
          imageUrl = `${getBackendUrl()}${imageUrl}`.replace(/([^:]\/)\/+/g, '$1');
          console.log('Constructed image URL:', imageUrl);
        }

        return {
          _id: item._id,
          title: item.title || 'Untitled',
          description: item.description || '',
          image: imageUrl,
          category: item.category || '',
          section: item.section || 'Banner',
          completed: item.completed || false,
          year: item.year || new Date().getFullYear().toString()
        };
      }).filter(Boolean);

      console.log('Final processed projects:', processedProjects);
      setProjects(processedProjects);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load projects';
      setError(errorMessage);
      setProjects([]); // Clear projects on error
    } finally {
      setLoading(false);
    }
  };

  // Initialize by fetching projects from backend
  useEffect(() => {
    fetchProjects();
  }, []);

  // Add a new project
  const addProject = async (formData) => {
    try {
      setLoading(true);
      const backendUrl = getBackendUrl();
      console.log('Adding project to:', backendUrl);

      // Upload to backend
      const response = await axios.post(`${backendUrl}/api/projects`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Refresh projects list
      await fetchProjects();
      return response.data;
    } catch (err) {
      console.error('Error adding project:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing project
  const updateProject = async ({ _id, formData }) => {
    try {
      setLoading(true);
      const backendUrl = getBackendUrl();
      console.log('Updating project at:', backendUrl);

      // Update in backend
      const response = await axios.put(`${backendUrl}/api/projects/${_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Refresh projects list
      await fetchProjects();
      return response.data;
    } catch (err) {
      console.error('Error updating project:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a project
  const deleteProject = async (id) => {
    try {
      setLoading(true);
      const backendUrl = getBackendUrl();
      console.log('Deleting project from:', backendUrl);

      await axios.delete(`${backendUrl}/api/projects/${id}`);
      
      // Refresh projects list
      await fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete all projects
  const deleteAllProjects = async () => {
    try {
      setLoading(true);
      const backendUrl = getBackendUrl();

      await axios.delete(`${backendUrl}/api/projects/all`);
      setProjects([]); // Clear the local state
      setError(null);
    } catch (err) {
      console.error('Error deleting all projects:', err);
      setError('Failed to delete all projects');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get projects by section
  const getProjectsBySection = (section) => {
    return projects.filter(project => project.section === section);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        loading,
        error,
        addProject,
        updateProject,
        deleteProject,
        deleteAllProjects,
        getProjectsBySection,
        setProjects,
        fetchProjects
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectContext;
