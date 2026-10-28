import type { Metadata } from "next";
import { CurbPhoto } from "@/components/home-photo";
import { CURB_WINS } from "@/lib/curb";
import { TOOL_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";

export const metadata: Metadata = pageMetadata({
  title: "Curb appeal quick wins",
  description: TOOL_DESCRIPTIONS.curb,
  path: "/tools/curb-appeal",
});

export default function CurbAppealPage() {
  return (
    <>
      <h1>Curb appeal quick wins</h1>
      <p className="lede">
        Short jobs at the front of the house. The tag is a cost band, not a quote. $ is a hardware-store trip. $$ is
        materials for a weekend you do yourself. $$$ is a hired repair.
      </p>
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
