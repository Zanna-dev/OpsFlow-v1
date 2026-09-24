import { requirePermission } from "../auth/demoAuthService";
import type { EmployeeFieldErrors, EmployeeInput } from "../../types/employee.types";
import type { Employee } from "../../interfaces/employee.interfaces";
import { normalizeEmployee, validateEmployee } from "../../validation/employee.validation";
import { assertEmployeeCanBeDeleted, assertEmployeeCanBeDeactivated } from "../projects/projectStorage";

const storageKey = "opsflow.employees.v1";

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "Amara Okafor",
    email: "amara@opsflow.demo",
    department: "Design",
    active: true,
  },
  {
    id: 2,
    name: "Daniel Chen",
    email: "daniel@opsflow.demo",
    department: "Engineering",
    active: true,
  },
  {
    id: 3,
    name: "Zara Bello",
    email: "zara@opsflow.demo",
    department: "Product",
    active: true,
  },
  {
    id: 4,
    name: "Oliver James",
    email: "oliver@opsflow.demo",
    department: "Operations",
    active: false,
  },
  {
    id: 5,
    name: "Nia Williams",
    email: "nia@opsflow.demo",
    department: "Engineering",
    active: true,
  },
  {
    id: 6,
    name: "Tunde Adeyemi",
    email: "tunde@opsflow.demo",
    department: "Finance",
    active: true,
  },
  {
    id: 7,
    name: "Sofia Martins",
    email: "sofia@opsflow.demo",
    department: "Design",
    active: true,
  },
  {
    id: 8,
    name: "Ethan Park",
    email: "ethan@opsflow.demo",
    department: "People",
    active: false,
  },
];

function isEmployee(value: unknown): value is Employee {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    Number.isInteger(record.id) &&
    Number(record.id) > 0 &&
    typeof record.name === "string" &&
    typeof record.email === "string" &&
    typeof record.department === "string" &&
    typeof record.active === "boolean"
  );
}

// The UI depends on this contract, not on localStorage or a future HTTP client.
function readEmployees(): Employee[] {
  const stored = localStorage.getItem(storageKey);
  if (stored === null) {
    localStorage.setItem(storageKey, JSON.stringify(initialEmployees));
    return structuredClone(initialEmployees);
  }
  const records: unknown = JSON.parse(stored);
  if (
    !Array.isArray(records) ||
    !records.every(isEmployee) ||
    new Set(records.map((record) => record.id)).size !== records.length
  ) {
    throw new Error(
      "The saved demo directory could not be read. Your data has not been overwritten.",
    );
  }
  return records;
}

export async function listEmployees(): Promise<Employee[]> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 300));
  return readEmployees();
}

export async function deleteEmployee(id: number): Promise<void> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 350));
  requirePermission("employees.manage");
  const employees = readEmployees();
  if (!employees.some((employee) => employee.id === id))
    throw new EmployeeNotFoundError();
  assertEmployeeCanBeDeleted(id);
  localStorage.setItem(
    storageKey,
    JSON.stringify(employees.filter((employee) => employee.id !== id)),
  );
}

export class EmployeeNotFoundError extends Error {
  constructor() {
    super("This employee no longer exists in the workspace.");
    this.name = "EmployeeNotFoundError";
  }
}

export async function getEmployee(id: number): Promise<Employee> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 300));
  const employee = readEmployees().find((record) => record.id === id);
  if (!employee) throw new EmployeeNotFoundError();
  return employee;
}

export async function updateEmployee(
  id: number,
  input: EmployeeInput,
): Promise<Employee> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 350));
  requirePermission("employees.manage");
  const employees = readEmployees();
  if (!employees.some((employee) => employee.id === id))
    throw new EmployeeNotFoundError();
  const value = normalizeEmployee(input);
  const errors = validateEmployee(value);
  if (Object.keys(errors).length) throw new EmployeeValidationError(errors);
  if (
    employees.some(
      (employee) =>
        employee.id !== id &&
        employee.email.trim().toLowerCase() === value.email,
    )
  ) {
    throw new EmployeeValidationError({
      email: "An employee with this email already exists.",
    });
  }
  const updated: Employee = { ...value, id };
  if (!updated.active) assertEmployeeCanBeDeactivated(id);
  localStorage.setItem(
    storageKey,
    JSON.stringify(
      employees.map((employee) => (employee.id === id ? updated : employee)),
    ),
  );
  return updated;
}

export class EmployeeValidationError extends Error {
  readonly fieldErrors: EmployeeFieldErrors;

  constructor(fieldErrors: EmployeeFieldErrors) {
    super("Review the highlighted fields.");
    this.name = "EmployeeValidationError";
    this.fieldErrors = fieldErrors;
  }
}

export async function createEmployee(input: EmployeeInput): Promise<Employee> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 350));
  requirePermission("employees.manage");
  const value = normalizeEmployee(input);
  const errors = validateEmployee(value);
  if (Object.keys(errors).length) throw new EmployeeValidationError(errors);
  // Read/check/write together after the delay so concurrent saves in this tab
  // see the latest records rather than an earlier snapshot.
  const employees = readEmployees();
  if (
    employees.some(
      (employee) => employee.email.trim().toLowerCase() === value.email,
    )
  ) {
    throw new EmployeeValidationError({
      email: "An employee with this email already exists.",
    });
  }
  const id =
    employees.reduce((highest, employee) => Math.max(highest, employee.id), 0) +
    1;
  const employee: Employee = { ...value, id };
  localStorage.setItem(storageKey, JSON.stringify([...employees, employee]));
  return employee;
}

