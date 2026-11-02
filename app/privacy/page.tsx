import type { Metadata } from "next";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";
import { INFO_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";

export const metadata: Metadata = pageMetadata({
  title: "Privacy",
  description: INFO_DESCRIPTIONS.privacy,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <h1>Privacy</h1>
      <p className="lede">HomeSellTips does not offer accounts, comments, or a newsletter.</p>
      <h2>Consent choice</h2>
      <p>
        If you accept or decline advertising scripts, the choice is saved in localStorage on this browser under the key{" "}
        {CONSENT_STORAGE_KEY}. The site does not write its own cookie for that choice. You can clear the saved value in
        your browser settings.
      </p>
      <h2>Advertising</h2>
      <p>
        Ad slots stay off unless a publisher id and a slot id are configured. The page head includes the AdSense script
        Google uses to verify the site. See the <a href="/disclosure">ad and affiliate disclosure</a>.
      </p>
      <h2>Advertising and cookies</h2>
      <p>HomeSellTips uses Google AdSense.</p>
      <p>
        Google and its partners use cookies to serve ads based on your prior visits to this site and to other sites.
        Google&apos;s advertising cookies let Google and its partners serve ads based on those visits.
      </p>
      <p>
        You can opt out of personalized ads at <a href="https://www.google.com/settings/ads">Google&apos;s ad settings</a>{" "}
        and at <a href="https://www.aboutads.info">aboutads.info</a>.
      </p>
      <p>
        <a href="https://policies.google.com/technologies/partner-sites">
          How Google uses information from sites or apps that use our services
        </a>
        .
      </p>
      <p>
        Visitors in the European Economic Area, the United Kingdom, and Switzerland are asked for consent. Google&apos;s
        certified consent message asks that question.
      </p>
      <h2>Advertise form</h2>
      <p>
        The form at <a href="/advertise">/advertise</a> sends your name, email, company, what you want to advertise,
        optional budget, and message to FormSubmit (formsubmit.co) from your browser. FormSubmit delivers that inquiry by
        email. The page checks the fields before sending them. It does not create an account from the form.
      </p>
      <h2>Analytics</h2>
      <p>
        HomeSellTips uses Vercel Web Analytics. It is cookieless and collects anonymous page views. Vercel Speed
        Insights is cookieless and measures page performance.
      </p>
      <h2>Email</h2>
      <p>
        Renewal notes, when drafted, stay in an admin outbox in the repository. Those notes are not emailed. The only
        message the site forwards is the advertise inquiry described above.
      </p>
    </>
  );
}
