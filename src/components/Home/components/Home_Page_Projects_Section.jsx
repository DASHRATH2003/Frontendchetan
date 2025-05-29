import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import ProjectContext from "../../../context/ProjectContext";

const Home_Page_Projects_Section = () => {
  const { projects, loading, error } = useContext(ProjectContext);
  const [homeProjects, setHomeProjects] = useState([]);

  useEffect(() => {
    // Filter projects for the Home section
    // We'll display projects with section 'Home' or 'Banner' if no Home section projects exist
    const filteredProjects = projects.filter(project => project.section === 'Home');
    
    // If no Home section projects, use Banner projects
    if (filteredProjects.length === 0) {
      const bannerProjects = projects.filter(project => project.section === 'Banner');
      setHomeProjects(bannerProjects);
    } else {
      setHomeProjects(filteredProjects);
    }
  }, [projects]);

  return (
    <section className="py-20 bg-[#faf5fa]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-8 mb-12">
          <h1 className="text-4xl text-center font-bold text-[#363636]">
            Our{" "}
            <span className="font-signature text-[#800080] text-5xl">
              Projects
            </span>
          </h1>
          <p className="text-center leading-6 max-w-3xl">
            Explore Chethan Jodidhar's diverse portfolio of film projects, showcasing his unique vision and storytelling abilities across various genres and formats.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            {error}
          </div>
        ) : homeProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {homeProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="h-[250px] w-full overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
                  />
                  {project.completed && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs">
                      Completed
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{project.category} • {project.year}</p>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-3">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No projects found. Check back soon for updates!</p>
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Link to="/chethan-jodidhar/projects">
            <button className="border border-black px-8 py-3 text-lg hover:bg-[#800080] hover:text-white transition duration-300 ease-in-out">
              View All Projects
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home_Page_Projects_Section;
