import { attentionCategories } from "../constants/projectAttentionLabels";
import { matchesProjectAttention } from "./projectAttention";
import type { ProjectDirectoryData } from "../interfaces/project.interfaces";
import type { DashboardData } from "../interfaces/dashboard.interfaces";
import { projectStatuses } from "../constants/projects";

export function summarizeWorkspace({ employees, projects }: ProjectDirectoryData, today: string): DashboardData {
  const open = projects.filter((project) => project.status === "planning" || project.status === "active");
  return {
    attention: attentionCategories.map((category) => ({ category, count: projects.filter((project) => matchesProjectAttention(project, category, today)).length })),
    peopleCount: employees.length,
    activePeopleCount: employees.filter((employee) => employee.active).length,
    projectCount: projects.length,
    openProjectCount: open.length,
    overdueCount: open.filter((project) => matchesProjectAttention(project, "overdue", today)).length,
    statuses: projectStatuses.map((status) => ({ status, count: projects.filter((project) => project.status === status).length })),
    deadlines: open.filter((project) => project.endDate !== null)
      .sort((a, b) => a.endDate!.localeCompare(b.endDate!) || a.id - b.id).slice(0, 5),
    today,
  };
}


