import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('react-router')) {
              return 'router';
            }
            return 'vendor';
          }
          
          // Split our own components
          if (id.includes('components/Mentor')) {
            return 'mentor';
          }
          if (id.includes('components/Student')) {
            return 'student';
          }
          if (id.includes('components/Roadmap')) {
            return 'roadmap';
          }
        },
      },
    },
  },
  define: {
    __SUBDOMAIN__: JSON.stringify(process.env.SUBDOMAIN || 'shestem'),
  },
});
