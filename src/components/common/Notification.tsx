import type { NotificationProps } from "../../interfaces/Notification.interfaces";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";
import styles from "./Notification.module.css";



export function Notification({ message, onClose, title, tone = "success", floating = false }: NotificationProps) {
  return <div className={`${styles.notification} ${floating ? styles.floating : ""}`} data-tone={tone}>
    <span className={styles.icon} aria-hidden="true">{tone === "error" ? <FiAlertCircle /> : <FiCheckCircle />}</span>
    <div role={tone === "error" ? "alert" : "status"}><strong>{title ?? (tone === "error" ? "Unable to save" : "Changes saved")}</strong><p>{message}</p></div>
    <button type="button" onClick={onClose} aria-label="Dismiss notification"><FiX /></button>
  </div>;
}

