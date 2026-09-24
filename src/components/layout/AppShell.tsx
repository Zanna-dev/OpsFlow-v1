import { useRouteAccessibility } from "../../hooks/layout/useRouteAccessibility";
import { DemoRoleSelector } from "./DemoRoleSelector";
import { SignOutButton } from "../auth/SignOutButton";
import { useAuth } from "../../hooks/auth/useAuth";
import { NavLink, Outlet } from "react-router-dom";
import { FiArrowUpRight, FiGrid, FiUsers, FiLayers, FiSidebar, FiChevronRight } from "react-icons/fi";
import { useSidebar } from "../../hooks/layout/useSidebar";
import { useRouteNotification } from "../../hooks/layout/useRouteNotification";
import { Notification } from "../common/Notification";
import styles from "./AppShell.module.css";

export function AppShell() {
  const mainRef = useRouteAccessibility();
  const { collapsed, toggleSidebar } = useSidebar();
  const { role, employeeId } = useAuth();
  const notification = useRouteNotification();
  return <div className={`${styles.shell} ${collapsed ? styles.collapsed : ""}`}>
    <a className={styles.skip} href="#main-content">Skip to content</a>
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <NavLink to="/overview" className={styles.brand} aria-label="OpsFlow home"><span className={styles.mark}><FiLayers aria-hidden="true" /></span><span className={styles.brandText}>opsflow<span className={styles.brandDot}>.</span></span></NavLink>
        <button type="button" className={styles.toggle} onClick={toggleSidebar} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} aria-controls="sidebar-navigation" title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <FiChevronRight /> : <FiSidebar />}</button>
      </div>
      <div className={styles.workspace}><span className={styles.workspaceIcon}>O</span><div>Studio workspace<small>Local demo</small></div></div>
      <p className={styles.navLabel}>WORKSPACE</p>
      <nav id="sidebar-navigation" aria-label="Primary navigation">
        <NavLink to="/overview" title="Overview" aria-label="Overview" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`}><FiGrid aria-hidden="true" /><span className={styles.navText}>Overview</span></NavLink>
        <NavLink to="/employees" title="People" aria-label="People" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`}><FiUsers aria-hidden="true" /><span className={styles.navText}>People</span><span className={styles.navCount}>01</span></NavLink>
        <NavLink to="/projects" title="Projects" aria-label="Projects" className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ""}`}><FiLayers aria-hidden="true" /><span className={styles.navText}>Projects</span><span className={styles.navCount}>02</span></NavLink>
      </nav>
      <div className={styles.sidebarNote}><span className={styles.orbit} aria-hidden="true" /><p className={styles.sidebarTagline}>Good work.<br />Great people.</p><p>A little clarity makes room for your next big idea.</p><FiArrowUpRight aria-hidden="true" /></div>
      <div className={styles.identity}><span>DW</span><div>Demo workspace<small>Sample people · local storage</small></div></div>
    </aside>
    <div className={styles.body}>
      <header className={styles.topbar}><span>Workspace <span className={styles.slash}>/</span> <strong>People & collaboration</strong></span><DemoRoleSelector /><SignOutButton /></header>
      <main ref={mainRef} id="main-content" tabIndex={-1} className={styles.main}><Outlet key={`${role}-${employeeId ?? "none"}`} /></main>
      <footer className={styles.footer}><span className={styles.footerBrand}><FiLayers aria-hidden="true" /> OPSFLOW</span><span>Space for people. Focus for work.</span><span className={styles.footerAccent}>Made for momentum <FiArrowUpRight /></span></footer>
    </div>
    {notification.message && <Notification floating message={notification.message} onClose={notification.dismiss} />}
  </div>;
}






