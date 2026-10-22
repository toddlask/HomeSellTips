"use client";

import { useState } from "react";
import { MoneyField } from "@/components/money-field";
import { commissionComparison, formatUsd, hasInvalidMoney, parseMoney } from "@/lib/money";

type FieldId = "price" | "listingPercent" | "buyerPercent" | "listingFlat" | "buyerFlat";

const emptyValues: Record<FieldId, string> = {
  price: "",
  listingPercent: "",
  buyerPercent: "",
  listingFlat: "",
  buyerFlat: "",
};

export function CommissionForm() {
  const [values, setValues] = useState(emptyValues);

  function update(id: FieldId, value: string) {
    setValues((current) => ({ ...current, [id]: value }));
  }
  const parsed = {
    price: parseMoney(values.price),
    listingPercent: parseMoney(values.listingPercent),
    buyerPercent: parseMoney(values.buyerPercent),
    listingFlat: parseMoney(values.listingFlat),
    buyerFlat: parseMoney(values.buyerFlat),
  };
  const invalid = hasInvalidMoney([
    parsed.price,
    parsed.listingPercent,
    parsed.buyerPercent,
    parsed.listingFlat,
    parsed.buyerFlat,
  ]);
  const result =
    !invalid &&
    parsed.price !== null &&
    parsed.listingPercent !== null &&
    parsed.buyerPercent !== null &&
    parsed.listingFlat !== null &&
    parsed.buyerFlat !== null
      ? commissionComparison({
          price: parsed.price,
          listingPercent: parsed.listingPercent,
          buyerAgentPercent: parsed.buyerPercent,
          listingFlatFee: parsed.listingFlat,
          buyerAgentFlatFee: parsed.buyerFlat,
        })
      : null;

  return (
    <div className="panel">
      <p className="note">Enter the price and the rates you are actually considering. A rate can be zero.</p>
      <div className="form-grid">
        <MoneyField id="price" label="Sale price" value={values.price} onChange={(value) => update("price", value)} />
        <MoneyField
          id="listingPercent"
          label="Listing side percent"
          value={values.listingPercent}
          onChange={(value) => update("listingPercent", value)}
        />
        <MoneyField
          id="buyerPercent"
          label="Buyer agent percent"
          value={values.buyerPercent}
          onChange={(value) => update("buyerPercent", value)}
        />
        <MoneyField
          id="listingFlat"
          label="Listing flat fee"
          value={values.listingFlat}
          onChange={(value) => update("listingFlat", value)}
        />
        <MoneyField
          id="buyerFlat"
          label="Buyer agent flat fee"
          value={values.buyerFlat}
          onChange={(value) => update("buyerFlat", value)}
        />
      </div>
      {invalid ? <p role="alert">Use zero or a positive number in each field.</p> : null}
      {result ? (
        <div id="commission-result" aria-live="polite">
          <table>
            <caption>Commission from your inputs</caption>
            <tbody>
              <tr>
                <th scope="row">Listing commission</th>
                <td className="money">{formatUsd(result.listingCommission)}</td>
              </tr>
              <tr>
                <th scope="row">Buyer agent commission</th>
                <td className="money">{formatUsd(result.buyerAgentCommission)}</td>
              </tr>
              <tr>
                <th scope="row">Full service, both commissions</th>
                <td className="money">{formatUsd(result.fullService)}</td>
              </tr>
              <tr>
                <th scope="row">FSBO paying the buyer agent only</th>
                <td className="money">{formatUsd(result.fsboBuyerOnly)}</td>
              </tr>
              <tr>
                <th scope="row">FSBO paying neither</th>
                <td className="money">{formatUsd(result.fsboNeither)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
