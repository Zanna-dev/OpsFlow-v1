import type { ProjectFilters } from "../interfaces/project.interfaces";
import { projectPriorities, projectStatuses } from "../constants/projects";
import type { ProjectSortField, ProjectView } from "../types/project.types";

export const defaultProjectFilters: ProjectFilters = { search: "", status: "all", priority: "all", owner: "all", sort: "name", direction: "asc" };
const sortFields: ProjectSortField[] = ["name", "startDate", "endDate", "status", "priority"];
export function readProjectFilters(params: URLSearchParams): ProjectFilters {
  const owner = params.get("owner") ?? "all";
  return {
    search: params.get("search") ?? "",
    status: projectStatuses.find((value) => value === params.get("status")) ?? "all",
    priority: projectPriorities.find((value) => value === params.get("priority")) ?? "all",
    owner: /^[1-9]\d*$/.test(owner) && Number.isSafeInteger(Number(owner)) ? owner : "all",
    sort: sortFields.find((value) => value === params.get("sort")) ?? "name",
    direction: params.get("direction") === "desc" ? "desc" : "asc",
  };
}
export function readProjectView(params: URLSearchParams): ProjectView { return params.get("view") === "table" ? "table" : "cards"; }
export function updateProjectQuery(params: URLSearchParams, key: keyof ProjectFilters | "view", value: string): URLSearchParams {
  const next = new URLSearchParams(params);
  const fallback = key === "view" ? "cards" : defaultProjectFilters[key];
  if (value === fallback) next.delete(key); else next.set(key, value);
  return next;
}
export function resetProjectQuery(params: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(params);
  [...Object.keys(defaultProjectFilters), "attention"].forEach((key) => next.delete(key));
  return next;
}
