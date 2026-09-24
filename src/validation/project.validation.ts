import { isProjectTask } from "./task.validation";
import type { Project } from "../interfaces/project.interfaces";
import { projectPriorities, projectStatuses } from "../constants/projects";
import type { Employee } from "../interfaces/employee.interfaces";
import type { ProjectInput, ProjectFieldErrors } from "../types/project.types";

export function normalizeProject(input: ProjectInput): ProjectInput {
  return {
    name: input.name.trim(), code: input.code.trim().toUpperCase(),
    description: input.description.trim(), status: input.status, priority: input.priority,
    startDate: input.startDate, endDate: input.endDate || null,
    ownerId: input.ownerId, memberIds: [...input.memberIds],
  };
}

export function validateProject(input: ProjectInput, employees: Employee[]): ProjectFieldErrors {
  const value = normalizeProject(input);
  const errors: ProjectFieldErrors = {};
  if (value.name.length < 3 || value.name.length > 100) errors.name = "Enter a project name between 3 and 100 characters.";
  if (!/^[A-Z0-9-]{2,20}$/.test(value.code)) errors.code = "Use 2–20 letters, numbers, or hyphens for the project code.";
  if (value.description.length < 10 || value.description.length > 1000) errors.description = "Enter a description between 10 and 1,000 characters.";
  if (!projectStatuses.includes(value.status)) errors.status = "Choose a status from the list.";
  if (!projectPriorities.includes(value.priority)) errors.priority = "Choose a priority from the list.";
  if (!isDate(value.startDate)) errors.startDate = "Choose a valid start date.";
  if (value.endDate !== null && !isDate(value.endDate)) errors.endDate = "Choose a valid end date.";
  else if (value.status === "completed" && value.endDate === null) errors.endDate = "Completed projects require an end date.";
  else if (value.endDate && isDate(value.startDate) && value.endDate < value.startDate) errors.endDate = "The end date cannot be before the start date.";
  if (!employees.some((employee) => employee.id === value.ownerId && employee.active)) errors.ownerId = "Choose an existing active employee as the project owner.";
  if (new Set(value.memberIds).size !== value.memberIds.length || value.memberIds.includes(value.ownerId) || value.memberIds.some((id) => !employees.some((employee) => employee.id === id))) {
    errors.memberIds = "Choose unique existing employees; the owner must not also be a team member.";
  }
  return errors;
}

function isDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function isProject(value: unknown): value is Project {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return Number.isSafeInteger(record.id) && Number(record.id) > 0 &&
    typeof record.name === "string" && record.name.trim().length >= 3 && record.name.trim().length <= 100 &&
    typeof record.code === "string" && /^[A-Z0-9-]{2,20}$/.test(record.code) &&
    typeof record.description === "string" && record.description.trim().length >= 10 && record.description.trim().length <= 1000 &&
    projectStatuses.some((status) => status === record.status) &&
    projectPriorities.some((priority) => priority === record.priority) &&
    isDate(record.startDate) &&
    (record.endDate === null || (isDate(record.endDate) && record.endDate >= record.startDate)) &&
    (record.status !== "completed" || record.endDate !== null) &&
    Number.isSafeInteger(record.ownerId) && Number(record.ownerId) > 0 &&
    Array.isArray(record.memberIds) && record.memberIds.every((id: unknown) => Number.isSafeInteger(id) && Number(id) > 0 && id !== record.ownerId) &&
    new Set(record.memberIds).size === record.memberIds.length &&
    (record.tasks === undefined || (Array.isArray(record.tasks) && record.tasks.every(isProjectTask) && new Set(record.tasks.map((task) => task.id)).size === record.tasks.length && record.tasks.every((task) => task.assigneeId === record.ownerId || (record.memberIds as number[]).includes(task.assigneeId))));
}

