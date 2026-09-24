import { Link } from "react-router-dom";
import type { ProjectRecordProps } from "../../interfaces/project.interfaces";
import { useProjectRecord } from "../../hooks/projects/useProjectRecord";
import { ProjectTeam } from "./ProjectTeam";
import styles from "../../styles/projects/ProjectTeam.module.css";

export function ProjectDetailsRecord({ id }: ProjectRecordProps) {
  const { state, retry } = useProjectRecord(id);
  if (state.status === "ready") return <ProjectTeam project={state.project} onRefresh={retry} />;
  return <section className={styles.workspace}>
    {state.status === "loading" ? <p role="status">Loading project details…</p> : state.status === "missing" ? <><h1>Project not found</h1><p>This project is no longer available.</p></> : <div className={styles.state}><h1>We couldn’t load this project</h1><p role="alert">Your saved project data could not be read.</p><button onClick={retry}>Try again</button></div>}
    <Link className={styles.back} to="/projects">Back to projects</Link>
  </section>;
}

