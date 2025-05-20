import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = () => {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            const needsRedirect = !location.pathname.includes(user.id);
            if (needsRedirect) {
                const correctedPath = location.pathname.replace(/\/$/, '') + `/${user.id}`;
                navigate(correctedPath, { replace: true });
            }
        }
    }, [user, location, navigate]);

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;