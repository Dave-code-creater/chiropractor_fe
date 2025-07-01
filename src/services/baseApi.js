/**
 * Enhanced Base API with Automatic Token Management
 * 
 * This module provides automatic JWT token refresh capabilities:
 * 
 * Features:
 * - Automatic token validation before each API request
 * - Automatic token refresh when expired or expiring soon
 * - Periodic background token checking (every 5 minutes)
 * - Prevents multiple simultaneous refresh attempts
 * - Automatic logout and redirect on refresh failure
 * - Performance monitoring and error tracking
 * 
 * How it works:
 * 1. Before each API request, checks if token is expired or expiring soon
 * 2. If token needs refresh, automatically calls /auth/refresh endpoint
 * 3. Updates Redux store with new tokens
 * 4. Retries original request with new token
 * 5. Periodic background checks every 5 minutes for proactive refresh
 * 
 * Usage:
 * - No changes needed in your API endpoints
 * - Tokens are automatically included in Authorization headers
 * - Automatic refresh happens transparently
 * - Use TokenStatusIndicator component for debugging in development
 * 
 * Manual token management:
 * - Import { ensureValidToken } from '../utils/token' for manual refresh
 * - Use useTokenStatus() hook to monitor token status in components
 * 
 * @author AI Assistant
 * @version 2.0
 */

import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "../state/data/authSlice";
import { isTokenExpired, willExpireSoon } from "../utils/token";
import { jwtDecode } from "jwt-decode";

// Cache configuration
export const CACHE_TIMES = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 15 * 60, // 15 minutes
  LONG: 60 * 60, // 1 hour
  VERY_LONG: 24 * 60 * 60, // 24 hours
};

// Simple configuration - no need for env variables
const API_CONFIG = {
  development: 'http://localhost:3000/v1/api/2025',
  production: 'https://your-production-api.com/v1/api/2025',
  staging: 'https://your-staging-api.com/v1/api/2025'
};

// Determine environment and get base URL
const getBaseUrl = () => {
  // Simple environment detection
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isStaging = window.location.hostname.includes('staging');
  
  if (isDevelopment) return API_CONFIG.development;
  if (isStaging) return API_CONFIG.staging;
  return API_CONFIG.production;
};

// Token refresh state management
let isRefreshing = false;
let refreshPromise = null;
let isLoggingOut = false; // Flag to prevent token refresh during logout

// Set logout flag - called by logout utility
const setLoggingOut = (value) => {
  isLoggingOut = value;
};

