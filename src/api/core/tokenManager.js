import { API_CONFIG, getBaseUrl } from '../config/config';
import { logOut, setCredentials } from '../../state/data/authSlice';
import { jwtDecode } from 'jwt-decode';

let isRefreshing = false;
let refreshPromise = null;
let isLoggingOut = false;

export const setLoggingOut = (value) => {
  isLoggingOut = value;
};

export const refreshTokens = async (api) => {
  if (isLoggingOut) {
    throw new Error('User is logging out');
  }

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
      
      if (data.token && data.user && !isLoggingOut) {
        api.dispatch(setCredentials({
          user: data.user,
          token: data.token,
          accessToken: data.token,
          refreshToken: data.refreshToken || refreshToken,
        }));
        try {
          storeTokens(data.token, data.refreshToken || refreshToken, data.user);
        } catch (err) {
          console.warn('Failed to persist refreshed tokens to localStorage:', err);
        }

        return data.token;
      } else {
        throw new Error('Invalid refresh response format or user logging out');
      }
    });

    const newToken = await refreshPromise;
    return newToken;

  } catch (error) {
    if (!isLoggingOut && error.message?.includes('Refresh failed with status: 401')) {
      try {
        api.dispatch(logOut());
      } catch (e) {
        console.warn('Failed to dispatch logout action:', e);
      }

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } else {
      console.warn('Token refresh error (non-401):', error);
    }

    throw error;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

let tokenCheckInterval = null;

export const startPeriodicTokenCheck = (api) => {
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval);
  }

  tokenCheckInterval = setInterval(async () => {
    try {
      if (isLoggingOut || !api?.getState) {
        return;
      }

      const state = api.getState();
      const accessToken = state?.auth?.accessToken;
      const isAuthenticated = state?.auth?.isAuthenticated;

      if (isAuthenticated && accessToken) {
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

export const getToken = () => {
  if (API_CONFIG.SECURITY?.USE_HTTP_ONLY) {
    console.warn('Token access not available when using httpOnly cookies');
    return null;
  }

  try {
    const store = window.__REDUX_STORE__;
    if (!store) {
      console.warn("Redux store not available on window");
      return localStorage.getItem('accessToken') || null;
    }
    const state = store.getState();
    return state?.auth?.accessToken || localStorage.getItem('accessToken') || null;
  } catch (error) {
    console.error("Failed to get token from store:", error);
    return localStorage.getItem('accessToken') || null;
  }
};

export const getRefreshToken = () => {
  if (API_CONFIG.SECURITY?.USE_HTTP_ONLY) {
    console.warn('Refresh token access not available when using httpOnly cookies');
    return null;
  }

  try {
    const store = window.__REDUX_STORE__;
    if (!store) {
      console.warn("Redux store not available on window");
      return localStorage.getItem('refreshToken') || null;
    }
    const state = store.getState();
    return state?.auth?.refreshToken || localStorage.getItem('refreshToken') || null;
  } catch (error) {
    console.error("Failed to get refresh token from store:", error);
    return localStorage.getItem('refreshToken') || null;
  }
};

export const willExpireSoon = (token, buffer = 60) => {
  try {
    const { exp } = jwtDecode(token);
    return exp - Date.now() / 1000 < buffer;
  } catch {
    return true;
  }
};

export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

export const getTokenExpiration = (token) => {
  try {
    const { exp } = jwtDecode(token);
    if (!exp) return null;
    return new Date(exp * 1000);
  } catch {
    return null;
  }
};

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

export const storeTokens = (accessToken, refreshToken, userData) => {
  if (API_CONFIG.SECURITY?.USE_HTTP_ONLY) {
    console.info('Token storage handled by httpOnly cookies');
    try {
      if (userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
      }
      return true;
    } catch (error) {
      console.error('Failed to store user data:', error);
      return false;
    }
  }

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

export const clearTokens = () => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');

    if (API_CONFIG.SECURITY?.USE_HTTP_ONLY) {
      fetch(`${getBaseUrl()}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch(error => {
        console.warn('Failed to clear httpOnly cookies on server:', error);
      });
    }

    return true;
  } catch (error) {
    console.error('Failed to clear tokens:', error);
    return false;
  }
};

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