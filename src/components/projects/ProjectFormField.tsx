import type { ProjectFormFieldProps } from "../../interfaces/project.interfaces";
import styles from "../../styles/projects/ProjectForm.module.css";

export function ProjectFormField({ field, label, error, children }: ProjectFormFieldProps) {
  return <div className={styles.field}>
    <label htmlFor={`project-${field}`}>{label}</label>
    {children}
    {error && <p id={`project-${field}-error`} className={styles.fieldError}>{error}</p>}
  </div>;
}
