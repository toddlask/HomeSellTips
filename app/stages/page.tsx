import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SourceList } from "@/components/source-list";
import { PagePhoto } from "@/components/home-photo";
import { stagesHubCrumbs } from "@/lib/crumbs";
import { HUB_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { pagePhoto } from "@/lib/photos";
import { HUB_SOURCES } from "@/lib/page-sources";
import { stagePath, stageSummary, stageTitle } from "@/lib/stages";
import { topicHeading, topicPath, TOPIC_IDS } from "@/lib/topics";
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
      <p>
        Separate questions live under <Link href="/topics">Topics</Link>:{" "}
        {TOPIC_IDS.map((topic, index) => (
          <span key={topic}>
            {index > 0 ? ", " : null}
            <a href={topicPath(topic)}>{topicHeading(topic)}</a>
          </span>
        ))}
        .
      </p>
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
      <SourceList sources={HUB_SOURCES} />
    </>
  );
}
