import { LoginPage } from "../pages/auth/LoginPage";
import { RequireSession } from "./RequireSession";

import { ProjectTasksPage } from "../pages/projects/ProjectTasksPage";
import { ProtectedRoute } from "./ProtectedRoutes";
import { DashboardPage } from "../pages/dashboard/DashboardPage";
import { EmployeeProfilePage } from "../pages/employees/EmployeeProfilePage";
import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route, Navigate, Link } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { EmployeesPage } from "../pages/employees/EmployeesPage";
import { CreateEmployeePage } from "../pages/employees/CreateEmployeePage";
import { EditEmployeePage } from "../pages/employees/EditEmployeePage";
import { ProjectsPage } from "../pages/projects/ProjectsPage";
import { CreateProjectPage } from "../pages/projects/CreateProjectPage";
import { EditProjectPage } from "../pages/projects/EditProjectPage";
import { ProjectDetailsPage } from "../pages/projects/ProjectDetailsPage";

const router = createBrowserRouter(createRoutesFromElements(
  <><Route path="/login" element={<LoginPage />} />
    <Route element={<RequireSession />}>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/overview" replace />} />
        <Route path="/my-tasks" element={<Navigate to="/projects" replace />} />
        <Route path="/overview" element={<DashboardPage />} />
        <Route path="/dashboard" element={<Navigate to="/overview" replace />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/employees/new" element={<ProtectedRoute permission="employees.manage"><CreateEmployeePage /></ProtectedRoute>} />
        <Route path="/employees/:id" element={<EmployeeProfilePage />} />
        <Route path="/employees/:id/edit" element={<ProtectedRoute permission="employees.manage"><EditEmployeePage /></ProtectedRoute>} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/new" element={<ProtectedRoute permission="projects.create"><CreateProjectPage /></ProtectedRoute>} />
        <Route path="/projects/:id/edit" element={<ProtectedRoute permission="projects.edit"><EditProjectPage /></ProtectedRoute>} />
        <Route path="/projects/:id/tasks" element={<ProjectTasksPage />} />
        <Route path="/projects/:id" element={<ProjectDetailsPage />} />
        <Route path="/users" element={<Navigate to="/employees" replace />} />
        <Route
          path="*"
          element={
            <section>
              <p>404 / PAGE NOT FOUND</p>
              <h1>This space hasn’t been built.</h1>
              <p>Return to your people and keep exploring.</p>
              <Link to="/employees">Back to people</Link>
            </section>
          }
        />
      </Route>
    </Route>
</>));
export function Routers() { return <RouterProvider router={router} />; }









