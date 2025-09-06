// API Configuration
export const API_CONFIG = {
  // Environment-specific base URLs
  URLS: {
    development: 'http://localhost:3000/api/v1/2025',
    production: 'https://api.drdieuphanchiropractor.com/api/v1/2025',
    staging: 'http://staging.drdieuphanchiropractor.com/api/v1/2025',
  },

  // Request configuration
  REQUEST: {
    TIMEOUT: 15000, // Increased from 10s to 15s for chat polling
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
  },

  // Security configuration for httpOnly cookies
  SECURITY: {
    USE_HTTP_ONLY: true,
    SAME_SITE: 'strict',
    SECURE: true, // Only send cookies over HTTPS
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