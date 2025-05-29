import React from "react";
import bannerImage from "../../../assets/About_Us/About_Us_Banner.webp";

const About_Us_Banner_Section = () => {
  return (
    <section>
      <div className="relative">
        <img src={bannerImage} alt="chetan_jodidhar_films" />
        <p className="absolute bottom-0 sm:bottom-5 left-0 sm:left-6 bg-[#800080] bg-opacity-75 p-2 sm:p-5 font-semibold text-lg sm:text-2xl md:text-3xl lg:text-4xl text-white">
          About Us
        </p>
      </div>
      <div className="py-5 bg-[#fefefe]">
        <h1 className="text-xl text-center text-[#3b444c] font-bold tracking-wider">
          Film Director | Director of Photography | Film Producer | Screenwriter
        </h1>
      </div>
    </section>
  );
};

export default About_Us_Banner_Section;
