import type { Project } from "../interfaces/project.interfaces";
import type { ProjectAttention } from "../types/projectAttention.types";

export function getLocalDay(now = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function parseProjectAttention(value: string | null): ProjectAttention | null {
  return value === "overdue" || value === "due-soon" || value === "no-members" ? value : null;
}

export function matchesProjectAttention(project: Project, attention: ProjectAttention, today: string): boolean {
  if (project.status !== "planning" && project.status !== "active") return false;
  if (attention === "no-members") return project.memberIds.length === 0;
  if (project.endDate === null) return false;
  if (attention === "overdue") return project.endDate < today;
  // UTC calendar arithmetic keeps the seven-day boundary stable across DST changes.
  const end = new Date(`${today}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 7);
  return project.endDate >= today && project.endDate <= end.toISOString().slice(0, 10);
}
