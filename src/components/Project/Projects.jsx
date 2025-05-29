import React from 'react'
import Projects_Banner_Section from './components/Projects_Banner_Section'
import Projects_Section2 from './components/Projects_Section2'
import Projects_Section_Section3 from './components/Projects_Section_Section3'
import Projects_Cameo_Section from './components/Projects_Cameo_Section'

const Projects = () => {
  console.log("Projects component rendered");
  return (
    <main>
        <section>
            <Projects_Banner_Section/>
            <Projects_Section2/>
            {/* <Projects_Section_Section3/> */}
            <Projects_Cameo_Section/>
        </section>
    </main>
  )
}

export default Projects
