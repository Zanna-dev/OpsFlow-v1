import { PermissionGate } from "../../components/common/PermissionGate";
import { getInitials } from "../../utils/getInitials";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { Notification } from "../../components/common/Notification";
import { FiArrowDown, FiArrowUpRight, FiSearch, FiUsers, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useEmployees } from "../../hooks/employees/useEmployees";
import type { EmployeeStatusFilter } from "../../types/employee.types";
import styles from "../../styles/employees/EmployeesPage.module.css";
import { Link } from "react-router-dom";



export function EmployeesPage() {
  const directory = useEmployees();
  const { employees, visibleEmployees, loading, error, deletion } = directory;
  return <div className={styles.page}>
    {deletion.message && <Notification floating title="Employee deleted" message={deletion.message} onClose={deletion.dismissMessage} />}
    {deletion.target && <ConfirmDialog title={`Delete ${deletion.target.name}?`} description="This removes the employee from your demo directory. This action cannot be undone. You can cancel to keep the record." confirmLabel="Delete employee" pending={deletion.deletingId !== null} error={deletion.error} onConfirm={deletion.confirm} onCancel={deletion.cancel} onDismissError={deletion.dismissError} />}
    <div className={styles.heading}><div><p className={styles.eyebrow}>THE PEOPLE BEHIND THE PROGRESS</p><h1>Your team, in focus<span>.</span></h1><p className={styles.subtitle}>A shared space for the people who make things happen.</p></div><span className={styles.chapter}>01 <span>/ PEOPLE</span></span></div>
    <section className={styles.overview} aria-label="Directory summary">
      <div className={styles.feature}><div><span className={styles.overline}>BETTER, TOGETHER</span><h2>Individual talent.<br />Collective possibility.</h2><p>Explore your people. Find your next collaborator.</p><a href="#directory">Explore the directory <FiArrowDown /></a></div><div className={styles.art} aria-hidden="true"><div /><div /><div /><span><FiUsers /></span></div></div>
      <div className={styles.metrics}><div><span>Total people <FiUsers /></span><strong>{loading || error ? "—" : employees.length.toString().padStart(2, "0")}</strong><small>Across the workspace</small></div><div><span>Active members <i /></span><strong>{loading || error ? "—" : employees.filter((employee) => employee.active).length.toString().padStart(2, "0")}</strong><small>{loading || error ? "Waiting for directory" : `${directory.departments.length} departments, one team`}</small></div></div>
    </section>
    <section id="directory" className={styles.directory} aria-labelledby="directory-title" aria-busy={loading}>
      <div className={styles.sectionHeading}><div><h2 id="directory-title" tabIndex={-1}>People directory <span>{loading || error ? "—" : employees.length}</span></h2><p>Get to know the minds behind the work.</p></div><PermissionGate permission="employees.manage"><Link className={styles.addEmployee} to="/employees/new">Add employee <FiArrowUpRight /></Link></PermissionGate></div>
      <div className={styles.toolbar}>
        <label className={styles.search}><FiSearch /><span className="sr-only">Search people by name or email</span><input value={directory.search} onChange={(event) => directory.setSearch(event.target.value)} placeholder="Search name or email…" type="search" /></label>
        <label><span className="sr-only">Department</span><select value={directory.department} onChange={(event) => directory.setDepartment(event.target.value)}><option value="all">All departments</option>{directory.departments.map((department) => <option key={department}>{department}</option>)}</select></label>
        <label><span className="sr-only">Status</span><select value={directory.status} onChange={(event) => directory.setStatus(event.target.value as EmployeeStatusFilter)}><option value="all">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select></label>
        <label><span className="sr-only">Sort people</span><select value={directory.sort} onChange={(event) => directory.setSort(event.target.value)}><option value="name-asc">Name A–Z</option><option value="name-desc">Name Z–A</option><option value="department">Department A–Z</option><option value="status">Active first</option></select></label>
      </div>
      {loading ? <div className={styles.message} role="status"><span className={styles.loader} />Getting everyone together…</div> : error ? <div className={styles.message} role="alert"><h3>We couldn’t load your people</h3><p>{error}</p><button onClick={directory.retry}>Try again</button></div> : employees.length === 0 ? <div className={styles.message}><h3>Your directory is empty</h3><p>There are no employee records in this workspace yet.</p></div> : visibleEmployees.length === 0 ? <div className={styles.message}><h3>No people match these filters</h3><p>Try another name, department, or status.</p><button onClick={directory.clearFilters}>Clear filters</button></div> : <div className={styles.tableScroll}><table><caption className="sr-only">Employees in the demo workspace</caption><thead><tr><th scope="col">NAME</th><th scope="col">DEPARTMENT</th><th scope="col">STATUS</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead><tbody>{visibleEmployees.map((employee) => <tr key={employee.id}><td><div className={styles.person}><span className={styles.avatar} data-tone={employee.id % 4}>{getInitials(employee.name)}</span><div><strong>{employee.name}</strong><span>{employee.email}</span></div></div></td><td><span className={styles.department}>{employee.department}</span></td><td><span className={styles.status} data-active={employee.active}><i />{employee.active ? "Active" : "Inactive"}</span></td><td><Link className={styles.view} to={`/employees/${employee.id}`} aria-label={`View ${employee.name}'s profile`}>View profile <FiArrowUpRight /></Link><PermissionGate permission="employees.manage"><Link className={styles.editButton} to={`/employees/${employee.id}/edit`} aria-label={`Edit ${employee.name}`}><FiEdit2 aria-hidden="true" /> Edit employee</Link></PermissionGate><PermissionGate permission="employees.manage"><button type="button" className={styles.deleteButton} onClick={() => deletion.requestDelete(employee)} disabled={deletion.deletingId === employee.id} aria-label={`Delete ${employee.name}`}><FiTrash2 aria-hidden="true" />{deletion.deletingId === employee.id ? "Deleting…" : "Delete"}</button></PermissionGate></td></tr>)}</tbody></table></div>}
      {!loading && !error && <div className={styles.tableFooter}><span role="status">Showing {visibleEmployees.length} of {employees.length} people</span><span>Thoughtful teams. Meaningful work.</span></div>}
    </section>
  </div>;
}






