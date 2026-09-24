import { useRef, useState } from "react";
import { deleteEmployee, EmployeeNotFoundError } from "../../services/employees/employeeService";
import { ProjectDependencyError } from "../../services/projects/projectStorage";
import type { Employee, EmployeeDeletionOptions } from "../../interfaces/employee.interfaces";

export function useEmployeeDeletion({ onDeleted }: EmployeeDeletionOptions) {
  const [target, setTarget] = useState<Employee | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const saving = useRef(false);

  function requestDelete(employee: Employee) {
    if (saving.current) return;
    setError("");
    setMessage("");
    setTarget(employee);
  }

  function cancel() {
    if (saving.current) return;
    setTarget(null);
    setError("");
  }

  async function confirm() {
    if (!target || saving.current) return;
    saving.current = true;
    setDeletingId(target.id);
    setError("");
    try {
      await deleteEmployee(target.id);
      onDeleted(target.id);
      setTarget(null);
      setMessage(`${target.name} was deleted from this demo workspace.`);
    } catch (cause) {
      setError(cause instanceof ProjectDependencyError ? cause.message : cause instanceof EmployeeNotFoundError
        ? "This employee no longer exists in storage. Cancel and reload the directory to see the current records."
        : "We couldn’t delete this employee. The directory has not been changed. Check browser storage access and try again.");
    } finally {
      saving.current = false;
      setDeletingId(null);
    }
  }

  return { target, deletingId, error, message, requestDelete, cancel, confirm, dismissError: () => setError(""), dismissMessage: () => setMessage("") };
}
