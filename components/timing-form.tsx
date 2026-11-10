"use client";

import { useState } from "react";
import { PrintButton } from "@/components/print-button";
import { busiestMonth, SEASON_MONTHS, timingReading } from "@/lib/season";
import { TIMING_EXAMPLE } from "@/lib/tool-examples";

function formatSales(sales: number): string {
  return String(sales).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function TimingForm() {
  const [moveDateFixed, setMoveDateFixed] = useState<boolean>(TIMING_EXAMPLE.moveDateFixed);
  const [houseReady, setHouseReady] = useState<boolean>(TIMING_EXAMPLE.houseReady);
  const busiest = busiestMonth(SEASON_MONTHS);
  const reading = timingReading({ moveDateFixed, houseReady });

  return (
    <div className="panel">
      <p className="note">The choices start with the worked example. Change them to match this sale.</p>
      <div className="form-grid">
        <label htmlFor="timing-move">
          Move date
          <select
            id="timing-move"
            value={moveDateFixed ? "fixed" : "flexible"}
            onChange={(event) => setMoveDateFixed(event.target.value === "fixed")}
          >
            <option value="flexible">Flexible</option>
            <option value="fixed">Fixed</option>
          </select>
        </label>
        <label htmlFor="timing-ready">
          House
          <select
            id="timing-ready"
            value={houseReady ? "ready" : "prep"}
            onChange={(event) => setHouseReady(event.target.value === "ready")}
          >
            <option value="prep">Still needs prep</option>
            <option value="ready">Ready to list</option>
          </select>
        </label>
      </div>
      <div id="timing-result" className="print-result" aria-live="polite">
        <h2>What this result means</h2>
        <p>{reading}</p>
        <p>
          In this table, {busiest.label} has the most closed sales ({formatSales(busiest.sales)}). That count is not a
          price for this house.
        </p>
        <PrintButton label="Print this result" />
      </div>
    </div>
  );
}
