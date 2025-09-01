import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Include .tsx and .jsx files
      include: "**/*.{jsx,tsx}",
    })
  ],
  server: {
    // Enable HMR
    hmr: true,
    // Watch for changes in these file types
    watch: {
      usePolling: true,
      interval: 100,
    },
    // Port configuration
    port: 5173,
    // Enable hot reload
    host: true,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    // Force pre-bundling of these dependencies for faster HMR
    include: ['react', 'react-dom'],
  },
  // Enable source maps for better debugging
  build: {
    sourcemap: true,
  },
});
