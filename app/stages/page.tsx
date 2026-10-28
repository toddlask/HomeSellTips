import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-meta";
import { stagePath, stageSummary, stageTitle } from "@/lib/stages";
import { STAGE_IDS } from "@/lib/types";

export const metadata: Metadata = pageMetadata({
  title: "Stages",
  description: "Home-selling stages from prep and repairs through moving.",
  path: "/stages",
});

export default function StagesIndexPage() {
  return (
    <>
      <h1>Stages</h1>
      <p className="lede">The sale, split into the jobs that come before the moving truck.</p>
      <ul className="card-grid">
        {STAGE_IDS.map((stage) => (
          <li key={stage}>
            <a className="card" href={stagePath(stage)}>
              <h2>{stageTitle(stage)}</h2>
              <p>{stageSummary(stage)}</p>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
