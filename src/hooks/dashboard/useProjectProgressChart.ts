import { useState } from "react";
import { getProjectProgressHistory } from "../../services/dashboard/projectHistoryService";

export function useProjectProgressChart() {
  const [history] = useState(getProjectProgressHistory);
  const [selectedIndex, setSelectedIndex] = useState(() => history.months.findLastIndex((month) => month.completion !== null));
  const selected = history.months[selectedIndex];
  const previous = history.months[selectedIndex - 1]?.completion;
  const change = selected.completion !== null && previous != null ? selected.completion - previous : null;
  const gap = selected.completion === null ? null : selected.completion - selected.planned;
  return { history, selected, selectedIndex, selectMonth: setSelectedIndex, change, gap };
}
