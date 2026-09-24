import { Link } from "react-router-dom";
import type { ProjectProgressProps } from "../../interfaces/project.interfaces";
import { averageTaskProgress } from "../../utils/taskProgress";
import styles from "../../styles/projects/ProjectProgress.module.css";
export function ProjectProgress({ project }: ProjectProgressProps) {
  const completion = averageTaskProgress(project.tasks ?? []);
  return <div className={styles.progress}>
    <div><span>Task completion</span><strong>{completion === null ? "—" : `${completion}%`}</strong></div>
    {completion !== null && <progress max={100} value={completion} aria-label={`${project.name} task completion`} />}
    <small>{completion === null ? "No assigned tasks yet" : `Average of ${project.tasks!.length} assigned tasks`}</small>
    <Link to={`/projects/${project.id}/tasks`}>View assigned task cards →</Link>
  </div>;
}
