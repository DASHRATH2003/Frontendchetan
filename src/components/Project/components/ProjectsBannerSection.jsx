import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ProjectContext from '../../../context/ProjectContext';
import './ProjectsBannerSection.css';

const ProjectsBannerSection = () => {
  const { projects, loading, error, processImageUrl } = useContext(ProjectContext);

  if (loading) {
    return (
      <div className="projects-banner-section">
        <div className="projects-title">
          <h1>PROJECTS</h1>
        </div>
        <div>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-banner-section">
        <div className="projects-title">
          <h1>PROJECTS</h1>
        </div>
        <div>Error: {error}</div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="projects-banner-section">
        <div className="projects-title">
          <h1>PROJECTS</h1>
        </div>
        <div>No projects found</div>
      </div>
    );
  }

  return (
    <div className="projects-banner-section">
      <div className="projects-title">
        <h1>PROJECTS</h1>
      </div>
      <div className="projects-banner-container">
        <div className="projects-banner-grid">
          {projects.map((project) => (
            <Link
              to={`/project/${project._id}`}
              key={project._id}
              className="project-card"
            >
              <div className="project-image-container">
                <img
                  src={project.imageUrl || processImageUrl(project.image)}
                  alt={project.title}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = processImageUrl('/placeholder.webp');
                    e.target.onerror = null; // Prevent infinite loop
                  }}
                />
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsBannerSection; 