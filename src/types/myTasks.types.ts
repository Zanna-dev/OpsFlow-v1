import type { MyTasksData } from "../interfaces/myTasks.interfaces";
export type TaskProgressFilter = "all" | "not-started" | "in-progress" | "complete";
export type MyTasksState = { status: "loading" } | { status: "ready"; data: MyTasksData } | { status: "error"; message: string };
