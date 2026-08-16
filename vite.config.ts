import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },

    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},

      // 🔁 Local dev proxy: forwards /api/* to the Express dev server
      // On Vercel, /api/* is handled natively by serverless functions
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    build: {
      // 🔒 DISABLE source maps in production — hides readable code from DevTools
      sourcemap: false,

      // Minify with terser for better name mangling and dead-code elimination
      minify: 'terser',
      terserOptions: {
        compress: {
          // 🔒 Strip all console.log / console.warn / console.error in production
          drop_console: isProd,
          drop_debugger: true,
          pure_funcs: isProd
            ? ['console.log', 'console.warn', 'console.error', 'console.info']
            : [],
        },
        mangle: {
          // Mangle top-level names for extra obfuscation
          toplevel: true,
        },
        format: {
          // Remove all comments from output
          comments: false,
        },
      },

      // Chunk splitting for better browser caching on Vercel CDN
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks — rarely change, will be cached long-term by Vercel CDN
            'vendor-react': ['react', 'react-dom'],
            'vendor-ui': ['lucide-react', 'canvas-confetti'],
          },
        },
      },

      // Warn if any chunk exceeds 1MB
      chunkSizeWarningLimit: 1000,
    },
  };
});
