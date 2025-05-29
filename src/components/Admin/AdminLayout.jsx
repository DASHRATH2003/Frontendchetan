import React, { useContext, useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { FaHome, FaImages, FaEnvelope, FaUser, FaSignOutAlt, FaMoon, FaSun, FaProjectDiagram } from 'react-icons/fa';
import AuthContext from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const AdminLayout = ({ children }) => {
  const { isAuthenticated, user, logout, loading, updateTheme } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(user?.theme === 'dark');
  const location = useLocation();

  // If not authenticated and not loading, redirect to login
  if (!isAuthenticated && !loading) {
    return <Navigate to="/admin/login" />;
  }

  // If still loading, show loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleTheme = async () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    await updateTheme(newTheme);

    // Apply theme to body
    if (newTheme === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, link: '/admin/dashboard' },
    { name: 'Projects', icon: <FaProjectDiagram />, link: '/admin/projects' },
    { name: 'Gallery', icon: <FaImages />, link: '/admin/gallery' },
    { name: 'Contact', icon: <FaEnvelope />, link: '/admin/contact' },
    { name: 'Profile', icon: <FaUser />, link: '/admin/profile' },
  ];

  return (
    <div className={`flex h-screen bg-gray-100 ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto`}
      >
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
          <img src={logo} alt="Logo" className="h-10" />
          <h1 className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">Admin Panel</h1>
        </div>
        <nav className="mt-5 px-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className={`flex items-center px-4 py-3 mt-2 text-gray-600 rounded-lg ${
                location.pathname === item.link
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                  : 'hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="mx-4 font-medium">{item.name}</span>
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 mt-5 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <span className="text-lg">
              <FaSignOutAlt />
            </span>
            <span className="mx-4 font-medium">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between h-16 px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 focus:outline-none lg:hidden"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20M4 12H20M4 18H11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:outline-none"
            >
              {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>
            <div className="relative ml-4">
              <div className="flex items-center">
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={user?.profileImage || '/src/assets/logo.png'}
                  alt="User avatar"
                />
                <span className="ml-2 font-medium text-gray-800 dark:text-white">
                  {user?.name || 'Admin'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
