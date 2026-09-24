import { useEffect, useState } from "react";
import { getMyTasks } from "../../services/tasks/myTasksService";
import type { MyTasksState, TaskProgressFilter } from "../../types/myTasks.types";
import { filterAssignedTasks } from "../../utils/assignedTasks";
export function useMyTasks() {
  const [state, setState] = useState<MyTasksState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<TaskProgressFilter>("all");
  const [includeClosed, setIncludeClosed] = useState(false);
  useEffect(() => {
    let current = true;
    getMyTasks().then((data) => { if (current) setState({ status: "ready", data }); })
      .catch((cause: unknown) => { if (current) setState({ status: "error", message: cause instanceof Error ? cause.message : "Unable to load your tasks." }); });
    return () => { current = false; };
  }, [attempt]);
  function refresh() { setState({ status: "loading" }); setAttempt((value) => value + 1); }
  const assignments = state.status === "ready" ? state.data.assignments : [];
  const open = assignments.filter((item) => item.projectStatus === "planning" || item.projectStatus === "active");
  return { state, search, setSearch, filter, setFilter, includeClosed, setIncludeClosed, refresh,
    visible: filterAssignedTasks(assignments, search, filter, includeClosed), total: assignments.length,
    openCount: open.length, completeCount: open.filter((item) => item.task.progress === 100).length,
    projectCount: new Set(open.map((item) => item.projectId)).size,
    reset: () => { setSearch(""); setFilter("all"); setIncludeClosed(false); } };
}
