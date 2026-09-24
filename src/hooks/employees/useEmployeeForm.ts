import { useUnsavedChanges } from "../common/useUnsavedChanges";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployee, updateEmployee, EmployeeNotFoundError, EmployeeValidationError } from "../../services/employees/employeeService";
import type { EmployeeFieldErrors, EmployeeInput, EmployeeTouchedFields } from "../../types/employee.types";
import type { Employee } from "../../interfaces/employee.interfaces";
import { validateEmployee } from "../../validation/employee.validation";
import { ProjectDependencyError } from "../../services/projects/projectStorage";

export function useEmployeeForm(employee?: Employee) {
  const navigate = useNavigate();
  const saving = useRef(false);
  const [values, setValues] = useState<EmployeeInput>(employee ? { name: employee.name, email: employee.email, department: employee.department, active: employee.active } : { name: "", email: "", department: "", active: true });
  const [initialValues] = useState(() => JSON.stringify(values));
  const dirty = JSON.stringify(values) !== initialValues;
  const [touched, setTouched] = useState<EmployeeTouchedFields>({});
  const [attempted, setAttempted] = useState(false);
  const [serviceErrors, setServiceErrors] = useState<EmployeeFieldErrors>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigation = useUnsavedChanges(dirty, submitting);
  const validation = validateEmployee(values);
  const errors: EmployeeFieldErrors = { ...serviceErrors };
  for (const key of Object.keys(validation) as (keyof EmployeeInput)[]) {
    if (attempted || touched[key]) errors[key] = validation[key];
  }

  function change<K extends keyof EmployeeInput>(field: K, value: EmployeeInput[K]) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setServiceErrors((previous) => ({ ...previous, [field]: undefined }));
    setError("");
  }

  function touch(field: keyof EmployeeInput) {
    setTouched((previous) => ({ ...previous, [field]: true }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving.current) return;
    const form = event.currentTarget;
    setAttempted(true);
    setError("");
    setServiceErrors({});
    const firstInvalid = Object.keys(validation)[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    saving.current = true;
    setSubmitting(true);
    try {
      const saved = employee ? await updateEmployee(employee.id, values) : await createEmployee(values);
      navigation.allowSavedNavigation();
      navigate("/employees", { replace: true, state: employee ? { updatedEmployeeName: saved.name } : { createdEmployeeName: saved.name } });
    } catch (cause) {
      if (cause instanceof EmployeeValidationError) {
        setServiceErrors(cause.fieldErrors);
        const field = Object.keys(cause.fieldErrors)[0];
        // Disabled controls are re-enabled before focusing the error.
        window.setTimeout(() => (form.elements.namedItem(field) as HTMLElement | null)?.focus(), 0);
      } else if (cause instanceof ProjectDependencyError) {
        setError(cause.message);
      } else if (cause instanceof EmployeeNotFoundError) {
        setError("This employee no longer exists. Your entries are still here; return to the directory to select an existing employee.");
      } else {
        setError("We couldn’t save this employee in your browser. Your entries are still here. Check browser storage access and try again.");
      }
    } finally {
      saving.current = false;
      setSubmitting(false);
    }
  }

  function cancel() {
    if (!saving.current) navigate("/employees");
  }

  return { dirty, navigation, values, errors, error, submitting, change, touch, submit, cancel, dismissError: () => setError("") };
}



