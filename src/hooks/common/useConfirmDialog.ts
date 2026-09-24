import { useEffect, useRef, type SyntheticEvent } from "react";

export function useConfirmDialog(pending: boolean, onCancel: () => void, fallbackFocusId: string) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog?.showModal();
    cancelRef.current?.focus();
    return () => {
      dialog?.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected && !previousFocus.matches(":disabled")) {
        previousFocus.focus();
      } else {
        document.getElementById(fallbackFocusId)?.focus();
      }
    };
  }, [fallbackFocusId]);

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    if (!pending) onCancel();
  }

  return { dialogRef, cancelRef, handleCancel };
}

