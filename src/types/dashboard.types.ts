import type { DashboardData } from "../interfaces/dashboard.interfaces";

export type DashboardState =
  | { status: "loading" }
  | { status: "ready"; data: DashboardData }
  | { status: "error"; message: string };
