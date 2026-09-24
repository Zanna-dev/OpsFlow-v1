import type { ProjectProgressHistory } from "../../interfaces/projectChart.interfaces";

// Illustrative portfolio snapshots, independent of current local project records.
// Replace with monthly recorded snapshots when history storage is introduced.
export function getProjectProgressHistory(): ProjectProgressHistory {
  return {
    year: 2026,
    months: [
      { month: "January", completion: 12, planned: 15 },
      { month: "February", completion: 21, planned: 23 },
      { month: "March", completion: 29, planned: 32 },
      { month: "April", completion: 38, planned: 40 },
      { month: "May", completion: 44, planned: 48 },
      { month: "June", completion: 57, planned: 56 },
      { month: "July", completion: 64, planned: 65 },
      { month: "August", completion: 72, planned: 74 },
      { month: "September", completion: 81, planned: 82 },
      { month: "October", completion: null, planned: 88 },
      { month: "November", completion: null, planned: 94 },
      { month: "December", completion: null, planned: 100 },
    ],
  };
}
