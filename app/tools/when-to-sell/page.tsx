import type { Metadata } from "next";
import { PagePhoto } from "@/components/home-photo";
import { PageByline } from "@/components/page-byline";
import { SourceList } from "@/components/source-list";
import { TimingForm } from "@/components/timing-form";
import { ToolGuide } from "@/components/tool-guide";
import { sourcesForTool } from "@/lib/page-sources";
import { TOOL_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { pagePhoto } from "@/lib/photos";
import { SEASON_MONTHS, SEASON_SOURCE, seasonMax } from "@/lib/season";
import { TIMING_GUIDE } from "@/lib/tool-guides";

export const metadata: Metadata = pageMetadata({
  title: "Best Time to Sell a House: Season and Timing Guide",
  description: TOOL_DESCRIPTIONS.season,
  path: "/tools/when-to-sell",
  absoluteTitle: true,
});

function formatSales(sales: number): string {
  const digits = String(sales);
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function WhenToSellPage() {
  const max = seasonMax(SEASON_MONTHS);
  return (
    <>
      <h1>Best time to sell a house</h1>
      <PageByline />
      <p className="lede">
        These bars are closed US existing-home sales, not seasonally adjusted, from September 2025 through September
        2026. FRED publishes that span for this series. It is one year of closed sales, not a long-run seasonal index,
        and it does not say what your home will sell for.
      </p>
      <PagePhoto photo={pagePhoto("/tools/when-to-sell")} />
      <ToolGuide steps={TIMING_GUIDE.steps} example={TIMING_GUIDE.example()} assumptions={TIMING_GUIDE.assumptions} />
      <TimingForm />
      <figure className="season-chart">
        <figcaption>
          Existing-home sales, number of units. Source: National Association of Realtors, via{" "}
          <a href={SEASON_SOURCE}>FRED series EXHOSLUSM495N</a>.
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
      <SourceList sources={sourcesForTool("/tools/when-to-sell")} />
    </>
  );
}
