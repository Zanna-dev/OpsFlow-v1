import { Link } from "react-router-dom";
import { useAuth } from "../hooks/auth/useAuth";
import type { PermissionProps } from "../interfaces/auth.interfaces";


export function ProtectedRoute({ permission, children }: PermissionProps) {
  const { can } = useAuth();
  if (!can(permission))
    return (
      <section>
        <h1>Access restricted</h1>
        <p>
          Your current demo role can view this workspace but cannot perform this
          action.
        </p>
        <Link to="/overview">Back to Overview</Link>
      </section>
    );
  return children;
}
