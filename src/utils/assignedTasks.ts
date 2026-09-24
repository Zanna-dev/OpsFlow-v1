import type { Project } from "../interfaces/project.interfaces";
import type { AssignedTask } from "../interfaces/myTasks.interfaces";
import type { TaskProgressFilter } from "../types/myTasks.types";
export function collectAssignedTasks(projects: Project[], employeeId: number): AssignedTask[] {
  return projects.flatMap((project) => (project.tasks ?? []).filter((task) => task.assigneeId === employeeId).map((task) => ({ task, projectId: project.id, projectName: project.name, projectCode: project.code, projectStatus: project.status })))
    .sort((a, b) => a.task.progress - b.task.progress || a.projectName.localeCompare(b.projectName) || a.task.title.localeCompare(b.task.title) || a.task.id.localeCompare(b.task.id));
}
export function filterAssignedTasks(assignments: AssignedTask[], search: string, filter: TaskProgressFilter, includeClosed: boolean): AssignedTask[] {
  const query = search.trim().toLowerCase();
  return assignments.filter(({ task, projectName, projectCode, projectStatus }) =>
    (includeClosed || projectStatus === "active" || projectStatus === "planning") &&
    (!query || [task.title, projectName, projectCode].some((text) => text.toLowerCase().includes(query))) &&
    (filter === "all" || (filter === "not-started" ? task.progress === 0 : filter === "complete" ? task.progress === 100 : task.progress > 0 && task.progress < 100)));
}
