import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: '/fit-cabinet/',
  test: {
    environment: 'jsdom',
  },
});
