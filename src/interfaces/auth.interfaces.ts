import type { ReactNode } from "react";
import type { DemoSession, SignInInput } from "./session.interfaces";
import type { Permission, Role } from "../types/auth.types";
export interface AuthContextValue { session: DemoSession | null; signIn: (input: SignInInput) => Promise<void>; signOut: () => void; employeeId: number | null; changeEmployee: (id: number | null) => void; formBusy: boolean; setFormBusy: (busy: boolean) => void; role: Role; changeRole: (role: Role) => void; can: (permission: Permission) => boolean; }
export interface AuthProviderProps { children: ReactNode; }
export interface PermissionProps { permission: Permission; children: ReactNode; }




