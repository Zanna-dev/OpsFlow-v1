import type { TaskInput, TaskWorkspace, ProjectTask } from "../../interfaces/task.interfaces";
import type { Project } from "../../interfaces/project.interfaces";
import { listEmployees } from "../employees/employeeService";
import { getProject, ProjectNotFoundError } from "../projects/projectService";
import { readProjects, writeProjects, withProjectWriteLock } from "../projects/projectStorage";
import { requirePermission, getDemoRole, getDemoEmployeeId, PermissionError } from "../auth/demoAuthService";

export async function getTaskWorkspace(projectId: number): Promise<TaskWorkspace> {
  const [project, employees] = await Promise.all([getProject(projectId), listEmployees()]);
  return { project, employees };
}
function editable(project: Project) {
  if (project.status === "completed" || project.status === "cancelled") throw new Error("Tasks are read-only while this project is completed or cancelled.");
}
function checkedInput(input: TaskInput, project: Project, employees: TaskWorkspace["employees"]): TaskInput {
  const title = input.title.trim();
  if (title.length < 3 || title.length > 120) throw new Error("Enter a task title between 3 and 120 characters.");
  if (!employees.some((employee) => employee.id === input.assigneeId && employee.active) || (input.assigneeId !== project.ownerId && !project.memberIds.includes(input.assigneeId))) throw new Error("Assign an active employee who owns or belongs to this project.");
  if (input.scheduled !== undefined && typeof input.scheduled !== "boolean") throw new Error("Scheduled must be a yes/no flag.");
  return { title, assigneeId: input.assigneeId, scheduled: input.scheduled ?? false };
}
function findTask(project: Project, taskId: string, revision: number): ProjectTask {
  const task = project.tasks?.find((item) => item.id === taskId);
  if (!task) throw new Error("This task no longer exists. Reload the task list.");
  if (task.revision !== revision) throw new Error("This task changed elsewhere. Discard your draft and reload before editing again.");
  return task;
}
export async function createTask(projectId: number, input: TaskInput): Promise<Project> {
  const employees = await listEmployees();
  return withProjectWriteLock(() => {
    requirePermission("tasks.manage");
    const projects = readProjects() ?? [];
    const project = projects.find((item) => item.id === projectId);
    if (!project) throw new ProjectNotFoundError();
    editable(project);
    const value = checkedInput(input, project, employees);
    const task: ProjectTask = { ...value, id: crypto.randomUUID(), progress: 0, revision: 1, updatedAt: new Date().toISOString() };
    const updated = { ...project, tasks: [...(project.tasks ?? []), task] };
    writeProjects(projects.map((item) => item.id === projectId ? updated : item));
    return updated;
  });
}
export async function updateTaskAssignment(projectId: number, taskId: string, input: TaskInput, revision: number): Promise<Project> {
  const employees = await listEmployees();
  return withProjectWriteLock(() => {
    requirePermission("tasks.manage");
    const projects = readProjects() ?? [];
    const project = projects.find((item) => item.id === projectId);
    if (!project) throw new ProjectNotFoundError();
    editable(project);
    const task = findTask(project, taskId, revision);
    const value = checkedInput(input, project, employees);
    const updated = { ...project, tasks: project.tasks!.map((item) => item.id === taskId ? { ...task, ...value, revision: task.revision + 1, updatedAt: new Date().toISOString() } : item) };
    writeProjects(projects.map((item) => item.id === projectId ? updated : item));
    return updated;
  });
}
export async function updateTaskProgress(projectId: number, taskId: string, progress: number, revision: number): Promise<Project> {
  const employees = await listEmployees();
  return withProjectWriteLock(() => {
    requirePermission("tasks.progress");
    const projects = readProjects() ?? [];
    const project = projects.find((item) => item.id === projectId);
    if (!project) throw new ProjectNotFoundError();
    editable(project);
    const task = findTask(project, taskId, revision);
    if (getDemoRole() === "employee" && (getDemoEmployeeId() !== task.assigneeId || !employees.some((employee) => employee.id === task.assigneeId && employee.active))) throw new PermissionError();
    if (!Number.isInteger(progress) || progress < 0 || progress > 100) throw new Error("Progress must be a whole number from 0 to 100.");
    const updated = { ...project, tasks: project.tasks!.map((item) => item.id === taskId ? { ...task, progress, revision: task.revision + 1, updatedAt: new Date().toISOString() } : item) };
    writeProjects(projects.map((item) => item.id === projectId ? updated : item));
    return updated;
  });
}

