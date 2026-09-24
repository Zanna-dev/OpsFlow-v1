import { Link } from "react-router-dom";
import { EditProjectRecord } from "../../components/projects/EditProjectRecord";
import { useProjectRoute } from "../../hooks/projects/useProjectRoute";
import styles from "../../styles/projects/ProjectForm.module.css";

export function EditProjectPage() {
  const { projectId, valid } = useProjectRoute();
  if (!valid) return <section className={styles.form}><h1>Project not found</h1><p>Choose a project from the directory to edit its details.</p><Link to="/projects">Back to projects</Link></section>;
  return <EditProjectRecord key={projectId} id={projectId} />;
}
