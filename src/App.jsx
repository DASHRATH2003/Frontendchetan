import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Header from "./components/Navbar/Header";
import Footer from "./components/Navbar/Footer";
import About from "./components/About/About";
import Projects from "./components/Project/Projects";
import Contact from "./components/Contact/Contact";
import Gallery from "./components/Gallery/Gallery";
import ScrollToTop from "./components/ScrollToTop";

// Admin Components
import AdminLogin from "./components/Admin/Login";
import Dashboard from "./components/Admin/Dashboard";
import ProjectsAdmin from "./components/Admin/ProjectsAdmin";
import GalleryAdmin from "./components/Admin/GalleryAdmin";
import ContactAdmin from "./components/Admin/ContactAdmin";
import ProfileAdmin from "./components/Admin/ProfileAdmin";

// Context
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { ProjectProvider } from "./context/ProjectContext";
import { GalleryProvider } from "./context/GalleryContext";
import UserLogin from "./components/Auth/Login";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <ProjectProvider>
          <GalleryProvider>
            <Router>
              <ScrollToTop />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={
                  <React.Fragment>
                    <Header />
                    <main>
                      <Home />
                    </main>
                    <Footer />
                  </React.Fragment>
                } />
                <Route path="/chethan-jodidhar/about-us" element={
                  <React.Fragment>
                    <Header />
                    <main>
                      <About />
                    </main>
                    <Footer />
                  </React.Fragment>
                } />
                <Route path="/chethan-jodidhar/projects" element={
                  <React.Fragment>
                    <Header />
                    <main>
                      <Projects />
                    </main>
                    <Footer />
                  </React.Fragment>
                } />
                <Route path="/chethan-jodidhar/gallery" element={
                  <React.Fragment>
                    <Header />
                    <main>
                      <Gallery />
                    </main>
                    <Footer />
                  </React.Fragment>
                } />
                <Route path="/chethan-jodidhar/contact" element={
                  <React.Fragment>
                    <Header />
                    <main>
                      <Contact />
                    </main>
                    <Footer />
                  </React.Fragment>
                } />

                {/* User Auth Routes */}
                <Route path="/login" element={
                  <React.Fragment>
                    <Header />
                    <main className="py-10">
                      <div className="container mx-auto px-4">
                        <UserLogin />
                      </div>
                    </main>
                    <Footer />
                  </React.Fragment>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/projects" element={<ProjectsAdmin />} />
                <Route path="/admin/gallery" element={<GalleryAdmin />} />
                <Route path="/admin/contact" element={<ContactAdmin />} />
                <Route path="/admin/profile" element={<ProfileAdmin />} />
              </Routes>
            </Router>
          </GalleryProvider>
        </ProjectProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
