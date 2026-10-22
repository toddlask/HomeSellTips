import type { Metadata } from "next";
import { RoiForm } from "@/components/roi-form";

export const metadata: Metadata = {
  title: "What to fix first",
  description: "Rank repairs by the cost and the value you enter. HomeSellTips does not supply a return rate.",
  openGraph: {
    title: "What to fix first",
    description: "Rank repairs by the cost and the value you enter.",
    url: "/tools/what-to-fix",
  },
};

export default function WhatToFixPage() {
  return (
    <>
      <h1>What to fix first</h1>
      <p className="lede">
        The groups are safety and function, curb and entry, kitchen and baths, paint and floors, and work you may leave
        for the buyer. You supply the cost and the value.
      </p>
      <RoiForm />
    </>
  );
}
