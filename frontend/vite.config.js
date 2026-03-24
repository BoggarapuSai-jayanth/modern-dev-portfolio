import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Force Vite to resolve "convex/server" from the frontend's own
      // node_modules instead of following the relative import into the backend.
      'convex/server': path.resolve(
        __dirname,
        'node_modules/convex/dist/esm/server/index.js'
      ),
    },
  },
})
