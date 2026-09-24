import type { Permission, Role } from "../../types/auth.types";
import { hasPermission } from "../../constants/permissions";
import { getSession } from "./sessionService";
// Role simulation is available only inside the signed-in demo workspace.
let employeeId: number | null = null;
let role: Role = "administrator";
const listeners = new Set<() => void>();
export function getDemoRole(): Role { return role; }
export function changeDemoRole(next: Role) {
  if (!["administrator", "manager", "viewer", "employee"].includes(next)) throw new Error("Unknown demo role.");
  role = next;
  employeeId = null;
  listeners.forEach((listener) => listener());
}
export function subscribeDemoRole(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }
export class PermissionError extends Error {
  constructor() { super("Your current demo role does not permit this action."); this.name = "PermissionError"; }
}
export function requirePermission(permission: Permission) { if (!getSession() || !hasPermission(role, permission)) throw new PermissionError(); }
export function getDemoEmployeeId(): number | null { return employeeId; }
export function changeDemoEmployeeId(id: number | null) {
  if (id !== null && (!Number.isSafeInteger(id) || id <= 0)) throw new Error("Choose a valid employee.");
  employeeId = id;
  listeners.forEach((listener) => listener());
}
