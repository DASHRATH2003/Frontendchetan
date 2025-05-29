import React from "react";
import img1 from "../../../assets/Home_Page_About_Us/chetan_cinemas_banglore_contact_us.webp";
import { Link } from "react-router-dom";

const Home_Page_Contact_Section2 = () => {
  return (
    <section className="bg-[#800080] py-5">
      <section className="container px-4 lg:px-0 mx-auto py-5 flex flex-col lg:flex-row gap-10 items-center">
        <div>
          {/* Add the animation class to the image */}
          <img
            className="w-96 rounded-full shadow-2xl lg:shadow-massive animate-up-down"
            src={img1}
            alt="Gallery"
          />
        </div>
        <div className="flex flex-col items-start gap-5">
          <p className="text-white">
            Step into our world of creativity and elegance. Explore our gallery
            to discover stunning moments and inspiring creations that define our
            vision.
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

export default Home_Page_Contact_Section2;
