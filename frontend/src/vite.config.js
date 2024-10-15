// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,  // Automatically open the browser when the server starts
    hmr: true, // <--- Enable Hot Module Replacement
  },
  build: {
    outDir: 'dist',  // Output directory for the build files
  },
});
