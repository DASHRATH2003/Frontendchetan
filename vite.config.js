import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Base path for production deployment
  server: {
    host: "0.0.0.0", // Allow connections from external devices
    port: 5137, // Optional: Specify the port if not already
    cors: true, // Enable CORS
    proxy: {
      '/api': {
        target: 'https://chetanbackend.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory for production build
    assetsDir: 'assets', // Directory for assets in production build
    sourcemap: false, // Disable sourcemaps for smaller build size
    minify: 'terser', // Use terser for minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
      },
    },
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify('https://chetanbackend.onrender.com'),
    'process.env.VITE_APP_URL': JSON.stringify('https://silly-zuccutto-6e18a6.netlify.app')
  }
});
