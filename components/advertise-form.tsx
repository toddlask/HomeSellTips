"use client";

import { useState } from "react";
import { categoryLabel } from "@/lib/categories";
import type { PaypalReadiness } from "@/lib/paypal-config";
import { paypalStatusMessage } from "@/lib/paypal-config";
import { PRO_CATEGORIES, type ProductId } from "@/lib/types";
import { US_STATES } from "@/lib/us-states";

const products: Array<{ id: ProductId; label: string; price: string }> = [
  { id: "category-sponsor", label: "Category sponsor banner", price: "$99 per month" },
  { id: "header-sponsor", label: "Sitewide header sponsor", price: "$249 per month" },
];

export function AdvertiseForm({ readiness, launchPromo }: { readiness: PaypalReadiness; launchPromo: boolean }) {
  const [productId, setProductId] = useState<ProductId>("category-sponsor");
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const paymentsReady = readiness.state === "ready";

  async function startCheckout() {
    setError("");
    setPending(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ productId, businessName, category, city, state: stateCode }),
      });
      const payload = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !payload.url) {
        setError(payload.error ?? "Checkout is unavailable.");
        return;
      }
      window.location.assign(payload.url);
    } catch {
      setError("Checkout is unavailable.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="panel">
      <p>{paypalStatusMessage(readiness)}</p>
      {launchPromo ? (
        <p>Launch promo is on. The first month of a monthly plan is half off. The renewal price stays the listed price.</p>
      ) : (
        <p>Launch promo is off. Monthly plans bill the full price from the first month.</p>
      )}
      <fieldset>
        <legend>Choose a placement</legend>
        {products.map((product) => (
          <label key={product.id} htmlFor={product.id}>
            <span>
              <input
                id={product.id}
                type="radio"
                name="product"
                value={product.id}
                checked={productId === product.id}
                onChange={() => setProductId(product.id)}
              />{" "}
              {product.label} — {product.price}
            </span>
          </label>
        ))}
      </fieldset>
      <label htmlFor="businessName">
        Business name
        <input id="businessName" value={businessName} onChange={(event) => setBusinessName(event.target.value)} />
      </label>
      <label htmlFor="category">
        Service category
        <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">Select a service</option>
          {PRO_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {categoryLabel(item)}
            </option>
          ))}
        </select>
      </label>
      <div className="form-grid">
        <label htmlFor="city">
          City
          <input id="city" value={city} onChange={(event) => setCity(event.target.value)} />
        </label>
        <label htmlFor="state">
          State
          <select id="state" value={stateCode} onChange={(event) => setStateCode(event.target.value)}>
            <option value="">Select a state</option>
            {US_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="note">The sitewide header has one slot. A second active header is refused. Nothing displays until it is approved in git.</p>
      {paymentsReady ? (
        <button type="button" onClick={startCheckout} disabled={pending}>
          {pending ? "Starting sandbox checkout…" : "Continue in the PayPal sandbox"}
        </button>
      ) : (
        <p>
          <strong>Payments are not configured.</strong>
        </p>
      )}
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
