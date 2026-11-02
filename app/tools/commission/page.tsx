import type { Metadata } from "next";
import { CommissionForm } from "@/components/commission-form";
import { PagePhoto } from "@/components/home-photo";
import { PageByline } from "@/components/page-byline";
import { TOOL_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { pagePhoto } from "@/lib/photos";
import { NAR_SETTLEMENT } from "@/lib/sources";
import { CALCULATOR_NOTE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Realtor Commission Calculator: Agent vs FSBO Costs",
  description: TOOL_DESCRIPTIONS.commission,
  path: "/tools/commission",
  absoluteTitle: true,
});

export default function CommissionPage() {
  return (
    <>
      <h1>Realtor commission calculator</h1>
      <PageByline />
      <p className="lede">
        Compare full service (listing and buyer agent), a FSBO sale that pays the buyer agent, and a FSBO sale that pays
        neither. Every figure starts from your inputs. Rates can be zero.
      </p>
      <p>
        Compensation is negotiable, and a multiple listing service cannot advertise an offer to pay the buyer&apos;s
        broker. The <a href={NAR_SETTLEMENT.href}>{NAR_SETTLEMENT.label}</a> explain those practice changes.
      </p>
      <PagePhoto photo={pagePhoto("/tools/commission")} />
      <p className="note">{CALCULATOR_NOTE}</p>
      <CommissionForm />
    </>
  );
}
