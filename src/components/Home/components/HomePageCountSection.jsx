import React from "react";
import {
  FaUsers,
  FaHandBackFist,
  FaHandHoldingHand,
  FaAward,
} from "react-icons/fa6";
import CountUp from "react-countup";
// import bgImg from "../../../assets/Home_Page_Countup/dj_glasses_acheivements_banner_image.webp";

const HomePageCountSection = () => {
  const countArray = [
    {
      number: 2,
      title: "Directed Movies",
    },
    {
      number: 80,
      title: "Ad Shoots, Promo Videos Completed",
    },
    {
      number: 7,
      title: "Projects Ongoing",
    },
    {
      number: 2,
      title: "Awards Won",
    },
  ];

  return (
    <section className="px-4 bg-[#800080]">

      <div className="container mx-auto text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {countArray.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-opacity-50 p-4 sm:p-6 shadow-md rounded-md"
            >
              <CountUp
                start={0}
                end={item.number}
                duration={2.5}
                suffix="+"
                className="text-2xl sm:text-3xl md:text-5xl font-bold text-white"
              />
              <p className="text-sm sm:text-base md:text-lg mt-2 font-medium text-white uppercase">
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomePageCountSection;
