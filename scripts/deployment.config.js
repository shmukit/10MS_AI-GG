// Deployment Configuration for 10MS SheSTEM
// This file contains configuration for different environments

module.exports = {
  // Development Environment
  development: {
    port: 5173,
    host: 'localhost',
    baseUrl: 'http://localhost:5173',
    apiUrl: 'http://localhost:5173/api',
    environment: 'development',
    enableDebugMode: true,
  },

  // Production Environment
  production: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    baseUrl: process.env.BASE_URL || 'https://shestem.10minuteschool.com',
    apiUrl: process.env.API_URL || 'https://shestem.10minuteschool.com/api',
    environment: 'production',
    enableDebugMode: false,
    subdomain: 'shestem',
  },

  // Staging Environment
  staging: {
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    baseUrl: process.env.BASE_URL || 'https://staging-shestem.10minuteschool.com',
    apiUrl: process.env.API_URL || 'https://staging-shestem.10minuteschool.com/api',
    environment: 'staging',
    enableDebugMode: true,
    subdomain: 'staging-shestem',
  },

  // Sub-domain Configuration
  subdomains: {
    shestem: {
      name: '10MS SheSTEM',
      description: 'AI-Enabled Group Guidance Program',
      features: ['student-dashboard', 'mentor-dashboard', 'roadmaps', 'community'],
    },
    'staging-shestem': {
      name: '10MS SheSTEM (Staging)',
      description: 'Staging Environment for Testing',
      features: ['student-dashboard', 'mentor-dashboard', 'roadmaps', 'community'],
    },
  },

  // Database Configuration
  database: {
    supabase: {
      url: process.env.VITE_SUPABASE_URL,
      anonKey: process.env.VITE_SUPABASE_ANON_KEY,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  },

  // Build Configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          router: ['react-router-dom'],
        },
      },
    },
  },

  // Server Configuration
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000,
    strictPort: true,
    cors: {
      origin: [
        'http://localhost:5173',
        'https://shestem.10minuteschool.com',
        'https://staging-shestem.10minuteschool.com',
      ],
      credentials: true,
    },
  },
};

// Environment-specific configuration
const getConfig = (env = process.env.NODE_ENV || 'development') => {
  return module.exports[env] || module.exports.development;
};

module.exports.getConfig = getConfig;
