import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true
      } 
    },
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,  // Enable polling for Docker
      interval: 100,     // Check for changes every 100ms
    },
    hmr: {
      host: 'localhost',
    },
  }
})
