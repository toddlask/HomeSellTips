import type { Metadata } from "next";
import { CommissionForm } from "@/components/commission-form";

export const metadata: Metadata = {
  title: "Commission comparison",
  description: "Compare full-service and FSBO commission totals from the price, percents, and flat fees you enter.",
  openGraph: {
    title: "Commission comparison",
    description: "Compare full-service and FSBO commission totals from your own rates.",
    url: "/tools/commission",
  },
};

export default function CommissionPage() {
  return (
    <>
      <h1>Commission comparison</h1>
      <p className="lede">
        Compare full service (listing and buyer agent), a FSBO sale that pays the buyer agent, and a FSBO sale that pays
        neither. Every figure starts from your inputs. Rates can be zero.
      </p>
      <CommissionForm />
    </>
  );
}
