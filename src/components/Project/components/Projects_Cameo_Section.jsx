import React, { useState, useEffect, useContext } from "react";
import ProjectContext from "../../../context/ProjectContext";
import cameo from "../../../assets/Projects/ChethanJodidharProjects/chethanjodidharprojects.webp";

const Projects_Cameo_Section = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { projects, loading: contextLoading } = useContext(ProjectContext);

  useEffect(() => {
    // Find a project in the Cameo section
    const cameoProject = projects.find(p => p.section === 'Cameo');

    if (cameoProject) {
      setProject(cameoProject);
    }

    setLoading(false);
  }, [projects]);

  // Fallback content if no project is found
  const title = project ? project.title : "Personal Cameos and Appearances";
  const description = project ? project.description :
    "A filmmaker with a deep appreciation for cinematic tradition, " +
    "Chethan often makes cameo appearances in his films as a nod to " +
    "legendary filmmakers like Alfred Hitchcock. These brief " +
    "appearances add an extra layer of intrigue for his audience and " +
    "give them an additional connection to his work.";
  const imageUrl = project ? project.imageUrl : cameo;

  return (
    <section className="py-12 md:py-24 bg-[#faf5fa] px-4 md:px-6">
      <div className="container mx-auto">
        {loading || contextLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 md:gap-12">
            {/* Image Column */}
            <div className="flex justify-center md:justify-start items-center md:w-1/2">
              <div className="w-full max-w-[700px] h-[400px] overflow-hidden rounded-2xl shadow-2xl">
                <img
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  src={imageUrl}
                  alt={title}
                />
              </div>
            </div>

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
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects_Cameo_Section;
