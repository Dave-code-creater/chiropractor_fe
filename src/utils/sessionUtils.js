import { validateSession } from '../state/data/authSlice';
import { getTokenInfo, isValidTokenFormat, startPeriodicTokenCheck } from '../api/core/tokenManager';

export const attemptSessionRestore = (store) => {
    try {
        const state = store.getState();
        const auth = state.auth;

        if (!auth.accessToken || !auth.userID || !auth.role) {
            return false;
        }

        if (!isValidTokenFormat(auth.accessToken)) {
            store.dispatch(validateSession());
            return false;
        }

        const tokenInfo = getTokenInfo(auth.accessToken);
        if (!tokenInfo.isValid) {
            store.dispatch(validateSession());
            return false;
        }

        store.dispatch(validateSession());

        startPeriodicTokenCheck(store);

        return true;

    } catch (error) {
        console.error('Session restoration failed:', error);
        return false;
    }
};

export const clearInvalidSession = (store) => {
    try {
        const { logOut } = require('../state/data/authSlice');
        store.dispatch(logOut());

        const { clearTokens } = require('../api/core/tokenManager');
        clearTokens();
    } catch (error) {
        console.error('Failed to clear invalid session:', error);
    }
};

export const getUserDashboardPath = (userRole, userID) => {
    if (!userRole || !userID) return '/login';
    return `/dashboard/${userRole.toLowerCase()}/${userID}`;
};

export const isAuthPage = (pathname) => {
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];
    return authPages.includes(pathname);
};

export const shouldRedirectAuthenticated = (pathname, isAuthenticated, userRole, userID) => {
    if (!isAuthenticated || !userRole || !userID)
        return false;

    if (isAuthPage(pathname))
        return true;

    if (pathname === '/')
        return true;

    return false;
};
