import { ProjectProgress } from "./ProjectProgress";
import { ProjectActions } from "./ProjectActions";
import { FiCalendar, FiFlag, FiLayers } from "react-icons/fi";

import type { ProjectCardProps } from "../../interfaces/project.interfaces";
import { priorityLabels, statusLabels } from "../../constants/projects";
import { formatProjectDate } from "../../utils/formatProjectDate";
import { getInitials } from "../../utils/getInitials";
import styles from "../../styles/projects/ProjectsPage.module.css";

export function ProjectCard({ project, ownerName, deleting, onDelete }: ProjectCardProps) {
  return <article className={styles.card}>
    <div className={styles.cardHeader}>
      <span className={styles.projectIcon} aria-hidden="true"><FiLayers /></span>
      <span className={styles.code}>{project.code}</span>
      <span className={styles.status} data-status={project.status}>{statusLabels[project.status]}</span>
    </div>
    <h2>{project.name}</h2>
    <p className={styles.description}>{project.description}</p>
    <div className={styles.priority} data-priority={project.priority}><FiFlag aria-hidden="true" />{priorityLabels[project.priority]} priority</div>
    <dl className={styles.dates}>
      <div><dt><FiCalendar aria-hidden="true" /> Start date</dt><dd>{formatProjectDate(project.startDate)}</dd></div>
      <div><dt>End date</dt><dd>{formatProjectDate(project.endDate)}</dd></div>
    </dl>
    <div className={styles.owner}><span className={styles.avatar} aria-hidden="true">{getInitials(ownerName)}</span><div><span>PROJECT OWNER</span><strong>{ownerName}</strong></div><span className={styles.members}>{project.memberIds.length} {project.memberIds.length === 1 ? "member" : "members"}</span></div>
    <ProjectProgress project={project} />
    <div className={styles.cardActions}><ProjectActions project={project} deleting={deleting} onDelete={onDelete} /></div>
  </article>;
}





