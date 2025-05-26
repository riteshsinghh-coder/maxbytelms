// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Import the plugin

export default defineConfig({
  plugins: [react()], // Use the plugin
  // You might also need to configure specific file extensions if you're mixing .js and .jsx
  // For example, if you have React code in .js files:
  // esbuild: {
  //   loader: 'jsx',
  //   include: /src\/.*\.js$/, // adjust this regex to match your files
  //   exclude: [],
  // },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     loader: {
  //       '.js': 'jsx',
  //     },
  //   },
  // },
});