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
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'react-redux',
      '@reduxjs/toolkit',
      'axios',
      'clsx',
      'tailwind-merge',
      'styled-components',
      'shallowequal'
    ],
    exclude: [
      // 'styled-components'
    ]
  },
  // Vite automatically exposes VITE_ prefixed variables safely
  // Removed unsafe define that exposed all environment variables
})