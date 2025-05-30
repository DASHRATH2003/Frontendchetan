import React, { useState, useEffect, useContext } from "react";
import ProjectContext from "../../../context/ProjectContext";

const Projects_Banner_Section = () => {
  const { projects: allProjects, loading, error } = useContext(ProjectContext);
  const [bannerProjects, setBannerProjects] = useState([]);

  // Helper to get image URL with fallback for relative paths
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';

    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    if (imageUrl.startsWith('/uploads/')) {
      const backendUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : import.meta.env.VITE_BACKEND_URL || 'https://chetanbackend.onrender.com';
      return `${backendUrl}${imageUrl}`;
    }

    return imageUrl;
  };

  useEffect(() => {
    if (!allProjects || !Array.isArray(allProjects)) return;

    console.log("✅ All projects from context:", allProjects);

    // Filter for section: "Banner"
    const filteredProjects = allProjects.filter(
      (project) => project.section === "Banner"
    );

    if (filteredProjects.length === 0) {
      console.warn("⚠️ No projects with section: 'Banner'. Displaying all for now.");
    }

    setBannerProjects(
      filteredProjects.length > 0 ? filteredProjects : allProjects // fallback for testing
    );
  }, [allProjects]);

  return (
    <section className="bg-[#faf5fa] py-12 md:py-24">
      {/* Header */}
      <section className="flex items-center flex-col mb-8">
        <h1 className="text-[#48A77E] text-center font-bold text-3xl md:text-5xl">
          PROJECTS
        </h1>
      </section>

      {/* Projects Grid */}
      <section className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8 md:mt-10 px-4">
        {loading ? (
          <div className="col-span-full flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-10 text-red-500">
            {error}
          </div>
        ) : bannerProjects.length > 0 ? (
          bannerProjects.map((project, index) => (
            <div
              className="flex flex-col justify-center gap-3 items-center lg:items-start"
              key={project._id || index}
            >
              <div className="w-full h-[300px] overflow-hidden rounded-lg shadow-lg">
                <img
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  src={getImageUrl(project.image)}
                  alt={project.title}
                  onError={(e) => {
                    console.error('Image failed to load:', project.image);
                    e.target.src = '/placeholder.webp';
                  }}
                />
              </div>
              <div>
                <h1 className="font-bold uppercase">{project.title}</h1>
              </div>
              <div>
                <h1 className="text-center">{project.year}</h1>
              </div>
              {project.category && (
                <div>
                  <span className="text-sm text-gray-600">{project.category}</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            No projects found.
          </div>
        )}
      </section>

      {/* Future Projects Section */}
      <section className="container mx-auto flex flex-col items-center lg:items-start gap-4 md:gap-5 justify-center mt-10 md:mt-14 px-4">
        <h1 className="font-bold uppercase text-xl md:text-2xl mb-4">
          Future Projects
        </h1>
        <p className="text-center lg:text-justify leading-6 max-w-3xl">
          Chethan&apos;s future in filmmaking is filled with exciting possibilities.
          With several innovative projects in development, he is focused on
          exploring contemporary social issues through high-impact action and
          emotional storytelling. His commitment to pushing boundaries and
          creating films that resonate with a global audience ensures that his
          work will continue to shape the future of cinema.
        </p>
        <button className="border border-black px-8 md:px-12 py-2 md:py-3 text-lg md:text-xl hover:bg-[#800080] hover:text-white transition duration-300 ease-in-out mt-2 md:mt-4">
          Let&apos;s Work Together
        </button>
      </section>
    </section>
  );
};

export default Projects_Banner_Section;
