import type { ProjectTask } from "../interfaces/task.interfaces";
export function averageTaskProgress(tasks: ProjectTask[]): number | null {
  return tasks.length ? Math.round(tasks.reduce((total, task) => total + task.progress, 0) / tasks.length) : null;
}
