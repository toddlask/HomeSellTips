import { chargeCents, formatUsd, type ProductOffer } from "@/lib/paypal-config";
import type { ProductId } from "@/lib/types";

export const PAYPAL_SANDBOX_API = "https://api-m.sandbox.paypal.com";

const SANDBOX_APPROVAL_HOST = "www.sandbox.paypal.com";

export type PaypalLink = {
  href?: string;
  rel?: string;
};

export type PaypalOrderBody = {
  intent: "CAPTURE";
  purchase_units: Array<{
    custom_id: string;
    description: string;
    amount: {
      currency_code: "USD";
      value: string;
      breakdown: { item_total: { currency_code: "USD"; value: string } };
    };
    items: Array<{
      name: string;
      description: string;
      quantity: "1";
      category: "DIGITAL_GOODS";
      unit_amount: { currency_code: "USD"; value: string };
    }>;
  }>;
  payment_source: {
    paypal: {
      experience_context: {
        brand_name: "HomeSellTips";
        shipping_preference: "NO_SHIPPING";
        user_action: "PAY_NOW";
        return_url: string;
        cancel_url: string;
      };
    };
  };
};

export function paypalApiBase(mode: string | undefined): string | null {
  if ((mode ?? "").trim().toLowerCase() !== "sandbox") {
    return null;
  }
  return PAYPAL_SANDBOX_API;
}

function clip(value: string, max: number): string {
  if (value.length <= max) {
    return value;
  }
  return value.slice(0, max);
}

export function paypalOrderBody(input: {
  productId: ProductId;
  offer: ProductOffer;
  businessName: string;
  category: string;
  city: string;
  state: string;
  returnUrl: string;
  cancelUrl: string;
}): PaypalOrderBody {
  const value = formatUsd(chargeCents(input.offer));
  const place = [input.city, input.state].filter(Boolean).join(", ");
  const listing = clip(
    [input.businessName, place, input.category, "approval required"].filter(Boolean).join(" | "),
    127,
  );
  return {
    intent: "CAPTURE",
    purchase_units: [
      {
        custom_id: input.productId,
        description: clip(
          `${input.offer.name}. Admin approval is required before this placement is shown.`,
          127,
        ),
        amount: {
          currency_code: "USD",
          value,
          breakdown: { item_total: { currency_code: "USD", value } },
        },
        items: [
          {
            name: clip(input.offer.name, 127),
            description: listing,
            quantity: "1",
            category: "DIGITAL_GOODS",
            unit_amount: { currency_code: "USD", value },
          },
        ],
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: "HomeSellTips",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          return_url: input.returnUrl,
          cancel_url: input.cancelUrl,
        },
      },
    },
  };
}

export function sandboxApprovalUrl(links: readonly PaypalLink[] | undefined): string | null {
  if (!links) {
    return null;
  }
  for (const rel of ["payer-action", "approve"]) {
    const link = links.find((item) => item.rel === rel && item.href);
    if (!link?.href) {
      continue;
    }
    try {
      const url = new URL(link.href);
      if (url.protocol === "https:" && url.hostname === SANDBOX_APPROVAL_HOST) {
        return url.toString();
      }
    } catch {
      continue;
    }
  }
  return null;
}

export function isPaypalOrderId(value: string): boolean {
  return /^[A-Z0-9]{17}$/.test(value);
}

type TokenPayload = {
  access_token?: string;
};

type OrderPayload = {
  status?: string;
  links?: PaypalLink[];
};

async function sandboxAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const base = paypalApiBase("sandbox");
  if (!base) {
    throw new Error("PayPal sandbox is required.");
  }
  const authorization = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${authorization}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!response.ok) {
    throw new Error("PayPal token request failed.");
  }
  const payload = (await response.json()) as TokenPayload;
  if (!payload.access_token) {
    throw new Error("PayPal token request failed.");
  }
  return payload.access_token;
}

export async function createPaypalOrder(input: {
  clientId: string;
  clientSecret: string;
  order: PaypalOrderBody;
}): Promise<string> {
  const base = paypalApiBase("sandbox");
  if (!base) {
    throw new Error("PayPal sandbox is required.");
  }
  const accessToken = await sandboxAccessToken(input.clientId, input.clientSecret);
  const response = await fetch(`${base}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input.order),
  });
  if (!response.ok) {
    throw new Error("PayPal order request failed.");
  }
  const payload = (await response.json()) as OrderPayload;
  const approvalUrl = sandboxApprovalUrl(payload.links);
  if (!approvalUrl) {
    throw new Error("PayPal order did not return a sandbox approval link.");
  }
  return approvalUrl;
}

export async function capturePaypalOrder(input: {
  clientId: string;
  clientSecret: string;
  orderId: string;
}): Promise<void> {
  if (!isPaypalOrderId(input.orderId)) {
    throw new Error("Unexpected PayPal order id.");
  }
  const base = paypalApiBase("sandbox");
  if (!base) {
    throw new Error("PayPal sandbox is required.");
  }
  const accessToken = await sandboxAccessToken(input.clientId, input.clientSecret);
  const response = await fetch(`${base}/v2/checkout/orders/${input.orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    const payload = (await response.json()) as OrderPayload;
    if (payload.status === "COMPLETED") {
      return;
    }
    throw new Error("PayPal capture did not complete.");
  }
  const details = await response.text();
  if (details.includes("ORDER_ALREADY_CAPTURED")) {
    return;
  }
  throw new Error("PayPal capture failed.");
}
