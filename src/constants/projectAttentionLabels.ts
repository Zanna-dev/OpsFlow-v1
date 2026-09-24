import type { ProjectAttention } from "../types/projectAttention.types";

export const attentionCategories: ProjectAttention[] = ["overdue", "due-soon", "no-members"];
export const attentionLabels: Record<ProjectAttention, string> = {
  overdue: "Overdue", "due-soon": "Due within seven days", "no-members": "No team members",
};
export const attentionDescriptions: Record<ProjectAttention, string> = {
  overdue: "Open projects with an end date before today.",
  "due-soon": "Open projects due today through seven days ahead.",
  "no-members": "Open projects with an owner but no additional team members.",
};
