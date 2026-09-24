import { useState, useSyncExternalStore } from "react";
import { AuthContext } from "./AuthContext";
import * as sessionService from "../services/auth/sessionService";
import { changeDemoEmployeeId, getDemoEmployeeId, changeDemoRole, getDemoRole, subscribeDemoRole } from "../services/auth/demoAuthService";
import { hasPermission } from "../constants/permissions";
import type { AuthProviderProps } from "../interfaces/auth.interfaces";
export function AuthProvider({ children }: AuthProviderProps) {
  const [formBusy, setFormBusy] = useState(false);
  const session = useSyncExternalStore(sessionService.subscribeSession, sessionService.getSession);
  const employeeId = useSyncExternalStore(subscribeDemoRole, getDemoEmployeeId);
  const role = useSyncExternalStore(subscribeDemoRole, getDemoRole);
  return <AuthContext.Provider value={{ session,
    signIn: async (input) => { await sessionService.signIn(input); changeDemoRole("administrator"); },
    signOut: () => { sessionService.signOut(); changeDemoRole("administrator"); setFormBusy(false); },
    employeeId, changeEmployee: changeDemoEmployeeId, formBusy, setFormBusy, role, changeRole: changeDemoRole, can: (permission) => session !== null && hasPermission(role, permission) }}>{children}</AuthContext.Provider>;
}


