import { FiX } from "react-icons/fi";
import type { ProjectFilterChipsProps } from "../../interfaces/project.interfaces";
import { priorityLabels, statusLabels } from "../../constants/projects";
import styles from "../../styles/projects/ProjectFilterChips.module.css";

export function ProjectFilterChips({ filters, ownerNames, changeFilter }: ProjectFilterChipsProps) {
  return <div className={styles.chips} role="group" aria-label="Active project filters">
    {filters.search && <button type="button" onClick={() => changeFilter("search", "")} aria-label="Remove search filter"><span>Search: {filters.search}</span><FiX aria-hidden="true" /></button>}
    {filters.status !== "all" && <button type="button" onClick={() => changeFilter("status", "all")} aria-label="Remove status filter"><span>Status: {statusLabels[filters.status]}</span><FiX aria-hidden="true" /></button>}
    {filters.priority !== "all" && <button type="button" onClick={() => changeFilter("priority", "all")} aria-label="Remove priority filter"><span>Priority: {priorityLabels[filters.priority]}</span><FiX aria-hidden="true" /></button>}
    {filters.owner !== "all" && <button type="button" onClick={() => changeFilter("owner", "all")} aria-label="Remove owner filter"><span>Owner: {ownerNames.get(Number(filters.owner)) ?? `Unavailable (#${filters.owner})`}</span><FiX aria-hidden="true" /></button>}
  </div>;
}
