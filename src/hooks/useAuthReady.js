import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

/**
 * Hook to determine when authentication state is ready and stable
 * This prevents race conditions during Redux persist rehydration
 */
export const useAuthReady = () => {
  const [isReady, setIsReady] = useState(false);
  const stabilityCheck = useRef(null);
  
  // Get auth state from Redux
  const isAuthenticated = useSelector(state => state?.auth?.isAuthenticated ?? false);
  const userID = useSelector(state => state?.auth?.userID ?? null);
  const role = useSelector(state => state?.auth?.role ?? null);
  const accessToken = useSelector(state => state?.auth?.accessToken ?? null);
  const _persist = useSelector(state => state?._persist);
  
  useEffect(() => {
    // Clear any existing timer
    if (stabilityCheck.current) {
      clearTimeout(stabilityCheck.current);
    }
    
    // Set ready state after a short delay to ensure state is stable
    stabilityCheck.current = setTimeout(() => {
      setIsReady(true);
    }, 150);

    return () => {
      if (stabilityCheck.current) {
        clearTimeout(stabilityCheck.current);
      }
    };
  }, [isAuthenticated, userID, role]); // Re-run if key auth values change

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