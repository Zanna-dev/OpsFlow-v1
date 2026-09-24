import { Link } from "react-router-dom";
import { useProjectRoute } from "../../hooks/projects/useProjectRoute";
import { ProjectTasks } from "../../components/tasks/ProjectTasks";
export function ProjectTasksPage() {
  const { projectId, valid } = useProjectRoute();
  if (!valid) return <section><h1>Project not found</h1><Link to="/projects">Back to projects</Link></section>;
  return <ProjectTasks key={projectId} projectId={projectId} />;
}