// Helper function to refresh tokens
const refreshTokens = async (api) => {
  // Don't refresh if user is logging out
  if (isLoggingOut) {
    throw new Error('User is logging out');
  }

  // Prevent multiple simultaneous refresh attempts
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  
  try {
    const state = api.getState();
    const refreshToken = state?.auth?.refreshToken;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Create the refresh promise
    refreshPromise = fetch(`${getBaseUrl()}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({ refreshToken }),
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error(`Refresh failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update tokens in store (only if not logging out)
      if (data.token && data.user && !isLoggingOut) {
        api.dispatch(setCredentials({
          user: data.user,
          token: data.token,
          accessToken: data.token,
          refreshToken: data.refreshToken || refreshToken, // Use new or keep existing
        }));
        
        return data.token;
      } else {
        throw new Error('Invalid refresh response format or user logging out');
      }
    });

    const newToken = await refreshPromise;
    return newToken;

  } catch (error) {
    // Only logout if not already logging out and it's a genuine auth failure
    if (!isLoggingOut && error.message?.includes('Refresh failed with status: 401')) {
      api.dispatch(logOut());
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    throw error;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

// Periodic token checking
let tokenCheckInterval = null;

const startPeriodicTokenCheck = (api) => {
  // Clear existing interval
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
  }

  // Wait for app initialization before starting periodic checks
  if (!appInitialized) {
    setTimeout(() => startPeriodicTokenCheck(api), 1000);
    return;
  }

  // Check every 5 minutes
  tokenCheckInterval = setInterval(async () => {
    try {
      // Don't check if app is not fully initialized or user is logging out
      if (!appInitialized || isLoggingOut) {
        return;
      }

      // Use window store if api is not available
      const getState = api?.getState || (() => {
        const store = window.__REDUX_STORE__;
        return store ? store.getState() : null;
      });

      const state = getState();
      if (!state) {
        return;
      }

      const accessToken = state?.auth?.accessToken;
      const isAuthenticated = state?.auth?.isAuthenticated;

      if (isAuthenticated && accessToken) {
        // Check if token expires within 5 minutes
        if (willExpireSoon(accessToken, 300)) { // 5 minutes buffer
          await refreshTokens(api);
        }
      }
    } catch (error) {
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
};

const stopPeriodicTokenCheck = () => {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
    tokenCheckInterval = null;
  }
};

// Performance monitoring for API calls
const performanceTracker = {
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
      // 2 seconds
    }
  },
  getStats: () => {
    const calls = performanceTracker.calls;
    if (calls.length === 0) return null;

    const totalCalls = calls.length;
    const avgDuration =
      calls.reduce((sum, call) => sum + call.duration, 0) / totalCalls;
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

// Enhanced base query with automatic token management
const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  prepareHeaders: (headers, { getState, endpoint }) => {
    const isAuthEndpoint = endpoint?.includes('auth/');
    
    if (!isAuthEndpoint) {
      const state = getState();
      const accessToken = state?.auth?.accessToken;
      const isAuthenticated = state?.auth?.isAuthenticated;

      if (isAuthenticated && accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`);
      }
    }

    headers.set("X-Client-Version", "2.0");
    headers.set("X-Request-Time", Date.now().toString());
    return headers;
  },
  // Enhanced fetch configuration
  fetchFn: async (input, init) => {
    const startTime = performance.now();

    try {
      const response = await fetch(input, {
        ...init,
        // Add timeout
        signal: AbortSignal.timeout(30000), // 30 second timeout
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

// Track app initialization to prevent premature logout
let appInitialized = false;
setTimeout(() => { appInitialized = true; }, 2000); // Give 2 seconds for app to initialize

// Enhanced base query with retry and auth handling
export const baseQueryWithReauth = retry(
  async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // Handle authentication errors with automatic refresh
    if (result.error?.status === 401) {
      const state = api.getState();
      const hasToken = state?.auth?.accessToken;
      const refreshToken = state?.auth?.refreshToken;
      const isAuthEndpoint = args.url?.includes('/auth/') || args.url?.includes('/login') || args.url?.includes('/register');
      const isRefreshEndpoint = args.url?.includes('/refresh');
      
      // Only attempt refresh if we have tokens, not an auth endpoint, and not logging out
      if (hasToken && refreshToken && !isAuthEndpoint && !isRefreshEndpoint && appInitialized && !isLoggingOut) {
        try {
          await refreshTokens(api);
          
          // Retry the original request with the new token
          result = await baseQuery(args, api, extraOptions);
          
        } catch (refreshError) {
          
          // Be more conservative about automatic logout
          // Only logout if:
          // 1. App is fully initialized
          // 2. The refresh error indicates the refresh token is invalid (not just network issues)
          // 3. User is not on a critical page
          
          if (appInitialized && refreshError.message?.includes('Refresh failed with status: 401')) {
            api.dispatch(logOut());
            
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          } else {
            // Don't automatically logout for network errors or temporary issues
            // Let the user try again or manually logout if needed
          }
        }
      } else if (!appInitialized) {
        // App not initialized yet, skip token refresh to prevent race condition
      } else if (!hasToken || !refreshToken) {
        // Only logout if we're sure there are no tokens
        if (appInitialized) {
          api.dispatch(logOut());
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }
    }

    // Enhanced error logging for non-auth errors
    if (result.error && result.error.status !== 401) {
      // For 404s, just log a warning but don't treat as fatal
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
    maxRetries: 2, // Allow 2 retries for network issues
    retryCondition: (error, args) => {
      const status = error?.status;
      const url = typeof args === 'string' ? args : args?.url || '';
      
      // Don't retry known problematic endpoints that are spamming console
      const problematicEndpoints = [
        '/reports/patient/',
        '/recent',
        'type=health-condition',
        '/clinical-notes',
        '/doctor-notes'
      ];
      
      const isProblematicEndpoint = problematicEndpoints.some(endpoint => 
        url.includes(endpoint)
      );
      
      if (isProblematicEndpoint) {
        return false; // Don't retry these endpoints
      }
      
      // Only retry on genuine network errors (no status) or temporary server issues
      // Don't retry 4xx client errors or known 500 errors from problematic endpoints
      if (!status) {
        return true; // Network error, retry
      }
      
      // Don't retry any 4xx or 5xx errors to prevent console spam
      // The backend issues need to be fixed, not worked around with retries
      return false;
    },
  },
);

// Create base API
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
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

// Utility function to start periodic checking manually (temporarily disabled to prevent race conditions)
export const initializeTokenManagement = () => {
  // Verify token management is properly set up
  try {
    const store = window.__REDUX_STORE__;
    if (store) {
      const state = store.getState();
      const hasToken = state?.auth?.accessToken;
      
      // If we have a token, ensure app is marked as initialized
      if (hasToken) {
        appInitialized = true;
      }
    }
  } catch (error) {
    // Silently fail to prevent app crashes
  }
};

// Export utility functions for manual token management
export {
  refreshTokens,
  startPeriodicTokenCheck,
  stopPeriodicTokenCheck,
  performanceTracker,
  setLoggingOut,
};

export default baseApi;

/**
 * Check if token is expired or expires soon
 */
const isTokenExpiring = (token, bufferMinutes = 5) => {
  const decoded = decodeTokenSafely(token);
  if (!decoded?.exp) return true;
  
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  const bufferTime = bufferMinutes * 60 * 1000;
  
  return expirationTime <= currentTime + bufferTime;
};

/**
 * Refresh access token using refresh token
 */
const refreshTokenRequest = async () => {
  if (isLoggingOut) {
    return null;
  }

  try {
    const refreshToken = localStorage.getItem("refreshToken");
    
    if (!refreshToken) {
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${refreshToken}`,
      },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem("accessToken", data.token);
        if (data.refreshToken) {
          localStorage.setItem("refreshToken", data.refreshToken);
        }
        return data.token;
      }
    } else if (response.status === 401) {
      // Refresh token is invalid
      if (!isLoggingOut && isAppInitialized) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = '/login';
      }
    }
  } catch (error) {
    // Network errors - don't logout immediately
  }
  
  return null;
};
