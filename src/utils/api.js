// Get the backend URL based on environment
const getBackendUrl = () => {
  const isLocalhost = window.location.hostname === 'localhost';
  return isLocalhost
    ? 'http://localhost:5000'
    : 'https://backendchetan.onrender.com';
};

const API_URL = getBackendUrl();
const APP_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5137'
  : 'https://frontendchetan.vercel.app';

// Add error handling wrapper
const handleFetchError = async (response) => {
  if (!response.ok) {
    const error = await response.text().catch(() => 'Unknown error');
    throw new Error(error);
  }
  return response;
};

export const api = {
  // Projects
  getProjects: () => fetch(`${API_URL}/api/projects`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  })
  .then(handleFetchError)
  .then(res => res.json()),
  
  // Gallery
  getGallery: () => fetch(`${API_URL}/api/gallery`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  })
  .then(handleFetchError)
  .then(res => res.json()),
  
  // Contact
  submitContact: (data) => fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(data)
  })
  .then(handleFetchError)
  .then(res => res.json()),
};

export const config = {
  API_URL,
  APP_URL
};

export default api; 