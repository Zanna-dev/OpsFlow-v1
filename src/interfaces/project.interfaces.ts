import type { ProjectTask } from "./task.interfaces";
import type { ProjectPriority, ProjectStatus, ProjectSortField, SortDirection } from "../types/project.types";
import type { Employee } from "./employee.interfaces";
import type { ReactNode } from "react";

export interface Project {
  tasks?: ProjectTask[];
  id: number;
  name: string;
  code: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate: string | null;
  ownerId: number;
  memberIds: number[];
}

export interface ProjectDirectoryData { projects: Project[]; employees: Employee[]; }
export interface ProjectFilters {
  search: string;
  status: ProjectStatus | "all";
  priority: ProjectPriority | "all";
  owner: string;
  sort: ProjectSortField;
  direction: SortDirection;
}
export interface ProjectCardProps { project: Project; ownerName: string; deleting: boolean; onDelete: (project: Project) => void; }
export interface ProjectFormProps { project?: Project; }
export interface ProjectRecordProps { id: number; }
export interface ProjectTeamProps { project: Project; onRefresh: () => void; }
export interface ProjectFormFieldProps { field: string; label: string; error?: string; children: ReactNode; }

export interface ProjectDeletionOptions { onDeleted: (id: number) => void; }
export interface RetiredProjectIdentity { id: number; code: string; }
export interface ProjectActionsProps { project: Project; deleting: boolean; onDelete: (project: Project) => void; }
export interface ProjectTableProps { projects: Project[]; ownerNames: Map<number, string>; deletingId: number | null; onDelete: (project: Project) => void; }
export interface ProjectFilterChipsProps {
  filters: ProjectFilters;
  ownerNames: Map<number, string>;
  changeFilter: <K extends keyof ProjectFilters>(field: K, value: ProjectFilters[K]) => void;
}

export interface ProjectProgressProps { project: Project; }

