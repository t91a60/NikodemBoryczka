import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/NikodemBoryczka/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules\\react\\')) return 'vendor-react'
          if (id.includes('node_modules/motion')) return 'vendor-motion'
          if (id.includes('node_modules/@phosphor-icons') || id.includes('node_modules\\@phosphor-icons')) return 'vendor-icons'
        },
      },
    },
    cssMinify: 'lightningcss',
    reportCompressedSize: false,
    target: 'es2020',
  },
})
