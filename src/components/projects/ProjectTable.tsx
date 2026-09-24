import { ProjectProgress } from "./ProjectProgress";
import type { ProjectTableProps } from "../../interfaces/project.interfaces";
import { priorityLabels, statusLabels } from "../../constants/projects";
import { formatProjectDate } from "../../utils/formatProjectDate";
import { ProjectActions } from "./ProjectActions";
import styles from "../../styles/projects/ProjectTable.module.css";

export function ProjectTable({ projects, ownerNames, deletingId, onDelete }: ProjectTableProps) {
  return <div className={styles.scroll} role="region" aria-label="Project comparison table; scroll horizontally for more columns" tabIndex={0}>
    <table className={styles.table}><caption className="sr-only">Projects matching your current filters and sort order</caption>
      <thead><tr><th scope="col">Project</th><th scope="col">Owner</th><th scope="col">Status</th><th scope="col">Priority</th><th scope="col">Start date</th><th scope="col">End date</th><th scope="col">Members</th><th scope="col">Completion</th><th scope="col">Actions</th></tr></thead>
      <tbody>{projects.map((project) => <tr key={project.id}>
        <th scope="row"><span className={styles.code}>{project.code}</span><strong>{project.name}</strong></th>
        <td>{ownerNames.get(project.ownerId) ?? "Unavailable owner"}</td>
        <td><span className={styles.status} data-status={project.status}>{statusLabels[project.status]}</span></td>
        <td><span className={styles.priority} data-priority={project.priority}>{priorityLabels[project.priority]}</span></td>
        <td className={styles.date}>{formatProjectDate(project.startDate)}</td><td className={styles.date}>{formatProjectDate(project.endDate)}</td><td>{project.memberIds.length}</td>
        <td><ProjectProgress project={project} /></td>
        <td className={styles.actions}><ProjectActions project={project} deleting={deletingId === project.id} onDelete={onDelete} /></td>
      </tr>)}</tbody>
    </table>
  </div>;
}

