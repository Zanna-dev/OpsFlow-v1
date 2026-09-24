import { ProjectFilterChips } from "../../components/projects/ProjectFilterChips";
import { ProjectTable } from "../../components/projects/ProjectTable";
import { attentionDescriptions, attentionLabels } from "../../constants/projectAttentionLabels";
import { PermissionGate } from "../../components/common/PermissionGate";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { Notification } from "../../components/common/Notification";
import { Link } from "react-router-dom";
import { FiArrowDown, FiArrowUp, FiLayers, FiSearch, FiGrid, FiList } from "react-icons/fi";
import { useProjects } from "../../hooks/projects/useProjects";
import { ProjectCard } from "../../components/projects/ProjectCard";
import { priorityLabels, projectPriorities, projectStatuses, statusLabels } from "../../constants/projects";
import type { ProjectPriority, ProjectSortField, ProjectStatus } from "../../types/project.types";
import styles from "../../styles/projects/ProjectsPage.module.css";

export function ProjectsPage() {
  const directory = useProjects();
  const { projects, visibleProjects, filters, loading, error, changeFilter, deletion } = directory;
  return <div className={styles.page}>
    {deletion.message && <Notification floating title="Project deleted" message={deletion.message} onClose={deletion.dismissMessage} />}
    {deletion.target && <ConfirmDialog title={`Delete ${deletion.target.name}?`} description={`This permanently removes ${deletion.target.code}, its tasks, and its team assignments. Employee records are kept. To retain project history, cancel this dialog and change the project status to Cancelled instead.`} confirmLabel="Delete project" pendingLabel="Deleting project…" fallbackFocusId="projects-title" pending={deletion.deletingId !== null} error={deletion.error} onConfirm={deletion.confirm} onCancel={deletion.cancel} onDismissError={deletion.dismissError} />}
    <header className={styles.heading}><div><p className={styles.eyebrow}>FROM IDEAS TO IMPACT</p><h1>Make great work happen<span>.</span></h1><p className={styles.subtitle}>A clear view of what’s moving, who’s leading, and what’s next.</p></div><span className={styles.chapter}>02 <small>/ PROJECTS</small></span></header>
    <section className={styles.overview} aria-label="Project summary">
      <div className={styles.spotlight}><span className={styles.eyebrow}>SHARED DIRECTION. REAL PROGRESS.</span><h2>Big ideas deserve<br />a little structure.</h2><a href="#project-directory">Explore your projects <FiArrowDown aria-hidden="true" /></a><FiLayers className={styles.art} aria-hidden="true" /></div>
      <div className={styles.metrics}>
        <div><span>Total projects</span><strong>{loading || error ? "—" : projects.length}</strong></div>
        <div><span>In motion</span><strong>{loading || error ? "—" : directory.activeCount}</strong></div>
        <div><span>Completed</span><strong>{loading || error ? "—" : directory.completedCount}</strong></div>
      </div>
    </section>
    <section id="project-directory" aria-labelledby="projects-title" aria-busy={loading}>
      <div className={styles.sectionHeading}><div><h2 id="projects-title" tabIndex={-1}>Project portfolio</h2><p>One workspace. Every initiative in view.</p></div><PermissionGate permission="projects.create"><Link className={styles.createButton} to="/projects/new">Create project <FiLayers aria-hidden="true" /></Link></PermissionGate></div>
      {directory.attention && <div className={styles.attentionFilter}>
        <div><strong>{attentionLabels[directory.attention]}</strong><p>{attentionDescriptions[directory.attention]} Other filters below also apply.</p></div>
        <button type="button" onClick={directory.clearAttention}>Clear attention filter</button>
      </div>}
      <div className={styles.toolbar}>
        <label className={styles.search}><span>Search projects</span><div><FiSearch aria-hidden="true" /><input type="search" placeholder="Search name or code…" value={filters.search} onChange={(event) => changeFilter("search", event.target.value)} /></div></label>
        <label><span>Status</span><select value={filters.status} onChange={(event) => changeFilter("status", event.target.value as ProjectStatus | "all")}><option value="all">All statuses</option>{projectStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
        <label><span>Priority</span><select value={filters.priority} onChange={(event) => changeFilter("priority", event.target.value as ProjectPriority | "all")}><option value="all">All priorities</option>{projectPriorities.map((priority) => <option key={priority} value={priority}>{priorityLabels[priority]}</option>)}</select></label>
        <label><span>Owner</span><select value={filters.owner} onChange={(event) => changeFilter("owner", event.target.value)}><option value="all">All owners</option>{filters.owner !== "all" && !directory.owners.some((owner) => String(owner.id) === filters.owner) && <option value={filters.owner}>Unavailable owner (#{filters.owner})</option>}{directory.owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name}</option>)}</select></label>
        <label><span>Sort by</span><select value={filters.sort} onChange={(event) => changeFilter("sort", event.target.value as ProjectSortField)}><option value="name">Name</option><option value="startDate">Start date</option><option value="endDate">End date</option><option value="status">Status</option><option value="priority">Priority</option></select></label>
        <button className={styles.direction} onClick={() => changeFilter("direction", filters.direction === "asc" ? "desc" : "asc")} aria-label={`Sort ${filters.direction === "asc" ? "descending" : "ascending"}`} title="Toggle sort direction">{filters.direction === "asc" ? <FiArrowUp /> : <FiArrowDown />}{filters.direction === "asc" ? "Ascending" : "Descending"}</button>
      </div>
      <ProjectFilterChips filters={filters} ownerNames={directory.ownerNames} changeFilter={changeFilter} />
      <div className={styles.viewControls}>
        <div role="group" aria-label="Project display" className={styles.viewSwitch}>
          <button type="button" aria-pressed={directory.view === "cards"} onClick={() => directory.setView("cards")}><FiGrid aria-hidden="true" />Cards</button>
          <button type="button" aria-pressed={directory.view === "table"} onClick={() => directory.setView("table")}><FiList aria-hidden="true" />Table</button>
        </div>
        {directory.hasFilters && <button type="button" className={styles.resetFilters} onClick={directory.clearFilters}>Reset filters & sorting</button>}
      </div>
      {loading ? <div className={styles.message} role="status"><FiLayers aria-hidden="true" /><h3>Bringing your projects into focus…</h3></div> : error ? <div className={styles.message} role="alert"><h3>We couldn’t load your projects</h3><p>{error}</p><button onClick={directory.retry}>Try again</button></div> : projects.length === 0 ? <div className={styles.message}><h3>A little space for your next big idea</h3><p>No projects are available yet.{directory.employees.some((employee) => employee.active) ? " Create a project to give your next initiative a home." : " Add an active employee first so projects can have a valid owner."}</p><Link to="/employees">Go to people</Link></div> : visibleProjects.length === 0 ? <div className={styles.message}><h3>No projects match your filters</h3><p>Try a different name, code, status, priority, or owner.</p><button onClick={directory.clearFilters}>Clear filters</button></div> : directory.view === "table" ? <ProjectTable projects={visibleProjects} ownerNames={directory.ownerNames} deletingId={deletion.deletingId} onDelete={deletion.requestDelete} /> : <div className={styles.grid}>{visibleProjects.map((project) => <ProjectCard key={project.id} project={project} deleting={deletion.deletingId === project.id} onDelete={deletion.requestDelete} ownerName={directory.ownerNames.get(project.ownerId) ?? "Unavailable owner"} />)}</div>}
      {!loading && !error && <p className={styles.resultCount} role="status">Showing {visibleProjects.length} of {projects.length} projects</p>}
    </section>
  </div>;
}










