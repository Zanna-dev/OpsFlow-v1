import type { Permission, Role } from "../types/auth.types";
export const roleLabels: Record<Role, string> = { administrator: "Administrator", manager: "Manager", viewer: "Viewer", employee: "Employee" };
export const rolePermissions: Record<Role, readonly Permission[]> = {
  administrator: ["employees.manage", "projects.create", "projects.edit", "projects.delete", "projects.assign", "tasks.manage", "tasks.progress"],
  manager: ["projects.create", "projects.edit", "projects.assign", "tasks.manage", "tasks.progress"],
  viewer: [],
  employee: ["tasks.progress"],
};
export function hasPermission(role: Role, permission: Permission): boolean { return rolePermissions[role].includes(permission); }

