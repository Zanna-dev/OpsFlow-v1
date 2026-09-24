import { getEmployee } from "./employeeService";
import { readProjects } from "../projects/projectStorage";
import type { EmployeeProjects } from "../../interfaces/employeeProfile.interfaces";

export async function getEmployeeProjects(id: number): Promise<EmployeeProjects> {
  await getEmployee(id);
  // Reading a profile must not initialize the sample project portfolio.
  const projects = (readProjects() ?? []).sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id);
  return {
    ownedProjects: projects.filter((project) => project.ownerId === id),
    memberProjects: projects.filter((project) => project.memberIds.includes(id)),
  };
}
