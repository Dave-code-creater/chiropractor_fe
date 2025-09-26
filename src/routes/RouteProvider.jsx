import { useEffect, useRef } from 'react';
import { useNavigate, useParams, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserId, selectUserRole } from '../state/data/authSlice';

export const RouteProvider = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const userId = useSelector(selectUserId);
  const userRole = useSelector(selectUserRole);
  const hasNavigated = useRef(false);

  useEffect(() => {
    hasNavigated.current = false;
  }, [location.pathname]);

  useEffect(() => {
    if (hasNavigated.current) {
      return;
    }

    if (userId && userRole && (!id || id === 'undefined')) {
      const expectedPath = `/dashboard/${userRole.toLowerCase()}/${userId}`;
      const currentPath = location.pathname;
      
      if (!currentPath.includes(expectedPath)) {
        hasNavigated.current = true;
        navigate(expectedPath, { replace: true });
      }
    }
  }, [userId, id, userRole, navigate, location.pathname]);

  return <Outlet />;
};

export default RouteProvider; 