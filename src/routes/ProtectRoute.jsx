import { useLocation, Outlet, Navigate } from "react-router-dom";
import { useAuthReady } from "../hooks/useAuthReady";
import SessionLoadingScreen from "../components/loading/SessionLoadingScreen";

export default function ProtectRoute({ allowedRoles }) {
  const location = useLocation();
  const { isReady, isAuthenticated, userID, role } = useAuthReady();

  if (!isReady) {
    return <SessionLoadingScreen message="Verifying access..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
