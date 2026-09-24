import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { MyTasksWorkspace } from "../../components/tasks/MyTasksWorkspace";
export function MyTasksPage() {
  const { role, employeeId } = useAuth();
  if (role !== "employee") return <section><h1>My tasks</h1><p>This personal queue is available in Employee demo mode. Managers can manage tasks from each project.</p><Link to="/projects">Go to projects</Link></section>;
  if (employeeId === null) return <section><h1>Choose your demo employee</h1><p>Select “Act as employee” in the top bar to see that employee’s assigned tasks.</p></section>;
  return <MyTasksWorkspace key={employeeId} />;
}
