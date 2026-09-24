import { useId } from "react";
import { FiTrash2, FiX } from "react-icons/fi";
import { Notification } from "./Notification";
import { useConfirmDialog } from "../../hooks/common/useConfirmDialog";
import type { ConfirmDialogProps } from "../../interfaces/ConfirmDialog.interfaces";
import styles from "./ConfirmDialog.module.css";

export function ConfirmDialog({ title, description, confirmLabel, pendingLabel = "Deleting…", fallbackFocusId = "directory-title", pending, error, onConfirm, onCancel, onDismissError }: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const { dialogRef, cancelRef, handleCancel } = useConfirmDialog(pending, onCancel, fallbackFocusId);

  return <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={handleCancel}>
    <div className={styles.header}>
      <span className={styles.icon}><FiTrash2 aria-hidden="true" /></span>
      <button className={styles.close} type="button" onClick={onCancel} disabled={pending} aria-label="Close confirmation"><FiX /></button>
    </div>
    <h2 id={titleId}>{title}</h2>
    <p id={descriptionId}>{description}</p>
    {error && <Notification tone="error" title="Unable to delete" message={error} onClose={onDismissError} />}
    <div className={styles.actions}>
      <button ref={cancelRef} type="button" onClick={onCancel} disabled={pending}>Cancel</button>
      <button className={styles.confirm} type="button" onClick={onConfirm} disabled={pending}>{pending ? pendingLabel : confirmLabel}</button>
    </div>
    <span className="sr-only" role="status">{pending ? `${pendingLabel} Please wait.` : ""}</span>
  </dialog>;
}

