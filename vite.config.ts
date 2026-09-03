import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures static offline operation and file:// protocol support
  server: {
    port: 3000,
    open: false,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 100000000, // Inline small assets if any, keeping bundle self-contained
    sourcemap: false,
  },
});
