/**
 * Complete logout utility that wipes all user data
 * This function provides a nuclear logout option that clears absolutely everything
 */
export const performCompleteLogout = async (dispatch, navigate) => {
  try {
    // Step 1: Try API logout first (non-blocking)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      // API logout failed, continue with cleanup anyway
    }

    // Step 2: Set logout flag to prevent token refresh interference
    try {
      const { setLoggingOut } = await import('../services/baseApi');
      setLoggingOut(true);
    } catch (error) {
      // Non-critical if this fails
    }

    // Step 3: Clear Redux auth state and user entity
    try {
      const { logOut } = await import('../state/data/authSlice');
      dispatch(logOut());
      
      const { clearUserData } = await import('../state/data/userSlice');
      dispatch(clearUserData());
    } catch (error) {
      // Continue even if Redux clear fails
    }

    // Step 4: Clear browser storage
    localStorage.clear();
    sessionStorage.clear();

    // Step 5: Clear all cookies
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=");
      const name = eqPos > -1 ? c.substring(0, eqPos) : c;
      // Clear for multiple domain/path combinations
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost`;
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
    });

    // Step 6: Clear RTK Query cache
    try {
      const store = window.__REDUX_STORE__;
      if (store) {
        // Clear all API caches
        store.dispatch({ type: 'api/util/resetApiState' });
        
        // Reset specific API slices
        const apiSlices = ['authApi', 'reportApi', 'blogApi', 'appointmentApi', 'chatApi', 'clinicalNotesApi', 'profileApi'];
        apiSlices.forEach(slice => {
          store.dispatch({ type: `${slice}/util/resetApiState` });
        });
      }
    } catch (error) {
      // Non-critical if cache clear fails
    }

    // Step 7: Stop token management
    try {
      const { stopPeriodicTokenCheck } = await import('../services/baseApi');
      stopPeriodicTokenCheck();
    } catch (error) {
      // Non-critical if this fails
    }

    // Step 8: Clear IndexedDB (if used by the app)
    try {
      if ('indexedDB' in window) {
        const databases = await indexedDB.databases();
        await Promise.all(
          databases.map(db => {
            const deleteReq = indexedDB.deleteDatabase(db.name);
            return new Promise((resolve) => {
              deleteReq.onsuccess = () => resolve();
              deleteReq.onerror = () => resolve(); // Continue even if delete fails
            });
          })
        );
      }
    } catch (error) {
      // Non-critical if IndexedDB clear fails
    }

    // Step 9: Navigate to login or force reload
    if (navigate) {
      navigate('/login', { replace: true });
    } else {
      window.location.href = '/login';
    }
    
  } catch (error) {
    // Nuclear fallback - if anything fails, still try to clear everything and redirect
    
    try {
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=");
        const name = eqPos > -1 ? c.substring(0, eqPos) : c;
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
      
      // Force page reload as fallback
      window.location.href = '/login';
      
    } catch (e) {
      // Last resort - force page reload
      window.location.reload();
    }
  }
};

export default performCompleteLogout; 