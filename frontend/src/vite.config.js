import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Ensure this port matches your frontend URL
    strictPort: true, // Fail if the port is unavailable
    hmr: {
      port: 5173, // Force HMR to use the same port as the frontend
      host: 'localhost',
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend API target
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
