import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { logOut } from "../state/data/authSlice";

// Cache configuration
export const CACHE_TIMES = {
  SHORT: 5 * 60, // 5 minutes
  MEDIUM: 15 * 60, // 15 minutes
  LONG: 60 * 60, // 1 hour
  VERY_LONG: 24 * 60 * 60, // 24 hours
};

// Enhanced base URL configuration
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or fallback
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/v1/api/2025';
  }
  // Server-side: use environment variable or fallback
  return process.env.VITE_API_BASE_URL || 'http://localhost:3000/v1/api/2025';
};

// Performance monitoring for API calls
const performanceTracker = {
  calls: [],
  addCall: (endpoint, duration, status) => {
    const call = {
      endpoint,
      duration,
      status,
      timestamp: new Date().toISOString()
    };
    
    // Keep only last 100 calls
    performanceTracker.calls.push(call);
    if (performanceTracker.calls.length > 100) {
      performanceTracker.calls = performanceTracker.calls.slice(-100);
    }
    
    // Warn about slow API calls
    if (duration > 2000) { // 2 seconds
      console.warn(`🐌 Slow API call: ${endpoint} took ${duration}ms`);
    }
  },
  getStats: () => {
    const calls = performanceTracker.calls;
    if (calls.length === 0) return null;
    
    const totalCalls = calls.length;
    const avgDuration = calls.reduce((sum, call) => sum + call.duration, 0) / totalCalls;
    const slowCalls = calls.filter(call => call.duration > 1000).length;
    const errorCalls = calls.filter(call => call.status >= 400).length;
    
    return {
      totalCalls,
      avgDuration: Math.round(avgDuration),
      slowCalls,
      errorCalls,
      errorRate: Math.round((errorCalls / totalCalls) * 100)
    };
  }
};

// Enhanced base query with performance monitoring
const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.data?.auth?.accessToken;
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    // Add performance headers
    headers.set('X-Client-Version', '2.0');
    headers.set('X-Request-Time', Date.now().toString());
    
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
      const endpoint = typeof input === 'string' ? input : input.url;
      performanceTracker.addCall(endpoint, duration, response.status);
      
      return response;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Track failed requests
      const endpoint = typeof input === 'string' ? input : input.url;
      performanceTracker.addCall(endpoint, duration, 0);
      
      throw error;
    }
  },
});

// Enhanced base query with retry and auth handling
export const baseQueryWithReauth = retry(
  async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    
    // Handle authentication errors
    if (result.error) {
      if (result.error.status === 401) {
        console.warn('Authentication failed, logging out user');
        api.dispatch(logOut());
        
        // Clear all cached data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('persist:root');
          window.location.href = '/login';
        }
      }
      
      // Enhanced error logging
      console.error('API Error:', {
        endpoint: args.url || args,
        status: result.error.status,
        message: result.error.data?.message || result.error.message,
        timestamp: new Date().toISOString()
      });
    }
    
    return result;
  },
  {
    maxRetries: 2,
    retryCondition: (error, args) => {
      // Retry on network errors and 5xx server errors
      return (
        error.status === 'FETCH_ERROR' ||
        error.status === 'TIMEOUT_ERROR' ||
        (error.status >= 500 && error.status < 600)
      );
    },
    retryDelay: (attempt) => {
      // Exponential backoff: 1s, 2s, 4s
      return Math.min(1000 * Math.pow(2, attempt), 10000);
    },
  }
);

// Create base API
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Report', 'Appointment', 'Chat', 'Blog', 'ClinicalNote', 'Vitals'],
  endpoints: () => ({}),
});

// Expose performance utilities
if (typeof window !== 'undefined') {
  window.apiPerformance = {
    getStats: performanceTracker.getStats,
    getCalls: () => performanceTracker.calls,
    clearStats: () => {
      performanceTracker.calls = [];
    }
  };
}

export default baseApi;
