// This file is used by Vercel to build the project
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run the build command
console.log('Building the project...');
execSync('npm run build', { stdio: 'inherit' });

// Create a _redirects file for SPA routing
console.log('Creating _redirects file...');
const redirectsContent = '/* /index.html 200';
fs.writeFileSync(path.join(__dirname, 'dist', '_redirects'), redirectsContent);

console.log('Build completed successfully!');
