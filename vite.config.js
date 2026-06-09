import { defineConfig } from 'vite';
import shopify from 'vite-plugin-shopify';

export default defineConfig({
  plugins: [
    shopify({
      // Source directory for frontend code
      sourceCodeDir: 'frontend',
      // Directory containing entrypoints
      entrypointsDir: 'frontend/entrypoints',
      // Snippet file name (plugin adds snippets/ prefix automatically)
      snippetFile: 'vite-tag.liquid',
    }),
  ],
  build: {
    // Output to Shopify's assets folder
    outDir: 'assets',
    // CRITICAL: Do NOT empty the output directory - preserve existing theme assets
    emptyOutDir: false,
    // Rollup options for flat output structure
    rollupOptions: {
      input: {
        theme: 'frontend/entrypoints/theme.ts',
      },
      output: {
        // Flat file names required by Shopify (no subdirectories in assets/)
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  // Resolve TypeScript paths
  resolve: {
    alias: {
      '@components': '/frontend/components',
      '@styles': '/frontend/styles',
    },
  },
});
