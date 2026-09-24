import { FcGoogle } from "react-icons/fc";
import styles from "../../styles/auth/LoginPage.module.css";

export function GoogleSignIn() {
  return <div className={styles.socialSignIn}>
    <button type="button" className={styles.googleButton} disabled aria-describedby="google-sign-in-note">
      <FcGoogle aria-hidden="true" /> Sign in with Google
    </button>
    <p id="google-sign-in-note" className={styles.socialNote}>Google sign-in is not connected yet. Use email below.</p>
    <div className={styles.divider}><span>or continue with email</span></div>
  </div>;
}
