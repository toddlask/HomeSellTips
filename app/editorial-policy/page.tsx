import type { Metadata } from "next";
import { INFO_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { DISCLAIMER } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Editorial policy",
  description: INFO_DESCRIPTIONS.editorial,
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <>
      <h1>Editorial policy</h1>
      <p className="lede">
        HomeSellTips publishes short practical steps for selling a home in the United States. This page says how those
        pages are researched, reviewed, and kept current.
      </p>
      <h2>Research</h2>
      <p>
        A page starts from the task itself: the repair, the photos, the offer, the closing papers, or the move. When a
        page depends on a public rule, the sources are the official pages linked in that page&apos;s Sources section.
        Those include IRS Publication 523 for federal tax on a home sale, the Consumer Financial Protection Bureau for
        closing papers, HUD for single-family housing programs, the National Association of Realtors for the settlement
        that changed compensation offers, and the FBI Internet Crime Complaint Center for payment-instruction fraud.
      </p>
      <p>The site does not invent a commission rate, a repair cost, a sale price, or a local rule.</p>
      <h2>Review</h2>
      <p>
        Each page is reviewed before it is published. The review checks the steps against the sources and against the
        rule that a calculator uses only numbers a reader types.
      </p>
      <h2>Keeping pages current</h2>
      <p>
        When a cited rule changes, or a page is no longer accurate, the page is revised. The homepage lists recently
        updated guides from that review. The pages do not show dates.
      </p>
      <h2>Drafting help</h2>
      <p>
        AI tools help draft content. A reviewer then checks the draft before it is published. The published page is the
        reviewed version.
      </p>
      <h2>Not advice</h2>
      <p>{DISCLAIMER}</p>
      <p>
        Corrections and questions go through the <a href="/contact">contact page</a>.
      </p>
    </>
  );
}
