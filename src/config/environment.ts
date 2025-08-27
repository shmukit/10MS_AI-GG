export const environment = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  
  // App Configuration
  app: {
    name: '10MS SheSTEM',
    version: '1.0.0',
    environment: import.meta.env.MODE,
    subdomain: import.meta.env.VITE_SUBDOMAIN || 'shestem',
  },
  
  // URLs
  urls: {
    base: import.meta.env.MODE === 'production' 
      ? `https://${import.meta.env.VITE_SUBDOMAIN || 'shestem'}.10minuteschool.com`
      : 'http://localhost:5173',
    api: import.meta.env.MODE === 'production'
      ? `https://${import.meta.env.VITE_SUBDOMAIN || 'shestem'}.10minuteschool.com/api`
      : 'http://localhost:5173/api',
  },
  
  // Features
  features: {
    enableAnalytics: import.meta.env.MODE === 'production',
    enableDebugMode: import.meta.env.MODE === 'development',
  },
};

// Validate required environment variables
export const validateEnvironment = () => {
  const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  return true;
};
