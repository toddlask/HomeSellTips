import { productionPlacements } from "@/lib/catalog";
import { todayIso } from "@/lib/dates";
import { headerSlotTaken } from "@/lib/placements";
import { parseProCategory } from "@/lib/parse";
import { createPaypalOrder, paypalOrderBody } from "@/lib/paypal-checkout";
import { launchPromoEnabled, parseProductId, paypalReadiness, productOffer } from "@/lib/paypal-config";
import { getSiteUrl } from "@/lib/site";
import type { ProductId } from "@/lib/types";
import { parseStateCode } from "@/lib/us-states";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutBody = {
  productId?: string;
  businessName?: string;
  category?: string;
  city?: string;
  state?: string;
};

function needsCategory(productId: ProductId): boolean {
  switch (productId) {
    case "featured-monthly":
    case "featured-yearly":
    case "category-sponsor":
      return true;
    case "header-sponsor":
      return false;
    default: {
      const exhaustive: never = productId;
      return exhaustive;
    }
  }
}

function needsPlace(productId: ProductId): boolean {
  switch (productId) {
    case "featured-monthly":
    case "featured-yearly":
      return true;
    case "category-sponsor":
    case "header-sponsor":
      return false;
    default: {
      const exhaustive: never = productId;
      return exhaustive;
    }
  }
}

export async function POST(request: Request): Promise<Response> {
  const readiness = paypalReadiness({
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    mode: process.env.PAYPAL_MODE,
  });
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim() ?? "";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim() ?? "";
  if (readiness.state !== "ready" || !clientId || !clientSecret) {
    const error = readiness.state === "refused" ? readiness.reason : "Payments are not configured.";
    return Response.json({ error }, { status: 503 });
  }

  let body: CheckoutBody;
  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return Response.json({ error: "Send a JSON body." }, { status: 400 });
  }

  const productId = parseProductId(String(body.productId ?? ""));
  if (!productId) {
    return Response.json({ error: "Choose a product." }, { status: 400 });
  }

  const businessName = String(body.businessName ?? "").trim();
  if (businessName.length < 2 || businessName.length > 80) {
    return Response.json({ error: "Enter the business name you want on the listing." }, { status: 400 });
  }

  if (productId === "header-sponsor" && headerSlotTaken(productionPlacements, todayIso())) {
    return Response.json({ error: "The header slot is already filled." }, { status: 409 });
  }

  let category = "";
  if (needsCategory(productId)) {
    try {
      category = parseProCategory(body.category ?? "");
    } catch {
      return Response.json({ error: "Choose a service category." }, { status: 400 });
    }
  }

  const state = parseStateCode(body.state);
  const city = String(body.city ?? "").trim();
  if (needsPlace(productId) && (!city || !state)) {
    return Response.json({ error: "Enter a city and state for a featured listing." }, { status: 400 });
  }

  const offer = productOffer(productId, launchPromoEnabled(process.env.LAUNCH_PROMO));
  const siteUrl = getSiteUrl();
  try {
    const url = await createPaypalOrder({
      clientId,
      clientSecret,
      order: paypalOrderBody({
        productId,
        offer,
        businessName,
        category,
        city,
        state: state ?? "",
        returnUrl: `${siteUrl}/api/checkout/return`,
        cancelUrl: `${siteUrl}/advertise?checkout=cancel`,
      }),
    });
    return Response.json({ url });
  } catch {
    return Response.json({ error: "Checkout could not be started." }, { status: 502 });
  }
}
