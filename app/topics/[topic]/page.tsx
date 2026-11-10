import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InContentAd } from "@/components/ad-regions";
import { RichText } from "@/components/gloss-text";
import { AdviceNote } from "@/components/advice-note";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PagePhoto } from "@/components/home-photo";
import { SourceList } from "@/components/source-list";
import { pageMetadata } from "@/lib/page-meta";
import { parseTopicId, sourcesForTopic, topicAdvice, topicDescription, topicGuidePath, topicHeading, topicPath, topicSummary, TOPIC_IDS, type TopicId } from "@/lib/topics";
import { pagePhoto } from "@/lib/photos";
import { topicGuide, topicTipsFor } from "@/lib/round";

export function generateStaticParams(): Array<{ topic: TopicId }> {
  return TOPIC_IDS.map((topic) => ({ topic }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic: topicParam } = await params;
  let topic: TopicId;
  try {
    topic = parseTopicId(topicParam);
  } catch {
    return { title: "Topic" };
  }
  return pageMetadata({
    title: topicHeading(topic),
    description: topicDescription(topic),
    path: topicPath(topic),
    absoluteTitle: true,
  });
}

export default async function TopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicParam } = await params;
  let topic: TopicId;
  try {
    topic = parseTopicId(topicParam);
  } catch {
    notFound();
  }
  const guide = topicGuide(topic);
  const tips = topicTipsFor(topic);
  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Topics", path: "/topics" },
          { name: topicHeading(topic), path: topicPath(topic) },
        ]}
      />
      <h1>{topicHeading(topic)}</h1>
      <p className="lede">{topicSummary(topic)}</p>
      <AdviceNote kind={topicAdvice(topic)} />
      <PagePhoto photo={pagePhoto(topicPath(topic))} priority />
      <article className="panel">
        <h2>
          <a href={topicGuidePath(topic)}>{guide.h1}</a>
        </h2>
        <p>
          <RichText text={guide.lede.split("\n\n")[0] ?? guide.lede} />
        </p>
      </article>
      <ul className="card-grid">
        {tips.map((tip) => (
          <li key={tip.slug}>
            <a className="card" href={`/tips/${tip.slug}`}>
              <h2>{tip.title}</h2>
              <p>{tip.summary}</p>
            </a>
          </li>
        ))}
      </ul>
      <SourceList sources={sourcesForTopic(topic)} />
      <InContentAd />
    </>
  );
}
