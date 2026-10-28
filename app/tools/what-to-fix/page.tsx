import type { Metadata } from "next";
import { PagePhoto } from "@/components/home-photo";
import { RoiForm } from "@/components/roi-form";
import { TOOL_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { pagePhoto } from "@/lib/photos";
import { CALCULATOR_NOTE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "What to fix first",
  description: TOOL_DESCRIPTIONS.fix,
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
      <PagePhoto photo={pagePhoto("/tools/what-to-fix")} />
      <p className="note">{CALCULATOR_NOTE}</p>
      <RoiForm />
    </>
  );
}
