import type { Metadata } from "next";
import { AdvertiseForm } from "@/components/advertise-form";
import { launchPromoEnabled, paypalReadiness } from "@/lib/paypal-config";

export const metadata: Metadata = {
  title: "Advertise with us",
  description: "Category sponsor and sitewide header placements. Checkout stays in the PayPal sandbox.",
  openGraph: {
    title: "Advertise with us",
    description: "Category sponsor and sitewide header placements. Checkout stays in the PayPal sandbox.",
    url: "/advertise",
  },
};

export default async function AdvertisePage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const query = await searchParams;
  const readiness = paypalReadiness({
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    mode: process.env.PAYPAL_MODE,
  });
  const launchPromo = launchPromoEnabled(process.env.LAUNCH_PROMO);
  return (
    <>
      <h1>Advertise with us</h1>
      <p className="lede">
        Two placements. Each one is labeled Sponsored, stays hidden until an admin approves it in git, and drops off
        on its end date. Payments stay in the PayPal sandbox. Live charges are not available.
      </p>
      <ul className="card-grid">
        <li className="card">
          <h2>Category sponsor</h2>
          <p>$99 per month for a banner on one service category. It stays hidden until an admin approves it.</p>
        </li>
        <li className="card">
          <h2>Sitewide header</h2>
          <p>$249 per month. Exactly one header slot. A second active header is not sold.</p>
        </li>
      </ul>
      {query.checkout === "success" ? (
        <p className="panel" role="status">
          PayPal sent you back from sandbox checkout. A placement is not live until it is approved in the repository.
        </p>
      ) : null}
      {query.checkout === "cancel" ? (
        <p className="panel" role="status">
          Checkout was canceled. No placement was created.
        </p>
      ) : null}
      {query.checkout === "error" ? (
        <p className="panel" role="alert">
          Sandbox checkout did not finish. No placement was created.
        </p>
      ) : null}
      <AdvertiseForm readiness={readiness} launchPromo={launchPromo} />
    </>
  );
}
