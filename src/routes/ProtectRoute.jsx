import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuthReady } from "../hooks/useAuthReady";
import SessionLoadingScreen from "../components/loading/SessionLoadingScreen";

export default function ProtectRoute({ allowedRoles }) {
  const location = useLocation();
  const { isReady, isAuthenticated, userID, role } = useAuthReady();

  // Show loading while auth state is being rehydrated
  if (!isReady) {
    return <SessionLoadingScreen message="Verifying access..." />;
  }

  // not logged in → go to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // if allowedRoles is provided AND the user's role isn't in it → unauthorized
  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // otherwise render the child route
  return <Outlet />;
}
