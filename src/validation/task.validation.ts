import type { ProjectTask } from "../interfaces/task.interfaces";
export function isProjectTask(value: unknown): value is ProjectTask {
  if (!value || typeof value !== "object") return false;
  const task = value as Record<string, unknown>;
  return (task.scheduled === undefined || typeof task.scheduled === "boolean") && typeof task.id === "string" && task.id.length > 0 && typeof task.title === "string" && task.title.trim().length >= 3 && task.title.trim().length <= 120 &&
    Number.isSafeInteger(task.assigneeId) && Number(task.assigneeId) > 0 && Number.isInteger(task.progress) && Number(task.progress) >= 0 && Number(task.progress) <= 100 &&
    Number.isSafeInteger(task.revision) && Number(task.revision) > 0 && typeof task.updatedAt === "string" && Number.isFinite(Date.parse(task.updatedAt));
}

