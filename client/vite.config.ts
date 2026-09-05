import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  envDir: '../',
  server: {
    proxy: {
      '/auth': 'http://localhost:3001',
      '/api': 'http://localhost:3001',
      '/posts': 'http://localhost:3001',
      '/login': 'http://localhost:3001',
      '/register': 'http://localhost:3001',
      '/upload': 'http://localhost:3001',
      '/bank-records': 'http://localhost:3001',
      '/calendar-events': 'http://localhost:3001',
      '/movie-records': 'http://localhost:3001',
    },
  },
  resolve: {
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
})
