import { useEffect, useState } from "react";
import type { Employee } from "../../interfaces/employee.interfaces";
import { listEmployees } from "../../services/employees/employeeService";

export function useProjectOwners() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let current = true;
    listEmployees().then((records) => { if (current) setEmployees(records); })
      .catch(() => { if (current) setError("We couldn’t load available owners. Check browser storage access and try again."); })
      .finally(() => { if (current) setLoading(false); });
    return () => { current = false; };
  }, [attempt]);
  function retry() { setLoading(true); setError(""); setAttempt((value) => value + 1); }
  return { employees, owners: employees.filter((employee) => employee.active).sort((a, b) => a.name.localeCompare(b.name)), loading, error, retry };
}
