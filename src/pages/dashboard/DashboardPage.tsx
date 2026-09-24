import { AttentionSummary } from "../../components/dashboard/AttentionSummary";
import { ProjectProgressChart } from "../../components/dashboard/ProjectProgressChart";
import { PermissionGate } from "../../components/common/PermissionGate";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiRefreshCw } from "react-icons/fi";
import { useDashboard } from "../../hooks/dashboard/useDashboard";
import { DashboardMetrics } from "../../components/dashboard/DashboardMetrics";
import { PortfolioSummary } from "../../components/dashboard/PortfolioSummary";
import { ProjectDeadlines } from "../../components/dashboard/ProjectDeadlines";
import { formatProjectDate } from "../../utils/formatProjectDate";
import styles from "../../styles/dashboard/Dashboard.module.css";

export function DashboardPage() {
  const { state, refresh } = useDashboard();
  return <div className={styles.page}>
    <header className={styles.heading}><div><p className={styles.eyebrow}>YOUR WORKSPACE, CONNECTED</p><h1>Clarity for what’s next<span>.</span></h1><p className={styles.support}>People, projects, and the work ahead. All in perspective.</p></div><button className={styles.refresh} onClick={refresh} disabled={state.status === "loading"}><FiRefreshCw aria-hidden="true" />Refresh overview</button></header>
    <section className={styles.hero}><div><p className={styles.heroLabel}>MAKE ROOM FOR MEANINGFUL WORK</p><h2>Great people.<br />Shared direction.</h2><p>Explore your people, follow project progress, and keep the next milestone in view.</p><div className={styles.actions}><PermissionGate permission="projects.create"><Link to="/projects/new">Create project <FiArrowUpRight aria-hidden="true" /></Link></PermissionGate><PermissionGate permission="employees.manage"><Link to="/employees/new">Add employee <FiArrowUpRight aria-hidden="true" /></Link></PermissionGate></div></div><div className={styles.orbits} aria-hidden="true"><i /><i /><i /><span>O<span>WORK IN SYNC</span></span></div></section>
    <div aria-busy={state.status === "loading"}>
      {state.status === "loading" ? <p className={styles.notice} role="status">Bringing your workspace into focus…</p> : state.status === "error" ? <section className={styles.notice}><h2>Overview unavailable</h2><p role="alert">{state.message}</p><button className={styles.refresh} onClick={refresh}>Try again</button></section> : <>
        <p className={styles.snapshot}>Snapshot for {formatProjectDate(state.data.today)} · Refresh to include changes made elsewhere.</p>
        <DashboardMetrics data={state.data} />
        <ProjectProgressChart />
        <AttentionSummary data={state.data} />
        <div className={styles.panels}><PortfolioSummary data={state.data} /><ProjectDeadlines data={state.data} /></div>
      </>}
    </div>
  </div>;
}



