import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path' 

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), 
    },
  },
  // Vite automatically exposes VITE_ prefixed variables safely
  // Removed unsafe define that exposed all environment variables
})