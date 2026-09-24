import { UnsavedChangesDialog } from "../common/UnsavedChangesDialog";
import { LoadingSkeleton } from "../common/LoadingSkeleton";
import { useAuth } from "../../hooks/auth/useAuth";
import { PermissionGate } from "../common/PermissionGate";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiSearch, FiUsers, FiX } from "react-icons/fi";
import type { ProjectTeamProps } from "../../interfaces/project.interfaces";
import { useProjectTeam } from "../../hooks/projects/useProjectTeam";
import { statusLabels, priorityLabels } from "../../constants/projects";
import { formatProjectDate } from "../../utils/formatProjectDate";
import { getInitials } from "../../utils/getInitials";
import { Notification } from "../common/Notification";
import styles from "../../styles/projects/ProjectTeam.module.css";

export function ProjectTeam({ project, onRefresh }: ProjectTeamProps) {
  const { can } = useAuth();
  const canAssign = can("projects.assign");
  const team = useProjectTeam(project, onRefresh);
  return <div className={styles.page}>
    {team.navigation.blocker.state === "blocked" && <UnsavedChangesDialog onStay={team.navigation.blocker.reset} onDiscard={team.navigation.blocker.proceed} submitting={team.saving} />}
    {team.refresh.confirming && <UnsavedChangesDialog refreshing onStay={team.refresh.cancel} onDiscard={team.refresh.confirm} submitting={team.saving} />}
    {team.message && <Notification floating title="Team updated" message={team.message} onClose={team.dismissMessage} />}
    <Link to="/projects" className={styles.back}><FiArrowLeft /> Back to projects</Link>
    <header className={styles.header}>
      <div><p className={styles.eyebrow}>{team.project.code} / PROJECT DETAILS</p><h1>{team.project.name}</h1><p className={styles.description}>{team.project.description}</p></div>
      <Link className={styles.edit} to={`/projects/${team.project.id}/tasks`}>Assigned task cards</Link>
      <PermissionGate permission="projects.edit"><Link className={styles.edit} to={`/projects/${team.project.id}/edit`}><FiEdit2 /> Edit project</Link></PermissionGate>
    </header>
    <div className={styles.refreshRow}><button type="button" onClick={team.refresh.request} disabled={team.saving || team.people.loading}>Refresh saved team</button><span>Reloads saved assignments and the employee directory.</span></div>
    <dl className={styles.facts}><div><dt>Status</dt><dd>{statusLabels[team.project.status]}</dd></div><div><dt>Priority</dt><dd>{priorityLabels[team.project.priority]}</dd></div><div><dt>Start date</dt><dd>{formatProjectDate(team.project.startDate)}</dd></div><div><dt>End date</dt><dd>{formatProjectDate(team.project.endDate)}</dd></div></dl>
    <section className={styles.workspace} aria-labelledby="team-heading" aria-busy={team.people.loading || team.saving}>
      <div className={styles.sectionHeader}><div><p className={styles.eyebrow}>THE PEOPLE BEHIND THE WORK</p><h2 id="team-heading">Build the right team<span>.</span></h2><p>{canAssign ? "Select employees, then save to apply your changes. Removing an assignment keeps the employee record." : "View the project owner and saved team. Your role has read-only access."}</p></div><FiUsers aria-hidden="true" /></div>
      {team.people.loading ? <LoadingSkeleton label="Loading the team directory…" /> : team.people.error ? <div className={styles.state}><p role="alert">{team.people.error}</p><button onClick={team.people.retry}>Try again</button></div> : <>
        <div className={styles.owner}><span className={styles.avatar}>{getInitials(team.owner?.name ?? "?")}</span><div><span>PROJECT OWNER</span><strong>{team.owner?.name ?? "Owner unavailable"}</strong><small>{team.owner ? `${team.owner.department} · ${team.owner.active ? "Active" : "Inactive"}` : "Choose an active owner using Edit project."}</small></div><span className={styles.ownerTag}>Separate from members</span></div>
        {team.error && <Notification tone="error" title="Unable to update team" message={team.error} onClose={team.dismissError} />}
        <div className={styles.selection}>
          <div className={styles.selectionHeading}><h3>Selected members <span>{team.memberIds.length}</span></h3><span>{team.dirty ? "Unsaved changes" : "Saved team"}</span></div>
          {team.members.length === 0 ? <p className={styles.hint}>No team members assigned yet.</p> : <ul className={styles.chips}>{team.members.map((member) => <li key={member.id}><span>{member.name}</span><button type="button" disabled={team.saving || !canAssign} onClick={() => team.toggleMember(member.id)} aria-label={`Remove ${member.name} from selected team`}><FiX /></button></li>)}</ul>}
        </div>
        <p className={styles.hint}>Selected names move out of the available list. Remove a selected member to return them to the list.</p>
        <span className="sr-only" role="status">{team.selectionAnnouncement}</span>
        <label className={styles.search}><span>Available employees ({team.availableCount})</span><div><FiSearch aria-hidden="true" /><input id="team-employee-search" type="search" value={team.search} onChange={(event) => team.setSearch(event.target.value)} placeholder="Search by name or email…" /></div></label>
        <fieldset className={styles.people}>
          <legend className="sr-only">Choose project team members</legend>
          {team.eligibleCount === 0 ? <p className={styles.state}>No other employees are available. <PermissionGate permission="employees.manage"><Link to="/employees/new">Add an employee</Link> to grow the team.</PermissionGate></p> : team.availableCount === 0 ? <p className={styles.state}>All available employees are selected. Remove a selected member to make them available again.</p> : team.visibleEmployees.length === 0 ? <div className={styles.state}><p>No unselected employees match this search.</p><button type="button" onClick={() => team.setSearch("")}>Clear search</button></div> : team.visibleEmployees.map((employee) => <label className={styles.person} data-selected={team.memberIds.includes(employee.id)} data-readonly={!canAssign} key={employee.id}><input type="checkbox" disabled={team.saving || !canAssign} checked={team.memberIds.includes(employee.id)} onChange={() => team.toggleMember(employee.id)} /><span className={styles.avatar} aria-hidden="true">{getInitials(employee.name)}</span><span className={styles.personText}><strong>{employee.name}</strong><small>{employee.email}</small></span><span className={styles.department}>{employee.department}</span><span className={styles.status} data-active={employee.active}>{employee.active ? "Active" : "Inactive"}</span></label>)}
        </fieldset>
        <p className={styles.hint}>Inactive employees are labelled and may remain team members. Only active employees can own projects.</p>
        <div className={styles.actions} data-dirty={team.dirty}><span role="status">{team.saving ? "Saving team…" : team.dirty ? "Your changes have not been saved." : `${team.project.memberIds.length} saved team members`}</span><button type="button" onClick={team.discard} disabled={team.saving || !team.dirty || !canAssign}>Discard changes</button><button type="button" className={styles.save} onClick={team.save} disabled={team.saving || !team.dirty || !canAssign}>{team.saving ? "Saving…" : "Save team"}</button></div>
      </>}
    </section>
  </div>;
}








