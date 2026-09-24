import type { Employee } from "./employee.interfaces";
import type { ProjectTask } from "./task.interfaces";
import type { ProjectStatus } from "../types/project.types";
export interface AssignedTask { task: ProjectTask; projectId: number; projectName: string; projectCode: string; projectStatus: ProjectStatus; }
export interface MyTasksData { employee: Employee; assignments: AssignedTask[]; }
