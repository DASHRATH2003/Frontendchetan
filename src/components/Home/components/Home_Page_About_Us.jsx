import React from "react";
import { Link } from "react-router-dom";

const Home_Page_About_Us = () => {
  return (
    <section className="bg-[#faf5fa] py-24">
      <section className="container mx-auto">
        {/* About Us Image Section */}
        <div></div>

        {/* About US Content Section */}
        <div className="flex flex-col items-center justify-center gap-8">
          <h1 className="text-4xl leading-snug text-center font-bold text-[#363636]">
            Welcome to the official portfolio of{" "}
            <span className="font-signature text-[#800080] text-5xl">
              Chethan Jodidhar{" "}
            </span>
            !
          </h1>
          <p className="text-center leading-6 px-4">
            An accomplished and versatile filmmaker who has made his mark in the
            Indian film industry. With an exceptional career as a film director,
            director of photography (DOP), film producer, and screenwriter,
            Chethan is renowned for his dynamic storytelling approach. His films
            expertly merge contemporary social issues, high-octane action,
            family sentiments, vigilante themes, and cutting-edge technology,
            earning both critical acclaim and commercial success. A visionary
            filmmaker, Chethan has mastered the art of blending mass
            entertainment with thought-provoking narratives, leaving a lasting
            impact on audiences worldwide.
          </p>
          <Link to="/chethan-jodidhar/contact">
            <button className="border border-black px-12 py-3 text-xl hover:bg-[#800080] hover:text-white transition duration-300 ease-in-out">
              Let's Connect
            </button>
          </Link>
        </div>
      </section>
    </section>
  );
};

export default Home_Page_About_Us;
