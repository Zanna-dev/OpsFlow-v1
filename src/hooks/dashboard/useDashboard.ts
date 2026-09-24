import { useEffect, useState } from "react";
import { getDashboard } from "../../services/dashboard/dashboardService";
import type { DashboardState } from "../../types/dashboard.types";

export function useDashboard() {
  const [state, setState] = useState<DashboardState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let current = true;
    getDashboard().then((data) => {
      if (current) setState({ status: "ready", data });
    }).catch((cause: unknown) => {
      if (current) setState({ status: "error", message: cause instanceof Error ? cause.message : "Unable to load your workspace." });
    });
    return () => { current = false; };
  }, [attempt]);
  function refresh() {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }
  return { state, refresh };
}
