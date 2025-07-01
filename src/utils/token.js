import { jwtDecode } from "jwt-decode";

/**
 * Get the current access token from the Redux store
 * @returns {string|null} - Current access token or null
 */
export const getToken = () => {
  try {
    // Access store from window to avoid circular dependency
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
 * @returns {string|null} - Current refresh token or null
 */
export const getRefreshToken = () => {
  try {
    // Access store from window to avoid circular dependency
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
    const { exp } = jwtDecode(token); // exp = seconds since epoch
    return exp - Date.now() / 1000 < buffer;
  } catch {
    // Bad token → treat as expired
    return true;
  }
};

/**
 * Manually trigger token refresh if needed
 * This can be called from components or route guards
 */
export const ensureValidToken = async () => {
  const token = getToken();
  
  if (!token) {
    return false;
  }

  // If token will expire within 5 minutes, refresh it
  if (willExpireSoon(token, 300)) {
    try {
      // Access store from window to avoid circular dependency
      const store = window.__REDUX_STORE__;
      if (!store) {
        console.warn("Redux store not available on window");
        return false;
      }

      // Import the refresh function dynamically to avoid circular dependency
      const { refreshTokens } = await import('../services/baseApi');
      
      const mockApi = {
        getState: () => store.getState(),
        dispatch: (action) => store.dispatch(action)
      };
      
      await refreshTokens(mockApi);
      return true;
    } catch (error) {
      console.error('Manual token refresh failed:', error);
      return false;
    }
  }

  return true;
};

/**
 * Call from a route‑change hook if you want proactive refreshes
 * outside Axios. Usually the interceptor is enough.
 */
export const autoRefreshTokenIfNeeded = async () => {
  const accessToken = getToken();
  if (accessToken && willExpireSoon(accessToken)) {
    return await ensureValidToken();
  }
  return true;
};

// Token utility functions for secure JWT handling
// WARNING: These functions are for development/debugging only
// Never use private keys or validate tokens on the client side in production

/**
 * Safely decode JWT payload without validation (for display purposes only)
 * This is safe because we're only reading, not validating
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeJWTPayload = (token) => {
  try {
    if (!token || typeof token !== "string") {
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.warn("Failed to decode JWT payload:", error);
    return null;
  }
};

/**
 * Check if token is expired (for client-side UX only, not security)
 * @param {string} token - JWT token
 * @returns {boolean} - True if expired
 */
export const isTokenExpired = (token) => {
  try {
    const payload = decodeJWTPayload(token);
    if (!payload || !payload.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} - Expiration date or null
 */
export const getTokenExpiration = (token) => {
  try {
    const payload = decodeJWTPayload(token);
    if (!payload || !payload.exp) {
      return null;
    }

    return new Date(payload.exp * 1000);
  } catch (error) {
    return null;
  }
};

/**
 * Extract user info from token (for fallback purposes only)
 * @param {string} token - JWT token
 * @returns {object|null} - User info or null
 */
export const extractUserFromToken = (token) => {
  try {
    const payload = decodeJWTPayload(token);
    if (!payload) {
      return null;
    }

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
 * Validate token format (basic structure check only)
 * @param {string} token - JWT token
 * @returns {boolean} - True if format is valid
 */
export const isValidTokenFormat = (token) => {
  if (!token || typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");
  return parts.length === 3 && parts.every((part) => part.length > 0);
};

/**
 * Get token info for debugging (development only)
 * @param {string} token - JWT token
 * @returns {object} - Token information
 */
export const getTokenInfo = (token) => {
  if (!isValidTokenFormat(token)) {
    return {
      valid: false,
      error: "Invalid token format",
    };
  }

  const payload = decodeJWTPayload(token);
  const isExpired = isTokenExpired(token);
  const expiration = getTokenExpiration(token);

  return {
    valid: true,
    payload,
    isExpired,
    expiration,
    timeUntilExpiry: expiration ? expiration.getTime() - Date.now() : null,
  };
};

// Storage keys for tokens
export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_DATA: "userData",
};

/**
 * Securely store tokens (with encryption in production)
 * @param {string} accessToken - Access token
 * @param {string} refreshToken - Refresh token
 * @param {object} userData - User data
 */
export const storeTokens = (accessToken, refreshToken, userData) => {
  try {
    // In production, these should be encrypted or stored in secure HTTP-only cookies
    if (accessToken) {
      localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    }
    if (userData) {
      localStorage.setItem(
        TOKEN_STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData),
      );
    }
  } catch (error) {
    console.error("Failed to store tokens:", error);
  }
};

/**
 * Clear all stored tokens
 */
export const clearTokens = () => {
  try {
    Object.values(TOKEN_STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error("Failed to clear tokens:", error);
  }
};

/**
 * Get stored tokens
 * @returns {object} - Stored tokens and user data
 */
export const getStoredTokens = () => {
  try {
    const accessToken = localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
    const userDataStr = localStorage.getItem(TOKEN_STORAGE_KEYS.USER_DATA);

    let userData = null;
    if (userDataStr) {
      try {
        userData = JSON.parse(userDataStr);
      } catch (e) {
        console.warn("Failed to parse stored user data");
      }
    }

    return {
      accessToken,
      refreshToken,
      userData,
    };
  } catch (error) {
    console.error("Failed to get stored tokens:", error);
    return {
      accessToken: null,
      refreshToken: null,
      userData: null,
    };
  }
};
