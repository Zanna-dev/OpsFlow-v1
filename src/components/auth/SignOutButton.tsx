import { FiLogOut } from "react-icons/fi";
import { useSignOutConfirmation } from "../../hooks/auth/useSignOutConfirmation";
import { SignOutDialog } from "./SignOutDialog";
import styles from "../../styles/auth/SignOutButton.module.css";

export function SignOutButton() {
  const { confirming, formBusy, requestSignOut, cancelSignOut, confirmSignOut } = useSignOutConfirmation();
  return <><button className={styles.button} type="button" onClick={requestSignOut} disabled={formBusy} title={formBusy ? "Save or discard your changes before signing out" : "Sign out of this workspace"}><FiLogOut aria-hidden="true" /> Sign out</button>
    {confirming && <SignOutDialog onConfirm={confirmSignOut} onCancel={cancelSignOut} disabled={formBusy} />}</>;
}
