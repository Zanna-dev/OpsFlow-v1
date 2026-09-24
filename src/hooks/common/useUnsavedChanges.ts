import { useCallback, useEffect, useRef } from "react";
import { useBlocker, useBeforeUnload } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export function useUnsavedChanges(dirty: boolean, submitting: boolean) {
  const saved = useRef(false);
  const { setFormBusy } = useAuth();
  const blocker = useBlocker(({ currentLocation, nextLocation }) => !saved.current && (dirty || submitting) && (currentLocation.pathname !== nextLocation.pathname || currentLocation.search !== nextLocation.search));
  useEffect(() => {
    if (!dirty && !submitting && blocker.state === "blocked") blocker.reset();
  }, [dirty, submitting, blocker]);
  useBeforeUnload(useCallback((event: BeforeUnloadEvent) => {
    if (!saved.current && (dirty || submitting)) { event.preventDefault(); event.returnValue = ""; }
  }, [dirty, submitting]));
  useEffect(() => {
    setFormBusy(dirty || submitting);
    return () => setFormBusy(false);
  }, [dirty, submitting, setFormBusy]);
  return { blocker, allowSavedNavigation: () => { saved.current = true; if (blocker.state === "blocked") blocker.reset(); } };
}


