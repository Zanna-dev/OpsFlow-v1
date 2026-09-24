import styles from "../../styles/auth/LoginPage.module.css";

export function DemoAccessNote() {
  return <details className={styles.demoAccess}>
    <summary>Explore with a demo account</summary>
    <div id="login-preview-note" className={styles.demoDetails}>
      <p>Email: <strong>admin@opsflow.demo</strong><br />Password: <strong>OpsFlowDemo!23</strong></p>
      <p>Use these sample credentials only. Reloading signs you out. Password recovery is not connected yet.</p>
    </div>
  </details>;
}
