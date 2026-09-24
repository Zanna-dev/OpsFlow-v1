import type { EmployeeProjects } from "../interfaces/employeeProfile.interfaces";

export type EmployeeProjectsState =
  | { status: "loading" }
  | { status: "ready"; data: EmployeeProjects }
  | { status: "error"; message: string };
