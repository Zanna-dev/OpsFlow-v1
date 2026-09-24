import type { Employee } from "./employee.interfaces";
import type { Project } from "./project.interfaces";

export interface EmployeeProjects {
  ownedProjects: Project[];
  memberProjects: Project[];
}

export interface EmployeeProfileProps { employee: Employee; }
export interface EmployeeProjectListProps {
  title: string;
  description: string;
  projects: Project[];
  emptyMessage: string;
}
