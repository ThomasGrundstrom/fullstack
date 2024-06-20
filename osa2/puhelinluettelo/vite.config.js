import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
// Osaa 3 varten tehty muutos:
  server: {
    proxy: {
      '/api': {
        target: 'https://fullstack-osa3-deploy-version.fly.dev',
        changeOrigin: true,
      },
    }
  },
})
