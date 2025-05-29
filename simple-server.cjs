const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5150', 'http://127.0.0.1:5150'],
  credentials: true
}));

app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ msg: 'API is working' });
});

// User routes
app.post('/api/auth/login', (req, res) => {
  console.log('Login route hit');
  console.log('Request body:', req.body);

  // Mock authentication
  res.json({
    user: {
      _id: '1',
      name: 'Admin User',
      email: 'admin@example.com',
      username: 'admin',
      profileImage: '/uploads/profile.jpg'
    },
    token: 'mock-token-12345'
  });
});

// Gallery routes
app.get('/api/gallery', (req, res) => {
  console.log('Gallery route hit');
  res.json([
    { _id: '1', title: 'Image 1', description: 'Description 1', imageUrl: '/uploads/image1.jpg' },
    { _id: '2', title: 'Image 2', description: 'Description 2', imageUrl: '/uploads/image2.jpg' },
    { _id: '3', title: 'Image 3', description: 'Description 3', imageUrl: '/uploads/image3.jpg' }
  ]);
});

// Projects routes
app.get('/api/projects', (req, res) => {
  console.log('Projects route hit');
  res.json([
    { _id: '1', title: 'Project 1', description: 'Description 1', imageUrl: '/uploads/project1.jpg', category: 'Category 1', section: 'Banner', completed: true },
    { _id: '2', title: 'Project 2', description: 'Description 2', imageUrl: '/uploads/project2.jpg', category: 'Category 2', section: 'Section2', completed: false },
    { _id: '3', title: 'Project 3', description: 'Description 3', imageUrl: '/uploads/project3.jpg', category: 'Category 3', section: 'Cameo', completed: true }
  ]);
});

// Contact routes
app.get('/api/contact', (req, res) => {
  console.log('Contact route hit');
  res.json([
    { _id: '1', name: 'Contact 1', email: 'contact1@example.com', message: 'Message 1', isRead: true },
    { _id: '2', name: 'Contact 2', email: 'contact2@example.com', message: 'Message 2', isRead: false },
    { _id: '3', name: 'Contact 3', email: 'contact3@example.com', message: 'Message 3', isRead: false }
  ]);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /api/test');
  console.log('- POST /api/auth/login');
  console.log('- GET /api/gallery');
  console.log('- GET /api/projects');
  console.log('- GET /api/contact');
});

// Keep the server running
setInterval(() => {
  console.log('Server is still running...');
}, 60000); // Log every minute to keep the process alive

process.on('SIGINT', () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server shut down');
    process.exit(0);
  });
});
