import { useEffect, useState } from "react";
import { listEmployees } from "../../services/employees/employeeService";
import type { EmployeeStatusFilter } from "../../types/employee.types";
import type { Employee } from "../../interfaces/employee.interfaces";
import { useEmployeeDeletion } from "./useEmployeeDeletion";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState<EmployeeStatusFilter>("all");
  const [sort, setSort] = useState("name-asc");
  const deletion = useEmployeeDeletion({ onDeleted: (id) => {
    setEmployees((current) => current.filter((employee) => employee.id !== id));
  } });

  useEffect(() => {
    let current = true;
    listEmployees().then((records) => {
      if (current) setEmployees(records);
    }).catch((cause: unknown) => {
      if (current) setError(cause instanceof Error ? cause.message : "Unable to load the demo directory.");
    }).finally(() => {
      if (current) setLoading(false);
    });
    return () => { current = false; };
  }, [attempt]);

  function retry() {
    setError("");
    setLoading(true);
    setAttempt((value) => value + 1);
  }

  function clearFilters() {
    setSearch("");
    setDepartment("all");
    setStatus("all");
  }

  const query = search.trim().toLowerCase();
  const visibleEmployees = employees.filter((employee) =>
    (employee.name.toLowerCase().includes(query) || employee.email.toLowerCase().includes(query)) &&
    (department === "all" || employee.department === department) &&
    (status === "all" || employee.active === (status === "active")),
  ).sort((a, b) => {
    const comparison = sort === "department" ? a.department.localeCompare(b.department) :
      sort === "status" ? Number(b.active) - Number(a.active) :
      sort === "name-desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
    return comparison || a.name.localeCompare(b.name) || a.id - b.id;
  });

  return {
    employees, visibleEmployees, loading, error, retry, search, setSearch, deletion,
    department, setDepartment, status, setStatus, sort, setSort,
    clearFilters, departments: [...new Set([...employees.map((employee) => employee.department), ...(department === "all" ? [] : [department])])].sort(),
  };
}

