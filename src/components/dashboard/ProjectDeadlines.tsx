import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import type { DashboardPanelProps } from "../../interfaces/dashboard.interfaces";
import { formatProjectDate } from "../../utils/formatProjectDate";
import styles from "../../styles/dashboard/Dashboard.module.css";

export function ProjectDeadlines({ data }: DashboardPanelProps) {
  return <section className={styles.panel}>
    <p className={styles.eyebrow}>KEEP WORK IN VIEW</p><h2>On the horizon</h2><p className={styles.support}>Up to five open projects, earliest deadline first. Overdue work stays visible.</p>
    {data.deadlines.length === 0 ? <p className={styles.empty}>No deadlines to show. Open projects with an end date will appear here.</p> : <ul className={styles.deadlines}>{data.deadlines.map((project) => <li key={project.id}>
      <Link to={`/projects/${project.id}`}><div><span className={styles.code}>{project.code}</span><h3>{project.name}</h3><span className={styles.due} data-overdue={project.endDate! < data.today}>{project.endDate! < data.today ? "Overdue · " : project.endDate === data.today ? "Due today · " : "Due · "}{formatProjectDate(project.endDate)}</span></div><FiArrowUpRight aria-hidden="true" /></Link>
    </li>)}</ul>}
  </section>;
}
