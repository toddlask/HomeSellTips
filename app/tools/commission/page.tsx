import type { Metadata } from "next";
import { CommissionForm } from "@/components/commission-form";
import { PagePhoto } from "@/components/home-photo";
import { TOOL_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { pagePhoto } from "@/lib/photos";
import { CALCULATOR_NOTE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Commission comparison",
  description: TOOL_DESCRIPTIONS.commission,
  path: "/tools/commission",
});

export default function CommissionPage() {
  return (
    <>
      <h1>Commission comparison</h1>
      <p className="lede">
        Compare full service (listing and buyer agent), a FSBO sale that pays the buyer agent, and a FSBO sale that pays
        neither. Every figure starts from your inputs. Rates can be zero.
      </p>
      <PagePhoto photo={pagePhoto("/tools/commission")} />
      <p className="note">{CALCULATOR_NOTE}</p>
      <CommissionForm />
    </>
  );
}
