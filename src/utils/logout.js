/**
 * Complete logout utility that wipes all user data
 * This function provides a nuclear logout option that clears absolutely everything
 */

// Get the correct API base URL (same logic as baseApi.js)
const getBaseUrl = () => {
  // Check build-time environment variable first (for static builds)
  const buildEnv = import.meta.env.VITE_API_ENVIRONMENT;
  const API_CONFIG = {
    development: 'http://localhost:3000/v1/api/2025',
    production: 'http://drdieuphanchiropractor.com/v1/api/2025',
    staging: 'http://staging.drdieuphanchiropractor.com/v1/api/2025',
  };
  
  if (buildEnv && API_CONFIG[buildEnv]) {
    return API_CONFIG[buildEnv];
  }
  
  // Fallback to runtime hostname detection
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isStaging = window.location.hostname.includes('staging');
  
  if (isDevelopment) return API_CONFIG.development;
  if (isStaging) return API_CONFIG.staging;
  return API_CONFIG.production;
};

export const performCompleteLogout = async (dispatch, navigate) => {
  try {
    // Step 1: Call backend logout first and wait for confirmation
    let backendLogoutSuccess = false;
    
    try {
      const response = await fetch(`${getBaseUrl()}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if backend explicitly confirms logout success
        if (data && (data.success === true || data.message === "Logout successful")) {
          backendLogoutSuccess = true;
          console.log("Backend logout successful");
        } else {
          console.error("Backend logout failed - invalid response:", data);
          throw new Error(data?.message || "Logout not confirmed by server");
        }
      } else {
        console.error("Backend logout failed with status:", response.status);
        
        // Only proceed with emergency cleanup if server is unreachable (5xx errors)
        if (response.status >= 500) {
          console.warn("Server error - will proceed with emergency cleanup");
          backendLogoutSuccess = true; // Allow cleanup for server errors
        } else {
          throw new Error(`Logout failed with status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error("Backend logout error:", error);
      
      // Only proceed with cleanup if it's a network error (server unreachable)
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        console.warn("Network error - server may be unreachable, proceeding with emergency cleanup");
        backendLogoutSuccess = true;
      } else {
        // Backend explicitly rejected logout, don't proceed
        alert(`Logout failed: ${error.message}`);
        return;
      }
    }

    // Only proceed with cleanup if backend logout was successful or server is unreachable
    if (!backendLogoutSuccess) {
      console.error("Backend logout failed - not proceeding with local cleanup");
      alert("Logout failed. Please try again.");
      return;
    }

    console.log("Proceeding with local cleanup after backend confirmation");

    // Step 2: Set logout flag to prevent token refresh interference
    try {
      const { setLoggingOut } = await import('../services/baseApi');
      setLoggingOut(true);
    } catch (error) {
      // Non-critical if this fails
      console.warn("Could not set logout flag:", error);
    }

    // Step 3: Clear Redux auth state and user entity
    try {
      const { logOut } = await import('../state/data/authSlice');
      dispatch(logOut());
      
      const { clearUserData } = await import('../state/data/userSlice');
      dispatch(clearUserData());
    } catch (error) {
      // Continue even if Redux clear fails
      console.warn("Could not clear Redux state:", error);
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
      console.warn("Could not clear RTK Query cache:", error);
    }

    // Step 7: Stop token management
    try {
      const { stopPeriodicTokenCheck } = await import('../services/baseApi');
      stopPeriodicTokenCheck();
    } catch (error) {
      // Non-critical if this fails
      console.warn("Could not stop token management:", error);
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
      console.warn("Could not clear IndexedDB:", error);
    }

    // Step 9: Navigate to login or force reload
    if (navigate) {
      navigate('/login', { replace: true });
    } else {
      window.location.href = '/login';
    }
    
  } catch (error) {
    console.error("Complete logout failed:", error);
    
    // Emergency fallback - only if we know backend confirmed logout
    // or if it's a critical system error after successful backend logout
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
      console.error("Emergency fallback failed:", e);
      window.location.reload();
    }
  }
};

export default performCompleteLogout; 