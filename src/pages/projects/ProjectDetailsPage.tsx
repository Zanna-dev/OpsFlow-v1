import { Link } from "react-router-dom";
import { useProjectRoute } from "../../hooks/projects/useProjectRoute";
import { ProjectDetailsRecord } from "../../components/projects/ProjectDetailsRecord";

export function ProjectDetailsPage() {
  const { projectId, valid } = useProjectRoute();
  if (!valid) return <section><h1>Project not found</h1><p>Select a project from the directory to view its team.</p><Link to="/projects">Back to projects</Link></section>;
  return <ProjectDetailsRecord key={projectId} id={projectId} />;
}
