import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/userLogin': 'http://localhost:5000',
      '/userRegister': 'http://localhost:5000',
      '/userLogout': 'http://localhost:5000'
    }
  }
})
