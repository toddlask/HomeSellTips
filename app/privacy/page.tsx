import type { Metadata } from "next";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";
import { pageMetadata } from "@/lib/page-meta";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: "How HomeSellTips uses a consent cookie, optional ads, and the advertise form. No accounts.",
  path: "/privacy",
});

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
      <h2>Advertise form</h2>
      <p>
        The form at <a href="/advertise">/advertise</a> sends your name, email, company, what you want to advertise,
        optional budget, and message to FormSubmit (formsubmit.co). FormSubmit delivers that inquiry by email. The site
        checks the fields on its own server before forwarding them. It does not create an account from the form.
      </p>
      <h2>Email</h2>
      <p>
        Renewal notes, when drafted, stay in an admin outbox in the repository. Those notes are not emailed. The only
        message the site forwards is the advertise inquiry described above.
      </p>
    </>
  );
}
