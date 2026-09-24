import { PermissionGate } from "../common/PermissionGate";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiMail } from "react-icons/fi";
import type { EmployeeProfileProps } from "../../interfaces/employeeProfile.interfaces";
import { useEmployeeProjects } from "../../hooks/employees/useEmployeeProjects";
import { getInitials } from "../../utils/getInitials";
import { EmployeeProjectList } from "./EmployeeProjectList";
import styles from "../../styles/employees/EmployeeProfile.module.css";

export function EmployeeProfile({ employee }: EmployeeProfileProps) {
  const { state, retry } = useEmployeeProjects(employee.id);
  return <div className={styles.page}>
    <Link className={styles.back} to="/employees"><FiArrowLeft aria-hidden="true" />People directory</Link>
    <header className={styles.hero}>
      <div className={styles.identity}><span className={styles.avatar} aria-hidden="true">{getInitials(employee.name)}</span><div><p className={styles.eyebrow}>PEOPLE / PROFILE</p><h1>{employee.name}</h1><p className={styles.department}>{employee.department}</p></div></div>
      <PermissionGate permission="employees.manage"><Link className={styles.edit} to={`/employees/${employee.id}/edit`}><FiEdit2 aria-hidden="true" />Edit employee</Link></PermissionGate>
      <dl className={styles.facts}><div><dt>Contact</dt><dd><a href={`mailto:${employee.email}`}><FiMail aria-hidden="true" />{employee.email}</a></dd></div><div><dt>Availability</dt><dd><span className={styles.badge} data-status={employee.active ? "active" : "inactive"}>{employee.active ? "Active" : "Inactive"}</span></dd></div><div><dt>Projects owned</dt><dd>{state.status === "ready" ? state.data.ownedProjects.length : "—"}</dd></div><div><dt>Team memberships</dt><dd>{state.status === "ready" ? state.data.memberProjects.length : "—"}</dd></div></dl>
    </header>
    <div className={styles.sectionIntro}><p className={styles.eyebrow}>CONNECTED THROUGH WORK</p><h2>Where their contribution lives.</h2><p>Ownership and collaboration across the portfolio, including completed and cancelled projects.</p></div>
    <div aria-busy={state.status === "loading"}>
      {state.status === "loading" ? <p className={styles.notice} role="status">Finding project relationships…</p> : state.status === "error" ? <section className={styles.notice}><h2>Projects couldn’t be loaded</h2><p role="alert">{state.message}</p><button onClick={retry}>Try again</button></section> : <div className={styles.groups}>
        <EmployeeProjectList title="Leading the way" description="Projects owned by this employee." projects={state.data.ownedProjects} emptyMessage="No projects owned yet. Project owners can be assigned from the project form." />
        <EmployeeProjectList title="Part of the team" description="Projects joined as a team member." projects={state.data.memberProjects} emptyMessage="No team memberships yet. Add this employee from a project’s team page." />
      </div>}
    </div>
  </div>;
}

