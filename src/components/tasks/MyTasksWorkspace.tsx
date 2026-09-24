import { Link } from "react-router-dom";
import { FiArrowUpRight, FiRefreshCw } from "react-icons/fi";
import { useMyTasks } from "../../hooks/tasks/useMyTasks";
import type { TaskProgressFilter } from "../../types/myTasks.types";
import { statusLabels } from "../../constants/projects";
import { LoadingSkeleton } from "../common/LoadingSkeleton";
import styles from "../../styles/tasks/MyTasks.module.css";
export function MyTasksWorkspace() {
  const queue = useMyTasks();
  return <div className={styles.page}>
    <header className={styles.heading}><div><p className={styles.eyebrow}>YOUR PERSONAL WORK QUEUE</p><h1>My tasks<span>.</span></h1><p>{queue.state.status === "ready" ? `${queue.state.data.employee.name}, here is your assigned work across projects.` : "Your assignments, together in one place."}</p></div><button disabled={queue.state.status === "loading"} onClick={queue.refresh}><FiRefreshCw aria-hidden="true" />Refresh tasks</button></header>
    {queue.state.status === "loading" ? <LoadingSkeleton label="Loading your assigned tasks…" /> : queue.state.status === "error" ? <section className={styles.empty}><h2>Tasks unavailable</h2><p role="alert">{queue.state.message}</p><button onClick={queue.refresh}>Try again</button></section> : <>
      <section className={styles.metrics} aria-label="Assignments on open projects"><div><span>Assigned tasks</span><strong>{queue.openCount}</strong><small>On planning and active projects</small></div><div><span>Tasks completed</span><strong>{queue.completeCount}</strong><small>{queue.openCount - queue.completeCount} still to finish on open projects</small></div><div><span>Open projects</span><strong>{queue.projectCount}</strong><small>With tasks assigned to you</small></div></section>
      <div className={styles.toolbar}><label>Search your work<input type="search" placeholder="Task, project name, or code…" value={queue.search} onChange={(event) => queue.setSearch(event.target.value)} /></label><label>Task progress<select value={queue.filter} onChange={(event) => queue.setFilter(event.target.value as TaskProgressFilter)}><option value="all">All progress</option><option value="not-started">Not started</option><option value="in-progress">In progress</option><option value="complete">Complete</option></select></label><label className={styles.checkbox}><input type="checkbox" checked={queue.includeClosed} onChange={(event) => queue.setIncludeClosed(event.target.checked)} />Include closed projects</label></div>
      <p className={styles.explanation}>Ordered by progress, lowest first. Open a project’s task workspace to save an update. Refresh to include changes made elsewhere.</p>
      {queue.total === 0 ? <section className={styles.empty}><h2>No tasks assigned yet</h2><p>When a Manager or Administrator assigns you a task, it will appear here.</p><Link to="/projects">Explore projects</Link></section> : queue.visible.length === 0 ? <section className={styles.empty}><h2>No tasks match this view</h2><p>Try a different search or progress filter, or include closed projects to view historical assignments.</p><button onClick={queue.reset}>Reset filters</button></section> : <ul className={styles.list}>{queue.visible.map(({ task, projectId, projectName, projectCode, projectStatus }) => <li key={`${projectId}-${task.id}`}>
        <div className={styles.taskHeading}><div><span className={styles.projectCode}>{projectCode} · {statusLabels[projectStatus]}</span><h2>{task.title}</h2><p>{projectName}</p></div><strong>{task.progress}%</strong></div>
        <progress value={task.progress} max={100} aria-label={`${task.title} progress`} />
        <div className={styles.taskFooter}><span>{task.progress === 0 ? "Not started" : task.progress === 100 ? "Complete" : "In progress"}{projectStatus === "completed" || projectStatus === "cancelled" ? " · Read-only project" : ""}</span><Link to={`/projects/${projectId}/tasks`} aria-label={`Open ${projectName} tasks for ${task.title}`}>Open project tasks <FiArrowUpRight aria-hidden="true" /></Link></div>
      </li>)}</ul>}
      <p className={styles.explanation} role="status">Showing {queue.visible.length} of {queue.total} assigned tasks, including history.</p>
    </>}
  </div>;
}
