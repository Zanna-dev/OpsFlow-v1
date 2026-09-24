import assert from "node:assert/strict";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

// Compile only the pure feature modules into an isolated temporary directory.
const temporary = await mkdtemp(join(tmpdir(), "opsflow-employees-"));
const records = new Map();
let rejectWrites = false;
let rejectKey = "";
globalThis.window = { setTimeout: (callback) => setTimeout(callback, 0) };
globalThis.localStorage = {
  getItem: (key) => records.get(key) ?? null,
  setItem: (key, value) => {
    if (rejectWrites || key === rejectKey) throw new Error("Storage unavailable");
    records.set(key, value);
  },
};
try {
  const modules = ["services/auth/sessionService", "utils/safeReturnPath", "validation/employee.validation", "services/employees/employeeService", "services/projects/projectStorage", "validation/project.validation", "validation/task.validation", "services/tasks/taskService", "services/tasks/myTasksService", "utils/assignedTasks", "utils/taskProgress", "constants/projects", "services/projects/projectService", "utils/filterProjects", "utils/projectQuery", "utils/generateProjectCode", "services/employees/employeeProjectService", "utils/summarizeWorkspace", "utils/projectAttention", "constants/projectAttentionLabels", "constants/permissions", "services/auth/demoAuthService"];
  for (const file of modules) {
    const source = await readFile(new URL(`../src/${file}.ts`, import.meta.url), "utf8");
    const output = ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2023, module: ts.ModuleKind.ESNext },
    }).outputText.replace(/from "(\.[^"]+)"/g, (_, dependency) => `from "./${basename(dependency)}.mjs"`);
    await writeFile(join(temporary, `${basename(file)}.mjs`), output);
  }
  const { signIn, signOut, getSession } = await import(pathToFileURL(join(temporary, "sessionService.mjs")));
  const { safeReturnPath } = await import(pathToFileURL(join(temporary, "safeReturnPath.mjs")));
  assert.equal(getSession(), null);
  for (const path of [null, "https://evil.example", "//evil.example", "/login", "/\\evil.example", "/%2f%2fevil.example"]) assert.equal(safeReturnPath(path), "/overview");
  assert.equal(safeReturnPath("/projects/2/tasks?status=active#task"), "/projects/2/tasks?status=active#task");
  await assert.rejects(signIn({ email: "admin@opsflow.demo", password: "wrong" }), /email or password/);
  await assert.rejects(signIn({ email: "admin@opsflow.demo", password: " OpsFlowDemo!23 " }), /email or password/);
  assert.equal(getSession(), null);
  await signIn({ email: " ADMIN@OPSFLOW.DEMO ", password: "OpsFlowDemo!23" });
  assert.equal(getSession().email, "admin@opsflow.demo");
  signOut();
  assert.equal(getSession(), null);
  const { requirePermission } = await import(pathToFileURL(join(temporary, "demoAuthService.mjs")));
  assert.throws(() => requirePermission("employees.manage"));
  await signIn({ email: "admin@opsflow.demo", password: "OpsFlowDemo!23" });
  const { validateEmployee, normalizeEmployee } = await import(pathToFileURL(join(temporary, "employee.validation.mjs")));
  const { listEmployees, createEmployee, getEmployee, updateEmployee, deleteEmployee, EmployeeNotFoundError, EmployeeValidationError } = await import(pathToFileURL(join(temporary, "employeeService.mjs")));
  const { getEmployeeProjects } = await import(pathToFileURL(join(temporary, "employeeProjectService.mjs")));
  const { summarizeWorkspace } = await import(pathToFileURL(join(temporary, "summarizeWorkspace.mjs")));
  const { changeDemoRole, PermissionError } = await import(pathToFileURL(join(temporary, "demoAuthService.mjs")));
  const { hasPermission } = await import(pathToFileURL(join(temporary, "permissions.mjs")));
  const { readProjectFilters, readProjectView, updateProjectQuery, resetProjectQuery } = await import(pathToFileURL(join(temporary, "projectQuery.mjs")));
  const queryParams = new URLSearchParams("status=active&priority=high&owner=2&sort=endDate&direction=desc&search=Design&view=table&attention=overdue&extra=keep");
  assert.deepEqual(readProjectFilters(queryParams), { status: "active", priority: "high", owner: "2", sort: "endDate", direction: "desc", search: "Design" });
  assert.equal(readProjectView(queryParams), "table");
  const resetParams = resetProjectQuery(queryParams);
  assert.equal(resetParams.get("view"), "table");
  assert.equal(resetParams.get("extra"), "keep");
  assert.equal(resetParams.has("attention"), false);
  assert.equal(readProjectFilters(resetParams).status, "all");
  assert.equal(queryParams.get("status"), "active");
  const invalidParams = new URLSearchParams("status=bad&priority=bad&owner=-3&sort=bad&direction=bad&view=bad");
  assert.deepEqual(readProjectFilters(invalidParams), { search: "", status: "all", priority: "all", owner: "all", sort: "name", direction: "asc" });
  assert.equal(readProjectView(invalidParams), "cards");
  assert.equal(readProjectFilters(new URLSearchParams("owner=99999999999999999999")).owner, "all");
  const updatedParams = updateProjectQuery(queryParams, "status", "all");
  assert.equal(updatedParams.has("status"), false);
  assert.equal(updatedParams.get("attention"), "overdue");
  assert.equal(updatedParams.get("priority"), "high");
  assert.equal(readProjectFilters(updateProjectQuery(queryParams, "search", "R&D + Design")).search, "R&D + Design");
  const input = { name: "  Ada O’Neil  ", email: " ADA@EXAMPLE.COM ", department: "Engineering", active: true };
  assert.deepEqual(validateEmployee(input), {});
  assert.equal(normalizeEmployee(input).name, "Ada O’Neil");
  assert.equal(normalizeEmployee(input).email, "ada@example.com");
  for (const name of [" ", "A", "A".repeat(81), "Ada123", "--"]) assert.ok(validateEmployee({ ...input, name }).name);
  assert.ok(validateEmployee({ ...input, email: "ada@" }).email);
  assert.ok(validateEmployee({ ...input, department: "Unknown" }).department);
  const before = await listEmployees();
  assert.deepEqual(await getEmployeeProjects(before[0].id), { ownedProjects: [], memberProjects: [] });
  assert.equal(records.has("opsflow.projects.v1"), false);
  await assert.rejects(getEmployeeProjects(999999), EmployeeNotFoundError);
  const created = await createEmployee(input);
  assert.equal(created.name, "Ada O’Neil");
  assert.ok(created.id > Math.max(...before.map((record) => record.id)));
  assert.equal((await listEmployees()).length, before.length + 1);
  await assert.rejects(createEmployee(input), (error) => error instanceof EmployeeValidationError && !!error.fieldErrors.email);
  await assert.rejects(createEmployee({ ...input, name: " " }), EmployeeValidationError);
  const snapshot = JSON.stringify(await listEmployees());
  rejectWrites = true;
  await assert.rejects(createEmployee({ ...input, email: "new@example.com" }), /Storage unavailable/);
  rejectWrites = false;
  assert.equal(JSON.stringify(await listEmployees()), snapshot);
  const concurrent = await Promise.all([
    createEmployee({ ...input, email: "first@example.com" }),
    createEmployee({ ...input, email: "second@example.com" }),
  ]);
  assert.notEqual(concurrent[0].id, concurrent[1].id);
  assert.equal((await listEmployees()).length, before.length + 3);
  const originalRecords = await listEmployees();
  const updated = await updateEmployee(created.id, { ...input, id: 999, name: "Ada Smith", active: false });
  assert.equal(updated.id, created.id);
  assert.equal(updated.active, false);
  assert.equal(updated.email, "ada@example.com");
  assert.deepEqual(await getEmployee(created.id), updated);
  assert.deepEqual((await listEmployees()).filter((record) => record.id !== created.id), originalRecords.filter((record) => record.id !== created.id));
  await assert.rejects(updateEmployee(created.id, { ...input, email: before[0].email.toUpperCase() }), (error) => error instanceof EmployeeValidationError && !!error.fieldErrors.email);
  await assert.rejects(updateEmployee(created.id, { ...input, name: " " }), EmployeeValidationError);
  await assert.rejects(getEmployee(99999), EmployeeNotFoundError);
  await assert.rejects(updateEmployee(99999, input), EmployeeNotFoundError);
  const updateSnapshot = JSON.stringify(await listEmployees());
  rejectWrites = true;
  await assert.rejects(updateEmployee(created.id, { ...input, name: "Ada Jones" }), /Storage unavailable/);
  rejectWrites = false;
  assert.equal(JSON.stringify(await listEmployees()), updateSnapshot);
  const beforeDelete = await listEmployees();
  rejectWrites = true;
  await assert.rejects(deleteEmployee(created.id), /Storage unavailable/);
  rejectWrites = false;
  assert.deepEqual(await listEmployees(), beforeDelete);
  await deleteEmployee(created.id);
  assert.deepEqual(await listEmployees(), beforeDelete.filter((record) => record.id !== created.id));
  await assert.rejects(deleteEmployee(created.id), EmployeeNotFoundError);
  await assert.rejects(deleteEmployee(99999), EmployeeNotFoundError);
  for (const employee of await listEmployees()) await deleteEmployee(employee.id);
  assert.deepEqual(await listEmployees(), []);
  assert.equal(records.get("opsflow.employees.v1"), "[]");
  records.set("opsflow.employees.v1", "{}");
  await assert.rejects(deleteEmployee(1), /could not be read/);
  await assert.rejects(listEmployees(), /could not be read/);
  assert.equal(records.get("opsflow.employees.v1"), "{}");
  const { getProjectDirectory, createProject, getProject, updateProject, updateProjectMembers, deleteProject, ProjectNotFoundError, ProjectValidationError } = await import(pathToFileURL(join(temporary, "projectService.mjs")));
  const { ProjectDependencyError, assertEmployeeCanBeDeleted } = await import(pathToFileURL(join(temporary, "projectStorage.mjs")));
  const { isProject, validateProject } = await import(pathToFileURL(join(temporary, "project.validation.mjs")));
  const { filterProjects } = await import(pathToFileURL(join(temporary, "filterProjects.mjs")));
  records.set("opsflow.employees.v1", "[]");
  assert.deepEqual((await getProjectDirectory()).projects, []);
  assert.equal(records.has("opsflow.projects.v1"), false);
  records.set("opsflow.employees.v1", JSON.stringify(before));
  rejectWrites = true;
  await assert.rejects(getProjectDirectory(), /Storage unavailable/);
  assert.equal(records.has("opsflow.projects.v1"), false);
  rejectWrites = false;
  const directory = await getProjectDirectory();
  assert.equal(directory.projects.length, 6);
  assert.ok(directory.projects.every(isProject));
  assert.deepEqual((await getProjectDirectory()).projects, directory.projects);
  const project = directory.projects[0];
  assert.equal(isProject({ ...project, startDate: "2026-02-30" }), false);
  assert.equal(isProject({ ...project, status: "completed", endDate: null }), false);
  assert.equal(isProject({ ...project, memberIds: [project.ownerId] }), false);
  const owner = before.find((employee) => employee.id === project.ownerId);
  await assert.rejects(deleteEmployee(owner.id), ProjectDependencyError);
  await assert.rejects(updateEmployee(owner.id, { ...owner, active: false }), ProjectDependencyError);
  assert.deepEqual(await getEmployee(owner.id), owner);
  const filters = { search: "", status: "all", priority: "all", owner: "all", sort: "name", direction: "asc" };
  assert.deepEqual(filterProjects(directory.projects, { ...filters, search: " ops-001 ", status: "active", priority: "high", owner: String(owner.id) }), [project]);
  assert.deepEqual(filterProjects(directory.projects, { ...filters, search: "ops-001", status: "planning" }), []);
  const snapshotProjects = JSON.stringify(directory.projects);
  const ranked = filterProjects(directory.projects, { ...filters, sort: "priority", direction: "desc" });
  assert.equal(ranked[0].priority, "critical");
  for (const direction of ["asc", "desc"]) {
    const byEnd = filterProjects(directory.projects, { ...filters, sort: "endDate", direction });
    assert.equal(byEnd.at(-1).endDate, null);
  }
  assert.equal(JSON.stringify(directory.projects), snapshotProjects);
  const member = before.find((employee) => !directory.projects.some((record) => record.ownerId === employee.id));
  records.set("opsflow.projects.v1", JSON.stringify([{ ...project, memberIds: [member.id] }]));
  await assert.rejects(deleteEmployee(member.id), ProjectDependencyError);
  records.set("opsflow.projects.v1", JSON.stringify([{ ...project, ownerId: 999999 }]));
  await assert.rejects(getProjectDirectory(), /missing employee/);
  records.set("opsflow.projects.v1", "{}");
  await assert.rejects(getProjectDirectory(), /could not be read/);
  await assert.rejects(deleteEmployee(owner.id), /could not be read/);
  assert.equal(records.get("opsflow.projects.v1"), "{}");
  records.set("opsflow.projects.v1", "[]");
  assert.deepEqual((await getProjectDirectory()).projects, []);
  const draft = { name: "  New initiative  ", code: "  new-001  ", description: "  A clear description of the project outcome.  ", status: "planning", priority: "medium", startDate: "2026-10-01", endDate: null, ownerId: owner.id, memberIds: [] };
  assert.deepEqual(validateProject(draft, before), {});
  assert.ok(validateProject({ ...draft, name: "  " }, before).name);
  assert.ok(validateProject({ ...draft, description: "short" }, before).description);
  assert.ok(validateProject({ ...draft, code: "A B" }, before).code);
  assert.ok(validateProject({ ...draft, status: "unknown" }, before).status);
  assert.ok(validateProject({ ...draft, priority: "unknown" }, before).priority);
  assert.ok(validateProject({ ...draft, status: "completed" }, before).endDate);
  assert.ok(validateProject({ ...draft, endDate: "2026-09-30" }, before).endDate);
  assert.ok(validateProject({ ...draft, startDate: "2026-02-30" }, before).startDate);
  assert.deepEqual(validateProject({ ...draft, status: "completed", endDate: draft.startDate }, before), {});
  const inactiveOwner = before.find((employee) => !employee.active);
  await assert.rejects(createProject({ ...draft, ownerId: inactiveOwner.id }), (error) => error instanceof ProjectValidationError && !!error.fieldErrors.ownerId);
  await assert.rejects(createProject({ ...draft, ownerId: 999999 }), ProjectValidationError);
  await assert.rejects(createProject({ ...draft, memberIds: [owner.id] }), ProjectValidationError);
  await assert.rejects(createProject({ ...draft, status: "completed" }), ProjectValidationError);
  const saved = await createProject({ ...draft, id: 999999 });
  assert.equal(saved.name, "New initiative");
  assert.equal(saved.code, "PRJ-0001");
  assert.notEqual(saved.id, 999999);
  assert.deepEqual((await getProjectDirectory()).projects, [saved]);
  const suppliedCodeIgnored = await createProject({ ...draft, code: saved.code });
  assert.equal(suppliedCodeIgnored.code, "PRJ-0002");
  const projectSnapshot = records.get("opsflow.projects.v1");
  rejectWrites = true;
  await assert.rejects(createProject({ ...draft, code: "NEW-002" }), /Storage unavailable/);
  rejectWrites = false;
  assert.equal(records.get("opsflow.projects.v1"), projectSnapshot);
  const concurrentProjects = await Promise.all([createProject({ ...draft, code: "NEW-002" }), createProject({ ...draft, code: "NEW-003" })]);
  assert.notEqual(concurrentProjects[0].id, concurrentProjects[1].id);
  assert.equal((await getProjectDirectory()).projects.length, 4);
  const sameCode = await Promise.allSettled([createProject({ ...draft, code: "SAME-004" }), createProject({ ...draft, code: "SAME-004" })]);
  assert.equal(sameCode.filter((result) => result.status === "fulfilled").length, 2);
  const generatedProjects = (await getProjectDirectory()).projects;
  assert.equal(new Set(generatedProjects.map((project) => project.code)).size, generatedProjects.length);
  const { generateProjectCode } = await import(pathToFileURL(join(temporary, "generateProjectCode.mjs")));
  assert.equal(generateProjectCode([{ ...saved, code: "PRJ-0001" }, { ...saved, code: "PRJ-0002" }]), "PRJ-0003");
  const projectsBeforeEdit = (await getProjectDirectory()).projects;
  const edited = await updateProject(saved.id, { ...saved, id: 999999, name: "Updated initiative", status: "completed", endDate: saved.startDate });
  assert.equal(edited.id, saved.id);
  assert.equal(edited.code, saved.code);
  assert.equal(edited.status, "completed");
  assert.deepEqual(await getProject(saved.id), edited);
  assert.deepEqual((await getProjectDirectory()).projects.filter((record) => record.id !== saved.id), projectsBeforeEdit.filter((record) => record.id !== saved.id));
  const tamperedCode = await updateProject(saved.id, { ...edited, code: suppliedCodeIgnored.code });
  assert.equal(tamperedCode.code, saved.code);
  assert.equal((await getProject(saved.id)).code, saved.code);
  await assert.rejects(updateProject(saved.id, { ...edited, endDate: null }), ProjectValidationError);
  await assert.rejects(updateProject(saved.id, { ...edited, ownerId: inactiveOwner.id }), ProjectValidationError);
  await assert.rejects(updateProject(saved.id, { ...edited, name: " " }), ProjectValidationError);
  await assert.rejects(getProject(999999), ProjectNotFoundError);
  await assert.rejects(updateProject(999999, edited), ProjectNotFoundError);
  const editSnapshot = records.get("opsflow.projects.v1");
  rejectWrites = true;
  await assert.rejects(updateProject(saved.id, { ...edited, name: "Must not persist" }), /Storage unavailable/);
  rejectWrites = false;
  assert.equal(records.get("opsflow.projects.v1"), editSnapshot);
  const newOwner = before.find((employee) => employee.active && employee.id !== owner.id);
  const remainingMember = before.find((employee) => employee.id !== owner.id && employee.id !== newOwner.id);
  records.set("opsflow.projects.v1", JSON.stringify([{ ...edited, memberIds: [newOwner.id, remainingMember.id] }]));
  const reassigned = await updateProject(saved.id, { ...edited, ownerId: newOwner.id, memberIds: [] });
  assert.equal(reassigned.ownerId, newOwner.id);
  assert.deepEqual(reassigned.memberIds, [remainingMember.id]);
  assert.doesNotThrow(() => assertEmployeeCanBeDeleted(owner.id));
  assert.throws(() => assertEmployeeCanBeDeleted(newOwner.id), ProjectDependencyError);
  assert.throws(() => assertEmployeeCanBeDeleted(remainingMember.id), ProjectDependencyError);
  assert.deepEqual(await listEmployees(), before);
  const cancelled = await updateProject(saved.id, { ...reassigned, status: "cancelled" });
  assert.equal(cancelled.status, "cancelled");
  assert.equal((await getProjectDirectory()).projects.length, 1);
  const employeesBeforeTeam = await listEmployees();
  const assigned = await updateProjectMembers(saved.id, [owner.id, inactiveOwner.id]);
  assert.deepEqual(assigned, { ...cancelled, memberIds: [owner.id, inactiveOwner.id] });
  assert.deepEqual(await getProject(saved.id), assigned);
  assert.deepEqual(await listEmployees(), employeesBeforeTeam);
  assert.throws(() => assertEmployeeCanBeDeleted(owner.id), ProjectDependencyError);
  await assert.rejects(updateProjectMembers(saved.id, [owner.id, owner.id]), ProjectValidationError);
  await assert.rejects(updateProjectMembers(saved.id, [newOwner.id]), ProjectValidationError);
  await assert.rejects(updateProjectMembers(saved.id, [999999]), ProjectValidationError);
  await assert.rejects(updateProjectMembers(999999, []), ProjectNotFoundError);
  const teamSnapshot = records.get("opsflow.projects.v1");
  rejectWrites = true;
  await assert.rejects(updateProjectMembers(saved.id, []), /Storage unavailable/);
  rejectWrites = false;
  assert.equal(records.get("opsflow.projects.v1"), teamSnapshot);
  const cleared = await updateProjectMembers(saved.id, []);
  assert.deepEqual(cleared.memberIds, []);
  assert.doesNotThrow(() => assertEmployeeCanBeDeleted(owner.id));
  assert.throws(() => assertEmployeeCanBeDeleted(newOwner.id), ProjectDependencyError);
  assert.deepEqual(await listEmployees(), employeesBeforeTeam);
  await Promise.all([
    updateProject(saved.id, { ...cleared, name: "Concurrent project update" }),
    updateProjectMembers(saved.id, [remainingMember.id]),
  ]);
  const combinedUpdate = await getProject(saved.id);
  assert.equal(combinedUpdate.name, "Concurrent project update");
  assert.deepEqual(combinedUpdate.memberIds, [remainingMember.id]);
  assert.equal(combinedUpdate.code, saved.code);
  const profileSnapshot = records.get("opsflow.projects.v1");
  assert.deepEqual(await getEmployeeProjects(newOwner.id), { ownedProjects: [combinedUpdate], memberProjects: [] });
  assert.deepEqual(await getEmployeeProjects(remainingMember.id), { ownedProjects: [], memberProjects: [combinedUpdate] });
  assert.deepEqual(await getEmployeeProjects(owner.id), { ownedProjects: [], memberProjects: [] });
  assert.equal(records.get("opsflow.projects.v1"), profileSnapshot);
  const survivor = await createProject({ ...draft, ownerId: newOwner.id });
  const calendarProjects = [
    { ...combinedUpdate, id: 1, status: "active", endDate: "2026-09-22" },
    { ...combinedUpdate, id: 2, status: "planning", endDate: "2026-09-23" },
    { ...combinedUpdate, id: 3, status: "active", endDate: "2026-09-24" },
    { ...combinedUpdate, id: 4, status: "completed", endDate: "2026-09-20" },
    { ...combinedUpdate, id: 5, status: "cancelled", endDate: "2026-09-20" },
    { ...combinedUpdate, id: 6, status: "planning", endDate: null },
  ];
  const summary = summarizeWorkspace({ employees: before, projects: calendarProjects }, "2026-09-23");
  assert.equal(summary.peopleCount, before.length);
  assert.equal(summary.activePeopleCount, before.filter((person) => person.active).length);
  assert.equal(summary.projectCount, 6);
  assert.equal(summary.openProjectCount, 4);
  assert.equal(summary.overdueCount, 1);
  assert.deepEqual(summary.deadlines.map((project) => project.id), [1, 2, 3]);
  assert.equal(summary.statuses.reduce((total, item) => total + item.count, 0), 6);
  assert.deepEqual(calendarProjects.map((project) => project.id), [1, 2, 3, 4, 5, 6]);
  const { matchesProjectAttention, parseProjectAttention } = await import(pathToFileURL(join(temporary, "projectAttention.mjs")));
  assert.equal(parseProjectAttention("overdue"), "overdue");
  assert.equal(parseProjectAttention("unknown"), null);
  assert.equal(parseProjectAttention(null), null);
  for (const { category, count } of summary.attention) {
    assert.equal(count, calendarProjects.filter((project) => matchesProjectAttention(project, category, "2026-09-23")).length);
  }
  assert.equal(summary.attention.find((item) => item.category === "due-soon").count, 2);
  const boundaryProject = { ...calendarProjects[0], endDate: "2026-10-04", memberIds: [] };
  assert.equal(matchesProjectAttention(boundaryProject, "due-soon", "2026-09-27"), true);
  assert.equal(matchesProjectAttention({ ...boundaryProject, endDate: "2026-10-05" }, "due-soon", "2026-09-27"), false);
  assert.equal(matchesProjectAttention({ ...boundaryProject, endDate: "2027-01-03" }, "due-soon", "2026-12-27"), true);
  assert.equal(matchesProjectAttention(boundaryProject, "no-members", "2026-09-27"), true);
  assert.equal(matchesProjectAttention({ ...boundaryProject, memberIds: [9] }, "no-members", "2026-09-27"), false);
  for (const category of ["overdue", "due-soon", "no-members"]) {
    assert.equal(matchesProjectAttention({ ...boundaryProject, status: "completed" }, category, "2026-09-27"), false);
    assert.equal(matchesProjectAttention({ ...boundaryProject, status: "cancelled" }, category, "2026-09-27"), false);
  }
  assert.equal(matchesProjectAttention({ ...boundaryProject, endDate: null }, "due-soon", "2026-09-27"), false);
  const emptySummary = summarizeWorkspace({ employees: [], projects: [] }, "2026-09-23");
  assert.equal(emptySummary.openProjectCount, 0);
  assert.equal(emptySummary.peopleCount, 0);
  assert.deepEqual(emptySummary.deadlines, []);
  const manyDeadlines = Array.from({ length: 8 }, (_, id) => ({ ...calendarProjects[0], id: 8 - id }));
  assert.deepEqual(summarizeWorkspace({ employees: [], projects: manyDeadlines }, "2026-09-23").deadlines.map((project) => project.id), [1, 2, 3, 4, 5]);
  const beforeProjectDelete = (await getProjectDirectory()).projects;
  const peopleBeforeProjectDelete = await listEmployees();
  rejectWrites = true;
  await assert.rejects(deleteProject(saved.id), /Storage unavailable/);
  rejectWrites = false;
  assert.deepEqual((await getProjectDirectory()).projects, beforeProjectDelete);
  // Identity reservation may succeed before the removal write fails; retry must work.
  rejectKey = "opsflow.projects.v1";
  await assert.rejects(deleteProject(saved.id), /Storage unavailable/);
  rejectKey = "";
  assert.deepEqual((await getProjectDirectory()).projects, beforeProjectDelete);
  await deleteProject(saved.id);
  assert.deepEqual((await getProjectDirectory()).projects, [survivor]);
  assert.deepEqual(await getEmployeeProjects(remainingMember.id), { ownedProjects: [], memberProjects: [] });
  assert.deepEqual(await listEmployees(), peopleBeforeProjectDelete);
  assert.doesNotThrow(() => assertEmployeeCanBeDeleted(remainingMember.id));
  assert.throws(() => assertEmployeeCanBeDeleted(newOwner.id), ProjectDependencyError);
  await assert.rejects(getProject(saved.id), ProjectNotFoundError);
  await assert.rejects(deleteProject(saved.id), ProjectNotFoundError);
  await assert.rejects(deleteProject(999999), ProjectNotFoundError);
  await deleteProject(survivor.id);
  assert.deepEqual((await getProjectDirectory()).projects, []);
  assert.equal(records.get("opsflow.projects.v1"), "[]");
  assert.doesNotThrow(() => assertEmployeeCanBeDeleted(newOwner.id));
  const afterDelete = await createProject(draft);
  assert.ok(afterDelete.id > survivor.id);
  assert.notEqual(afterDelete.code, saved.code);
  assert.notEqual(afterDelete.code, survivor.code);
  assert.deepEqual(await listEmployees(), peopleBeforeProjectDelete);
  const { createTask, updateTaskProgress, updateTaskAssignment } = await import(pathToFileURL(join(temporary, "taskService.mjs")));
  const { changeDemoEmployeeId } = await import(pathToFileURL(join(temporary, "demoAuthService.mjs")));
  const { averageTaskProgress } = await import(pathToFileURL(join(temporary, "taskProgress.mjs")));
  const projectBeforeTasks = await getProject(afterDelete.id);
  assert.equal(averageTaskProgress([]), null);
  await assert.rejects(createTask(afterDelete.id, { title: "x", assigneeId: projectBeforeTasks.ownerId }), /title/);
  await assert.rejects(createTask(afterDelete.id, { title: "Valid task", assigneeId: 999999 }), /active employee/);
  const taskProject = await createTask(afterDelete.id, { title: "Prepare checklist", assigneeId: projectBeforeTasks.ownerId, scheduled: true });
  const firstTask = taskProject.tasks[0];
  assert.equal(firstTask.progress, 0);
  assert.equal(firstTask.scheduled, true);
  changeDemoRole("employee");
  await assert.rejects(updateTaskProgress(afterDelete.id, firstTask.id, 50, 1), PermissionError);
  changeDemoEmployeeId(projectBeforeTasks.ownerId);
  await assert.rejects(createTask(afterDelete.id, { title: "Forbidden create", assigneeId: projectBeforeTasks.ownerId }), PermissionError);
  for (const value of [-1, 101, 4.5, NaN]) await assert.rejects(updateTaskProgress(afterDelete.id, firstTask.id, value, 1), /whole number/);
  await assert.rejects(updateTaskAssignment(afterDelete.id, firstTask.id, { title: "Changed task", assigneeId: projectBeforeTasks.ownerId, scheduled: false }, 1), PermissionError);
  const halfway = await updateTaskProgress(afterDelete.id, firstTask.id, 50, 1);
  assert.equal(halfway.tasks[0].progress, 50);
  assert.equal(halfway.tasks[0].scheduled, true);
  assert.equal(averageTaskProgress(halfway.tasks), 50);
  assert.equal(averageTaskProgress([{ ...firstTask, progress: 20 }, { ...firstTask, progress: 80 }]), 50);
  await assert.rejects(updateTaskProgress(afterDelete.id, firstTask.id, 80, 1), /changed elsewhere/);
  const taskSnapshot = records.get("opsflow.projects.v1");
  rejectWrites = true;
  await assert.rejects(updateTaskProgress(afterDelete.id, firstTask.id, 75, 2), /Storage unavailable/);
  rejectWrites = false;
  assert.equal(records.get("opsflow.projects.v1"), taskSnapshot);
  changeDemoRole("viewer");
  await assert.rejects(updateTaskProgress(afterDelete.id, firstTask.id, 75, 2), PermissionError);
  changeDemoRole("administrator");
  const completeTask = await updateTaskProgress(afterDelete.id, firstTask.id, 100, 2);
  assert.equal(completeTask.status, projectBeforeTasks.status);
  const preserved = await updateProject(afterDelete.id, { ...draft, name: "Task-preserving project edit" });
  assert.deepEqual(preserved.tasks, completeTask.tasks);
  const otherPerson = (await listEmployees()).find((person) => person.active && person.id !== projectBeforeTasks.ownerId);
  await updateProjectMembers(afterDelete.id, [otherPerson.id]);
  const reassignedTask = await updateTaskAssignment(afterDelete.id, firstTask.id, { title: "Prepare checklist", assigneeId: otherPerson.id }, 3);
  assert.equal(reassignedTask.tasks[0].progress, 100);
  await assert.rejects(updateProjectMembers(afterDelete.id, []), /Reassign tasks/);
  changeDemoRole("employee");
  changeDemoEmployeeId(projectBeforeTasks.ownerId);
  await assert.rejects(updateTaskProgress(afterDelete.id, firstTask.id, 80, 4), PermissionError);
  changeDemoRole("administrator");
  await updateProject(afterDelete.id, { ...draft, status: "cancelled" });
  await assert.rejects(updateTaskProgress(afterDelete.id, firstTask.id, 80, 4), /read-only/);
  await updateProject(afterDelete.id, draft);
  const { getMyTasks } = await import(pathToFileURL(join(temporary, "myTasksService.mjs")));
  const { collectAssignedTasks, filterAssignedTasks } = await import(pathToFileURL(join(temporary, "assignedTasks.mjs")));
  await assert.rejects(getMyTasks(), PermissionError);
  changeDemoRole("employee");
  await assert.rejects(getMyTasks(), /Select an active employee/);
  changeDemoEmployeeId(otherPerson.id);
  const personalQueue = await getMyTasks();
  assert.equal(personalQueue.employee.id, otherPerson.id);
  assert.equal(personalQueue.assignments.length, 1);
  assert.ok(personalQueue.assignments.every((item) => item.task.assigneeId === otherPerson.id));
  changeDemoEmployeeId(projectBeforeTasks.ownerId);
  assert.equal((await getMyTasks()).assignments.length, 0);
  changeDemoEmployeeId(999999);
  await assert.rejects(getMyTasks(), /Select an active employee/);
  changeDemoRole("administrator");
  const queueProject = await getProject(afterDelete.id);
  const sampleQueue = collectAssignedTasks([
    { ...queueProject, id: 100, name: "Alpha project", tasks: [{ ...queueProject.tasks[0], id: "a", progress: 0 }] },
    { ...queueProject, id: 101, name: "Beta project", tasks: [{ ...queueProject.tasks[0], id: "b", progress: 50 }] },
    { ...queueProject, id: 102, name: "Closed project", status: "cancelled", tasks: [{ ...queueProject.tasks[0], id: "c", progress: 100 }] },
  ], otherPerson.id);
  assert.equal(sampleQueue.length, 3);
  assert.equal(filterAssignedTasks(sampleQueue, "", "all", false).length, 2);
  assert.equal(filterAssignedTasks(sampleQueue, "", "complete", false).length, 0);
  assert.equal(filterAssignedTasks(sampleQueue, "", "complete", true).length, 1);
  assert.equal(filterAssignedTasks(sampleQueue, "  ALPHA  ", "not-started", false).length, 1);
  assert.equal(filterAssignedTasks(sampleQueue, "", "in-progress", false).length, 1);
  assert.equal(collectAssignedTasks([{ ...queueProject, tasks: undefined }], otherPerson.id).length, 0);
  const validTaskStorage = records.get("opsflow.projects.v1");
  const malformedProjects = JSON.parse(validTaskStorage);
  malformedProjects.find((project) => project.id === afterDelete.id).tasks[0].progress = 101;
  records.set("opsflow.projects.v1", JSON.stringify(malformedProjects));
  await assert.rejects(getProject(afterDelete.id), /could not be read/);
  records.set("opsflow.projects.v1", validTaskStorage);
  const permissionSnapshot = new Map(records);
  changeDemoRole("viewer");
  for (const permission of ["employees.manage", "projects.create", "projects.edit", "projects.delete", "projects.assign"]) {
    assert.equal(hasPermission("administrator", permission), true);
    assert.equal(hasPermission("viewer", permission), false);
  }
  await assert.rejects(createEmployee(input), PermissionError);
  await assert.rejects(updateEmployee(owner.id, input), PermissionError);
  await assert.rejects(deleteEmployee(owner.id), PermissionError);
  await assert.rejects(createProject(draft), PermissionError);
  await assert.rejects(updateProject(afterDelete.id, draft), PermissionError);
  await assert.rejects(updateProjectMembers(afterDelete.id, []), PermissionError);
  await assert.rejects(deleteProject(afterDelete.id), PermissionError);
  assert.deepEqual(records, permissionSnapshot);
  assert.equal((await getProject(afterDelete.id)).id, afterDelete.id);
  changeDemoRole("manager");
  assert.equal(hasPermission("manager", "employees.manage"), false);
  assert.equal(hasPermission("manager", "projects.delete"), false);
  await assert.rejects(createEmployee(input), PermissionError);
  await assert.rejects(deleteProject(afterDelete.id), PermissionError);
  const managerProject = await createProject(draft);
  await updateProject(managerProject.id, { ...draft, name: "Manager update" });
  await updateProjectMembers(managerProject.id, []);
  changeDemoRole("administrator");
  const managerTaskProject = await createTask(managerProject.id, { title: "Deletion cleanup task", assigneeId: managerProject.ownerId });
  assert.equal(managerTaskProject.tasks.length, 1);
  await deleteProject(managerProject.id);
  assert.equal(JSON.parse(records.get("opsflow.projects.v1")).some((project) => project.id === managerProject.id), false);
  const pendingWrite = createEmployee({ ...input, email: "role-change@example.com" });
  changeDemoRole("viewer");
  await assert.rejects(pendingWrite, PermissionError);
  changeDemoRole("administrator");
  records.set("opsflow.projects.v1", "{}");
  await assert.rejects(createProject({ ...draft, code: "NEW-005" }), /could not be read/);
  assert.equal(records.get("opsflow.projects.v1"), "{}");
  await assert.rejects(deleteProject(afterDelete.id), /could not be read/);
  await assert.rejects(getEmployeeProjects(owner.id), /could not be read/);
  console.log("PASS: employee/project CRUD; assignments; preserved employees; immutable/non-reused project codes and IDs; dependency cleanup; empty-directory persistence; retry after partial write; validation; concurrency; failure preservation.");
} finally {
  await rm(temporary, { recursive: true, force: true });
}















