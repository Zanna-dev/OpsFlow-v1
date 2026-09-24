import { useEffect, useState } from "react";
import type { ProjectRecordState } from "../../types/project.types";
import { getProject, ProjectNotFoundError } from "../../services/projects/projectService";

export function useProjectRecord(id: number) {
  const [state, setState] = useState<ProjectRecordState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let current = true;
    getProject(id).then((project) => { if (current) setState({ status: "ready", project }); })
      .catch((cause: unknown) => { if (current) setState({ status: cause instanceof ProjectNotFoundError ? "missing" : "error" }); });
    return () => { current = false; };
  }, [id, attempt]);
  function retry() { setState({ status: "loading" }); setAttempt((value) => value + 1); }
  return { state, retry };
}
