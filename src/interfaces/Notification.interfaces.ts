export interface NotificationProps {
  title?: string;
  message: string;
  onClose: () => void;
  tone?: "success" | "error";
  floating?: boolean;
}
