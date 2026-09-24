import { useEffect, useState } from "react";
import { EmployeeNotFoundError, getEmployee } from "../../services/employees/employeeService";
import type { EmployeeRecordState } from "../../types/employee.types";


export function useEmployeeRecord(id: number) {
  const [state, setState] = useState<EmployeeRecordState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let current = true;
    getEmployee(id).then((employee) => {
      if (current) setState({ status: "ready", employee });
    }).catch((error: unknown) => {
      if (current) setState({ status: error instanceof EmployeeNotFoundError ? "missing" : "error" });
    });
    return () => { current = false; };
  }, [id, attempt]);
  function retry() {
    setState({ status: "loading" });
    setAttempt((value) => value + 1);
  }
  return { state, retry };
}

