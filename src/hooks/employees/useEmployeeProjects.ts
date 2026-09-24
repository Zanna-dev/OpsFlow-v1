import { useEffect, useState } from "react";
import { getEmployeeProjects } from "../../services/employees/employeeProjectService";
import type { EmployeeProjectsState } from "../../types/employeeProfile.types";

export function useEmployeeProjects(id: number) {
  const [state, setState] = useState<EmployeeProjectsState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let current = true;
    getEmployeeProjects(id).then((data) => {
      if (current) setState({ status: "ready", data });
    }).catch((cause: unknown) => {
      if (current) setState({ status: "error", message: cause instanceof Error ? cause.message : "Unable to read project relationships." });
    });
    return () => { current = false; };
  }, [id, attempt]);

  function retry() {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }
  return { state, retry };
}
