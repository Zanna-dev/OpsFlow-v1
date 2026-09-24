import { ProjectDependencyError } from "../../services/projects/projectStorage";
import { useUnsavedChanges } from "../common/useUnsavedChanges";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { ProjectFieldErrors, ProjectInput, ProjectTouchedFields } from "../../types/project.types";
import { validateProject } from "../../validation/project.validation";
import { createProject, updateProject, ProjectNotFoundError, ProjectValidationError } from "../../services/projects/projectService";
import type { Project } from "../../interfaces/project.interfaces";
import { useProjectOwners } from "./useProjectOwners";

export function useProjectForm(project?: Project) {
  const navigate = useNavigate();
  const ownerSource = useProjectOwners();
  const saving = useRef(false);
  const [values, setValues] = useState<ProjectInput>(project ? { name: project.name, code: project.code, description: project.description, status: project.status, priority: project.priority, startDate: project.startDate, endDate: project.endDate, ownerId: project.ownerId, memberIds: [...project.memberIds] } : { name: "", code: "", description: "", status: "planning", priority: "medium", startDate: "", endDate: null, ownerId: 0, memberIds: [] });
  const [initialValues] = useState(() => JSON.stringify(values));
  const dirty = JSON.stringify(values) !== initialValues;
  const [touched, setTouched] = useState<ProjectTouchedFields>({});
  const [attempted, setAttempted] = useState(false);
  const [serviceErrors, setServiceErrors] = useState<ProjectFieldErrors>({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigation = useUnsavedChanges(dirty, submitting);
  // Creation validates editable fields; the service assigns the real code at save.
  const validation = validateProject({ ...values, code: project?.code ?? "AUTO" }, ownerSource.employees);
  const errors: ProjectFieldErrors = { ...serviceErrors };
  for (const key of Object.keys(validation) as (keyof ProjectInput)[]) {
    if (attempted || touched[key]) errors[key] = validation[key];
  }
  function change<K extends Exclude<keyof ProjectInput, "code">>(field: K, value: ProjectInput[K]) {
    setValues((previous) => ({ ...previous, [field]: value, ...(field === "ownerId" ? { memberIds: (project?.memberIds ?? previous.memberIds).filter((id) => id !== value) } : {}) }));
    setServiceErrors((previous) => ({ ...previous, [field]: undefined }));
    setError("");
  }
  function fieldProps(field: keyof ProjectInput) {
    return { id: `project-${field}`, name: field, onBlur: () => setTouched((previous) => ({ ...previous, [field]: true })), "aria-invalid": !!errors[field], "aria-describedby": errors[field] ? `project-${field}-error` : undefined };
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving.current || ownerSource.loading || ownerSource.error || ownerSource.owners.length === 0) return;
    const form = event.currentTarget;
    setAttempted(true); setServiceErrors({}); setError("");
    const firstInvalid = Object.keys(validation)[0];
    if (firstInvalid) {
      if (firstInvalid === "memberIds") setError("A team member is no longer available. Restore the employee record before saving this project.");
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus(); return;
    }
    saving.current = true; setSubmitting(true);
    try {
      const saved = project ? await updateProject(project.id, values) : await createProject(values);
      navigation.allowSavedNavigation();
      navigate("/projects", { replace: true, state: project ? { updatedProjectName: saved.name } : { createdProjectName: saved.name } });
    } catch (cause) {
      if (cause instanceof ProjectValidationError) {
        setServiceErrors(cause.fieldErrors);
        if (cause.fieldErrors.memberIds) setError(cause.fieldErrors.memberIds);
        const field = Object.keys(cause.fieldErrors)[0];
        window.setTimeout(() => (form.elements.namedItem(field) as HTMLElement | null)?.focus(), 0);
      } else if (cause instanceof ProjectDependencyError) {
        setError(cause.message);
      } else if (cause instanceof ProjectNotFoundError) {
        setError("This project no longer exists. Your entries are still here; return to the directory to select an existing project.");
      } else {
        setError("We couldn’t save this project. Your entries are still here. Check browser storage access and try again.");
      }
    } finally { saving.current = false; setSubmitting(false); }
  }
  function cancel() { if (!saving.current) navigate("/projects"); }
  return { dirty, navigation, values, errors, error, submitting, ownerSource, change, fieldProps, submit, cancel, dismissError: () => setError(""), ownerName: ownerSource.owners.find((owner) => owner.id === values.ownerId)?.name ?? "Not selected" };
}



