import { requirePermission } from "../auth/demoAuthService";
import type { Project, ProjectDirectoryData } from "../../interfaces/project.interfaces";
import { listEmployees } from "../employees/employeeService";
import { ProjectDependencyError, initializeProjects, readProjects, writeProjects, withProjectWriteLock, readRetiredProjectIdentities, retireProjectIdentity } from "./projectStorage";
import type { ProjectFieldErrors, ProjectCreateInput, ProjectUpdateInput } from "../../types/project.types";
import { generateProjectCode } from "../../utils/generateProjectCode";
import { normalizeProject, validateProject } from "../../validation/project.validation";

export class ProjectValidationError extends Error {
  readonly fieldErrors: ProjectFieldErrors;
  constructor(fieldErrors: ProjectFieldErrors) {
    super("Review the highlighted project fields.");
    this.name = "ProjectValidationError";
    this.fieldErrors = fieldErrors;
  }
}

export class ProjectNotFoundError extends Error {
  constructor() { super("This project no longer exists in the workspace."); this.name = "ProjectNotFoundError"; }
}

export async function getProject(id: number): Promise<Project> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 300));
  const project = readProjects()?.find((record) => record.id === id);
  if (!project) throw new ProjectNotFoundError();
  return project;
}

export async function updateProject(id: number, input: ProjectUpdateInput): Promise<Project> {
  const employees = await listEmployees();
  return withProjectWriteLock(() => {
    requirePermission("projects.edit");
    const projects = readProjects() ?? [];
    const existing = projects.find((project) => project.id === id);
    if (!existing) throw new ProjectNotFoundError();
    // General editing preserves the latest team; ownership is separate from membership.
    const value = normalizeProject({ ...input, code: existing.code, memberIds: existing.memberIds.filter((memberId) => memberId !== input.ownerId) });
    const errors = validateProject(value, employees);
    if (Object.keys(errors).length) throw new ProjectValidationError(errors);
    if (projects.some((project) => project.id !== id && project.code === value.code)) {
      throw new ProjectValidationError({ code: "A project with this code already exists. Choose a different code." });
    }
    const updated: Project = { ...value, id, ...(existing.tasks ? { tasks: existing.tasks } : {}) };
    if (updated.tasks?.some((task) => task.assigneeId !== updated.ownerId && !updated.memberIds.includes(task.assigneeId))) throw new ProjectDependencyError("Reassign tasks belonging to the previous owner before changing project ownership.");
    writeProjects(projects.map((project) => project.id === id ? updated : project));
    return updated;
  });
}

export async function createProject(input: ProjectCreateInput): Promise<Project> {
  // Refresh employees at save time, rather than trusting the form's earlier list.
  const employees = await listEmployees();
  return withProjectWriteLock(() => {
    requirePermission("projects.create");
    const projects = readProjects() ?? [];
    const identities = [...projects, ...readRetiredProjectIdentities()];
    const value = normalizeProject({ ...input, code: generateProjectCode(identities) });
    const errors = validateProject(value, employees);
    if (Object.keys(errors).length) throw new ProjectValidationError(errors);
    if (projects.some((project) => project.code === value.code)) {
      throw new ProjectValidationError({ code: "A project with this code already exists. Choose a different code." });
    }
    const id = identities.reduce((highest, project) => Math.max(highest, project.id), 0) + 1;
    const project: Project = { ...value, id };
    // No await between reading and writing: same-tab submissions see fresh data.
    writeProjects([...projects, project]);
    return project;
  });
}

export async function updateProjectMembers(id: number, memberIds: number[]): Promise<Project> {
  const employees = await listEmployees();
  return withProjectWriteLock(() => {
    requirePermission("projects.assign");
    const projects = readProjects() ?? [];
    const existing = projects.find((project) => project.id === id);
    if (!existing) throw new ProjectNotFoundError();
    const updated: Project = { ...existing, memberIds: [...memberIds] };
    if (updated.tasks?.some((task) => task.assigneeId !== updated.ownerId && !updated.memberIds.includes(task.assigneeId))) throw new ProjectDependencyError("Reassign tasks belonging to this employee before removing them from the team.");
    const errors = validateProject(updated, employees);
    if (Object.keys(errors).length) throw new ProjectValidationError(errors);
    writeProjects(projects.map((project) => project.id === id ? updated : project));
    return updated;
  });
}

export async function getProjectDirectory(): Promise<ProjectDirectoryData> {
  const employees = await listEmployees();
  let projects = readProjects();
  if (projects === null) {
    const owners = employees.filter((employee) => employee.active);
    // Do not invent owners or seed invalid projects when the directory is empty.
    if (owners.length === 0) return { projects: [], employees };
    const seeds: Project[] = [
      { id: 1, name: "Workspace experience", code: "OPS-001", description: "Create a focused workspace that brings people and their work together.", status: "active", priority: "high", startDate: "2026-09-01", endDate: "2026-11-20", ownerId: owners[0].id, memberIds: [] },
      { id: 2, name: "Design system refresh", code: "DS-002", description: "Build a consistent visual language for every product touchpoint.", status: "planning", priority: "medium", startDate: "2026-10-01", endDate: null, ownerId: owners[1 % owners.length].id, memberIds: [] },
      { id: 3, name: "Customer onboarding", code: "CX-003", description: "Simplify the first steps and help new customers reach their first milestone.", status: "active", priority: "critical", startDate: "2026-09-14", endDate: "2026-10-30", ownerId: owners[2 % owners.length].id, memberIds: [] },
      { id: 4, name: "Operations playbook", code: "OPS-004", description: "Document repeatable processes and make shared knowledge easy to find.", status: "completed", priority: "low", startDate: "2026-07-06", endDate: "2026-09-10", ownerId: owners[3 % owners.length].id, memberIds: [] },
      { id: 5, name: "Partner portal", code: "EXT-005", description: "Explore a shared portal for partners and their delivery teams.", status: "cancelled", priority: "medium", startDate: "2026-08-10", endDate: null, ownerId: owners[4 % owners.length].id, memberIds: [] },
      { id: 6, name: "Insights foundation", code: "DATA-006", description: "Define reliable measures of project health and operational progress.", status: "planning", priority: "high", startDate: "2026-10-12", endDate: "2026-12-18", ownerId: owners[0].id, memberIds: [] },
    ];
    projects = await withProjectWriteLock(() => initializeProjects(seeds));
  }
  const employeeIds = new Set(employees.map((employee) => employee.id));
  const activeIds = new Set(employees.filter((employee) => employee.active).map((employee) => employee.id));
  if (projects.some((project) => !activeIds.has(project.ownerId) || project.memberIds.some((id) => !employeeIds.has(id)))) {
    throw new Error("A saved project references a missing employee or inactive owner. Project data has been preserved; restore the employee records before retrying.");
  }
  return { projects, employees };
}

export async function deleteProject(id: number): Promise<void> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 350));
  return withProjectWriteLock(() => {
    requirePermission("projects.delete");
    const projects = readProjects() ?? [];
    const project = projects.find((record) => record.id === id);
    if (!project) throw new ProjectNotFoundError();
    retireProjectIdentity(project);
    writeProjects(projects.filter((record) => record.id !== id));
  });
}



