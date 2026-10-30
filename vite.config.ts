import { copyFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const root = fileURLToPath(new URL('.', import.meta.url))

function spaFallback() {
  return {
    name: 'spa-fallback',
    closeBundle() {
      const index = resolve(root, 'dist/index.html')
      if (existsSync(index)) {
        copyFileSync(index, resolve(root, 'dist/404.html'))
      }
    },
  }
}

export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [react(), spaFallback()],
  resolve: {
    alias: {
      '@': resolve(root, 'src'),
    },
  },
})
