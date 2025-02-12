import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Bundle all node_modules dependencies into separate chunks
            return 'vendor';
          }
          // You can add other logic for manual chunking here
        },
      },
    },
    chunkSizeWarningLimit: 1000,  // Increase the chunk size limit if needed
  },
  
  
});





