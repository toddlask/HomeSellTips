import { capturePaypalOrder } from "@/lib/paypal-checkout";
import { paypalReadiness } from "@/lib/paypal-config";
import { getSiteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function advertiseRedirect(checkout: "success" | "error" | "cancel"): Response {
  const destination = new URL("/advertise", getSiteUrl());
  destination.searchParams.set("checkout", checkout);
  return Response.redirect(destination, 303);
}

export async function GET(request: Request): Promise<Response> {
  const orderId = new URL(request.url).searchParams.get("token")?.trim() ?? "";
  const readiness = paypalReadiness({
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    mode: process.env.PAYPAL_MODE,
  });
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim() ?? "";
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim() ?? "";
  if (readiness.state !== "ready" || !clientId || !clientSecret) {
    return advertiseRedirect("error");
  }
  try {
    await capturePaypalOrder({ clientId, clientSecret, orderId });
    return advertiseRedirect("success");
  } catch {
    return advertiseRedirect("error");
  }
}
