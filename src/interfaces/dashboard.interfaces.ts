import type { ProjectAttention } from "../types/projectAttention.types";
import type { Project } from "./project.interfaces";
import type { ProjectStatus } from "../types/project.types";

export interface DashboardData {
  attention: { category: ProjectAttention; count: number }[];
  peopleCount: number;
  activePeopleCount: number;
  projectCount: number;
  openProjectCount: number;
  overdueCount: number;
  statuses: { status: ProjectStatus; count: number }[];
  deadlines: Project[];
  today: string;
}
export interface DashboardPanelProps { data: DashboardData; }

