import React, { useState, useContext } from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { FaAlignRight } from "react-icons/fa6";
import { FaTimes, FaFacebook, FaInstagram, FaYoutube, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import UserContext from "../../context/UserContext";
import AuthModal from "../Auth/AuthModal";

const Header = () => {
  const { user, logout } = useContext(UserContext);

  const menuItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "About",
      link: "/chethan-jodidhar/about-us",
    },
    // {
    //   name: "Team",
    // },
    {
      name: "Projects",
      link: "/chethan-jodidhar/projects",
    },
    {
      name: "Gallery",
      link: "/chethan-jodidhar/gallery",
    },
    {
      name: "Contact",
      link: "/chethan-jodidhar/contact",
    },
  ];

  const [toggle, setToggle] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const toggleMenu = () => {
    setToggle((prevState) => !prevState);
  };

  const openLoginModal = () => {
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    // Close mobile menu if open
    if (toggle) {
      toggleMenu();
    }
  };

  return (
    <main>
      {/* Desktop Header */}

      <header className="container mx-auto hidden md:block lg:block">
        <section className="flex items-center justify-between">
          {/* Logo */}
          <figure>
            <img src={logo} className="w-28 p-3" alt="chetan_cinemas_logo" />
          </figure>

          {/* Navigation Menu */}
          <nav className="flex items-center">
            <ul className="flex gap-10 uppercase">
              {menuItems.map((item, index) => {
                return (
                  <Link to={item.link} key={index}>
                    <li
                      key={index}
                      className="cursor-pointer text-lg font-normal"
                    >
                      {item.name}
                    </li>
                  </Link>
                );
              })}

              {/* Auth Buttons or User Info */}
              {user ? (
                <div className="flex items-center gap-2 ml-6">
                  <span className="text-lg font-medium">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-lg font-normal text-red-600 hover:text-red-800"
                  >
                    <FaSignOutAlt /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-4 ml-6">
                  <button
                    onClick={openLoginModal}
                    className="flex items-center gap-1 text-lg font-normal hover:text-purple-600"
                  >
                    <FaSignInAlt /> Login
                  </button>
                </div>
              )}
            </ul>
          </nav>
        </section>
      </header>

      {/* Mobile Menu  */}
      <header className="container mx-auto block md:hidden lg:hidden relative">
        <section className="flex items-center justify-between">
          {/* Logo */}
          <div>
            <figure>
              <img src={logo} className="w-28" alt="chetan_cinemas_logo" />
            </figure>
          </div>

          <div className="flex items-center justify-center">
            {toggle ? (
              <>
                <FaTimes
                  className="text-4xl absolute right-3"
                  onClick={toggleMenu}
                />

                {/* Navigation menu */}
                <div
                  className={`absolute top-[100%] right-0 w-full z-50 bg-black transition-all duration-500 ease-in-out ${
                    toggle
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 -translate-y-10"
                  }`}
                >
                  <nav>
                    <ul className="py-20 flex flex-col gap-10 uppercase items-center justify-center text-white">
                      {menuItems.map((item, index) => {
                        return (
                          <Link to={item.link} key={index}>
                            <li
                              key={index}
                              className="cursor-pointer text-lg font-normal"
                              onClick={toggleMenu}
                            >
                              {item.name}
                            </li>
                          </Link>
                        );
                      })}
                      {/* Auth Buttons or User Info */}
                      {user ? (
                        <div className="flex flex-col items-center gap-4 mt-4">
                          <span className="text-lg font-medium">{user.name}</span>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-lg font-normal text-red-400 hover:text-red-300"
                          >
                            <FaSignOutAlt /> Logout
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4 mt-4">
                          <button
                            onClick={() => {
                              toggleMenu();
                              openLoginModal();
                            }}
                            className="flex items-center gap-2 text-lg font-normal text-white hover:text-purple-300"
                          >
                            <FaSignInAlt /> Login
                          </button>
                        </div>
                      )}

                      <div className="flex gap-5 mt-6">
                        <FaFacebook className="text-4xl bg-[#eb2beb] p-[5px] rounded-lg" />
                        <FaInstagram className="text-4xl bg-[#eb2beb] p-[5px] rounded-lg" />
                        <FaYoutube className="text-4xl bg-[#eb2beb] p-[5px] rounded-lg" />
                      </div>
                    </ul>
                  </nav>
                </div>
              </>
            ) : (
              <>
                <FaAlignRight
                  className="text-4xl absolute right-3"
                  onClick={toggleMenu}
                />
              </>
            )}
          </div>
        </section>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
      />
    </main>
  );
};

export default Header;
