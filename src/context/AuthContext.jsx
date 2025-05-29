import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // PRODUCTION MODE: No API calls, just client-side validation
        // Don't set axios headers since we're not making API calls
        // axios.defaults.headers.common['x-auth-token'] = token;

        // Mock user data
        const mockUser = {
          _id: '1',
          username: 'admin',
          name: 'Admin User',
          email: 'admin@example.com',
          isAdmin: true,
          theme: 'light',
          profileImage: '/src/assets/logo.png' // Add a default profile image
        };

        setUser(mockUser);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('token');
        setError('Authentication failed');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login user
  const login = async (username, password) => {
    try {
      setLoading(true);
      console.log('Login attempt with:', { username, password });

      // PRODUCTION MODE: No API calls, just client-side validation
      // For production deployment, use hardcoded credentials
      // This is not secure for real production but works for this demo
      if ((username === 'admin' && password === 'admin123') ||
          (username === 'chethan' && password === 'chethan123') ||
          (password === 'password')) { // Keep the old password option for backward compatibility

        // Mock token
        const mockToken = 'mock-jwt-token';
        localStorage.setItem('token', mockToken);

        // Don't set axios headers since we're not making API calls
        // axios.defaults.headers.common['x-auth-token'] = mockToken;

        // Mock user data
        const mockUser = {
          _id: '1',
          username: username,
          name: 'Admin User',
          email: `${username}@example.com`,
          isAdmin: true,
          theme: 'light',
          profileImage: '/src/assets/logo.png' // Add a default profile image
        };

        setUser(mockUser);
        setIsAuthenticated(true);
        setError(null);
        return true;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);

      // PRODUCTION MODE: No API calls, just client-side validation
      // Mock registration
      const mockToken = 'mock-jwt-token';
      localStorage.setItem('token', mockToken);
      // Don't set axios headers since we're not making API calls
      // axios.defaults.headers.common['x-auth-token'] = mockToken;

      // Create mock user from registration data
      const mockUser = {
        _id: '1',
        username: userData.username || 'newuser',
        name: userData.name || 'New User',
        email: userData.email || 'newuser@example.com',
        isAdmin: false,
        theme: 'light',
        profileImage: '/src/assets/logo.png' // Add a default profile image
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (err) {
      setError('Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    // Don't try to delete axios headers since we're not using them
    // delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);

      // PRODUCTION MODE: No API calls, just client-side validation
      // Update user data in state
      const updatedUser = { ...user, ...userData };

      // Make sure profileImage is set
      if (!updatedUser.profileImage) {
        updatedUser.profileImage = '/src/assets/logo.png';
      }

      setUser(updatedUser);
      setError(null);
      return true;
    } catch (err) {
      setError('Profile update failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update theme
  const updateTheme = async (theme) => {
    try {
      setLoading(true);

      // Update theme in user state
      setUser({ ...user, theme });
      setError(null);
      return true;
    } catch (err) {
      setError('Theme update failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        updateTheme
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
