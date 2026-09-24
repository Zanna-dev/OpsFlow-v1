import type { ReactNode } from "react";

export interface ChildNodeProps { children: ReactNode; }
export interface AppButtonProps { label: string; disabled?: boolean; }
export interface EmployeeCardProps { name: string; email: string; department: string; activeStatus: boolean; }
export interface UserCardProps { user: Pick<EmployeeCardProps, "name" | "email" | "department">; }
export interface ButtonProps { onDelete: () => void; }
export interface RemoveUserProps { onDelete: (id: number) => void; }
