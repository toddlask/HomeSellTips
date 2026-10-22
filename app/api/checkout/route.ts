import Stripe from "stripe";
import { productionPlacements } from "@/lib/catalog";
import { todayIso } from "@/lib/dates";
import { headerSlotTaken } from "@/lib/placements";
import { parseProCategory } from "@/lib/parse";
import { getSiteUrl } from "@/lib/site";
import { launchPromoEnabled, parseProductId, productOffer, stripeReadiness } from "@/lib/stripe-config";
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
  const readiness = stripeReadiness(process.env.STRIPE_SECRET_KEY);
  const secret = process.env.STRIPE_SECRET_KEY?.trim() ?? "";
  if (readiness.state !== "ready" || !secret.startsWith("sk_test_")) {
    return Response.json({ error: "Payments are not configured." }, { status: 503 });
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
  const stripe = new Stripe(secret);
  try {
    let couponId = "";
    if (offer.firstMonthHalfOff) {
      const coupon = await stripe.coupons.create({
        percent_off: 50,
        duration: "once",
        max_redemptions: 1,
        name: "HomeSellTips first month",
      });
      couponId = coupon.id;
    }
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: "subscription",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: offer.unitAmount,
            recurring: { interval: offer.interval },
            product_data: { name: offer.name },
          },
        },
      ],
      success_url: `${getSiteUrl()}/advertise?checkout=success`,
      cancel_url: `${getSiteUrl()}/advertise?checkout=cancel`,
      metadata: {
        productId,
        businessName,
        category,
        city,
        state,
        approval: "required",
      },
    };
    if (couponId) {
      params.discounts = [{ coupon: couponId }];
    }
    const session = await stripe.checkout.sessions.create(params);
    if (!session.url) {
      return Response.json({ error: "Checkout could not be started." }, { status: 502 });
    }
    return Response.json({ url: session.url });
  } catch {
    return Response.json({ error: "Checkout could not be started." }, { status: 502 });
  }
}
