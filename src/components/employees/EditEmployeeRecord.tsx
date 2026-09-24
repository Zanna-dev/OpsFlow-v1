import type { EmployeeRecordProps } from "../../interfaces/employee.interfaces";
import { Link } from "react-router-dom";
import { EmployeeForm } from "./EmployeeForm";
import { useEmployeeRecord } from "../../hooks/employees/useEmployeeRecord";
import styles from "../../styles/employees/EmployeeForm.module.css";
export function EditEmployeeRecord({ id }: EmployeeRecordProps) {
  const { state, retry } = useEmployeeRecord(id);
  if (state.status === "ready") return <EmployeeForm employee={state.employee} />;
  return <section className={styles.form}>
    {state.status === "loading" ? <p role="status">Loading employee details…</p> : state.status === "missing" ? <><h1>Employee not found</h1><p>This record is no longer available in your workspace.</p></> : <><h1>We couldn’t load this employee</h1><p role="alert">Your saved data could not be read. Check browser storage access and try again.</p><div className={styles.actions}><button onClick={retry}>Try again</button></div></>}
    <Link className={styles.back} to="/employees">Back to people</Link>
  </section>;
}


