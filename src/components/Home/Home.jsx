import React from 'react'
import Home_Banner_Section from './components/Home_Banner_Section'
import Home_Page_About_Us from './components/Home_Page_About_Us'
import Home_Page_About_Us2 from './components/Home_Page_About_Us2'
import HomePageCountSection from './components/HomePageCountSection'
import Home_Page_Projects_Section from './components/Home_Page_Projects_Section'
import Home_Page_Gallery_Section from './components/Home_Page_Gallery_Section'
import Home_Page_StyleOfWorking_Section from './components/Home_Page_StyleOfWorking_Section'
import Home_Page_Experience_Section from './components/Home_Page_Experience_Section'
import Home_Page_Contact_Us from './components/Home_Page_Contact_Us'
import Home_Page_Contact_Section2 from './components/Home_Page_Contact_Section2'
import ContactMap from '../Contact/components/ContatMap'

const Home = () => {
  return (
    <div>
      <Home_Banner_Section/>
      <Home_Page_About_Us/>
      <Home_Page_About_Us2/>
      <HomePageCountSection/>
      <Home_Page_StyleOfWorking_Section/>
      <Home_Page_Projects_Section/>
      <Home_Page_Gallery_Section/>
      {/* <Home_Page_Contact_Section2/> */}
      <Home_Page_Experience_Section/>
      <Home_Page_Contact_Us/>
      <ContactMap/>
    </div>
  )
}

export default Home
