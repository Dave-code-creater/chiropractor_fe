import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

/**
 * Hook to determine when authentication state is ready and stable
 * This prevents race conditions during Redux persist rehydration
 */
export const useAuthReady = () => {
  const [isReady, setIsReady] = useState(false);
  
  // Get auth state from Redux
  const isAuthenticated = useSelector(state => state?.auth?.isAuthenticated ?? false);
  const userID = useSelector(state => state?.auth?.user?.id ?? null);
  const role = useSelector(state => state?.auth?.role ?? null);
  const accessToken = useSelector(state => state?.auth?.accessToken ?? null);
  const _persist = useSelector(state => state?._persist);
  
  // Simple one-time initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []); // Empty dependency array - only run once

  return {
    isReady,
    isAuthenticated,
    userID,
    role,
    hasToken: !!accessToken,
    persistRehydrated: _persist?.rehydrated
  };
};

export default useAuthReady; 