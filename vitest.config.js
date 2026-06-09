import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use jsdom for DOM testing (required for Lit components)
    environment: 'jsdom',
    // Test file patterns
    include: ['test/**/*.test.ts'],
    // Global test utilities
    globals: true,
    setupFiles: ['test/setup.ts'],
  },
  resolve: {
    alias: {
      '@components': '/frontend/components',
      '@styles': '/frontend/styles',
    },
  },
});
