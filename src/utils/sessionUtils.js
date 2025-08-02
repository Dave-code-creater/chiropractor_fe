import { validateSession, restoreSession } from '../state/data/authSlice';
import { getTokenInfo, isValidTokenFormat } from '../api/core/tokenManager';

/**
 * Session Restoration Utility
 * Handles automatic session restoration from persisted state
 */

/**
 * Check if stored auth data is valid and restore session
 */
export const attemptSessionRestore = (store) => {
    try {
        const state = store.getState();
        const auth = state.auth;

        // Check if we have basic auth data
        if (!auth.accessToken || !auth.userID || !auth.role) {
            console.log('No valid session data found');
            return false;
        }

        // Validate token format
        if (!isValidTokenFormat(auth.accessToken)) {
            console.log('Invalid token format detected');
            store.dispatch(validateSession());
            return false;
        }

        // Check token expiration
        const tokenInfo = getTokenInfo(auth.accessToken);
        if (!tokenInfo.isValid) {
            console.log('Token validation failed:', tokenInfo.error);
            store.dispatch(validateSession());
            return false;
        }

        // If token is expired, we need to refresh (handled by token manager)
        if (tokenInfo.isExpired) {
            console.log('Token expired, refresh will be attempted automatically');
            // Don't return false here, let the refresh logic handle it
        }

        // Session data looks good, ensure state is marked as authenticated
        store.dispatch(validateSession());

        console.log('Session restored successfully for user:', auth.userID, 'role:', auth.role);
        return true;

    } catch (error) {
        console.error('Session restoration failed:', error);
        return false;
    }
};

/**
 * Clear invalid session data
 */
export const clearInvalidSession = (store) => {
    try {
        // This will reset the auth state to initial state
        const { logOut } = require('../state/data/authSlice');
        store.dispatch(logOut());

        // Also clear localStorage tokens
        const { clearTokens } = require('../api/core/tokenManager');
        clearTokens();

        console.log('Invalid session cleared');
    } catch (error) {
        console.error('Failed to clear invalid session:', error);
    }
};

/**
 * Get user dashboard path based on role and ID
 */
export const getUserDashboardPath = (userRole, userID) => {
    if (!userRole || !userID) return '/login';
    return `/dashboard/${userRole.toLowerCase()}/${userID}`;
};

/**
 * Check if current path is an auth page
 */
export const isAuthPage = (pathname) => {
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
    return authPages.includes(pathname);
};

/**
 * Check if user should be redirected from current page
 */
export const shouldRedirectAuthenticated = (pathname, isAuthenticated, userRole, userID) => {
    // If not authenticated, no redirect needed
    if (!isAuthenticated || !userRole || !userID) return false;

    // If on auth pages, redirect to dashboard
    if (isAuthPage(pathname)) return true;

    // If on root page, redirect to dashboard (Facebook-like behavior)
    if (pathname === '/') return true;

    return false;
};
