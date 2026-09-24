import type { Employee } from "./employee.interfaces";
import type { Project } from "./project.interfaces";
export interface ProjectTask { scheduled?: boolean; id: string; title: string; assigneeId: number; progress: number; updatedAt: string; revision: number; }
export interface TaskInput { scheduled?: boolean; title: string; assigneeId: number; }
export interface TaskWorkspace { project: Project; employees: Employee[]; }
export interface TaskWorkspaceProps { projectId: number; }

