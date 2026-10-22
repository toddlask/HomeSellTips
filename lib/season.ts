export type SeasonMonth = {
  label: string;
  sales: number;
};

// National Association of Realtors existing-home sales, not seasonally adjusted,
// as published by FRED series EXHOSLUSM495N. Table checked 2026-10-22.
// Date range on that table: 2025-09-01 through 2026-09-01. Last updated 2026-10-13.
// https://fred.stlouisfed.org/series/EXHOSLUSM495N
export const SEASON_SOURCE = "https://fred.stlouisfed.org/series/EXHOSLUSM495N";

export const SEASON_MONTHS: readonly SeasonMonth[] = [
  { label: "Sep 2025", sales: 355000 },
  { label: "Oct 2025", sales: 359000 },
  { label: "Nov 2025", sales: 295000 },
  { label: "Dec 2025", sales: 346000 },
  { label: "Jan 2026", sales: 228000 },
  { label: "Feb 2026", sales: 259000 },
  { label: "Mar 2026", sales: 329000 },
  { label: "Apr 2026", sales: 356000 },
  { label: "May 2026", sales: 391000 },
  { label: "Jun 2026", sales: 424000 },
  { label: "Jul 2026", sales: 401000 },
  { label: "Aug 2026", sales: 358000 },
  { label: "Sep 2026", sales: 341000 },
];

export function seasonMax(months: readonly SeasonMonth[]): number {
  return months.reduce((max, month) => (month.sales > max ? month.sales : max), 0);
}
