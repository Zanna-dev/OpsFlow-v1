import { listEmployees } from "../employees/employeeService";
import { readProjects } from "../projects/projectStorage";
import { getDemoRole, getDemoEmployeeId, PermissionError } from "../auth/demoAuthService";
import { collectAssignedTasks } from "../../utils/assignedTasks";
import type { MyTasksData } from "../../interfaces/myTasks.interfaces";
export async function getMyTasks(): Promise<MyTasksData> {
  const employees = await listEmployees();
  if (getDemoRole() !== "employee") throw new PermissionError();
  const employee = employees.find((person) => person.id === getDemoEmployeeId() && person.active);
  if (!employee) throw new Error("Select an active employee in the top bar to view their assigned tasks.");
  return { employee, assignments: collectAssignedTasks(readProjects() ?? [], employee.id) };
}
