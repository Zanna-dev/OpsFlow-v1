import { Link } from "react-router-dom";
import type { ProjectRecordProps } from "../../interfaces/project.interfaces";
import { useProjectRecord } from "../../hooks/projects/useProjectRecord";
import { ProjectForm } from "./ProjectForm";
import styles from "../../styles/projects/ProjectForm.module.css";

export function EditProjectRecord({ id }: ProjectRecordProps) {
  const { state, retry } = useProjectRecord(id);
  if (state.status === "ready") return <ProjectForm project={state.project} />;
  return <section className={styles.form}>
    {state.status === "loading" ? <p role="status">Loading project details…</p> : state.status === "missing" ? <><h1>Project not found</h1><p>This project is no longer available in your workspace.</p></> : <><h1>We couldn’t load this project</h1><p role="alert">Your saved data could not be read. Check browser storage access and try again.</p><div className={styles.actions}><button onClick={retry}>Try again</button></div></>}
    <Link className={styles.back} to="/projects">Back to projects</Link>
  </section>;
}
