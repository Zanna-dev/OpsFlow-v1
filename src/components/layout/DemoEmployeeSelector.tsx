import { useAuth } from "../../hooks/auth/useAuth";
import { useProjectOwners } from "../../hooks/projects/useProjectOwners";
import styles from "../../styles/auth/DemoRoleSelector.module.css";
export function DemoEmployeeSelector() {
  const { employeeId, changeEmployee, formBusy } = useAuth();
  const people = useProjectOwners();
  return <div className={styles.selector}>
    <label>Act as employee <select disabled={formBusy || people.loading || !!people.error} value={employeeId ?? ""} onChange={(event) => changeEmployee(event.target.value ? Number(event.target.value) : null)}>
      <option value="">{people.loading ? "Loading employees…" : "Select an employee"}</option>{people.owners.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
    </select></label>
    {people.error && <button type="button" onClick={people.retry}>Retry employee list</button>}
    {!people.loading && !people.error && people.owners.length === 0 && <span>No active employees available.</span>}
  </div>;
}
