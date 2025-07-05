import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTokenExpiration, isTokenExpired, willExpireSoon } from '../api/core/tokenManager';

/**
 * Custom hook to monitor token status and provide real-time information
 * about token expiration and authentication state
 */
export const useTokenStatus = () => {
  const accessToken = useSelector((state) => state?.auth?.accessToken);
  const refreshToken = useSelector((state) => state?.auth?.refreshToken);
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);
  
  const [tokenStatus, setTokenStatus] = useState({
    isValid: false,
    isExpired: false,
    willExpireSoon: false,
    timeUntilExpiry: null,
    expirationDate: null,
    hasRefreshToken: false,
  });

  useEffect(() => {
    const updateTokenStatus = () => {
      if (!accessToken || !isAuthenticated) {
        setTokenStatus({
          isValid: false,
          isExpired: true,
          willExpireSoon: false,
          timeUntilExpiry: null,
          expirationDate: null,
          hasRefreshToken: !!refreshToken,
        });
        return;
      }

      const expired = isTokenExpired(accessToken);
      const expiringSoon = willExpireSoon(accessToken, 300); // 5 minutes
      const expirationDate = getTokenExpiration(accessToken);
      const timeUntilExpiry = expirationDate ? expirationDate.getTime() - Date.now() : null;

      setTokenStatus({
        isValid: !expired,
        isExpired: expired,
        willExpireSoon: expiringSoon,
        timeUntilExpiry,
        expirationDate,
        hasRefreshToken: !!refreshToken,
      });
    };

    // Update immediately
    updateTokenStatus();

    // Update every minute
    const interval = setInterval(updateTokenStatus, 60000);

    return () => clearInterval(interval);
  }, [accessToken, refreshToken, isAuthenticated]);

  return {
    ...tokenStatus,
    // Helper functions
    getTimeUntilExpiryString: () => {
      if (!tokenStatus.timeUntilExpiry || tokenStatus.timeUntilExpiry <= 0) {
        return 'Expired';
      }
      
      const minutes = Math.floor(tokenStatus.timeUntilExpiry / (1000 * 60));
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      
      if (days > 0) {
        return `${days}d ${hours % 24}h`;
      } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
      } else {
        return `${minutes}m`;
      }
    },
    
    getStatusColor: () => {
      if (tokenStatus.isExpired) return 'red';
      if (tokenStatus.willExpireSoon) return 'orange';
      return 'green';
    },
    
    getStatusText: () => {
      if (tokenStatus.isExpired) return 'Expired';
      if (tokenStatus.willExpireSoon) return 'Expiring Soon';
      return 'Valid';
    },
  };
};

export default useTokenStatus; 