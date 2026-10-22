import { describe, expect, it } from "vitest";
import {
  chargeCents,
  formatUsd,
  paypalReadiness,
  paypalStatusMessage,
  productOffer,
} from "@/lib/paypal-config";
import { isPaypalOrderId, paypalApiBase, paypalOrderBody, sandboxApprovalUrl } from "@/lib/paypal-checkout";

const ready = { clientId: "sandbox-client", clientSecret: "sandbox-secret", mode: "sandbox" };

describe("PayPal sandbox checkout", () => {
  it("stays unconfigured until both sandbox credentials are set", () => {
    expect(paypalReadiness({ clientId: undefined, clientSecret: undefined, mode: undefined }).state).toBe("missing");
    expect(paypalReadiness({ clientId: "id", clientSecret: undefined, mode: "sandbox" }).state).toBe("missing");
    expect(paypalReadiness({ clientId: undefined, clientSecret: "secret", mode: "sandbox" }).state).toBe("missing");
    expect(paypalReadiness({ clientId: "  ", clientSecret: "secret", mode: "sandbox" }).state).toBe("missing");
    expect(paypalStatusMessage(paypalReadiness({ clientId: "", clientSecret: "", mode: "sandbox" }))).toMatch(
      /not configured/i,
    );
  });

  it("refuses live mode even when credentials are present", () => {
    expect(paypalReadiness({ ...ready, mode: "live" }).state).toBe("refused");
    expect(paypalReadiness({ ...ready, mode: "LIVE" }).state).toBe("refused");
    expect(paypalReadiness({ ...ready, mode: "production" }).state).toBe("refused");
    expect(paypalReadiness({ clientId: undefined, clientSecret: undefined, mode: "live" }).state).toBe("refused");
    expect(paypalReadiness({ ...ready, mode: undefined }).state).toBe("refused");
    expect(paypalReadiness({ ...ready, mode: "sandboxx" }).state).toBe("refused");
    expect(paypalApiBase("live")).toBeNull();
    expect(paypalApiBase("production")).toBeNull();
    expect(paypalApiBase(undefined)).toBeNull();
    expect(paypalApiBase("sandbox")).toBe("https://api-m.sandbox.paypal.com");
  });

  it("is ready only for sandbox with both credentials", () => {
    expect(paypalReadiness(ready).state).toBe("ready");
    expect(paypalReadiness({ ...ready, mode: " Sandbox " }).state).toBe("ready");
    expect(paypalStatusMessage(paypalReadiness(ready))).toMatch(/sandbox/i);
  });

  it("charges half of the first month during the launch promo and leaves the renewal price unchanged", () => {
    const monthly = productOffer("featured-monthly", true);
    expect(monthly.unitAmount).toBe(2900);
    expect(chargeCents(monthly)).toBe(1450);
    expect(formatUsd(chargeCents(monthly))).toBe("14.50");
    expect(chargeCents(productOffer("featured-yearly", true))).toBe(29000);
    expect(formatUsd(chargeCents(productOffer("category-sponsor", true)))).toBe("49.50");
    expect(formatUsd(chargeCents(productOffer("header-sponsor", false)))).toBe("249.00");
    expect(formatUsd(chargeCents(productOffer("featured-monthly", false)))).toBe("29.00");
  });

  it("builds a sandbox capture order and ignores non-sandbox approval links", () => {
    const body = paypalOrderBody({
      productId: "featured-monthly",
      offer: productOffer("featured-monthly", false),
      businessName: "North Lamp Photography",
      category: "photography",
      city: "Austin",
      state: "TX",
      returnUrl: "https://homeselltips.example/api/checkout/return",
      cancelUrl: "https://homeselltips.example/advertise?checkout=cancel",
    });
    expect(body.intent).toBe("CAPTURE");
    expect(body.purchase_units[0]?.amount.value).toBe("29.00");
    expect(body.purchase_units[0]?.custom_id).toBe("featured-monthly");
    expect(body.purchase_units[0]?.items[0]?.description).toContain("North Lamp Photography");
    expect(body.purchase_units[0]?.items[0]?.description).toContain("Austin, TX");
    expect(body.purchase_units[0]?.items[0]?.description).toContain("photography");
    expect(body.payment_source.paypal.experience_context.return_url).toContain("/api/checkout/return");
    expect(
      sandboxApprovalUrl([
        { rel: "approve", href: "https://www.paypal.com/checkoutnow?token=ABC" },
        { rel: "payer-action", href: "https://www.sandbox.paypal.com/checkoutnow?token=5O190127TN364715T" },
      ]),
    ).toBe("https://www.sandbox.paypal.com/checkoutnow?token=5O190127TN364715T");
    expect(sandboxApprovalUrl([{ rel: "approve", href: "https://www.paypal.com/checkoutnow?token=LIVE" }])).toBeNull();
    expect(sandboxApprovalUrl([{ rel: "approve", href: "http://www.sandbox.paypal.com/checkoutnow?token=ABC" }])).toBeNull();
    expect(isPaypalOrderId("5O190127TN364715T")).toBe(true);
    expect(isPaypalOrderId("not-an-order")).toBe(false);
  });
});
