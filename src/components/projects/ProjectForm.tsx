import { UnsavedChangesDialog } from "../common/UnsavedChangesDialog";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowUpRight, FiLayers, FiFlag } from "react-icons/fi";
import { useProjectForm } from "../../hooks/projects/useProjectForm";
import { priorityLabels, projectPriorities, projectStatuses, statusLabels } from "../../constants/projects";
import type { ProjectPriority, ProjectStatus } from "../../types/project.types";
import { Notification } from "../common/Notification";
import { ProjectFormField } from "./ProjectFormField";
import styles from "../../styles/projects/ProjectForm.module.css";
import type { ProjectFormProps } from "../../interfaces/project.interfaces";

export function ProjectForm({ project }: ProjectFormProps) {
  const form = useProjectForm(project);
  const { values, errors, ownerSource } = form;
  return <div className={styles.page}>
    {form.navigation.blocker.state === "blocked" && <UnsavedChangesDialog onStay={form.navigation.blocker.reset} onDiscard={form.navigation.blocker.proceed} submitting={form.submitting} />}
    <Link to="/projects" className={styles.back}><FiArrowLeft /> Back to projects</Link>
    <p className={styles.eyebrow}>{project ? "PROJECTS / EDIT INITIATIVE" : "PROJECTS / NEW INITIATIVE"}</p>
    <h1>{project ? "Keep great work moving" : "Give your next idea direction"}<span>.</span></h1>
    <p className={styles.subtitle}>{project ? "Refine the brief, update the timeline, or hand over ownership." : "A clear brief. The right owner. A shared starting point."}</p>
    <div className={styles.layout}>
      <form onSubmit={form.submit} className={styles.form} noValidate aria-busy={form.submitting}>
        {form.error && <Notification tone="error" message={form.error} onClose={form.dismissError} />}
        <fieldset disabled={form.submitting}>
          <legend><span>01</span> Project details</legend>
          <p className={styles.hint}>Give your project a recognizable name. Its unique code is managed automatically.</p>
          <ProjectFormField field="name" label="Project name" error={errors.name}>
            <input {...form.fieldProps("name")} required value={values.name} onChange={(event) => form.change("name", event.target.value)} placeholder="e.g. Customer onboarding" />
          </ProjectFormField>
          <ProjectFormField field="code" label="Project code" error={errors.code}>
            <input id="project-code" name="code" disabled value={values.code} placeholder="Generated automatically when saved" aria-describedby="project-code-hint" />
            <p id="project-code-hint" className={styles.hint}>{project ? "This code permanently identifies the project and cannot be edited." : "A unique code, such as PRJ-0001, will be assigned when you create the project."}</p>
          </ProjectFormField>
          <ProjectFormField field="description" label="Description" error={errors.description}>
            <textarea {...form.fieldProps("description")} required rows={5} value={values.description} onChange={(event) => form.change("description", event.target.value)} placeholder="What will this project achieve? Describe the outcome and scope." />
            <span className={styles.counter}>{values.description.trim().length} / 1,000 characters</span>
          </ProjectFormField>
        </fieldset>
        <fieldset disabled={form.submitting}>
          <legend><span>02</span> Delivery settings</legend>
          <p className={styles.hint}>Set the priority, current stage, and expected timeline.</p>
          <div className={styles.row}>
            <ProjectFormField field="status" label="Status" error={errors.status}><select {...form.fieldProps("status")} required value={values.status} onChange={(event) => form.change("status", event.target.value as ProjectStatus)}>{projectStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></ProjectFormField>
            <ProjectFormField field="priority" label="Priority" error={errors.priority}><select {...form.fieldProps("priority")} required value={values.priority} onChange={(event) => form.change("priority", event.target.value as ProjectPriority)}>{projectPriorities.map((priority) => <option key={priority} value={priority}>{priorityLabels[priority]}</option>)}</select></ProjectFormField>
          </div>
          <div className={styles.row}>
            <ProjectFormField field="startDate" label="Start date" error={errors.startDate}><input {...form.fieldProps("startDate")} type="date" required value={values.startDate} onChange={(event) => form.change("startDate", event.target.value)} /></ProjectFormField>
            <ProjectFormField field="endDate" label={values.status === "completed" ? "End date (required)" : "End date (optional)"} error={errors.endDate}><input {...form.fieldProps("endDate")} type="date" required={values.status === "completed"} min={values.startDate || undefined} value={values.endDate ?? ""} onChange={(event) => form.change("endDate", event.target.value || null)} /></ProjectFormField>
          </div>
          {values.status === "cancelled" && <p className={styles.hint}>Cancelled projects remain in the directory as a record of past work.</p>}
        </fieldset>
        <fieldset disabled={form.submitting || ownerSource.loading || !!ownerSource.error}>
          <legend><span>03</span> Ownership</legend>
          <p className={styles.hint}>Choose an active employee to lead the project.</p>
          {project && <p className={styles.hint}>Team assignments are preserved. A team member selected as owner moves out of the member list; the previous owner is not automatically added to the team.</p>}
          {ownerSource.loading ? <p role="status" className={styles.hint}>Loading available owners…</p> : !ownerSource.error && ownerSource.owners.length === 0 ? <div className={styles.empty}><p>No active employees are available to own a project.</p><Link to="/employees/new">Add an employee</Link></div> : null}
          <ProjectFormField field="ownerId" label="Project owner" error={errors.ownerId}><select {...form.fieldProps("ownerId")} required value={values.ownerId || ""} onChange={(event) => form.change("ownerId", Number(event.target.value))}><option value="">Select an active employee</option>{ownerSource.owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name} · {owner.department}</option>)}</select></ProjectFormField>
        </fieldset>
        {ownerSource.error && <div className={styles.empty}><p role="alert">{ownerSource.error}</p><button type="button" onClick={ownerSource.retry}>Retry loading owners</button></div>}
        <p className={styles.draftStatus} role="status">{form.submitting ? "Saving your changes…" : form.dirty ? "Unsaved changes · save before leaving" : "No unsaved changes"}</p>
        <div className={styles.actions}><button type="button" disabled={form.submitting} onClick={form.cancel}>Cancel</button><button type="submit" disabled={form.submitting || ownerSource.loading || !!ownerSource.error || ownerSource.owners.length === 0}>{form.submitting ? "Saving project…" : project ? "Save changes" : "Create project"}<FiArrowUpRight /></button></div>
        <span className="sr-only" role="status">{form.submitting ? "Saving project. Please wait." : ""}</span>
      </form>
      <aside className={styles.summary} aria-label="Project draft summary">
        <FiLayers className={styles.summaryIcon} aria-hidden="true" />
        <p className={styles.eyebrow}>YOUR NEXT CHAPTER</p>
        <h2>{values.name.trim() || "Something great starts here."}</h2>
        <span className={styles.code}>{values.code || "CODE ASSIGNED ON SAVE"}</span>
        <dl><div><dt>Status</dt><dd>{statusLabels[values.status]}</dd></div><div><dt><FiFlag aria-hidden="true" /> Priority</dt><dd>{priorityLabels[values.priority]}</dd></div><div><dt>Owner</dt><dd>{form.ownerName}</dd></div></dl>
        <p className={styles.summaryNote}>Saved in your demo workspace, in this browser. Saving a project does not send invitations or notifications to employees.</p>
      </aside>
    </div>
  </div>;
}

