// API Configuration
export const API_CONFIG = {
  // Environment-specific base URLs
  URLS: {
    development: 'http://localhost:3000/v1/api/2025',
    production: 'https://drdieuphanchiropractor.com/v1/api/2025',
    staging: 'http://staging.drdieuphanchiropractor.com/v1/api/2025',
  },

  // Request configuration
  REQUEST: {
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
  },

  // Cache configuration
  CACHE: {
    SHORT: 5 * 60,    // 5 minutes
    MEDIUM: 15 * 60,  // 15 minutes
    LONG: 60 * 60,    // 1 hour
    VERY_LONG: 24 * 60 * 60, // 24 hours
  },

  // Token refresh configuration
  TOKEN: {
    REFRESH_BUFFER: 300,  // 5 minutes before expiry
    CHECK_INTERVAL: 5 * 60 * 1000, // Check every 5 minutes
  }
};

// Get base URL based on environment
export const getBaseUrl = () => {
  // Check build-time environment variable first (for static builds)
  const buildEnv = import.meta.env.VITE_API_ENVIRONMENT;
  if (buildEnv && API_CONFIG.URLS[buildEnv]) {
    return API_CONFIG.URLS[buildEnv];
  }
  
  // Fallback to runtime hostname detection
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isStaging = window.location.hostname.includes('staging');
  
  if (isDevelopment) return API_CONFIG.URLS.development;
  if (isStaging) return API_CONFIG.URLS.staging;
  return API_CONFIG.URLS.production;
}; 