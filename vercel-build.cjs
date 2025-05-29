// This file is used by Vercel to build the project
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Run the build command
console.log('Building the project...');
execSync('npm run build', { stdio: 'inherit' });

// Create a _redirects file for SPA routing
console.log('Creating _redirects file...');
const redirectsContent = '/* /index.html 200';
fs.writeFileSync(path.join(__dirname, 'dist', '_redirects'), redirectsContent);

// Create a Vercel-specific _routes.json file
console.log('Creating _routes.json file...');
const routesContent = JSON.stringify({
  "version": 1,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
});
fs.writeFileSync(path.join(__dirname, 'dist', '_routes.json'), routesContent);

console.log('Build completed successfully!');
