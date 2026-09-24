import { Link } from "react-router-dom";
import { FiArrowLeft, FiPlus, FiRefreshCw } from "react-icons/fi";
import type { TaskWorkspaceProps } from "../../interfaces/task.interfaces";
import { useProjectTasks } from "../../hooks/tasks/useProjectTasks";
import { LoadingSkeleton } from "../common/LoadingSkeleton";
import { Notification } from "../common/Notification";
import { UnsavedChangesDialog } from "../common/UnsavedChangesDialog";
import styles from "../../styles/tasks/ProjectTasks.module.css";

export function ProjectTasks({ projectId }: TaskWorkspaceProps) {
  const { editorRef, ...tasks } = useProjectTasks(projectId);
  const editorPanel = tasks.editor && <form className={styles.editor} onSubmit={tasks.submit} noValidate aria-busy={tasks.saving}>
        <h2 ref={editorRef} tabIndex={-1}>{tasks.editor.mode === "create" ? "Assign project work" : tasks.editor.mode === "progress" ? "Report completion" : "Edit task assignment"}</h2>
        {tasks.editor.mode !== "create" && <p>{tasks.editor.task.title}</p>}
        {tasks.error && <Notification tone="error" title="Unable to save task" message={tasks.error} onClose={tasks.dismissError} />}
        <fieldset disabled={tasks.saving}><legend className="sr-only">Task details</legend>
          {tasks.editor.mode === "progress" ? <><label htmlFor="task-progress">% completion (0–100)</label><div className={styles.progressInput}><input id="task-progress" aria-describedby="task-progress-hint" name="progress" type="number" min={0} max={100} step={1} required value={tasks.progress} onChange={(event) => tasks.setProgress(event.target.value)} /><span aria-hidden="true">%</span></div><p id="task-progress-hint">0% = not started · 100% = complete. Save to apply this update.</p></> : <><label htmlFor="task-title">Task title</label><input id="task-title" name="title" required maxLength={120} value={tasks.title} onChange={(event) => tasks.setTitle(event.target.value)} placeholder="e.g. Prepare the onboarding checklist" /><label htmlFor="task-assignee">Assign to</label><select id="task-assignee" name="assignee" required value={tasks.assigneeId || ""} onChange={(event) => tasks.setAssigneeId(Number(event.target.value))}><option value="">Choose an active project member</option>{tasks.assignees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select><label className={styles.scheduledInput}><input type="checkbox" checked={tasks.scheduled} onChange={(event) => tasks.setScheduled(event.target.checked)} />Scheduled</label><p>Assignees must be the project owner or an active team member. Reassigning a task preserves its progress.</p></>}
        </fieldset>
        <div className={styles.editorActions}><span role="status">{tasks.saving ? "Saving task…" : tasks.dirty ? "Unsaved task changes" : "No unsaved changes"}</span><button type="button" disabled={tasks.saving} onClick={tasks.discard}>{tasks.dirty ? "Discard draft" : "Cancel"}</button><button className={styles.primary} type="submit" disabled={tasks.saving || !tasks.dirty}>{tasks.saving ? "Saving…" : "Save changes"}</button></div>
      </form>;
  return <div className={styles.page}>
    {tasks.navigation.blocker.state === "blocked" && <UnsavedChangesDialog onStay={tasks.navigation.blocker.reset} onDiscard={tasks.navigation.blocker.proceed} submitting={tasks.saving} />}
    {tasks.refresh.confirming && <UnsavedChangesDialog refreshing onStay={tasks.refresh.cancel} onDiscard={tasks.refresh.confirm} submitting={tasks.saving} />}
    {tasks.message && <Notification floating title="Tasks updated" message={tasks.message} onClose={tasks.dismissMessage} />}
    <Link className={styles.back} to={`/projects/${projectId}`}><FiArrowLeft aria-hidden="true" />Project details & team</Link>
    {tasks.state.status === "loading" ? <LoadingSkeleton label="Loading project tasks…" /> : tasks.state.status === "error" ? <section className={styles.panel}><h1>Tasks unavailable</h1><p role="alert">{tasks.state.message}</p><button onClick={tasks.reload}>Try again</button></section> : <>
      <header className={styles.heading}><div><p className={styles.eyebrow}>{tasks.state.data.project.code} / ASSIGNED TASKS</p><h1>{tasks.state.data.project.name}</h1><p>Report completion on work assigned to you. Project cards show the saved completion average.</p></div><button onClick={tasks.refresh.request} disabled={tasks.saving}><FiRefreshCw aria-hidden="true" />Refresh tasks</button></header>
      {tasks.needsIdentity && <p className={styles.notice}>Choose “Act as employee” in the top bar to update your own assigned tasks. This is a demo identity, not a login.</p>}
      {tasks.closed && <p className={styles.notice}>This project is closed. Its task records are available in read-only mode.</p>}
      <div className={styles.sectionHeading}><h2 id="tasks-heading" tabIndex={-1}>Assigned work <span>{tasks.tasks.length}</span></h2>{tasks.canManage && <button className={styles.primary} disabled={!!tasks.editor || tasks.saving} onClick={() => tasks.openEditor({ mode: "create" })}><FiPlus aria-hidden="true" />Assign task</button>}</div>
      {tasks.editor?.mode !== "progress" && editorPanel}
      {tasks.tasks.length === 0 ? <div className={styles.empty}><h3>No assigned tasks to show</h3><p>An Administrator or Manager assigns project work. Employees report completion on their assigned cards.</p></div> : <ul className={styles.list}>{tasks.tasks.map((task) => <li className={styles.task} key={task.id}>
        <div className={styles.taskHeading}><div><span className={styles.status} data-complete={task.progress === 100}>Task status: {task.progress === 0 ? "Not started" : task.progress === 100 ? "Complete" : "In progress"}</span><h3>{task.title}</h3><span className={styles.scheduleFlag}>Scheduled: {task.scheduled ? "Yes" : "No"}</span><p>Assigned to {tasks.state.status === "ready" ? tasks.state.data.employees.find((employee) => employee.id === task.assigneeId)?.name ?? "Unavailable employee" : ""}</p></div><strong>{task.progress}%</strong></div>
        <progress max={100} value={task.progress} aria-label={`${task.title} progress`} />
        {tasks.editor?.mode === "progress" && tasks.editor.task.id === task.id && editorPanel}
        <div className={styles.taskFooter}><small>Updated <time dateTime={task.updatedAt}>{new Date(task.updatedAt).toLocaleString()}</time></small><div>{tasks.canManage && <button disabled={!!tasks.editor || tasks.saving} onClick={() => tasks.openEditor({ mode: "assignment", task })} aria-label={`Edit assignment for ${task.title}`}>Edit assignment</button>}{tasks.canUpdate(task) && <button className={styles.primary} disabled={!!tasks.editor || tasks.saving} onClick={() => tasks.openEditor({ mode: "progress", task })} aria-label={`Update progress for ${task.title}`}>Update % completion</button>}</div></div>
      </li>)}</ul>}
    </>}
  </div>;
}




