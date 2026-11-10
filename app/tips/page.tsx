import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SourceList } from "@/components/source-list";
import { PagePhoto } from "@/components/home-photo";
import { tips } from "@/lib/catalog";
import { publishedTopicTips } from "@/lib/round";
import { topicHeading, topicPath, TOPIC_IDS } from "@/lib/topics";
import { tipsHubCrumbs } from "@/lib/crumbs";
import { HUB_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { pagePhoto } from "@/lib/photos";
import { HUB_SOURCES } from "@/lib/page-sources";
import { stageTitle } from "@/lib/stages";
import { publishedTips } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Tips",
  description: HUB_DESCRIPTIONS.tips,
  path: "/tips",
});

export default function TipsIndexPage() {
  const published = [
    ...publishedTips(tips).map((tip) => ({
      slug: tip.slug,
      title: tip.title,
      summary: tip.summary,
      kicker: stageTitle(tip.stage),
      updatedOn: tip.updatedOn,
    })),
    ...publishedTopicTips().map((tip) => ({
      slug: tip.slug,
      title: tip.title,
      summary: tip.summary,
      kicker: topicHeading(tip.topic),
      updatedOn: tip.updatedOn,
    })),
  ].toSorted((left, right) => right.updatedOn.localeCompare(left.updatedOn) || left.title.localeCompare(right.title));
  return (
    <>
      <Breadcrumbs crumbs={tipsHubCrumbs()} linkLast />
      <h1>Tips</h1>
      <p className="lede">Notes from the library, including the topic sections beside the stages.</p>
      <ul className="related-list">
        {TOPIC_IDS.map((topic) => (
          <li key={topic}>
            <a href={topicPath(topic)}>{topicHeading(topic)}</a>
          </li>
        ))}
      </ul>
      <PagePhoto photo={pagePhoto("/tips")} priority />
      {published.length === 0 ? (
        <p className="panel">No published tips yet.</p>
      ) : (
        <ul className="card-grid">
          {published.map((tip) => (
            <li key={tip.slug}>
              <a className="card" href={`/tips/${tip.slug}`}>
                <h2>{tip.title}</h2>
                <p>
                  {tip.kicker}. {tip.summary}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
      <SourceList sources={HUB_SOURCES} />
    </>
  );
}
