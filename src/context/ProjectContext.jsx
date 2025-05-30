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
    // Always use production URL for deployed site
    return 'https://chetanbackend.onrender.com';
  };

  // Function to fetch projects from backend
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const backendUrl = getBackendUrl();
      console.log('Fetching projects from:', backendUrl);
      
      const response = await axios.get(`${backendUrl}/api/projects`);
      const projectsData = response.data;

      if (!projectsData || !Array.isArray(projectsData)) {
        throw new Error('Invalid projects data received');
      }

      console.log('Received projects data:', projectsData);

      // Process the projects data
      const processedProjects = projectsData.map(item => {
        let imageUrl = item.image;
        
        // If the image URL is relative, make it absolute
        if (imageUrl && !imageUrl.startsWith('http')) {
          // Remove any double slashes except after http(s):
          imageUrl = `${backendUrl}${imageUrl}`.replace(/([^:]\/)\/+/g, '$1');
        }

        console.log(`Processing image URL for ${item.title}:`, imageUrl);

        return {
          _id: item._id,
          title: item.title || 'Untitled',
          description: item.description || '',
          image: imageUrl,
          category: item.category || '',
          section: item.section || 'Banner',
          completed: item.completed || false,
          year: item.year || new Date().getFullYear().toString(),
          createdAt: item.createdAt || new Date().toISOString()
        };
      });

      console.log('Processed projects:', processedProjects);
      setProjects(processedProjects);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please try again later.');
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
