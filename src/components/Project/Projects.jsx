import React from 'react'
import ProjectsBannerSection from './components/ProjectsBannerSection'
import ProjectsSection2 from './components/Projects_Section2'
import ProjectsSectionSection3 from './components/Projects_Section_Section3'
import ProjectsCameoSection from './components/Projects_Cameo_Section'

const Projects = () => {
  console.log("Projects component rendered");
  return (
    <main>
        <section>
            <ProjectsBannerSection/>
            <ProjectsSection2/>
            {/* <ProjectsSectionSection3/> */}
            <ProjectsCameoSection/>
        </section>
    </main>
  )
}

export default Projects
