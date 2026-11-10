import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InContentAd } from "@/components/ad-regions";
import { AdviceNote } from "@/components/advice-note";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GuideArticle } from "@/components/guide-article";
import { JsonLd } from "@/components/json-ld";
import { PageByline } from "@/components/page-byline";
import { SourceList } from "@/components/source-list";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/page-meta";
import { pagePhoto } from "@/lib/photos";
import { topicGuide, topicTipsFor } from "@/lib/round";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import {
  parseTopicId,
  sourcesForTopic,
  topicAdvice,
  topicGuidePath,
  topicHeading,
  topicPath,
  TOPIC_IDS,
  type TopicId,
} from "@/lib/topics";

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
    return { title: "Guide" };
  }
  const guide = topicGuide(topic);
  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: topicGuidePath(topic),
    absoluteTitle: true,
    openGraphType: "article",
  });
}

export default async function TopicGuidePage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicParam } = await params;
  let topic: TopicId;
  try {
    topic = parseTopicId(topicParam);
  } catch {
    notFound();
  }
  const guide = topicGuide(topic);
  const origin = getSiteUrl();
  const path = topicGuidePath(topic);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Topics", path: "/topics" },
    { name: topicHeading(topic), path: topicPath(topic) },
    { name: guide.h1, path },
  ];
  const related = topicTipsFor(topic).map((tip) => ({ href: `/tips/${tip.slug}`, title: tip.title }));
  return (
    <article>
      <JsonLd
        data={articleJsonLd({
          headline: guide.h1,
          image: `${origin}${pagePhoto(path).src}`,
          url: `${origin}${path}`,
          authorName: SITE_NAME,
          publisherUrl: origin,
        })}
      />
      <JsonLd data={breadcrumbJsonLd(origin, crumbs)} />
      <Breadcrumbs crumbs={crumbs} />
      <h1>{guide.h1}</h1>
      <PageByline />
      <AdviceNote kind={topicAdvice(topic)} />
      <GuideArticle guide={guide} photo={pagePhoto(path)} related={related} />
      <SourceList sources={sourcesForTopic(topic)} />
      <InContentAd />
    </article>
  );
}
