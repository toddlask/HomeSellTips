import type { Metadata } from "next";
import { MythDeck } from "@/components/myth-deck";

export const metadata: Metadata = {
  title: "Myth or fact",
  description: "Common home-selling claims, and a plain-language fact for each one.",
  openGraph: {
    title: "Myth or fact",
    description: "Common home-selling claims, and a plain-language fact for each one.",
    url: "/tools/myths",
  },
};

export default function MythsPage() {
  return (
    <>
      <h1>Myth or fact</h1>
      <p className="lede">Flip a card. These are practical corrections, not a promise about your sale.</p>
      <MythDeck />
    </>
  );
}
