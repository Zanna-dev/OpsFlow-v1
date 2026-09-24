import { useState } from "react";
export function useRefreshConfirmation(dirty: boolean, pending: boolean, refresh: () => void) {
  const [confirming, setConfirming] = useState(false);
  function request() {
    if (pending) return;
    if (dirty) setConfirming(true); else refresh();
  }
  function confirm() {
    if (pending) return;
    setConfirming(false);
    refresh();
  }
  return { confirming, request, confirm, cancel: () => setConfirming(false) };
}
