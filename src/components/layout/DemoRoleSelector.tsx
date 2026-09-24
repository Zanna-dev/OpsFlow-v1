import { DemoEmployeeSelector } from "./DemoEmployeeSelector";
import { useAuth } from "../../hooks/auth/useAuth";
import { roleLabels } from "../../constants/permissions";
import type { Role } from "../../types/auth.types";
import styles from "../../styles/auth/DemoRoleSelector.module.css";
export function DemoRoleSelector() {
  const { role, changeRole, formBusy } = useAuth();
  return <div className={styles.controls}><label className={styles.selector}><span>Demo role</span><select disabled={formBusy} value={role} onChange={(event) => changeRole(event.target.value as Role)} title={formBusy ? "Save or discard your form changes before switching roles." : "Role preview only. Reload resets to Administrator."}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>{role === "employee" && <DemoEmployeeSelector />}</div>;
}


