import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthReady } from '../../hooks/useAuthReady';
import { selectUserId, selectUserRole, selectIsAuthenticated } from '../../state/data/authSlice';

const AUTH_PAGES = ['/login', '/register', '/forgot-password', '/reset-password'];

const AuthSessionManager = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isReady } = useAuthReady();

    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userID = useSelector(selectUserId);
    const userRole = useSelector(selectUserRole);

    useEffect(() => {
        if (!isReady)
            return;

        const currentPath = location.pathname;

        if (isAuthenticated && userID && userRole && AUTH_PAGES.includes(currentPath)) {
            const dashboardPath = `/dashboard/${userRole.toLowerCase()}/${userID}`;
            navigate(dashboardPath, { replace: true });
            return;
        }

        if (isAuthenticated && userID && userRole && currentPath === '/') {
            const dashboardPath = `/dashboard/${userRole.toLowerCase()}/${userID}`;
            navigate(dashboardPath, { replace: true });
            return;
        }

    }, [isReady, isAuthenticated, userID, userRole, location.pathname, navigate]);

    return children;
};

export default AuthSessionManager;
