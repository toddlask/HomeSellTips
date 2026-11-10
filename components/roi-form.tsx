"use client";

import { useState } from "react";
import { PrintButton } from "@/components/print-button";
import { formatUsd, parseMoney } from "@/lib/money";
import { netOfItem, rankFixItems, roiBucketLabel, ROI_PRESETS } from "@/lib/roi";
import { FIX_EXAMPLE } from "@/lib/tool-examples";
import { ROI_BUCKETS, type RoiItem } from "@/lib/types";

type Entry = { cost: string; expectedValue: string };

export function RoiForm() {
  const [entries, setEntries] = useState<Record<string, Entry>>({
    leak: { cost: String(FIX_EXAMPLE.cost), expectedValue: String(FIX_EXAMPLE.expectedValue) },
  });

  function update(id: string, key: keyof Entry, value: string) {
    setEntries((current) => {
      const existing = current[id] ?? { cost: "", expectedValue: "" };
      return { ...current, [id]: { ...existing, [key]: value } };
    });
  }

  const ready: RoiItem[] = [];
  let invalid = false;
  for (const preset of ROI_PRESETS) {
    const entry = entries[preset.id] ?? { cost: "", expectedValue: "" };
    if (!entry.cost.trim() && !entry.expectedValue.trim()) {
      continue;
    }
    const cost = parseMoney(entry.cost);
    const expectedValue = parseMoney(entry.expectedValue);
    if (cost === null || expectedValue === null || cost < 0 || expectedValue < 0) {
      invalid = true;
      continue;
    }
    if (!entry.cost.trim() || !entry.expectedValue.trim()) {
      continue;
    }
    ready.push({ id: preset.id, bucket: preset.bucket, label: preset.label, cost, expectedValue });
  }
  const ranked = rankFixItems(ready);

  return (
    <div>
      <p className="note">
        The leak row starts with a worked example. Replace it, and type a cost and the value you expect for any other row. The rank uses your value minus your cost. Nothing here assumes a return.
      </p>
      {ROI_BUCKETS.map((bucket) => (
        <fieldset key={bucket} className="panel">
          <legend>
            <h2>{roiBucketLabel(bucket)}</h2>
          </legend>
          {ROI_PRESETS.filter((preset) => preset.bucket === bucket).map((preset) => {
            const entry = entries[preset.id] ?? { cost: "", expectedValue: "" };
            return (
              <div key={preset.id} className="form-grid">
                <p>{preset.label}</p>
                <label htmlFor={`${preset.id}-cost`}>
                  Cost for {preset.label}
                  <input
                    id={`${preset.id}-cost`}
                    inputMode="decimal"
                    value={entry.cost}
                    onChange={(event) => update(preset.id, "cost", event.target.value)}
                  />
                </label>
                <label htmlFor={`${preset.id}-value`}>
                  Your expected value for {preset.label}
                  <input
                    id={`${preset.id}-value`}
                    inputMode="decimal"
                    value={entry.expectedValue}
                    onChange={(event) => update(preset.id, "expectedValue", event.target.value)}
                  />
                </label>
              </div>
            );
          })}
        </fieldset>
      ))}
      {invalid ? <p role="alert">Use zero or a positive number for cost and expected value.</p> : null}
      <div id="roi-ranking" className="panel print-result" aria-live="polite">
        <h2>What this result means</h2>
        <p>A higher remainder is your value minus your cost. It is not a promise that a buyer will pay that value.</p>
        <PrintButton label="Print this result" />
        <h2>Ranked by your numbers</h2>
        {ranked.length === 0 ? (
          <p>Enter a cost and your own expected value to rank a repair.</p>
        ) : (
          <ol>
            {ranked.map((item) => (
              <li key={item.id}>
                {item.label}: your value minus cost is {formatUsd(netOfItem(item))} ({roiBucketLabel(item.bucket)})
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
