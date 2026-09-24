import { useId } from "react";
import { useConfirmDialog } from "../../hooks/common/useConfirmDialog";
import type { UnsavedChangesDialogProps } from "../../interfaces/UnsavedChangesDialog.interfaces";
import styles from "./ConfirmDialog.module.css";

export function UnsavedChangesDialog({ onStay, onDiscard, submitting, refreshing = false }: UnsavedChangesDialogProps) {
  const id = useId();
  const { dialogRef, cancelRef, handleCancel } = useConfirmDialog(false, onStay, "main-content");
  return <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onCancel={handleCancel}>
    <h2 id={`${id}-title`}>{submitting ? "Save in progress" : refreshing ? "Discard draft and refresh?" : "Leave without saving?"}</h2>
    <p id={`${id}-description`}>{submitting ? "Wait for the save to finish before leaving this form." : refreshing ? "Refresh will discard only your unsaved edits and reload the saved records. Saved assignments will remain." : "Your edits have not been saved. Stay to continue editing, or discard them and leave."}</p>
    <div className={styles.actions}><button type="button" ref={cancelRef} onClick={onStay}>Stay on this page</button><button type="button" className={styles.confirm} disabled={submitting} onClick={onDiscard}>{refreshing ? "Discard draft and refresh" : "Discard changes"}</button></div>
  </dialog>;
}


