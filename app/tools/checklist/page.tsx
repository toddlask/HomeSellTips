import type { Metadata } from "next";
import { PrintButton } from "@/components/print-button";
import { SELLER_CHECKLIST } from "@/lib/checklist";

export const metadata: Metadata = {
  title: "Seller prep checklist",
  description: "A printable checklist for photos, paperwork, showings, offers, closing, and the move.",
  openGraph: {
    title: "Seller prep checklist",
    description: "A printable checklist for the weeks before you list and move.",
    url: "/tools/checklist",
  },
};

export default function ChecklistPage() {
  return (
    <article className="checklist-page">
      <h1>Seller prep checklist</h1>
      <p className="lede">Check items off as you finish them. Use the print button for a paper copy.</p>
      <PrintButton />
      {SELLER_CHECKLIST.map((group) => (
        <section key={group.id} className="panel" aria-labelledby={group.id}>
          <h2 id={group.id}>{group.title}</h2>
          <ul className="checklist">
            {group.items.map((item) => (
              <li key={item}>
                <label>
                  <input type="checkbox" />
                  <span>{item}</span>
                </label>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </article>
  );
}
