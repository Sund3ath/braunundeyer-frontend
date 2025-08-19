import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: true,
    allowedHosts: [
      'cms.braunundeyer.de',
      'localhost',
      '127.0.0.1',
      '0.0.0.0'
    ]
  },
  resolve: {
    alias: {
      'components': '/src/components',
      'pages': '/src/pages',
      'styles': '/src/styles',
      'services': '/src/services',
      'cms': '/src/cms',
    }
  }
})
