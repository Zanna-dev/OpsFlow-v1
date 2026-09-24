import { Link } from "react-router-dom";
import type { EmployeeRecordProps } from "../../interfaces/employee.interfaces";
import { useEmployeeRecord } from "../../hooks/employees/useEmployeeRecord";
import { EmployeeProfile } from "./EmployeeProfile";
import styles from "../../styles/employees/EmployeeProfile.module.css";

export function EmployeeProfileRecord({ id }: EmployeeRecordProps) {
  const { state, retry } = useEmployeeRecord(id);
  if (state.status === "ready") return <EmployeeProfile key={state.employee.id} employee={state.employee} />;
  return <section className={styles.notice}>
    {state.status === "loading" ? <p role="status">Loading employee profile…</p> : state.status === "missing" ? <><h1>Employee not found</h1><p>This employee is no longer in your directory.</p></> : <><h1>Profile unavailable</h1><p role="alert">Your saved employee details could not be read.</p><button onClick={retry}>Try again</button></>}
    <Link className={styles.back} to="/employees">Back to people</Link>
  </section>;
}
