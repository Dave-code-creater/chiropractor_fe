import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials, logOut } from '../state/data/authSlice';
import { jwtDecode } from 'jwt-decode';

/**
 * Smart authentication hook that handles token validation and refresh
 */
const useSmartAuth = () => {
  const dispatch = useDispatch();
  const [isValidating, setIsValidating] = useState(true);
  const [validationAttempts, setValidationAttempts] = useState(0);
  
  const { 
    accessToken, 
    refreshToken, 
    isAuthenticated,
    userID 
  } = useSelector(state => ({
    accessToken: state?.auth?.accessToken,
    refreshToken: state?.auth?.refreshToken,
    isAuthenticated: state?.auth?.isAuthenticated,
    userID: state?.auth?.userID
  }));

  /**
   * Check if token is expired or expiring soon
   */
  const isTokenExpiring = (token, bufferMinutes = 5) => {
    try {
      const decoded = jwtDecode(token);
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const bufferTime = bufferMinutes * 60 * 1000;
      
      return expirationTime <= currentTime + bufferTime;
    } catch (error) {
      return true; // Treat invalid tokens as expired
    }
  };

  /**
   * Validate and refresh tokens as needed
   */
  const validateTokens = async () => {
    setIsValidating(true);
    
    try {
      // If no tokens present, user needs to login
      if (!accessToken && !refreshToken) {
        setIsValidating(false);
        return;
      }

      // Check if access token is valid
      if (accessToken && !isTokenExpiring(accessToken)) {
        setIsValidating(false);
        return;
      }

      // Access token expired or expiring, try to refresh
      if (refreshToken && !isTokenExpiring(refreshToken, 0)) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${refreshToken}`
            },
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            
            if (data.user && data.token) {
              dispatch(setCredentials({
                user: data.user,
                token: data.token,
                refreshToken: data.refreshToken || refreshToken
              }));
              
              setIsValidating(false);
              return;
            }
          }
        } catch (error) {
          // Refresh failed
        }
      }

      // If we get here, refresh failed or refresh token is expired
      dispatch(logOut());
    } catch (error) {
      // Validation failed
      dispatch(logOut());
    }
    
    setIsValidating(false);
  };

  /**
   * Proactive token refresh when token is expiring soon
   */
  const proactiveRefresh = async () => {
    if (!accessToken || !refreshToken) return;
    
    if (isTokenExpiring(accessToken, 10)) { // Refresh 10 minutes before expiry
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refreshToken}`
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.user && data.token) {
            dispatch(setCredentials({
              user: data.user,
              token: data.token,
              refreshToken: data.refreshToken || refreshToken
            }));
          }
        }
      } catch (error) {
        // Proactive refresh failed, but don't logout
      }
    }
  };

  // Initial token validation on mount or when tokens change
  useEffect(() => {
    if (validationAttempts < 3) { // Prevent infinite validation loops
      setValidationAttempts(prev => prev + 1);
      validateTokens();
    }
  }, [accessToken, refreshToken]);

  // Reset validation attempts when tokens are cleared (logout)
  useEffect(() => {
    if (!accessToken && !refreshToken) {
      setValidationAttempts(0);
    }
  }, [accessToken, refreshToken]);

  // Set up proactive token refresh interval
  useEffect(() => {
    if (isAuthenticated && accessToken && refreshToken) {
      const interval = setInterval(proactiveRefresh, 5 * 60 * 1000); // Check every 5 minutes
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, accessToken, refreshToken]);

  return {
    isValidating,
    isAuthenticated,
    userID,
    validateTokens,
    proactiveRefresh
  };
};

export default useSmartAuth; 