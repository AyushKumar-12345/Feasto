import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Standard Vite port
    proxy: {
      '/api': {
        target: 'https://feasto-backend-pcbq.onrender.com',
        changeOrigin: true,
        secure: true,
      }
    }
  }
})