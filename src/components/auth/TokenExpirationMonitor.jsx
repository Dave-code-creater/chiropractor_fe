import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../../state/data/authSlice';
import { isTokenExpired, clearTokens } from '../../api/core/tokenManager';
import { getBaseUrl } from '../../api/config/config';

const TokenExpirationMonitor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const lastValidationCheck = useRef(0);
  
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);
  const accessToken = useSelector((state) => state?.auth?.accessToken);
  const refreshToken = useSelector((state) => state?.auth?.refreshToken);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const validateTokenWithServer = async () => {
      const now = Date.now();
      if (now - lastValidationCheck.current < 60000) {
        return;
      }
      
      lastValidationCheck.current = now;
      
      try {
        const response = await fetch(`${getBaseUrl()}/users/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          forceLogout();
          return;
        }

        if (!response.ok) {
          if (response.status >= 400 && response.status < 500) {
            forceLogout();
            return;
          }
        }
      } catch {}
    };

    const checkTokenExpiration = async () => {
      if (!accessToken) {
        forceLogout();
        return;
      }

      if (isTokenExpired(accessToken)) {
        if (!refreshToken || isTokenExpired(refreshToken)) {
          forceLogout();
          return;
        }

        return;
      }

      await validateTokenWithServer();
    };

    const forceLogout = () => {
      clearTokens();
      
      dispatch(logOut());
      
      navigate('/login', { replace: true });
      
      setTimeout(() => {
        alert('Your session has expired. Please log in again.');
      }, 100);
    };

    checkTokenExpiration();

    const handleGlobalError = (event) => {
      if (event.detail && event.detail.status === 401) {
        forceLogout();
      }
    };

    window.addEventListener('unauthorized', handleGlobalError);

    const interval = setInterval(async () => {
      await checkTokenExpiration();
    }, 30000);

    const handleWindowFocus = async () => {
      await checkTokenExpiration();
    };

    const handleUserActivity = () => {
      clearTimeout(window.tokenActivityTimeout);
      window.tokenActivityTimeout = setTimeout(async () => {
        await checkTokenExpiration();
      }, 5000);
    };

    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);

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

  return null;
};

export default TokenExpirationMonitor;
