import { defaultProjectFilters, readProjectFilters, readProjectView, updateProjectQuery, resetProjectQuery } from "../../utils/projectQuery";
import type { ProjectView } from "../../types/project.types";
import { useSearchParams } from "react-router-dom";
import { getLocalDay, matchesProjectAttention, parseProjectAttention } from "../../utils/projectAttention";
import { useProjectDeletion } from "./useProjectDeletion";
import { useEffect, useState } from "react";
import type { ProjectDirectoryData, ProjectFilters } from "../../interfaces/project.interfaces";
import { getProjectDirectory } from "../../services/projects/projectService";
import { filterProjects } from "../../utils/filterProjects";


export function useProjects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const attention = parseProjectAttention(searchParams.get("attention"));
  const today = getLocalDay();
  const [data, setData] = useState<ProjectDirectoryData>({ projects: [], employees: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const filters = readProjectFilters(searchParams);
  const view = readProjectView(searchParams);
  const deletion = useProjectDeletion({ onDeleted: (id) => {
    setData((previous) => ({ ...previous, projects: previous.projects.filter((project) => project.id !== id) }));
  } });

  useEffect(() => {
    let current = true;
    getProjectDirectory().then((result) => { if (current) setData(result); })
      .catch((cause: unknown) => { if (current) setError(cause instanceof Error ? cause.message : "Unable to load projects. Please try again."); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [attempt]);

  function retry() { setError(""); setLoading(true); setAttempt((value) => value + 1); }
  function changeFilter<K extends keyof ProjectFilters>(field: K, value: ProjectFilters[K]) {
    setSearchParams((current) => updateProjectQuery(current, field, value), { replace: field === "search" });
  }

  const ownerIds = new Set(data.projects.map((project) => project.ownerId));
  return {
    ...data, loading, error, retry, filters, changeFilter, deletion,
    attention, view,
    setView: (next: ProjectView) => setSearchParams((current) => updateProjectQuery(current, "view", next)),
    hasFilters: attention !== null || Object.keys(defaultProjectFilters).some((key) => filters[key as keyof ProjectFilters] !== defaultProjectFilters[key as keyof ProjectFilters]),
    clearAttention: () => setSearchParams((current) => { const next = new URLSearchParams(current); next.delete("attention"); return next; }),
    clearFilters: () => setSearchParams((current) => resetProjectQuery(current)),
    visibleProjects: filterProjects(data.projects, filters).filter((project) => !attention || matchesProjectAttention(project, attention, today)),
    owners: data.employees.filter((employee) => ownerIds.has(employee.id) || String(employee.id) === filters.owner).sort((a, b) => a.name.localeCompare(b.name)),
    ownerNames: new Map(data.employees.map((employee) => [employee.id, employee.name])),
    activeCount: data.projects.filter((project) => project.status === "active").length,
    completedCount: data.projects.filter((project) => project.status === "completed").length,
  };
}



