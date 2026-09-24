export type ProjectStatus = "planning" | "active" | "completed" | "cancelled";
export type ProjectPriority = "low" | "medium" | "high" | "critical";
export type ProjectSortField = "name" | "startDate" | "endDate" | "status" | "priority";
export type SortDirection = "asc" | "desc";
export type ProjectInput = Omit<Project, "id" | "tasks">;
export type ProjectCreateInput = Omit<ProjectInput, "code">;
export type ProjectUpdateInput = Omit<ProjectInput, "memberIds" | "code">;
export type ProjectRecordState =
  | { status: "loading" }
  | { status: "ready"; project: Project }
  | { status: "missing" }
  | { status: "error" };
export type ProjectFieldErrors = Partial<Record<keyof ProjectInput, string>>;
export type ProjectTouchedFields = Partial<Record<keyof ProjectInput, boolean>>;
import type { Project } from "../interfaces/project.interfaces";
export type ProjectView = "cards" | "table";

