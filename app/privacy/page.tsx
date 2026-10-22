import type { Metadata } from "next";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How HomeSellTips uses a consent cookie, optional ads, and Stripe test checkout. No accounts.",
  openGraph: {
    title: "Privacy",
    description: "How HomeSellTips uses a consent cookie, optional ads, and Stripe test checkout.",
    url: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy</h1>
      <p className="lede">HomeSellTips does not offer accounts, comments, or a newsletter.</p>
      <h2>Consent cookie</h2>
      <p>
        If you accept or decline cookies, the choice is stored in this browser under the key {CONSENT_STORAGE_KEY}. That
        is the only cookie the site itself writes. You can clear it in your browser settings.
      </p>
      <h2>Advertising</h2>
      <p>
        Google AdSense scripts load only after you accept cookies and only when a publisher id is configured on the
        server. If the id is missing, ad slots are not rendered. AdSense, when loaded, may set its own cookies. See the{" "}
        <a href="/disclosure">ad and affiliate disclosure</a>.
      </p>
      <h2>Advertise checkout</h2>
      <p>
        If a Stripe test key is configured, checkout runs on Stripe in test mode. Stripe receives the business name,
        city, state, and category you submit, plus the payment details you enter on Stripe. No listing is published from
        that payment until it is approved in the site repository. If no test key is set, the advertise page does not
        start a payment.
      </p>
      <h2>Email</h2>
      <p>The site does not send email. Renewal notes, when drafted, stay in an admin outbox in the repository.</p>
    </>
  );
}
