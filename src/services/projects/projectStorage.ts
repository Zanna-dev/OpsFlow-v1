import type { Project, RetiredProjectIdentity } from "../../interfaces/project.interfaces";
import { isProject } from "../../validation/project.validation";

const storageKey = "opsflow.projects.v1";

export async function withProjectWriteLock<T>(operation: () => T): Promise<T> {
  // Coordinate saves across tabs where the browser supports Web Locks.
  if (typeof navigator !== "undefined" && navigator.locks) {
    return navigator.locks.request("opsflow.projects.write", operation);
  }
  return operation();
}

// Null means never initialized; [] means an intentionally empty workspace.
export function readProjects(): Project[] | null {
  const stored = localStorage.getItem(storageKey);
  if (stored === null) return null;
  try {
    const records: unknown = JSON.parse(stored);
    if (!Array.isArray(records) || !records.every(isProject) ||
      new Set(records.map((project) => project.id)).size !== records.length ||
      new Set(records.map((project) => project.code)).size !== records.length) throw new Error();
    return records;
  } catch {
    throw new Error("The saved projects could not be read. Your data has not been overwritten.");
  }
}

export function initializeProjects(projects: Project[]): Project[] {
  const existing = readProjects();
  if (existing !== null) return existing;
  localStorage.setItem(storageKey, JSON.stringify(projects));
  return projects;
}

export function writeProjects(projects: Project[]): void {
  if (!projects.every(isProject) || new Set(projects.map((project) => project.id)).size !== projects.length || new Set(projects.map((project) => project.code)).size !== projects.length) {
    throw new Error("Invalid project records cannot be saved.");
  }
  localStorage.setItem(storageKey, JSON.stringify(projects));
}

export class ProjectDependencyError extends Error {
  constructor(message: string) { super(message); this.name = "ProjectDependencyError"; }
}

export function assertEmployeeCanBeDeleted(id: number): void {
  const project = readProjects()?.find((record) => record.ownerId === id || record.memberIds.includes(id));
  if (project) throw new ProjectDependencyError(`This employee is assigned to ${project.name} (${project.code}). Remove or reassign their project role before deleting them.`);
}

export function assertEmployeeCanBeDeactivated(id: number): void {
  const project = readProjects()?.find((record) => record.ownerId === id);
  if (project) throw new ProjectDependencyError(`This employee owns ${project.name} (${project.code}). Reassign the project owner before making them inactive.`);
}

const retiredKey = "opsflow.projects.retired.v1";

export function readRetiredProjectIdentities(): RetiredProjectIdentity[] {
  const stored = localStorage.getItem(retiredKey);
  if (stored === null) return [];
  try {
    const records: unknown = JSON.parse(stored);
    if (!Array.isArray(records) || !records.every((record: unknown) => {
      if (!record || typeof record !== "object") return false;
      const identity = record as Record<string, unknown>;
      return Number.isSafeInteger(identity.id) && Number(identity.id) > 0 && typeof identity.code === "string" && /^[A-Z0-9-]{2,20}$/.test(identity.code);
    })) throw new Error();
    return records;
  } catch { throw new Error("Saved project identifiers could not be read. No changes were made."); }
}

export function retireProjectIdentity(project: Project): void {
  const retired = readRetiredProjectIdentities();
  if (retired.some((identity) => identity.id === project.id && identity.code === project.code)) return;
  // Reserve first: if project removal fails, a retry remains safe.
  localStorage.setItem(retiredKey, JSON.stringify([...retired, { id: project.id, code: project.code }]));
}
