import type { Metadata } from "next";
import { RoiForm } from "@/components/roi-form";
import { pageMetadata } from "@/lib/page-meta";
import { CALCULATOR_NOTE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "What to fix first",
  description: "Rank repairs by the cost and the value you enter. HomeSellTips does not supply a return rate.",
  ogDescription: "Rank repairs by the cost and the value you enter.",
  path: "/tools/what-to-fix",
});

export default function WhatToFixPage() {
  return (
    <>
      <h1>What to fix first</h1>
      <p className="lede">
        The groups are safety and function, curb and entry, kitchen and baths, paint and floors, and work you may leave
        for the buyer. You supply the cost and the value.
      </p>
      <p className="note">{CALCULATOR_NOTE}</p>
      <RoiForm />
    </>
  );
}
