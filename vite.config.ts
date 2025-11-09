import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({ protocolImports: true })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      buffer: 'buffer',
      process: 'process/browser',
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
      util: 'util',
      events: 'events',
      assert: 'assert',
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer', 'process', 'stream-browserify', 'crypto-browserify'],
  },
  server: {
    port: 5173,
  },
})

