import React from 'react'
import About_Us_Banner_Section from './components/About_Us_Banner_Section'
import About_Us_Section2 from './components/About_Us_Section2'
import AboutUs_Colloborative_Team from './components/AboutUs_Colloborative_Team'
import About_Us_Cinemetography from './components/About_Us_Cinemetography'
import About_Us_Skills from './components/About_Us_Skills'
import About_Film_Making_Philosophy from './components/About_Film_Making_Philosophy'

const About = () => {
  return (
    <div>
      <About_Us_Banner_Section/>
      <About_Us_Section2/>
      <About_Us_Cinemetography/>
      <AboutUs_Colloborative_Team/>
      <About_Us_Skills/>
      <About_Film_Making_Philosophy/>
    </div>
  )
}

export default About
