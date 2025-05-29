import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('userToken');

        if (token) {
          // Set auth token header
          axios.defaults.headers.common['x-auth-token'] = token;

          // For testing purposes, we'll use a mock response
          // const res = await axios.get('http://localhost:5000/api/users/me');

          // Mock user data
          const mockUser = { name: 'Test User', email: 'test@example.com' };
          setUser(mockUser);
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
        // Clear invalid token
        localStorage.removeItem('userToken');
        delete axios.defaults.headers.common['x-auth-token'];
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setError(null);
      console.log('Registering user:', userData);

      // For testing purposes, we'll use a mock response
      // const res = await axios.post('http://localhost:5000/api/users/register', userData);

      // Mock response
      const res = { data: { token: 'test-token' } };

      // Save token and set user
      localStorage.setItem('userToken', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;

      // Mock user data
      const userRes = { data: { name: userData.name, email: userData.email } };
      setUser(userRes.data);

      return { success: true };
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.msg || 'Registration failed');
      return { success: false, error: err.response?.data?.msg || 'Registration failed' };
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setError(null);
      console.log('Logging in user:', userData);

      // For testing purposes, we'll use a mock response
      // const res = await axios.post('http://localhost:5000/api/users/login', userData);

      // Mock response
      const res = { data: { token: 'test-token' } };

      // Save token and set user
      localStorage.setItem('userToken', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;

      // Mock user data
      const userRes = { data: { name: userData.email.split('@')[0], email: userData.email } };
      setUser(userRes.data);

      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.msg || 'Login failed');
      return { success: false, error: err.response?.data?.msg || 'Login failed' };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('userToken');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        setError
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
