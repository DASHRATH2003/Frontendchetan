import React from "react";
import { FaCamera, FaPhotoFilm, FaVideo } from "react-icons/fa6";


const Home_Page_Experience_Section = () => {
    const array = [
      {
        icon:<FaCamera />,
        title: "Operative Camera Man for [Notable Feature Films/Projects]",
      },
      {
        icon:<FaVideo />,
        title: "Director of Photography for [High-Profile Commercial Ads]",
      },
      {
        icon:<FaPhotoFilm />,
        title:
          "Cinematographer for [Documentaries/TV Series], collaborating with leading production houses and award-winning filmmakers.",
      },
    ];
  return (
    <section className="py-20">
      <div className="flex flex-col items-center justify-center gap-8 container mx-auto">
        <h1 className="text-4xl text-center font-bold text-[#363636]">
          Experience{" "}
          <span className="font-signature text-[#800080] text-5xl px-1">
            In
          </span>
          {"  "}
          Filming
        </h1>
        <p className="text-center leading-6 px-4 lg:px-0">
          Chethan’s journey in filmmaking spans over 12 years, starting as an
          Operative Camera Man and expanding into key roles in cinematography,
          direction, and production. His deep understanding of both the
          technical and creative aspects of filmmaking has contributed to
          numerous successful projects.
        </p>
        <ul>
            {array.map((items,index)=>{
                return (
                  <div
                    key={index}
                    className="border border-[#faf5fa]-500 shadow-sm py-3 px-3 flex flex-col items-center gap-5 bg-slate-200 "
                  >
                    <div className="text-3xl flex items-center justify-center border border-[#800080] p-3 rounded-full text-[#800080]">
                      {items.icon}
                    </div>
                    <li className="text-center">{items.title}</li>
                  </div>
                );
            })}
        </ul>
      </div>
      {/* Bottom Section */}
    </section>
  );
};

export default Home_Page_Experience_Section;
