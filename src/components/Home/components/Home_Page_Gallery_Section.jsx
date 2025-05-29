import React from 'react'
import Home_Page_Contact_Section2 from './Home_Page_Contact_Section2';

const Home_Page_Gallery_Section = () => {
  return (
    <section className="bg-[#faf5fa] flex flex-col gap-5 lg:gap-8">
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-4xl text-center font-bold text-[#363636]">
          Explore{" "}
          <span className="font-signature text-[#800080] text-5xl">Our</span>{" "}
          Gallery !
        </h1>
      </div>
      <div>
        <Home_Page_Contact_Section2 />
      </div>
    </section>
  );
}

export default Home_Page_Gallery_Section
