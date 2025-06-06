import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Base path for production deployment
  server: {
    host: "0.0.0.0", // Allow connections from external devices
    port: 5137, // Specify the port
    cors: true, // Enable CORS
    proxy: {
      '/api': {
        target: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:5000'
          : 'https://backendchetan.onrender.com',
        changeOrigin: true,
        secure: true,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  },
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory for production build
    assetsDir: 'assets', // Directory for assets in production build
    sourcemap: process.env.NODE_ENV === 'development', // Disable sourcemaps for smaller build size
    minify: 'terser', // Use terser for minification
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production', // Remove console.log in production
      },
    },
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('https://backendchetan.onrender.com'),
    'process.env.VITE_APP_URL': JSON.stringify('https://frontendchetan.vercel.app')
  }
});
