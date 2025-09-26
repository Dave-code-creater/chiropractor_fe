import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

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

export const useAuthReady = () => {
  const [isReady, setIsReady] = useState(false);
  const stabilityCheck = useRef<NodeJS.Timeout | null>(null);

  const isAuthenticated = useSelector((state: RootState) => state?.auth?.isAuthenticated ?? false);
  const userID = useSelector((state: RootState) => state?.auth?.userID ?? null);
  const role = useSelector((state: RootState) => state?.auth?.role ?? null);
  const accessToken = useSelector((state: RootState) => state?.auth?.accessToken ?? null);
  const _persist = useSelector((state: RootState) => state?._persist);

  useEffect(() => {
    if (stabilityCheck.current) {
      clearTimeout(stabilityCheck.current);
    }

    if (_persist?.rehydrated) {
      stabilityCheck.current = setTimeout(() => {
        setIsReady(true);
      }, 100);
    }

    return () => {
      if (stabilityCheck.current) {
        clearTimeout(stabilityCheck.current);
      }
    };
  }, [isAuthenticated, userID, role, _persist?.rehydrated]);

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