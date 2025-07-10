import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { API_CONFIG, getBaseUrl } from '../config/config';
import { handleApiResponse } from '../config/errors';
import { refreshTokens, setLoggingOut } from './tokenManager';
import { getToken } from './tokenManager';
import { logOut } from '../../state/data/authSlice';

// Cache configuration for different types of data
export const CACHE_TIMES = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 15 * 60, // 15 minutes
  LONG: 60 * 60, // 1 hour
  VERY_LONG: 24 * 60 * 60, // 24 hours
};

// Performance monitoring for API calls
export const performanceTracker = {
  calls: [],
  addCall: (endpoint, duration, status) => {
    const call = {
      endpoint,
      duration,
      status,
      timestamp: new Date().toISOString(),
    };

    // Keep only last 100 calls
    performanceTracker.calls.push(call);
    if (performanceTracker.calls.length > 100) {
      performanceTracker.calls = performanceTracker.calls.slice(-100);
    }

    // Warn about slow API calls
    if (duration > 2000) {
      console.warn(`Slow API call detected: ${endpoint} took ${duration}ms`);
    }
  },
  getStats: () => {
    const calls = performanceTracker.calls;
    if (calls.length === 0) return null;

    const totalCalls = calls.length;
    const avgDuration = calls.reduce((sum, call) => sum + call.duration, 0) / totalCalls;
    const slowCalls = calls.filter((call) => call.duration > 1000).length;
    const errorCalls = calls.filter((call) => call.status >= 400).length;

    return {
      totalCalls,
      avgDuration: Math.round(avgDuration),
      slowCalls,
      errorCalls,
      errorRate: Math.round((errorCalls / totalCalls) * 100),
    };
  },
};

// Track app initialization to prevent premature logout
let appInitialized = false;
setTimeout(() => { appInitialized = true; }, 2000);

// Enhanced base query with performance tracking
const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  timeout: API_CONFIG.REQUEST.TIMEOUT,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const isAuthEndpoint = endpoint?.includes('auth/');
    
    if (!isAuthEndpoint) {
      const token = getToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
    }

    headers.set("content-type", "application/json");
    headers.set("X-Client-Version", "2.0");
    headers.set("X-Request-Time", Date.now().toString());
    return headers;
  },
  // Enhanced fetch with performance tracking
  fetchFn: async (input, init) => {
    const startTime = performance.now();

    try {
      const response = await fetch(input, {
        ...init,
        signal: AbortSignal.timeout(API_CONFIG.REQUEST.TIMEOUT || 30000),
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Track performance
      const endpoint = typeof input === "string" ? input : input.url;
      performanceTracker.addCall(endpoint, duration, response.status);

      return response;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      // Track failed requests
      const endpoint = typeof input === "string" ? input : input.url;
      performanceTracker.addCall(endpoint, duration, 0);

      throw error;
    }
  },
});

// Enhanced retry logic with token refresh and better error handling
const baseQueryWithRetry = retry(
  async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // Handle authentication errors with automatic refresh
    if (result.error?.status === 401) {
      const state = api.getState();
      const hasToken = state?.auth?.accessToken;
      const refreshToken = state?.auth?.refreshToken;
      const isAuthEndpoint = args.url?.includes('/auth/') || args.url?.includes('/login') || args.url?.includes('/register');
      const isRefreshEndpoint = args.url?.includes('/refresh');
      
      // Only attempt refresh if we have tokens, not an auth endpoint, and app is initialized
      if (hasToken && refreshToken && !isAuthEndpoint && !isRefreshEndpoint && appInitialized) {
        try {
          await refreshTokens(api);
          // Retry the original request with the new token
          result = await baseQuery(args, api, extraOptions);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          
          // Only logout if refresh token is invalid, not for network errors
          if (refreshError.message?.includes('Refresh failed with status: 401')) {
            api.dispatch(logOut());
            
            // Redirect to login if not already there
            if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
              setTimeout(() => {
                window.location.href = '/login';
              }, 100);
            }
          }
        }
      } else if (!hasToken || !refreshToken) {
        // No tokens available, logout
        if (appInitialized) {
          api.dispatch(logOut());
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
            setTimeout(() => {
              window.location.href = '/login';
            }, 100);
          }
        }
      }
    }

    // Enhanced error logging for non-auth errors
    if (result.error && result.error.status !== 401) {
      if (result.error.status === 404) {
        console.warn(`API endpoint not found: ${args.url}`);
      } else if (result.error.status >= 500) {
        console.error(`Server error (${result.error.status}) for ${args.url}:`, result.error);
      } else {
        console.warn(`API error (${result.error.status}) for ${args.url}:`, result.error);
      }
    }

    return result;
  },
  {
    maxRetries: API_CONFIG.REQUEST.RETRY_ATTEMPTS,
  }
);

// Create base API with common configuration
export const createBaseApi = (options) => {
  return createApi({
    baseQuery: baseQueryWithRetry,
    endpoints: () => ({}),
    ...options,
  });
};

// Create the main base API instance
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: [
    "Auth",
    "User",
    "Report",
    "Appointment",
    "Chat",
    "Blog",
    "ClinicalNote",
    "Vitals",
  ],
  endpoints: () => ({}),
});

// Export the enhanced base query for backward compatibility
export const baseQueryWithReauth = baseQueryWithRetry;

// Export token management utilities
export { setLoggingOut, startPeriodicTokenCheck, stopPeriodicTokenCheck } from './tokenManager';

export default baseApi; 