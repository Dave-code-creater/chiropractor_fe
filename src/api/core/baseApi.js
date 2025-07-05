import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { API_CONFIG, getBaseUrl } from '../config/config';
import { handleApiResponse } from '../config/errors';
import { refreshTokens } from './tokenManager';
import { getToken } from './tokenManager';

// Create base query with automatic token refresh
const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  timeout: API_CONFIG.REQUEST.TIMEOUT,
  prepareHeaders: (headers) => {
    const token = getToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("content-type", "application/json");
    return headers;
  },
});

// Add retry logic with token refresh
const baseQueryWithRetry = retry(
  async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
      // Try to get a new token
      try {
        const refreshResult = await refreshTokens(api);
        if (refreshResult) {
          // Retry the initial query
          result = await baseQuery(args, api, extraOptions);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
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