import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PagePhoto } from "@/components/home-photo";
import { stagesHubCrumbs } from "@/lib/crumbs";
import { HUB_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { pagePhoto } from "@/lib/photos";
import { stagePath, stageSummary, stageTitle } from "@/lib/stages";
import { STAGE_IDS } from "@/lib/types";

export const metadata: Metadata = pageMetadata({
  title: "Stages",
  description: HUB_DESCRIPTIONS.stages,
  path: "/stages",
});

export default function StagesIndexPage() {
  return (
    <>
      <Breadcrumbs crumbs={stagesHubCrumbs()} linkLast />
      <h1>Stages</h1>
      <p className="lede">The sale, split into the jobs that come before the moving truck.</p>
      <PagePhoto photo={pagePhoto("/stages")} priority />
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
