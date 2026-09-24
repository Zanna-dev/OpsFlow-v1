import type { EmployeeFieldErrors, EmployeeInput } from "../types/employee.types";

export const departments = ["Design", "Engineering", "Product", "Operations", "Finance", "People", "IT", "HR"] as const;

export function normalizeEmployee(input: EmployeeInput): EmployeeInput {
  return { name: input.name.trim(), email: input.email.trim().toLowerCase(), department: input.department, active: input.active };
}

export function validateEmployee(input: EmployeeInput): EmployeeFieldErrors {
  const value = normalizeEmployee(input);
  const errors: EmployeeFieldErrors = {};
  if (value.name.length < 2 || value.name.length > 80) errors.name = "Enter a name between 2 and 80 characters.";
  else if (!/^[\p{L}\p{M} '\u2019-]+$/u.test(value.name) || !/\p{L}/u.test(value.name)) errors.name = "Use letters, spaces, apostrophes, or hyphens for the name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) errors.email = "Enter a valid email address, such as name@example.com.";
  if (!departments.some((department) => department === value.department)) errors.department = "Choose a department from the list.";
  if (typeof value.active !== "boolean") errors.active = "Choose an active or inactive status.";
  return errors;
}
