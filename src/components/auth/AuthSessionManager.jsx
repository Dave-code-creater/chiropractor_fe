import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthReady } from '../../hooks/useAuthReady';
import { selectUserId, selectUserRole, selectIsAuthenticated } from '../../state/data/authSlice';

/**
 * AuthSessionManager - Handles automatic session restoration and redirects
 * Similar to Facebook's behavior where logged-in users are redirected to dashboard
 */
const AuthSessionManager = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isReady } = useAuthReady();

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userID = useSelector(selectUserId);
    const userRole = useSelector(selectUserRole);

    // Auth-related pages that authenticated users shouldn't access
    const authPages = ['/login', '/register', '/forgot-password', '/reset-password'];

    // Public pages that authenticated users can access
    const publicPages = ['/', '/about', '/contact', '/faq', '/terms-of-service', '/privacy-policy', '/blog'];

    useEffect(() => {
        // Only proceed if auth state is ready
        if (!isReady) return;

        const currentPath = location.pathname;

        // If user is authenticated and trying to access auth pages, redirect to dashboard
        if (isAuthenticated && userID && userRole && authPages.includes(currentPath)) {
            const dashboardPath = `/dashboard/${userRole.toLowerCase()}/${userID}`;
            navigate(dashboardPath, { replace: true });
            return;
        }

        // If user is authenticated and on root path, redirect to dashboard
        if (isAuthenticated && userID && userRole && currentPath === '/') {
            const dashboardPath = `/dashboard/${userRole.toLowerCase()}/${userID}`;
            navigate(dashboardPath, { replace: true });
            return;
        }

    }, [isReady, isAuthenticated, userID, userRole, location.pathname, navigate]);

    return children;
};

export default AuthSessionManager;
