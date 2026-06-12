import { defineConfig } from 'vite';

export default defineConfig({
  base: '/portfolioGalaxy/',
  server: { port: 3000, open: true },
  build: { outDir: 'dist' }
});
