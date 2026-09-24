export interface MonthlyProjectProgress {
  month: string;
  completion: number | null;
  planned: number;
}

export interface ProjectProgressHistory {
  year: number;
  months: MonthlyProjectProgress[];
}
