import React from "react";
import cinemetography from "../../../assets/About_Us/AboutUsGallerySection/cinematography.png";

const About_Us_Cinemetography = () => {
  return (
    <section className="py-24">
      <div className="flex flex-col gap-8 justify-center items-center container mx-auto">
        <h1 className="text-4xl font-bold text-[#00000] text-center">
          Cinematographer{" "}
          <span className="font-signature text-[#800080] text-4xl">&</span>{" "}
          Director of Photography
        </h1>
        <p className="text-center px-4 lg:px-0">
          Chethan Jodidhar’s passion for visual storytelling extends far beyond
          his directorial achievements. With over 12 years of hands-on
          experience as a cinematographer, he has contributed his expertise to
          feature films, commercial advertisements, and documentaries. His work
          as a DOP emphasizes the power of cinematography to evoke emotion,
          capture compelling narratives, and transport audiences into entirely
          different worlds.
        </p>
        <img src={cinemetography} className="w-52" alt="" />
        <p className="text-center px-4 lg:px-0">
          For Chethan, filmmaking is more than a job—it's a creative pursuit
          driven by collaboration. He believes that every film is the result of
          collective effort, where each shot and frame is crafted with
          dedication from the entire crew. His commitment to pushing the
          boundaries of creativity is evident in every project, with a constant
          drive to experiment with new techniques and ensure that every visual
          element serves the narrative.
        </p>
      </div>
    </section>
  );
};

export default About_Us_Cinemetography;
