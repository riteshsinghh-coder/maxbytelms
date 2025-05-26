import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Import the plugin

export default defineConfig({
  plugins: [react()], // Use the plugin
  server: {
    // If your frontend needs to proxy API calls to your backend (which is on port 10000)
    proxy: {
      '/api': {
        target: 'http://localhost:10000', // Your backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});