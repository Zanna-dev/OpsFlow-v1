import { FiUsers, FiUserCheck, FiLayers, FiClock } from "react-icons/fi";
import type { DashboardPanelProps } from "../../interfaces/dashboard.interfaces";
import styles from "../../styles/dashboard/Dashboard.module.css";

export function DashboardMetrics({ data }: DashboardPanelProps) {
  return <section className={styles.metrics} aria-label="Workspace metrics">
    <div><FiUsers aria-hidden="true" /><span>Total people</span><strong>{data.peopleCount}</strong><small>Across your workspace</small></div>
    <div><FiUserCheck aria-hidden="true" /><span>Active people</span><strong>{data.activePeopleCount}</strong><small>Currently marked active</small></div>
    <div><FiLayers aria-hidden="true" /><span>Open projects</span><strong>{data.openProjectCount}</strong><small>Planning + active</small></div>
    <div data-attention={data.overdueCount > 0}><FiClock aria-hidden="true" /><span>Overdue projects</span><strong>{data.overdueCount}</strong><small>Open, with a past end date</small></div>
  </section>;
}
