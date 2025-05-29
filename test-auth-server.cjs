const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5150', 'http://127.0.0.1:5150'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  console.log('Test route hit');
  res.json({ msg: 'API is working' });
});

// User routes
app.post('/api/users/register', (req, res) => {
  console.log('Register route hit');
  console.log('Request body:', req.body);
  res.json({ token: 'test-token' });
});

app.post('/api/users/login', (req, res) => {
  console.log('Login route hit');
  console.log('Request body:', req.body);
  res.json({ token: 'test-token' });
});

app.get('/api/users/me', (req, res) => {
  console.log('Me route hit');
  res.json({ name: 'Test User', email: 'test@example.com' });
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
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- GET /api/test');
  console.log('- POST /api/users/register');
  console.log('- POST /api/users/login');
  console.log('- GET /api/users/me');
  console.log('- GET /api/gallery');
  console.log('- GET /api/projects');
  console.log('- GET /api/contact');
});
