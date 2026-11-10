import type { Metadata } from "next";
import { INFO_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { DISCLAIMER } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms",
  description: INFO_DESCRIPTIONS.terms,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <h1>Terms</h1>
      <p className="lede">These terms cover use of this website.</p>
      <h2>General information</h2>
      <p>{DISCLAIMER}</p>
      <p>
        You are responsible for your own sale, contract, and local rules. A calculator result is an estimate from the
        numbers you enter. It is not a closing statement, a tax return, or an offer of representation.
      </p>
      <h2>The pages</h2>
      <p>
        You may read the pages and print a tool result for your own sale. Do not copy the pages into a commercial
        product. Linking to a page is fine.
      </p>
      <h2>Other sites</h2>
      <p>
        Some pages link to public agencies and other sites. Those sites have their own terms. A link is not an
        endorsement of a company or a product.
      </p>
      <h2>Related pages</h2>
      <ul>
        <li>
          <a href="/privacy">Privacy</a>
        </li>
        <li>
          <a href="/editorial-policy">Editorial policy</a>
        </li>
        <li>
          <a href="/disclosure">Ad and affiliate disclosure</a>
        </li>
        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </>
  );
}
