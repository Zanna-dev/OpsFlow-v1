import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function useRouteAccessibility() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(pathname);

  useEffect(() => {
    const section = pathname === "/my-tasks" ? "My tasks" : pathname.startsWith("/employees") ? "People" : pathname.startsWith("/projects") ? "Projects" : pathname === "/overview" || pathname === "/" ? "Overview" : "Page not found";
    document.title = `${section} | OpsFlow`;
    // Keep initial focus natural, but provide a predictable starting point after navigation.
    if (previousPath.current !== pathname) {
      mainRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    previousPath.current = pathname;
  }, [pathname]);

  return mainRef;
}

