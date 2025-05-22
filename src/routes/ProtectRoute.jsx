import { useLocation, useNavigate, Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function ProtectRoute() {
    const navigate = useNavigate(); // ✅ move inside the component
    const location = useLocation();
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
    const user = useSelector(state => state.auth.user);

    const from = location.state?.from?.pathname || `/dashboard/${user?.id || ''}`;

    useEffect(() => {
        if (isAuthenticated && location.pathname === '/login') {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, from, navigate, location.pathname]);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}