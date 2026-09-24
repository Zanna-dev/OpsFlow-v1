export interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  pendingLabel?: string;
  fallbackFocusId?: string;
  pending: boolean;
  error: string;
  onConfirm: () => void;
  onCancel: () => void;
  onDismissError: () => void;
}

