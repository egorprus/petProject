import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  envDir: '../',
  server: {
    proxy: {
      '/auth': 'http://localhost:8080',
      '/api': 'http://localhost:8080',
      '/posts': 'http://localhost:8080',
      '/login': 'http://localhost:8080',
      '/register': 'http://localhost:8080',
      '/upload': 'http://localhost:8080',
      '/bank-records': 'http://localhost:8080',
      '/calendar-events': 'http://localhost:8080',
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
