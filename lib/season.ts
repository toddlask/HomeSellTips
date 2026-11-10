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

export function busiestMonth(months: readonly SeasonMonth[]): SeasonMonth {
  return months.reduce((best, month) => (month.sales > best.sales ? month : best));
}

export function timingReading(input: { moveDateFixed: boolean; houseReady: boolean }): string {
  if (input.moveDateFixed) {
    return "A fixed move date decides the listing window. Finish the prep you still need, then list in time for that date. The chart shows national closed sales, not the price this house will bring.";
  }
  if (!input.houseReady) {
    return "Finish the work that has to be done before you list. The chart is context for when sales have closed nationally. It is not a reason to skip a repair or to pick a price.";
  }
  return "The house is ready and the move date can move. Use the taller bars as context for when more sales closed in this span, then price this house from comps you can check.";
}
