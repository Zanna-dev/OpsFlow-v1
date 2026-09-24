import { Link } from "react-router-dom";
import type { DashboardPanelProps } from "../../interfaces/dashboard.interfaces";
import { statusLabels } from "../../constants/projects";
import styles from "../../styles/dashboard/Dashboard.module.css";

export function PortfolioSummary({ data }: DashboardPanelProps) {
  return <section className={styles.panel}>
    <div className={styles.panelHeading}><div><p className={styles.eyebrow}>THE BIG PICTURE</p><h2>Portfolio balance</h2></div><span className={styles.total}>{data.projectCount}<small>projects</small></span></div>
    {data.projectCount === 0 ? <p className={styles.empty}>Your portfolio is ready for its first project.</p> : <div className={styles.statuses}>{data.statuses.map(({ status, count }) => <div key={status}>
      <div className={styles.statusLabel}><span>{statusLabels[status]}</span><strong>{count}</strong></div>
      <meter className={styles.meter} data-status={status} min={0} max={data.projectCount} value={count} aria-label={`${statusLabels[status]} projects`}>{count} of {data.projectCount}</meter>
    </div>)}</div>}
    <Link className={styles.textLink} to="/projects">Explore all projects →</Link>
  </section>;
}
