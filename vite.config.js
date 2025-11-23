import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Removed proxy - frontend will connect directly to Render backend
    // Proxy was for local backend, but we're using Render backend for local development
    // Frontend uses VITE_API_URL from .env file to connect to Render backend
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})

