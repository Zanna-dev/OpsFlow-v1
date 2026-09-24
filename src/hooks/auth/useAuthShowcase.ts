import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useMediaQuery } from "../common/useMediaQuery";
import { authScenes } from "../../constants/authScenes";
function subscribeVisibility(notify: () => void) {
  document.addEventListener("visibilitychange", notify);
  return () => document.removeEventListener("visibilitychange", notify);
}
export function useAuthShowcase() {
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wide = useMediaQuery("(min-width: 768px)");
  const documentVisible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false);
  const playing = !paused && !reducedMotion && wide && visible && documentVisible;
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (panelRef.current) observer.observe(panelRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setScene((value) => (value + 1) % authScenes.length), 6000);
    return () => window.clearInterval(timer);
  }, [playing]);
  function select(index: number) { setPaused(true); setScene((index + authScenes.length) % authScenes.length); }
  return { panelRef, scene, playing, reducedMotion, select, pause: () => setPaused(true), toggle: () => setPaused((value) => !value) };
}
