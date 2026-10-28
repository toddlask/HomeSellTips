import type { Metadata } from "next";
import { NetProceedsForm } from "@/components/net-proceeds-form";
import { TOOL_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { CALCULATOR_NOTE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Net proceeds calculator",
  description: TOOL_DESCRIPTIONS.proceeds,
  path: "/tools/net-proceeds",
});

export default function NetProceedsPage() {
  return (
    <>
      <h1>Net proceeds</h1>
      <p className="lede">
        Proceeds equal sale price minus mortgage payoff, listing commission, buyer agent commission, closing costs,
        seller credits, and repair costs.
      </p>
      <p className="note">{CALCULATOR_NOTE}</p>
      <NetProceedsForm />
    </>
  );
}
