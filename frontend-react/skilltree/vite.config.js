import { defineConfig } from 'vite'

export default defineConfig({
  root: 'public/skilltree',
  build: {
    outDir: '../../dist/skilltree',
    emptyOutDir: true
  },
  server: {
    port: 5174
  }
}) 