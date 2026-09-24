import type { Employee } from "../interfaces/employee.interfaces";

export type UserPreview = Pick<Employee, "id" | "name" | "email">;
