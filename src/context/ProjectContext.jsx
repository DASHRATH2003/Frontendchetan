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
    return window.location.hostname === 'localhost' 
      ? 'http://localhost:5000' 
      : 'https://backendchetan.onrender.com';
  };

  const processImageUrl = (imageUrl) => {
    if (!imageUrl) {
      console.log('No image URL provided');
      return '/placeholder.webp';
    }

    // If it's already a full URL, return it as is
    if (imageUrl.startsWith('http')) {
      console.log('Using full URL:', imageUrl);
      return imageUrl;
    }

    // For uploads or relative paths, construct the full URL
    const backendUrl = getBackendUrl();
    
    // Clean up the path and ensure it starts with /uploads/
    const cleanPath = imageUrl.replace(/^\/+/, '').replace(/^uploads\//, '');
    const finalPath = `/uploads/${cleanPath}`;
    const fullUrl = `${backendUrl}${finalPath}`;
    
    console.log('Constructed image URL:', fullUrl);
    return fullUrl;
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
          timeout: 10000 // 10 second timeout
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
      const processedProjects = projectsData.map(project => {
        if (!project || typeof project !== 'object') {
          console.error('Invalid project item:', project);
          return null;
        }

        // Use the processImageUrl function for consistent URL handling
        const imageUrl = processImageUrl(project.image);
        
        return {
          ...project,
          imageUrl: imageUrl
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

  // Add project with better error handling
  const addProject = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      const backendUrl = getBackendUrl();

      // Validate input
      const title = formData.get('title');
      const image = formData.get('image');

      if (!title) {
        throw new Error('Title is required');
      }

      if (!image || !(image instanceof File)) {
        throw new Error('Valid image file is required');
      }

      console.log('Uploading project:', {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        section: formData.get('section'),
        completed: formData.get('completed'),
        year: formData.get('year'),
        fileName: image.name,
        fileType: image.type,
        fileSize: image.size
      });

      // Upload to backend
      const response = await axios.post(`${backendUrl}/api/projects`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log('Upload response:', response.data);

      // Add the new project to the local state immediately
      const newProject = {
        ...response.data,
        imageUrl: processImageUrl(response.data.image)
      };
      
      setProjects(prevProjects => [newProject, ...prevProjects]);

      // Also refresh the full list to ensure consistency
      await fetchProjects();
      
      setError(null);
      return response.data;
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
      const backendUrl = getBackendUrl();

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

      await fetchProjects(); // Refresh the projects list
      return response.data;
    } catch (err) {
      console.error('Error updating project:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update project';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    try {
      setLoading(true);
      const backendUrl = getBackendUrl();

      await axios.delete(`${backendUrl}/api/projects/${id}`);
      await fetchProjects(); // Refresh the projects list
    } catch (err) {
      console.error('Error deleting project:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete project';
      setError(errorMessage);
      throw new Error(errorMessage);
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

  useEffect(() => {
    fetchProjects();
  }, []);

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
