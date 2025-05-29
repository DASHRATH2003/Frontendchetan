import React from "react";
import slide1 from "../../../assets/Home_Banner_Images/chetan_cinemas_banner1.webp";
import slide2 from "../../../assets/Home_Banner_Images/chetan_cinemas_benner2.webp";
import slide3 from "../../../assets/Home_Banner_Images/chetan_cinemas_benner3.webp";
import slide4 from "../../../assets/Home_Banner_Images/chetan_cinemas_banner4.webp";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Home_Banner_Section = () => {
  const slides = [
    { image: slide2, alt: "chetan_cinemas_banglore" },
    { image: slide3, alt: "chetan_cinemas_banglore" },
    { image: slide4, alt: "chetan_cinemas_banglore" },
    { image: slide1, alt: "chetan_cinemas_banglore" },
  ];

  const PreviousArrow = ({ onClick }) => (
    <button
      className="absolute top-1/2 left-2 md:left-4 z-10 transform -translate-y-1/2 text-white rounded-full p-1 md:p-2 shadow-md hover:bg-gray-200 hover:bg-opacity-50 transition-colors duration-300"
      onClick={onClick}
    >
      <FaChevronLeft size={16} className="md:w-5 md:h-5" />
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button
      className="absolute top-1/2 right-2 md:right-4 z-10 transform -translate-y-1/2 text-white rounded-full p-1 md:p-2 shadow-md hover:bg-gray-200 hover:bg-opacity-50 transition-colors duration-300"
      onClick={onClick}
    >
      <FaChevronRight size={16} className="md:w-5 md:h-5" />
    </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PreviousArrow />,
    nextArrow: <NextArrow />,
    pauseOnHover: false,
    autoplay: true,
    autoplaySpeed: 2500,
  };

  return (
    <section className="relative overflow-hidden">
      <Slider {...settings}>
        {slides.map((item, index) => (
          <div
            key={index}
            className="relative w-full h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[85vh] overflow-hidden"
          >
            <img
              className="w-full h-full object-cover"
              src={item.image}
              alt={item.alt}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-10"></div>
          </div>
        ))}
      </Slider>

      <div className="absolute top-0 left-0 w-full p-4 md:p-8 lg:p-10">
        <h1 className="text-white font-bold tracking-wide font-signature text-3xl sm:text-4xl md:text-5xl mb-2 md:mb-3">
          Chetan Jodidhar
        </h1>
        <p className="text-white text-sm sm:text-base md:text-lg font-normal bg-[#800080] bg-opacity-30 py-1 px-2 inline-block">
          <span className="block sm:inline">Film Director</span>
          <span className="hidden sm:inline"> | </span>
          <span className="block sm:inline">Director of Photography</span>
          <span className="hidden sm:inline"> | </span>
          <span className="block sm:inline">Film Producer</span>
          <span className="hidden sm:inline"> | </span>
          <span className="block sm:inline">Screenwriter</span>
        </p>
      </div>
    </section>
  );
};

export default Home_Banner_Section;
