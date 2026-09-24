import type { Employee } from "../interfaces/employee.interfaces";


export type EmployeeStatusFilter = "all" | "active" | "inactive";

export type EmployeeInput = Omit<Employee, "id">;
export type EmployeeFieldErrors = Partial<Record<keyof EmployeeInput, string>>;




export type EmployeeTouchedFields = Partial<Record<keyof EmployeeInput, boolean>>;
export type EmployeeRecordState =
  | { status: "loading" }
  | { status: "ready"; employee: Employee }
  | { status: "missing" }
  | { status: "error" };
