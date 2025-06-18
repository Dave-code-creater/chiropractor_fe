import { useEffect } from 'react';
import { useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectRoute({ allowedRoles }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isAuthenticated = useSelector(state => state.data.auth.isAuthenticated);
    const userID = useSelector(state => state.data.auth.userID);
    const role = useSelector(state => state.data.auth.role);

    // if you redirected here from /login, send them back to whatever they wanted
    const from = location.state?.from?.pathname || `/dashboard/${userID || ''}`;

    useEffect(() => {
        if (isAuthenticated && location.pathname === '/login') {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, from, navigate, location.pathname]);

    // not logged in → go to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // if allowedRoles is provided AND the user's role isn't in it → unauthorized
    if (allowedRoles?.length && !allowedRoles.includes(role)) {
        console.warn(`Unauthorized access attempt by user with role: ${role}`);
        return <Navigate to="/unauthorized" replace />;
    }

    // otherwise render the child route
    return <Outlet />;
}