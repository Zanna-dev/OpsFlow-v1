import type { TaskWorkspace } from "../interfaces/task.interfaces";
export type TaskWorkspaceState = { status: "loading" } | { status: "ready"; data: TaskWorkspace } | { status: "error"; message: string };
import type { ProjectTask } from "../interfaces/task.interfaces";
export type TaskEditor = { mode: "create" } | { mode: "assignment" | "progress"; task: ProjectTask };
