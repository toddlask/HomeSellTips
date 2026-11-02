import type { Metadata } from "next";
import { PagePhoto } from "@/components/home-photo";
import { NetProceedsForm } from "@/components/net-proceeds-form";
import { PageByline } from "@/components/page-byline";
import { TOOL_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { pagePhoto } from "@/lib/photos";
import { CALCULATOR_NOTE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Home Sale Net Proceeds Calculator",
  description: TOOL_DESCRIPTIONS.proceeds,
  path: "/tools/net-proceeds",
});

export default function NetProceedsPage() {
  return (
    <>
      <h1>Home sale net proceeds calculator</h1>
      <PageByline />
      <p className="lede">
        Proceeds equal sale price minus mortgage payoff, listing commission, buyer agent commission, closing costs,
        seller credits, and repair costs.
      </p>
      <PagePhoto photo={pagePhoto("/tools/net-proceeds")} />
      <p className="note">{CALCULATOR_NOTE}</p>
      <NetProceedsForm />
    </>
  );
}
