export const API_CONFIG = {
  URLS: {
    development: 'http://localhost:3000/api/v1/2025',
    production: 'https://api.drdieuphanchiropractor.com/api/v1/2025',
    staging: 'http://staging.drdieuphanchiropractor.com/api/v1/2025',
  },

  REQUEST: {
    TIMEOUT: 15000,
    RETRY_ATTEMPTS: 3,
  },

  CACHE: {
    SHORT: 5 * 60,
    MEDIUM: 15 * 60,
    LONG: 60 * 60,
    VERY_LONG: 24 * 60 * 60,
  },

  TOKEN: {
    REFRESH_BUFFER: 300,
    CHECK_INTERVAL: 5 * 60 * 1000,
  },

  SECURITY: {
    USE_HTTP_ONLY: true,
    SAME_SITE: 'strict',
    SECURE: true,
  }
};

export const getBaseUrl = () => {
  const buildEnv = import.meta.env.VITE_API_ENVIRONMENT;
  if (buildEnv && API_CONFIG.URLS[buildEnv]) {
    return API_CONFIG.URLS[buildEnv];
  }

  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isStaging = window.location.hostname.includes('staging');

  if (isDevelopment) return API_CONFIG.URLS.development;
  if (isStaging) return API_CONFIG.URLS.staging;
  return API_CONFIG.URLS.production;
}; 