import { useState } from "react";

export function useSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  return { collapsed, toggleSidebar: () => setCollapsed((value) => !value) };
}
