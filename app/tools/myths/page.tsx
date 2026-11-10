import type { Metadata } from "next";
import { PagePhoto } from "@/components/home-photo";
import { MythDeck } from "@/components/myth-deck";
import { PageByline } from "@/components/page-byline";
import { PrintButton } from "@/components/print-button";
import { ToolGuide } from "@/components/tool-guide";
import { TOOL_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { pagePhoto } from "@/lib/photos";
import { MYTHS_GUIDE } from "@/lib/tool-guides";

export const metadata: Metadata = pageMetadata({
  title: "Selling claims and the plain version",
  description: TOOL_DESCRIPTIONS.myths,
  path: "/tools/myths",
});

export default function MythsPage() {
  return (
    <>
      <h1>Myth or fact</h1>
      <PageByline />
      <p className="lede">Flip a card. These are practical corrections, not a promise about your sale.</p>
      <PagePhoto photo={pagePhoto("/tools/myths")} />
      <ToolGuide steps={MYTHS_GUIDE.steps} example={MYTHS_GUIDE.example} assumptions={MYTHS_GUIDE.assumptions} />
      <div className="print-result">
        <h2>What this result means</h2>
        <p>The fact is the correction. It is general information, not a promise about your sale.</p>
        <PrintButton label="Print this result" />
      </div>
      <MythDeck />
    </>
  );
}
