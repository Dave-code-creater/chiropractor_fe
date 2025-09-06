import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../state/data/authSlice';
import { isTokenExpired, clearTokens, getToken } from '../../api/core/tokenManager';
import { getBaseUrl } from '../../api/config/config';

/**
 * ===============================================
 * PROACTIVE TOKEN EXPIRATION MONITOR
 * ===============================================
 * 
 * This component runs in the background and actively monitors
 * token expiration. It forces logout even if user is just
 * sitting on dashboard without making API calls.
 * 
 * Runs every 30 seconds to check token validity.
 */

const TokenExpirationMonitor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lastValidationCheck = useRef(0);
  
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);
  const accessToken = useSelector((state) => state?.auth?.accessToken);
  const refreshToken = useSelector((state) => state?.auth?.refreshToken);

  useEffect(() => {
    // Only monitor if user is authenticated
    if (!isAuthenticated) {
      return;
    }

    // Validate token with server (rate limited to once per minute)
    const validateTokenWithServer = async () => {
      const now = Date.now();
      // Only check server validation once per minute to avoid spam
      if (now - lastValidationCheck.current < 60000) {
        return;
      }
      
      lastValidationCheck.current = now;
      
      try {
        console.log('🔍 Validating token with server...');
        
        // Make a simple API call to test token validity
        const response = await fetch(`${getBaseUrl()}/users/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          console.log('🚨 Server rejected token (401) - forcing logout');
          forceLogout();
          return;
        }

        if (!response.ok) {
          console.log('⚠️ Server validation failed with status:', response.status);
          // Don't logout for 5xx errors, only auth errors
          if (response.status >= 400 && response.status < 500) {
            forceLogout();
            return;
          }
        }
        
        console.log('✅ Token validated successfully with server');
      } catch (error) {
        console.log('⚠️ Server validation error (network issue):', error.message);
        // Don't logout for network errors, only auth failures
      }
    };

    const checkTokenExpiration = async () => {
      // If no access token, force logout
      if (!accessToken) {
        console.log('🚨 No access token found - forcing logout');
        forceLogout();
        return;
      }

      // Check if access token is expired (client-side check)
      if (isTokenExpired(accessToken)) {
        console.log('🚨 Access token expired - checking refresh token');
        
        // If no refresh token or refresh token is also expired, force logout
        if (!refreshToken || isTokenExpired(refreshToken)) {
          console.log('🚨 Refresh token expired or missing - forcing logout');
          forceLogout();
          return;
        }
        
        // If refresh token exists and is valid, let the normal refresh flow handle it
        console.log('💡 Refresh token available, normal refresh flow should handle this');
        return;
      }

      // If token is not expired but we suspect it might be invalid, validate with server
      await validateTokenWithServer();
    };

    const forceLogout = () => {
      console.log('🔴 FORCING LOGOUT - Invalid token detected');
      
      // Clear tokens immediately
      clearTokens();
      
      // Dispatch logout action
      dispatch(logOut());
      
      // Force redirect to login
      navigate('/login', { replace: true });
      
      // Show user notification
      setTimeout(() => {
        alert('Your session has expired. Please log in again.');
      }, 100);
    };

    // Initial check
    checkTokenExpiration();

    // Also listen for any global 401 errors and force logout immediately
    const handleGlobalError = (event) => {
      // Check if this is a fetch error with 401 status
      if (event.detail && event.detail.status === 401) {
        console.log('🚨 Global 401 error detected - forcing logout');
        forceLogout();
      }
    };

    // Listen for custom 401 events
    window.addEventListener('unauthorized', handleGlobalError);

    // Set up interval to check every 30 seconds
    const interval = setInterval(async () => {
      await checkTokenExpiration();
    }, 30000); // 30 seconds

    // Also check when user focuses back on the browser tab
    const handleWindowFocus = async () => {
      console.log('👁️ Window focused - checking token validity');
      await checkTokenExpiration();
    };

    // Also check when user becomes active (mouse movement, keyboard)
    const handleUserActivity = () => {
      // Debounce this check to avoid too many calls
      clearTimeout(window.tokenActivityTimeout);
      window.tokenActivityTimeout = setTimeout(async () => {
        await checkTokenExpiration();
      }, 5000); // Check 5 seconds after user activity
    };

    // Add event listeners
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('unauthorized', handleGlobalError);
      clearTimeout(window.tokenActivityTimeout);
    };

  }, [isAuthenticated, accessToken, refreshToken, dispatch, navigate]);

  // This component doesn't render anything
  return null;
};

export default TokenExpirationMonitor;