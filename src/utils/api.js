const API_URL = 'https://chetanbackend.onrender.com';
const APP_URL = 'https://silly-zuccutto-6e18a6.netlify.app';

export const api = {
  // Projects
  getProjects: () => fetch(`${API_URL}/api/projects`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()),
  
  // Gallery
  getGallery: () => fetch(`${API_URL}/api/gallery`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()),
  
  // Contact
  submitContact: (data) => fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),
};

export const config = {
  API_URL,
  APP_URL
};

export default api; 