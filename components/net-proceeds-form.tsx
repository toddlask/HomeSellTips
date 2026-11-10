"use client";

import { useState } from "react";
import { MoneyField } from "@/components/money-field";
import { PrintButton } from "@/components/print-button";
import { commissionAmount, formatUsd, hasInvalidMoney, netProceeds, parseMoney } from "@/lib/money";
import { PROCEEDS_EXAMPLE } from "@/lib/tool-examples";

const fields = [
  ["salePrice", "Sale price"],
  ["mortgagePayoff", "Mortgage payoff"],
  ["listingPercent", "Listing commission percent"],
  ["listingFlat", "Listing flat fee"],
  ["buyerPercent", "Buyer agent commission percent"],
  ["buyerFlat", "Buyer agent flat fee"],
  ["closingCosts", "Closing costs"],
  ["sellerCredits", "Seller credits"],
  ["repairCosts", "Repair costs"],
] as const;

type FieldId = (typeof fields)[number][0];

const exampleValues: Record<FieldId, string> = {
  salePrice: String(PROCEEDS_EXAMPLE.salePrice),
  mortgagePayoff: String(PROCEEDS_EXAMPLE.mortgagePayoff),
  listingPercent: String(PROCEEDS_EXAMPLE.listingPercent),
  listingFlat: String(PROCEEDS_EXAMPLE.listingFlat),
  buyerPercent: String(PROCEEDS_EXAMPLE.buyerPercent),
  buyerFlat: String(PROCEEDS_EXAMPLE.buyerFlat),
  closingCosts: String(PROCEEDS_EXAMPLE.closingCosts),
  sellerCredits: String(PROCEEDS_EXAMPLE.sellerCredits),
  repairCosts: String(PROCEEDS_EXAMPLE.repairCosts),
};

export function NetProceedsForm() {
  const [values, setValues] = useState(exampleValues);

  function update(id: FieldId, value: string) {
    setValues((current) => ({ ...current, [id]: value }));
  }

  const parsed = {
    salePrice: parseMoney(values.salePrice),
    mortgagePayoff: parseMoney(values.mortgagePayoff),
    listingPercent: parseMoney(values.listingPercent),
    listingFlat: parseMoney(values.listingFlat),
    buyerPercent: parseMoney(values.buyerPercent),
    buyerFlat: parseMoney(values.buyerFlat),
    closingCosts: parseMoney(values.closingCosts),
    sellerCredits: parseMoney(values.sellerCredits),
    repairCosts: parseMoney(values.repairCosts),
  };
  const invalid = hasInvalidMoney([
    parsed.salePrice,
    parsed.mortgagePayoff,
    parsed.listingPercent,
    parsed.listingFlat,
    parsed.buyerPercent,
    parsed.buyerFlat,
    parsed.closingCosts,
    parsed.sellerCredits,
    parsed.repairCosts,
  ]);
  const result =
    !invalid &&
    parsed.salePrice !== null &&
    parsed.mortgagePayoff !== null &&
    parsed.listingPercent !== null &&
    parsed.listingFlat !== null &&
    parsed.buyerPercent !== null &&
    parsed.buyerFlat !== null &&
    parsed.closingCosts !== null &&
    parsed.sellerCredits !== null &&
    parsed.repairCosts !== null
      ? netProceeds({
          salePrice: parsed.salePrice,
          mortgagePayoff: parsed.mortgagePayoff,
          listingCommission: commissionAmount(parsed.salePrice, parsed.listingPercent, parsed.listingFlat),
          buyerAgentCommission: commissionAmount(parsed.salePrice, parsed.buyerPercent, parsed.buyerFlat),
          closingCosts: parsed.closingCosts,
          sellerCredits: parsed.sellerCredits,
          repairCosts: parsed.repairCosts,
        })
      : null;

  return (
    <div className="panel">
      <p className="note" id="proceeds-help">
        The fields start with a worked example. Replace every number with yours. A blank field counts as zero.
      </p>
      <div className="form-grid">
        {fields.map(([id, label]) => (
          <MoneyField key={id} id={id} label={label} value={values[id]} onChange={(value) => update(id, value)} />
        ))}
      </div>
      {invalid ? <p role="alert">Use zero or a positive number in each field.</p> : null}
      {result ? (
        <div id="proceeds-result" className="result-panel print-result" aria-live="polite">
          <h2>What this result means</h2>
          <p>
            Estimated proceeds are the sale price minus payoff, commissions, closing costs, credits, and repairs. This
            is an estimate from these entries, not a closing statement.
          </p>
          <PrintButton label="Print this result" />
          <table>
            <caption>Line items</caption>
            <tbody>
              {result.lineItems.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.label}</th>
                  <td className="money">{item.kind === "cost" ? `−${formatUsd(item.amount)}` : formatUsd(item.amount)}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">Estimated proceeds</th>
                <td className="money proceeds">{formatUsd(result.proceeds)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
