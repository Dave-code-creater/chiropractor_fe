import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

// Type definitions for the auth state
interface AuthState {
  isAuthenticated: boolean;
  userID: string | null;
  role: string | null;
  accessToken: string | null;
}

interface RootState {
  auth: AuthState;
  _persist?: {
    rehydrated: boolean;
  };
}

/**
 * Hook to determine when authentication state is ready and stable
 * This prevents race conditions during Redux persist rehydration
 */
export const useAuthReady = () => {
  const [isReady, setIsReady] = useState(false);
  const stabilityCheck = useRef<NodeJS.Timeout | null>(null);

  // Get auth state from Redux
  const isAuthenticated = useSelector((state: RootState) => state?.auth?.isAuthenticated ?? false);
  const userID = useSelector((state: RootState) => state?.auth?.userID ?? null);
  const role = useSelector((state: RootState) => state?.auth?.role ?? null);
  const accessToken = useSelector((state: RootState) => state?.auth?.accessToken ?? null);
  const _persist = useSelector((state: RootState) => state?._persist);

  useEffect(() => {
    // Clear any existing timer
    if (stabilityCheck.current) {
      clearTimeout(stabilityCheck.current);
    }

    // Wait for persist to rehydrate
    if (_persist?.rehydrated) {
      // Set ready state after a short delay to ensure state is stable
      stabilityCheck.current = setTimeout(() => {
        setIsReady(true);
      }, 100);
    }

    return () => {
      if (stabilityCheck.current) {
        clearTimeout(stabilityCheck.current);
      }
    };
  }, [isAuthenticated, userID, role, _persist?.rehydrated]); // Re-run if key auth values change

  return {
    isReady: isReady && (_persist?.rehydrated ?? false),
    isAuthenticated,
    userID,
    role,
    hasToken: !!accessToken,
    persistRehydrated: _persist?.rehydrated,
    hasValidSession: isAuthenticated && !!userID && !!role
  };
};

export default useAuthReady; 