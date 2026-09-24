import { Link } from "react-router-dom";
import { EditEmployeeRecord } from "../../components/employees/EditEmployeeRecord";
import { useEmployeeRoute } from "../../hooks/employees/useEmployeeRoute";
import styles from "../../styles/employees/EmployeeForm.module.css";

export function EditEmployeePage() {
  const { employeeId, valid } = useEmployeeRoute();
  if (!valid) {
    return (
      <section className={styles.form}>
        <h1>Employee not found</h1>
        <p>Choose an employee from the directory to edit their details.</p>
        <Link to="/employees">Back to people</Link>
      </section>
    );
  }
  return <EditEmployeeRecord key={employeeId} id={employeeId} />;
}
