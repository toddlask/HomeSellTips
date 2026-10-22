import type { Metadata } from "next";
import { AdvertiseForm } from "@/components/advertise-form";
import { launchPromoEnabled, stripeReadiness } from "@/lib/stripe-config";

export const metadata: Metadata = {
  title: "Advertise with us",
  description: "Featured pro listings and sponsor placements. Checkout stays in Stripe test mode until pricing is approved.",
  openGraph: {
    title: "Advertise with us",
    description: "Featured pro listings and sponsor placements for HomeSellTips.",
    url: "/advertise",
  },
};

export default async function AdvertisePage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const query = await searchParams;
  const readiness = stripeReadiness(process.env.STRIPE_SECRET_KEY);
  const launchPromo = launchPromoEnabled(process.env.LAUNCH_PROMO);
  return (
    <>
      <h1>Advertise with us</h1>
      <p className="lede">
        Three placements. Each one is labeled Sponsored, stays hidden until an admin approves it in git, and drops off
        on its end date. Payments stay in Stripe test mode. Live charges are not available.
      </p>
      <ul className="card-grid">
        <li className="card">
          <h2>Featured pro listing</h2>
          <p>$29 per month or $290 per year, by city and state, in one service category.</p>
        </li>
        <li className="card">
          <h2>Category sponsor</h2>
          <p>$99 per month for a banner on one service category in the directory.</p>
        </li>
        <li className="card">
          <h2>Sitewide header</h2>
          <p>$249 per month. Exactly one header slot. A second active header is not sold.</p>
        </li>
      </ul>
      {query.checkout === "success" ? (
        <p className="panel" role="status">
          Stripe sent you back from test checkout. A placement is not live until it is approved in the repository.
        </p>
      ) : null}
      {query.checkout === "cancel" ? (
        <p className="panel" role="status">
          Checkout was canceled. No placement was created.
        </p>
      ) : null}
      <AdvertiseForm readiness={readiness} launchPromo={launchPromo} />
    </>
  );
}
