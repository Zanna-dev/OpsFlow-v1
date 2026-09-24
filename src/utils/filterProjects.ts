import type { Project, ProjectFilters } from "../interfaces/project.interfaces";
import { projectPriorities, projectStatuses } from "../constants/projects";

export function filterProjects(projects: Project[], filters: ProjectFilters): Project[] {
  const query = filters.search.trim().toLowerCase();
  return projects.filter((project) =>
    (project.name.toLowerCase().includes(query) || project.code.toLowerCase().includes(query)) &&
    (filters.status === "all" || project.status === filters.status) &&
    (filters.priority === "all" || project.priority === filters.priority) &&
    (filters.owner === "all" || project.ownerId === Number(filters.owner)),
  ).sort((a, b) => {
    // Missing end dates stay last in both directions.
    if (filters.sort === "endDate" && (a.endDate === null || b.endDate === null)) {
      if (a.endDate !== b.endDate) return a.endDate === null ? 1 : -1;
    }
    const compared = filters.sort === "priority" ? projectPriorities.indexOf(a.priority) - projectPriorities.indexOf(b.priority) :
      filters.sort === "status" ? projectStatuses.indexOf(a.status) - projectStatuses.indexOf(b.status) :
      (a[filters.sort] ?? "").localeCompare(b[filters.sort] ?? "");
    return compared * (filters.direction === "asc" ? 1 : -1) || a.name.localeCompare(b.name) || a.id - b.id;
  });
}
