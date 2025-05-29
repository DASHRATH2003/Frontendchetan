const API_URL = import.meta.env.VITE_API_URL || 'https://chetanbackend.onrender.com';

export const api = {
  // Projects
  getProjects: () => fetch(`${API_URL}/api/projects`).then(res => res.json()),
  
  // Gallery
  getGallery: () => fetch(`${API_URL}/api/gallery`).then(res => res.json()),
  
  // Contact
  submitContact: (data) => fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),
};

export default api; 