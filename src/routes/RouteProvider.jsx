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
    // Reset navigation flag when location changes
    hasNavigated.current = false;
  }, [location.pathname]);

  useEffect(() => {
    // Prevent infinite loops by checking if we've already navigated
    if (hasNavigated.current) {
      return;
    }

    // Only redirect if we have all required data and the URL needs fixing
    if (userId && userRole && (!id || id === 'undefined')) {
      const expectedPath = `/dashboard/${userRole.toLowerCase()}/${userId}`;
      const currentPath = location.pathname;
      
      // Check if we need to navigate to the correct path
      if (!currentPath.includes(expectedPath)) {
        hasNavigated.current = true;
        navigate(expectedPath, { replace: true });
      }
    }
  }, [userId, id, userRole, navigate, location.pathname]);

  return <Outlet />;
};

export default RouteProvider; 