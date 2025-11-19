import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost/bita',
        changeOrigin: true,
        secure: false
      },
      '/admin': {
        target: 'http://localhost/bita',
        changeOrigin: true,
        secure: false
      }
    },
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})

