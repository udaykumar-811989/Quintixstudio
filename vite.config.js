import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so the site works when served from a sub-path
  // (GitHub Pages: https://<user>.github.io/Quintixstudio/) as well as locally.
  base: './',
  server: {
    port: 5173,
    open: false,
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/three|@react-three/.test(id)) return 'three';
            if (/gsap|lenis/.test(id)) return 'motion';
          }
          return undefined;
        },
      },
    },
  },
});
