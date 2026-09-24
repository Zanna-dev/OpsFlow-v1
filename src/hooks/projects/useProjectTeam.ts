import { useRefreshConfirmation } from "../common/useRefreshConfirmation";
import { ProjectDependencyError } from "../../services/projects/projectStorage";
import { useUnsavedChanges } from "../common/useUnsavedChanges";
import { useAuth } from "../auth/useAuth";
import { useRef, useState } from "react";
import type { Project } from "../../interfaces/project.interfaces";
import { ProjectNotFoundError, ProjectValidationError, updateProjectMembers } from "../../services/projects/projectService";
import { useProjectOwners } from "./useProjectOwners";

export function useProjectTeam(project: Project, onRefresh: () => void) {
  const { can } = useAuth();
  const people = useProjectOwners();
  const [savedProject, setSavedProject] = useState(project);
  const [memberIds, setMemberIds] = useState([...project.memberIds]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectionAnnouncement, setSelectionAnnouncement] = useState("");
  const [saving, setSaving] = useState(false);
  const inFlight = useRef(false);
  const dirty = memberIds.length !== savedProject.memberIds.length || memberIds.some((id) => !savedProject.memberIds.includes(id));
  const refresh = useRefreshConfirmation(dirty, saving, onRefresh);
  const navigation = useUnsavedChanges(dirty, saving);
  const query = search.trim().toLowerCase();
  const eligible = people.employees.filter((employee) => employee.id !== savedProject.ownerId);
  const available = eligible.filter((employee) => !memberIds.includes(employee.id));
  const visibleEmployees = available.filter((employee) => employee.name.toLowerCase().includes(query) || employee.email.toLowerCase().includes(query)).sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id);
  const names = new Map(people.employees.map((employee) => [employee.id, employee.name]));

  function toggleMember(id: number) {
    if (!can("projects.assign") || inFlight.current || id === savedProject.ownerId) return;
    const removing = memberIds.includes(id);
    if (removing) setSearch("");
    setSelectionAnnouncement(`${names.get(id) ?? "Employee"} ${removing ? "returned to available employees" : "added to selected members"}.`);
    // The activated checkbox/chip leaves the DOM; return focus to the picker.
    window.requestAnimationFrame(() => document.getElementById("team-employee-search")?.focus());
    setMemberIds((previous) => previous.includes(id) ? previous.filter((memberId) => memberId !== id) : [...previous, id]);
    setError(""); setMessage("");
  }
  function discard() {
    if (inFlight.current) return;
    setMemberIds([...savedProject.memberIds]); setError(""); setMessage("");
  }
  async function save() {
    if (!can("projects.assign") || inFlight.current || !dirty || people.loading || people.error) return;
    inFlight.current = true; setSaving(true); setError(""); setMessage("");
    try {
      const updated = await updateProjectMembers(savedProject.id, memberIds);
      setSavedProject(updated); setMemberIds([...updated.memberIds]);
      setMessage(`The team for ${updated.name} was updated successfully.`);
    } catch (cause) {
      setError(cause instanceof ProjectDependencyError ? cause.message : cause instanceof ProjectValidationError
        ? `${Object.values(cause.fieldErrors)[0]} Your selections are still here.`
        : cause instanceof ProjectNotFoundError
          ? "This project no longer exists. Return to the project directory to continue."
          : "We couldn’t save this team. Your selections are still here. Check browser storage access and try again.");
    } finally { inFlight.current = false; setSaving(false); }
  }
  return {
    refresh, navigation, project: savedProject, people, memberIds, search, setSearch, visibleEmployees, dirty,
    error, message, saving, toggleMember, discard, save,
    owner: people.employees.find((employee) => employee.id === savedProject.ownerId),
    members: memberIds.map((id) => ({ id, name: names.get(id) ?? `Employee #${id} (unavailable)` })),
    availableCount: available.length, eligibleCount: eligible.length, selectionAnnouncement,
    dismissError: () => setError(""), dismissMessage: () => setMessage(""),
  };
}




