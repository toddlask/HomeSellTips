import type { Metadata } from "next";
import { SEASON_MONTHS, SEASON_SOURCE, seasonMax } from "@/lib/season";

export const metadata: Metadata = {
  title: "Best time to sell",
  description: "Monthly US existing-home sales from the FRED series EXHOSLUSM495N. One published year, not a forecast.",
  openGraph: {
    title: "Best time to sell",
    description: "Monthly US existing-home sales from a cited FRED series.",
    url: "/tools/when-to-sell",
  },
};

function formatSales(sales: number): string {
  const digits = String(sales);
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function WhenToSellPage() {
  const max = seasonMax(SEASON_MONTHS);
  return (
    <>
      <h1>Best time to sell</h1>
      <p className="lede">
        These bars are closed US existing-home sales, not seasonally adjusted, from September 2025 through September
        2026. FRED publishes that span for this series. It is one year of closed sales, not a long-run seasonal index,
        and it does not say what your home will sell for.
      </p>
      <figure className="season-chart">
        <figcaption>
          Existing-home sales, number of units. Source: National Association of Realtors, via{" "}
          <a href={SEASON_SOURCE}>FRED series EXHOSLUSM495N</a>. Table last updated October 13, 2026.
        </figcaption>
        <table>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Sales</th>
            </tr>
          </thead>
          <tbody>
            {SEASON_MONTHS.map((month) => (
              <tr key={month.label}>
                <th scope="row">{month.label}</th>
                <td>
                  <span className="season-count">{formatSales(month.sales)}</span>
                  <span className="season-track" aria-hidden="true">
                    <span className="season-bar" style={{ width: `${Math.round((month.sales / max) * 100)}%` }} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </figure>
      <p>
        A buyer who closes in June went under contract earlier. Use the chart as context, then price this house from
        comps you can check.
      </p>
    </>
  );
}
