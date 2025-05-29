import React from "react";
import { FaVideo, FaLightbulb, FaCogs, FaCameraRetro } from "react-icons/fa";
import { MdOutlineTimeline } from "react-icons/md";

const About_Us_Skills = () => {
  const skills = [
    {
      icon: <FaCameraRetro size={40} className="text-[#800080]" />,
      title: "Camera Handling",
      description:
        "Skilled in using various professional cameras, ensuring optimal composition and dynamic shots that amplify the story.",
    },
    {
      icon: <FaCogs size={40} className="text-[#800080]" />,
      title: "Composition & Staging",
      description:
        "Mastering the art of framing to create visually compelling sequences that enhance the narrative.",
    },
    {
      icon: <FaLightbulb size={40} className="text-[#800080]" />,
      title: "Lighting",
      description:
        "Proficient in different lighting setups to establish mood, atmosphere, and depth in each scene.",
    },
    {
      icon: <FaVideo size={40} className="text-[#800080]" />,
      title: "Camera Movement",
      description:
        "Expert in executing complex camera movements that add intensity and emotion to the story.",
    },
    {
      icon: <MdOutlineTimeline size={40} className="text-[#800080]" />,
      title: "Post-production Understanding",
      description:
        "Comprehensive knowledge of the entire filmmaking workflow, from initial shooting to the final cut, ensuring visual consistency.",
    },
  ];

  const softSkills = [
    {
      title: "Effective Communication",
      description:
        "Ensures clear communication with all departments, fostering seamless collaboration.",
    },
    {
      title: "Leadership & Teamwork",
      description:
        "A proven leader who values and empowers the expertise of the team while leading them toward a common goal.",
    },
    {
      title: "Problem Solving",
      description:
        "Quick thinker, adept at adapting to production challenges and finding creative solutions.",
    },
    {
      title: "Time Management",
      description:
        "Able to meet tight deadlines while maintaining a high standard of work.",
    },
    {
      title: "Creative Vision",
      description:
        "Maintains the artistic integrity of every project while balancing the technical aspects of filmmaking.",
    },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-5">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#000000]">
            Skills
            <span className="font-signature text-[#800080] text-4xl"> </span>
          </h1>
          <div className="bg-[#800080] w-16 h-[3px] mx-auto mt-2"></div>
        </div>

        {/* Technical Skills */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#000000] mb-8 text-center lg:text-start">
            Technical Expertise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition duration-300"
              >
                <div className="mb-4">{skill.icon}</div>
                <h3 className="text-xl font-semibold text-[#800080] mb-2 text-center">
                  {skill.title}
                </h3>
                <p className="text-center text-black">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div>
          <h2 className="text-2xl font-bold text-[#000000] mb-8  text-center lg:text-start">
            Soft Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {softSkills.map((skill, index) => (
              <div
                key={index}
                className="flex flex-col items-center bg-white p-6 shadow-lg rounded-lg hover:shadow-xl transition duration-300"
              >
                <h3 className="text-xl font-semibold text-center text-[#800080] mb-2">
                  {skill.title}
                </h3>
                <p className="text-black text-center">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About_Us_Skills;
