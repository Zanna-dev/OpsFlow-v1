import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";
import { safeReturnPath } from "../utils/safeReturnPath";

export function RequireSession() {
  const { session } = useAuth();
  const location = useLocation();
  if (!session) {
    const returnTo = safeReturnPath(location.pathname + location.search + location.hash);
    return <Navigate to={`/login?returnTo=${encodeURIComponent(returnTo)}`} replace />;
  }
  return <Outlet />;
}
