import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 4029,
    host: '0.0.0.0',
    strictPort: true,
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
