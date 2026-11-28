import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/fit-cabinet/',
  build: {
    cssMinify: 'esbuild',
  },
  test: {
    environment: 'jsdom',
  },
});
