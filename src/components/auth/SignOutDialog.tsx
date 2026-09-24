import { useId } from "react";
import { FiLogOut, FiX } from "react-icons/fi";
import { useConfirmDialog } from "../../hooks/common/useConfirmDialog";
import type { SignOutDialogProps } from "../../interfaces/signOutDialog.interfaces";
import styles from "../../styles/auth/SignOutDialog.module.css";

export function SignOutDialog({ onConfirm, onCancel, disabled }: SignOutDialogProps) {
  const id = useId();
  const { dialogRef, cancelRef, handleCancel } = useConfirmDialog(false, onCancel, "main-content");
  return <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onCancel={handleCancel}>
    <div className={styles.header}><span className={styles.icon}><FiLogOut aria-hidden="true" /></span><button className={styles.close} type="button" onClick={onCancel} aria-label="Close sign-out confirmation"><FiX aria-hidden="true" /></button></div>
    <h2 id={`${id}-title`}>Sign out of OpsFlow?</h2>
    <p id={`${id}-description`}>You will return to the login screen. Your saved work will be here when you sign in again.</p>
    <div className={styles.actions}><button ref={cancelRef} type="button" onClick={onCancel}>Stay signed in</button><button className={styles.confirm} type="button" onClick={onConfirm} disabled={disabled}>Yes, sign out</button></div>
  </dialog>;
}
