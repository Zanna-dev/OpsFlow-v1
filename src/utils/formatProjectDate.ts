const formatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function formatProjectDate(value: string | null): string {
  return value === null ? "Not scheduled" : formatter.format(new Date(`${value}T00:00:00Z`));
}
