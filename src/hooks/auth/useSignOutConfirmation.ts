import { useState } from "react";
import { useAuth } from "./useAuth";

export function useSignOutConfirmation() {
  const { signOut, formBusy } = useAuth();
  const [confirming, setConfirming] = useState(false);
  return {
    confirming, formBusy,
    requestSignOut: () => { if (!formBusy) setConfirming(true); },
    cancelSignOut: () => setConfirming(false),
    confirmSignOut: () => { if (!formBusy) { setConfirming(false); signOut(); } },
  };
}
