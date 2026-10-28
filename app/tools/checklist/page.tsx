import type { Metadata } from "next";
import { PagePhoto } from "@/components/home-photo";
import { PrintButton } from "@/components/print-button";
import { SELLER_CHECKLIST } from "@/lib/checklist";
import { pagePhoto } from "@/lib/photos";
import { TOOL_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";

export const metadata: Metadata = pageMetadata({
  title: "Seller prep checklist",
  description: TOOL_DESCRIPTIONS.checklist,
  path: "/tools/checklist",
});

export default function ChecklistPage() {
  return (
    <article className="checklist-page">
      <h1>Seller prep checklist</h1>
      <p className="lede">Check items off as you finish them. Use the print button for a paper copy.</p>
      <PagePhoto photo={pagePhoto("/tools/checklist")} />
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
