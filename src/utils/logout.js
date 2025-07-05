/**
 * Complete logout utility that wipes all user data
 * This function provides a nuclear logout option that clears absolutely everything
 */

import { API_CONFIG, getBaseUrl } from '../api';
import { setLoggingOut } from '../api';
import { persistor } from '../store/store';

// List of API slices to reset on logout
const apiSlices = [
  'authApi',
  'reportApi',
  'blogApi',
  'appointmentApi',
  'chatApi',
  'clinicalNotesApi',
  'vitalsApi',
  'profileApi',
  'userApi'
];

export const performCompleteLogout = async (dispatch, navigate) => {
  try {
    // Get the store instance
    const store = window.__REDUX_STORE__;
    if (!store) {
      console.error('Redux store not found');
      return;
    }

    // Set logging out flag to prevent token refresh
    setLoggingOut(true);

    // Get current state
    const state = store.getState();
    const token = state?.auth?.accessToken;

    if (token) {
      try {
        // Attempt to call logout endpoint
        await fetch(`${getBaseUrl()}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        // Continue with local logout even if server logout fails
        console.warn('Server logout failed:', error);
      }
    }

    // Clear Redux persist state first
    await persistor.purge();

    // Clear local storage and session storage
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.warn('Failed to clear storage:', error);
    }

    // Clear cookies
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });

    // Reset Redux store
    if (dispatch) {
      try {
        // Reset all state first
        dispatch({ type: 'RESET_STATE' });
        
        // Reset auth state explicitly
        dispatch({ type: 'auth/logOut' });
        
        // Reset all API states
        apiSlices.forEach(slice => {
          if (store.dispatch[`${slice}/resetApiState`]) {
            store.dispatch[`${slice}/resetApiState`]();
          }
        });

        // Reset other slices
        dispatch({ type: 'entities/reset' });
        dispatch({ type: 'ui/reset' });
        dispatch({ type: 'forms/reset' });
        
        // Clear RTK Query cache
        dispatch({ type: 'api/resetApiState' });
      } catch (error) {
        console.warn('Failed to reset Redux store:', error);
      }
    }

    // Clear any running intervals or timeouts
    const highestTimeoutId = setTimeout(";");
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }

    // Reset logging out flag
    setLoggingOut(false);

    // Force a complete page reload to ensure clean state
    window.location.href = '/login';

  } catch (error) {
    console.error('Logout failed:', error);
    // Reset logging out flag even if logout fails
    setLoggingOut(false);
    throw error;
  }
};

export default performCompleteLogout; 