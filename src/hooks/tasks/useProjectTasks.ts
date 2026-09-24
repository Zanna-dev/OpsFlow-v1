import { useRefreshConfirmation } from "../common/useRefreshConfirmation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createTask, getTaskWorkspace, updateTaskAssignment, updateTaskProgress } from "../../services/tasks/taskService";
import type { ProjectTask } from "../../interfaces/task.interfaces";
import type { TaskEditor, TaskWorkspaceState } from "../../types/task.types";
import { useUnsavedChanges } from "../common/useUnsavedChanges";
import { useAuth } from "../auth/useAuth";
import { averageTaskProgress } from "../../utils/taskProgress";

export function useProjectTasks(projectId: number) {
  const auth = useAuth();
  const [state, setState] = useState<TaskWorkspaceState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const [editor, setEditor] = useState<TaskEditor | null>(null);
  const [title, setTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState(0);
  const [scheduled, setScheduled] = useState(false);
  const [progress, setProgress] = useState("0");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const inFlight = useRef(false);
  const editorRef = useRef<HTMLHeadingElement>(null);
  const dirty = editor !== null && (editor.mode === "create" ? title !== "" || assigneeId !== 0 || scheduled : editor.mode === "progress" ? progress !== String(editor.task.progress) : title !== editor.task.title || assigneeId !== editor.task.assigneeId || scheduled !== (editor.task.scheduled ?? false));
  const navigation = useUnsavedChanges(dirty, saving);
  useEffect(() => {
    let current = true;
    getTaskWorkspace(projectId).then((data) => { if (current) setState({ status: "ready", data }); })
      .catch((cause: unknown) => { if (current) setState({ status: "error", message: cause instanceof Error ? cause.message : "Unable to load tasks." }); });
    return () => { current = false; };
  }, [projectId, attempt]);
  useEffect(() => {
    if (editor) editorRef.current?.focus();
    else document.getElementById("tasks-heading")?.focus();
  }, [editor]);
  const data = state.status === "ready" ? state.data : null;
  const tasks = data?.project.tasks ?? [];
  const closed = data?.project.status === "completed" || data?.project.status === "cancelled";
  const assignees = data?.employees.filter((employee) => employee.active && (employee.id === data.project.ownerId || data.project.memberIds.includes(employee.id))) ?? [];
  function canUpdate(task: ProjectTask) {
    return !closed && auth.can("tasks.progress") && (auth.role !== "employee" || (auth.employeeId === task.assigneeId && !!data?.employees.some((employee) => employee.id === auth.employeeId && employee.active)));
  }
  function openEditor(next: TaskEditor) {
    if (editor || inFlight.current || closed) return;
    if (next.mode === "progress" ? !canUpdate(next.task) : !auth.can("tasks.manage")) return;
    setEditor(next); setTitle(next.mode === "create" ? "" : next.task.title);
    setAssigneeId(next.mode === "create" ? 0 : next.task.assigneeId);
    setScheduled(next.mode === "create" ? false : next.task.scheduled ?? false);
    setProgress(next.mode === "create" ? "0" : String(next.task.progress)); setError("");
  }
  function discard() { if (!inFlight.current) { setEditor(null); setError(""); } }
  function reload() {
    if (inFlight.current) return;
    setEditor(null); setTitle(""); setAssigneeId(0); setScheduled(false); setProgress("0"); setError(""); setMessage(""); setState({ status: "loading" }); setAttempt((value) => value + 1);
  }
  const refresh = useRefreshConfirmation(dirty, saving, reload);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editor || inFlight.current || !data) return;
    const form = event.currentTarget;
    if (editor.mode === "progress" && (progress.trim() === "" || !Number.isInteger(Number(progress)) || Number(progress) < 0 || Number(progress) > 100)) {
      setError("Enter a whole-number percentage between 0 and 100."); (form.elements.namedItem("progress") as HTMLElement)?.focus(); return;
    }
    if (editor.mode !== "progress" && (title.trim().length < 3 || title.trim().length > 120 || !assignees.some((person) => person.id === assigneeId))) {
      setError("Enter a title of 3–120 characters and select an active project assignee.");
      (form.elements.namedItem(title.trim().length < 3 || title.trim().length > 120 ? "title" : "assignee") as HTMLElement | null)?.focus(); return;
    }
    inFlight.current = true; setSaving(true); setError(""); setMessage("");
    try {
      const project = editor.mode === "create" ? await createTask(projectId, { title, assigneeId, scheduled }) : editor.mode === "assignment" ? await updateTaskAssignment(projectId, editor.task.id, { title, assigneeId, scheduled }, editor.task.revision) : await updateTaskProgress(projectId, editor.task.id, Number(progress), editor.task.revision);
      setState({ status: "ready", data: { ...data, project } }); setEditor(null);
      setMessage(editor.mode === "create" ? "Task created and assigned." : editor.mode === "progress" ? "Task progress saved." : "Task assignment updated.");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to save. Your draft is still here."); }
    finally { inFlight.current = false; setSaving(false); }
  }
  return { refresh, state, tasks: auth.role === "employee" ? tasks.filter((task) => task.assigneeId === auth.employeeId) : tasks, scheduled, setScheduled, average: averageTaskProgress(tasks), closed, assignees, editor, editorRef, title, setTitle, assigneeId, setAssigneeId, progress, setProgress, saving, dirty, navigation, error, message, openEditor, discard, reload, submit, canUpdate,
    canManage: auth.can("tasks.manage") && !closed, needsIdentity: auth.role === "employee" && auth.employeeId === null,
    dismissError: () => setError(""), dismissMessage: () => setMessage("") };
}



