import type { Metadata } from "next";
import { MythDeck } from "@/components/myth-deck";
import { TOOL_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";

export const metadata: Metadata = pageMetadata({
  title: "Selling claims and the plain version",
  description: TOOL_DESCRIPTIONS.myths,
  path: "/tools/myths",
});

export default function MythsPage() {
  return (
    <>
      <h1>Myth or fact</h1>
      <p className="lede">Flip a card. These are practical corrections, not a promise about your sale.</p>
      <MythDeck />
    </>
  );
}
