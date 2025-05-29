import React from "react";
import img1 from "../../../assets/About_Us/AboutUsGallerySection/filmmakingphilosophy.webp";
import { Link } from "react-router-dom";


const About_Film_Making_Philosophy = () => {
  return (
    <section className="bg-[#faf5fa] py-24">
      {/* Title Section */}
      <div className="flex flex-col gap-8 justify-center items-center container mx-auto">
        <h1 className="text-4xl font-bold text-[#00000] text-center">
          Filmmaking Philosophy and Approach{" "}
        </h1>
        <div className="bg-[#800080] w-16 h-[3px] mx-auto mt-2"></div>
      </div>

      {/* Description Section */}
      <section className="container mx-auto py-5 grid gap-10 items-center justify-center mt-10">
        <div className="flex justify-center">
          {/* Add the animation class to the image */}
          <img
            className="w-96  shadow-xl animate-up-down"
            src={img1}
            alt="Gallery"
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <p className="text-black text-center leading-6 p-4 lg:p-0">
            Chethan believes that filmmaking should strike a balance between
            commercial viability and emotional depth. His philosophy centres on
            creating films that entertain while offering a strong social
            commentary. He works with established actors whose commercial appeal
            complements the narrative’s emotional core, ensuring that the
            story’s depth reaches a wide audience. His dedication to blending
            high-octane action with poignant social themes continues to define
            his unique filmmaking style.
          </p>
          <Link to="/chethan-jodidhar/gallery">
            <button className="border border-black px-12 py-3 text-xl bg-white hover:bg-[#fffff] hover:text-[#800080] transition duration-300 ease-in-out">
              Explore Our Gallery
            </button>
          </Link>
        </div>
      </section>
    </section>
  );
};

export default About_Film_Making_Philosophy;
