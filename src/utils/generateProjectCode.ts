import type { RetiredProjectIdentity } from "../interfaces/project.interfaces";

export function generateProjectCode(projects: RetiredProjectIdentity[]): string {
  const used = new Set(projects.map((project) => project.code));
  let sequence = 1;
  while (used.has(`PRJ-${String(sequence).padStart(4, "0")}`)) sequence += 1;
  return `PRJ-${String(sequence).padStart(4, "0")}`;
}

