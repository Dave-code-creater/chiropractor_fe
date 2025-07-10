import { API_CONFIG, getBaseUrl } from '../config/config';
import { logOut, setCredentials } from '../../state/data/authSlice';
import { jwtDecode } from "jwt-decode";

// Token refresh state management
let isRefreshing = false;
let refreshPromise = null;
let isLoggingOut = false;

// Set logout flag - called by logout utility
export const setLoggingOut = (value) => {
  isLoggingOut = value;
};

// Helper function to refresh tokens
export const refreshTokens = async (api) => {
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
          refreshToken: data.refreshToken || refreshToken,
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

export const startPeriodicTokenCheck = (api) => {
  // Clear existing interval
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
  }

  // Check every 5 minutes
  tokenCheckInterval = setInterval(async () => {
    try {
      // Don't check if user is logging out or app is not ready
      if (isLoggingOut || !api?.getState) {
        return;
      }

      const state = api.getState();
      const accessToken = state?.auth?.accessToken;
      const isAuthenticated = state?.auth?.isAuthenticated;

      if (isAuthenticated && accessToken) {
        // Check if token expires within 5 minutes
        if (willExpireSoon(accessToken, API_CONFIG.TOKEN.REFRESH_BUFFER)) {
          await refreshTokens(api);
        }
      }
    } catch (error) {
      console.error('Periodic token check failed:', error);
    }
  }, API_CONFIG.TOKEN.CHECK_INTERVAL);
};

export const stopPeriodicTokenCheck = () => {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
    tokenCheckInterval = null;
  }
};

/**
 * Get the current access token from the Redux store
 */
export const getToken = () => {
  try {
    const store = window.__REDUX_STORE__;
    if (!store) {
      console.warn("Redux store not available on window");
      return null;
    }
    const state = store.getState();
    return state?.auth?.accessToken || null;
  } catch (error) {
    console.error("Failed to get token from store:", error);
    return null;
  }
};

/**
 * Get the current refresh token from the Redux store
 */
export const getRefreshToken = () => {
  try {
    const store = window.__REDUX_STORE__;
    if (!store) {
      console.warn("Redux store not available on window");
      return null;
    }
    const state = store.getState();
    return state?.auth?.refreshToken || null;
  } catch (error) {
    console.error("Failed to get refresh token from store:", error);
    return null;
  }
};

/**
 * True when the JWT will expire within `buffer` seconds.
 * Default buffer is 60 s (one minute).
 */
export const willExpireSoon = (token, buffer = 60) => {
  try {
    const { exp } = jwtDecode(token);
    return exp - Date.now() / 1000 < buffer;
  } catch {
    return true;
  }
};

/**
 * Check if token is expired (for client-side UX only, not security)
 */
export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token) => {
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return null;
    return new Date(exp * 1000);
  } catch {
    return null;
  }
};

/**
 * Extract user info from token (for fallback purposes only)
 */
export const extractUserFromToken = (token) => {
  try {
    const payload = jwtDecode(token);
    if (!payload) return null;

    return {
      id: payload.sub || payload.id,
      email: payload.email,
      role: payload.role,
      firstName: payload.firstName || payload.first_name,
      lastName: payload.lastName || payload.last_name,
      exp: payload.exp,
      iat: payload.iat,
    };
  } catch (error) {
    console.warn("Failed to extract user from token:", error);
    return null;
  }
};

/**
 * Validate token format
 */
export const isValidTokenFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    const payload = JSON.parse(atob(parts[1]));
    return !!payload;
  } catch {
    return false;
  }
};

/**
 * Get detailed token info
 */
export const getTokenInfo = (token) => {
  if (!isValidTokenFormat(token)) {
    return {
      isValid: false,
      error: 'Invalid token format'
    };
  }

  try {
    const payload = jwtDecode(token);
    const now = Date.now() / 1000;

    return {
      isValid: true,
      isExpired: payload.exp <= now,
      willExpireSoon: willExpireSoon(token),
      expiresAt: new Date(payload.exp * 1000),
      issuer: payload.iss,
      subject: payload.sub,
      payload
    };
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
};

/**
 * Store tokens in localStorage
 */
export const storeTokens = (accessToken, refreshToken, userData) => {
  try {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
    return true;
  } catch (error) {
    console.error('Failed to store tokens:', error);
    return false;
  }
};

/**
 * Clear stored tokens
 */
export const clearTokens = () => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    return true;
  } catch (error) {
    console.error('Failed to clear tokens:', error);
    return false;
  }
};

/**
 * Get stored tokens
 */
export const getStoredTokens = () => {
  try {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      userData: JSON.parse(localStorage.getItem('userData') || 'null')
    };
  } catch (error) {
    console.error('Failed to get stored tokens:', error);
    return {
      accessToken: null,
      refreshToken: null,
      userData: null
    };
  }
}; 