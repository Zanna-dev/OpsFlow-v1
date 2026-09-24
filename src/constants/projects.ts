import type { ProjectPriority, ProjectStatus } from "../types/project.types";

export const projectStatuses: ProjectStatus[] = ["planning", "active", "completed", "cancelled"];
export const projectPriorities: ProjectPriority[] = ["low", "medium", "high", "critical"];
export const statusLabels: Record<ProjectStatus, string> = {
  planning: "Planning", active: "Active", completed: "Completed", cancelled: "Cancelled",
};
export const priorityLabels: Record<ProjectPriority, string> = {
  low: "Low", medium: "Medium", high: "High", critical: "Critical",
};
