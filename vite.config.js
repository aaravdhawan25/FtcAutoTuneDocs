import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use VITE_BASE env var for GitHub Pages (set to /FtcAutoTuneDocs/ in the Actions workflow)
  // Vercel and local dev get '/' by default
  base: process.env.VITE_BASE ?? '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'motion': ['framer-motion'],
          'syntax': ['react-syntax-highlighter'],
        },
      },
    },
  },
})
