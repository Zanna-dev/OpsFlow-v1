import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { PermissionGate } from "../common/PermissionGate";
import type { ProjectActionsProps } from "../../interfaces/project.interfaces";
import styles from "../../styles/projects/ProjectActions.module.css";

export function ProjectActions({ project, deleting, onDelete }: ProjectActionsProps) {
  return <div className={styles.actions}>
    <Link className={styles.edit} to={`/projects/${project.id}`} aria-label={`View ${project.name} and its team`}>Details & team</Link>
    <div className={styles.management}>
      <PermissionGate permission="projects.edit"><Link className={styles.edit} to={`/projects/${project.id}/edit`} aria-label={`Edit ${project.name}`}><FiEdit2 aria-hidden="true" />Edit project</Link></PermissionGate>
      <PermissionGate permission="projects.delete"><button type="button" className={styles.remove} disabled={deleting} onClick={() => onDelete(project)} aria-label={`Delete ${project.name}`}><FiTrash2 aria-hidden="true" />{deleting ? "Deleting…" : "Delete project"}</button></PermissionGate>
    </div>
  </div>;
}
