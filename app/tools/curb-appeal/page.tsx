import type { Metadata } from "next";
import { CurbPhoto } from "@/components/home-photo";
import { PageByline } from "@/components/page-byline";
import { PrintButton } from "@/components/print-button";
import { ToolGuide } from "@/components/tool-guide";
import { CURB_WINS } from "@/lib/curb";
import { TOOL_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { CURB_GUIDE } from "@/lib/tool-guides";

export const metadata: Metadata = pageMetadata({
  title: "Curb appeal quick wins",
  description: TOOL_DESCRIPTIONS.curb,
  path: "/tools/curb-appeal",
});

export default function CurbAppealPage() {
  return (
    <>
      <h1>Curb appeal quick wins</h1>
      <PageByline />
      <p className="lede">
        Short jobs at the front of the house. The tag is a cost band, not a quote. $ is a hardware-store trip. $$ is
        materials for a weekend you do yourself. $$$ is a hired repair.
      </p>
      <ToolGuide steps={CURB_GUIDE.steps} example={CURB_GUIDE.example} assumptions={CURB_GUIDE.assumptions} />
      <div className="print-result">
        <h2>What this result means</h2>
        <p>Each tag is a cost band, not a quote. Use it to choose which outdoor jobs to price with a real bid.</p>
        <PrintButton label="Print this result" />
      </div>
      <ul className="curb-grid">
        {CURB_WINS.map((win, index) => (
          <li key={win.id} className="curb-card">
            <CurbPhoto photo={win.photo} priority={index === 0} />
            <h2>{win.title}</h2>
            <p className="curb-tags">
              <span className="cost-tag">{win.cost}</span>
              <span>{win.time}</span>
            </p>
            <p>{win.detail}</p>
            <p className="photo-credit">
              Photograph by {win.photo.photographer}.{" "}
              <a href={win.photo.sourcePage}>Pexels source</a>.{" "}
              <a href={win.photo.licenseUrl}>{win.photo.license}</a>.
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
