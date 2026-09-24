import type { ProjectStatus } from "../types/projectCard.types";
export interface ProjectCardProps {
  id: number;
  name: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  onView: (id: number) => void;
}
