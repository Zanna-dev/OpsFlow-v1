import type { Employee } from "../interfaces/employee.interfaces";

export type ProjectStatus = "planning" | "active" | "completed" | "cancelled";

export type EmployeePreview = Pick<Employee, "id" | "name" | "email">;
