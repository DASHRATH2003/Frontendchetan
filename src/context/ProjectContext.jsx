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

  // Function to fetch projects from backend
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : process.env.REACT_APP_BACKEND_URL || 'https://your-backend-url.com';
      
      const response = await axios.get(`${backendUrl}/api/projects`);
      const projectsData = response.data;

      // Process the projects data
      const processedProjects = projectsData.map(item => ({
        _id: item._id,
        title: item.title || 'Untitled',
        description: item.description || '',
        image: item.image,
        category: item.category || '',
        section: item.section || 'Banner',
        completed: item.completed || false,
        year: item.year || new Date().getFullYear().toString(),
        createdAt: item.createdAt || new Date().toISOString()
      }));

      console.log('Processed projects:', processedProjects);
      setProjects(processedProjects);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects');
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
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : process.env.REACT_APP_BACKEND_URL || 'https://your-backend-url.com';

      // Upload to backend
      const response = await axios.post(`${backendUrl}/api/projects`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Refresh projects list
      await fetchProjects();
      return response.data;
    } catch (err) {
      console.error('Error adding project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing project
  const updateProject = async ({ _id, formData }) => {
    try {
      setLoading(true);
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : process.env.REACT_APP_BACKEND_URL || 'https://your-backend-url.com';

      // Update in backend
      await axios.put(`${backendUrl}/api/projects/${_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Refresh projects list
      await fetchProjects();
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a project
  const deleteProject = async (id) => {
    try {
      setLoading(true);
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : process.env.REACT_APP_BACKEND_URL || 'https://your-backend-url.com';

      await axios.delete(`${backendUrl}/api/projects/${id}`);
      
      // Refresh projects list
      await fetchProjects();
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete all projects
  const deleteAllProjects = async () => {
    try {
      setLoading(true);
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : process.env.REACT_APP_BACKEND_URL || 'https://your-backend-url.com';

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
