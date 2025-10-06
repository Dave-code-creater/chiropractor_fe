import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Optimize for Electron
    target: 'chrome100',
    // Increase chunk size warning limit (we've improved splitting)
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core vendor libraries
          if (id.includes('node_modules')) {
            // React ecosystem
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            // Router
            if (id.includes('react-router')) {
              return 'vendor-router';
            }
            // Redux ecosystem
            if (id.includes('redux') || id.includes('@reduxjs')) {
              return 'vendor-redux';
            }
            // UI libraries (Radix UI)
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            // Charts and visualization
            if (id.includes('recharts') || id.includes('d3-')) {
              return 'vendor-charts';
            }
            // Date libraries
            if (id.includes('date-fns')) {
              return 'vendor-date';
            }
            // DnD Kit
            if (id.includes('@dnd-kit')) {
              return 'vendor-dnd';
            }
            // Other vendor code
            return 'vendor-misc';
          }
          
          // Split feature modules
          if (id.includes('/src/features/')) {
            // Extract feature name
            const match = id.match(/\/features\/([^/]+)\//);
            if (match) {
              const feature = match[1];
              return `feature-${feature}`;
            }
          }
          
          // Split API services
          if (id.includes('/src/api/')) {
            return 'api-services';
          }
          
          // Split components by category
          if (id.includes('/src/components/ui/')) {
            return 'components-ui';
          }
          if (id.includes('/src/components/')) {
            return 'components-common';
          }
        }
      }
    }
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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setupTests.js',
    css: true
  },
  // Vite automatically exposes VITE_ prefixed variables safely
  // Removed unsafe define that exposed all environment variables
})
