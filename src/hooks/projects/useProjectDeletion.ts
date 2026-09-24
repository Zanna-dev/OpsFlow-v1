import { useRef, useState } from "react";
import type { Project, ProjectDeletionOptions } from "../../interfaces/project.interfaces";
import { deleteProject, ProjectNotFoundError } from "../../services/projects/projectService";

export function useProjectDeletion({ onDeleted }: ProjectDeletionOptions) {
  const [target, setTarget] = useState<Project | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const saving = useRef(false);
  function requestDelete(project: Project) {
    if (saving.current) return;
    setTarget(project); setError(""); setMessage("");
  }
  function cancel() { if (!saving.current) { setTarget(null); setError(""); } }
  async function confirm() {
    if (!target || saving.current) return;
    saving.current = true; setDeletingId(target.id); setError("");
    try {
      await deleteProject(target.id);
      onDeleted(target.id); setTarget(null);
      setMessage(`${target.name} was deleted. Employee records were kept.`);
    } catch (cause) {
      setError(cause instanceof ProjectNotFoundError
        ? "This project no longer exists in storage. Cancel and reload the directory to see current records."
        : "We couldn’t delete this project. It has been kept in the directory. Check browser storage access and try again.");
    } finally { saving.current = false; setDeletingId(null); }
  }
  return { target, deletingId, error, message, requestDelete, cancel, confirm, dismissError: () => setError(""), dismissMessage: () => setMessage("") };
}
