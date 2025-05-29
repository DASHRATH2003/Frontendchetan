import React, { useState, useEffect, useContext } from "react";
import ProjectContext from "../../../context/ProjectContext";
import image from "../../../assets/Projects/chethan_jodidhar_projects_banner.webp";

const Projects_Section2 = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { projects, loading: contextLoading } = useContext(ProjectContext);

  useEffect(() => {
    // Find a project in the Section2 section
    const section2Project = projects.find(p => p.section === 'Section2');

    if (section2Project) {
      setProject(section2Project);
    }

    setLoading(false);
  }, [projects]);

  // Fallback content if no project is found
  const title = project ? project.title : "Career Vision";
  const description = project ? project.description :
    "As Chethan continues to evolve as a filmmaker, he is excited about " +
    "leading larger-scale projects that challenge his craft and broaden " +
    "his creative horizons. He aspires to contribute to films and " +
    "commercials that are visually striking, emotionally engaging, and " +
    "culturally relevant. With a passion for exploring new technologies " +
    "and techniques, Chethan is committed to creating ground breaking " +
    "films that not only push the boundaries of Indian cinema but also " +
    "resonate on a global stage.";
  const imageUrl = project ? project.imageUrl : image;

  return (
    <section className="py-12 md:py-24 px-4 md:px-6">
      <div className="container mx-auto">
        {loading || contextLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="flex flex-col-reverse md:flex-row gap-8 md:gap-12">
            {/* Content Column */}
            <div className="flex flex-col items-center lg:items-start gap-4 md:gap-5 justify-center md:w-1/2">
              <h1 className="font-bold uppercase text-xl md:text-2xl text-center mb-4">
                {title}
              </h1>
              <p className="text-center lg:text-justify leading-6 md:leading-7">
                {description}
              </p>
              {project && project.category && (
                <p className="text-sm text-gray-600 mt-2">
                  Category: {project.category}
                </p>
              )}
              <button className="border border-black px-8 md:px-12 py-2 md:py-3 text-lg md:text-xl hover:bg-[#800080] hover:text-white transition duration-300 ease-in-out mt-2 md:mt-4">
                More About Me
              </button>
            </div>

            {/* Image Column */}
            <div className="flex justify-center md:justify-end items-center md:w-1/2 mt-8 md:mt-0">
              <div className="w-full max-w-[700px] h-[400px] overflow-hidden rounded-2xl shadow-2xl">
                <img
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  src={imageUrl}
                  alt={title}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects_Section2;
