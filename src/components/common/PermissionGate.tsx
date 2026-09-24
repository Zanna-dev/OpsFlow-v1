import { useAuth } from "../../hooks/auth/useAuth";
import type { PermissionProps } from "../../interfaces/auth.interfaces";
export function PermissionGate({ permission, children }: PermissionProps) { return useAuth().can(permission) ? children : null; }
