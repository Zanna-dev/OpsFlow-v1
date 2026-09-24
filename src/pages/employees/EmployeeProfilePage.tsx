import { Link } from "react-router-dom";
import { useEmployeeRoute } from "../../hooks/employees/useEmployeeRoute";
import { EmployeeProfileRecord } from "../../components/employees/EmployeeProfileRecord";

export function EmployeeProfilePage() {
  const { employeeId, valid } = useEmployeeRoute();
  if (!valid) return <section><h1>Employee not found</h1><p>Select an employee from the directory to view their profile.</p><Link to="/employees">Back to people</Link></section>;
  return <EmployeeProfileRecord key={employeeId} id={employeeId} />;
}
