// This file provides utility functions for handling routes
// It helps avoid issues with path-to-regexp

/**
 * Safely creates a route path by ensuring it doesn't contain invalid characters
 * @param {string} path - The route path
 * @returns {string} - A sanitized route path
 */
export const createRoutePath = (path) => {
  // Remove any invalid characters that might cause path-to-regexp to fail
  return path.replace(/https?:\/\/[^/]+/g, '');
};

/**
 * Checks if a URL is valid
 * @param {string} url - The URL to check
 * @returns {boolean} - Whether the URL is valid
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Safely handles navigation to prevent path-to-regexp errors
 * @param {function} navigate - The navigate function from react-router
 * @param {string} path - The path to navigate to
 */
export const safeNavigate = (navigate, path) => {
  const sanitizedPath = createRoutePath(path);
  navigate(sanitizedPath);
};

export default {
  createRoutePath,
  isValidUrl,
  safeNavigate
};
