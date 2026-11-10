import type { Metadata } from "next";
import { PagePhoto } from "@/components/home-photo";
import { PageByline } from "@/components/page-byline";
import { PrintButton } from "@/components/print-button";
import { SourceList } from "@/components/source-list";
import { ToolGuide } from "@/components/tool-guide";
import { SELLER_CHECKLIST } from "@/lib/checklist";
import { sourcesForTool } from "@/lib/page-sources";
import { pagePhoto } from "@/lib/photos";
import { TOOL_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { CHECKLIST_GUIDE } from "@/lib/tool-guides";

export const metadata: Metadata = pageMetadata({
  title: "Seller prep checklist",
  description: TOOL_DESCRIPTIONS.checklist,
  path: "/tools/checklist",
});

export default function ChecklistPage() {
  return (
    <article className="checklist-page">
      <h1>Seller prep checklist</h1>
      <PageByline />
      <p className="lede">Check items off as you finish them. Use the print button for a paper copy.</p>
      <PagePhoto photo={pagePhoto("/tools/checklist")} />
      <ToolGuide
        steps={CHECKLIST_GUIDE.steps}
        example={CHECKLIST_GUIDE.example}
        assumptions={CHECKLIST_GUIDE.assumptions}
      />
      <div className="print-result">
        <h2>What this result means</h2>
        <p>A checked item is done. An empty box is still open. The printed page is the list itself.</p>
        <PrintButton />
      </div>
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
      <SourceList sources={sourcesForTool("/tools/checklist")} />
    </article>
  );
}
