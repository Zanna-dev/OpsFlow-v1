import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { statusLabels } from "../../constants/projects";
import type { EmployeeProjectListProps } from "../../interfaces/employeeProfile.interfaces";
import { formatProjectDate } from "../../utils/formatProjectDate";
import styles from "../../styles/employees/EmployeeProfile.module.css";

export function EmployeeProjectList({ title, description, projects, emptyMessage }: EmployeeProjectListProps) {
  return <section className={styles.projectGroup}>
    <div className={styles.groupHeading}><h2>{title} <span>{projects.length}</span></h2><p>{description}</p></div>
    {projects.length === 0 ? <p className={styles.empty}>{emptyMessage}</p> :
      <ul className={styles.projects}>{projects.map((project) => <li key={project.id}>
        <Link className={styles.projectLink} to={`/projects/${project.id}`}>
          <div className={styles.projectMeta}><span>{project.code}</span><span className={styles.badge} data-status={project.status}>{statusLabels[project.status]}</span></div>
          <h3>{project.name}<FiArrowUpRight aria-hidden="true" /></h3>
          <p>{project.description}</p>
          <div className={styles.projectFooter}><span>Due {formatProjectDate(project.endDate)}</span><span>Explore project</span></div>
        </Link>
      </li>)}</ul>}
  </section>;
}
