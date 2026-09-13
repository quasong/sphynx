import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base so the built site can be served from any sub-path.
  base: './',
  build: {
    rollupOptions: {
      output: {
        // Cache math separately from frequently edited content. The entry
        // page and its figures are loaded only when an entry is opened.
        manualChunks: (id) => id.includes('/node_modules/katex/') ? 'math' : undefined,
      },
    },
  },
});
