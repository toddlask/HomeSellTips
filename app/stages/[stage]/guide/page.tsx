import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InContentAd } from "@/components/ad-regions";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GuideArticle } from "@/components/guide-article";
import { JsonLd } from "@/components/json-ld";
import { PageByline } from "@/components/page-byline";
import { SourceList } from "@/components/source-list";
import { tips } from "@/lib/catalog";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { sourcesForStage } from "@/lib/page-sources";
import { pageMetadata } from "@/lib/page-meta";
import { parseStageId } from "@/lib/parse";
import { pagePhoto } from "@/lib/photos";
import { stageGuide, stageGuidePath } from "@/lib/round";
import { stagePath, stageTitle } from "@/lib/stages";
import { getSiteUrl, SITE_NAME, tipsForStage } from "@/lib/site";
import { STAGE_IDS, type StageId } from "@/lib/types";

export function generateStaticParams(): Array<{ stage: StageId }> {
  return STAGE_IDS.map((stage) => ({ stage }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ stage: string }> }): Promise<Metadata> {
  const { stage: stageParam } = await params;
  let stage: StageId;
  try {
    stage = parseStageId(stageParam);
  } catch {
    return { title: "Guide" };
  }
  const guide = stageGuide(stage);
  return pageMetadata({
    title: guide.title,
    description: guide.description,
    path: stageGuidePath(stage),
    absoluteTitle: true,
    openGraphType: "article",
  });
}

export default async function StageGuidePage({ params }: { params: Promise<{ stage: string }> }) {
  const { stage: stageParam } = await params;
  let stage: StageId;
  try {
    stage = parseStageId(stageParam);
  } catch {
    notFound();
  }
  const guide = stageGuide(stage);
  const origin = getSiteUrl();
  const path = stageGuidePath(stage);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Stages", path: "/stages" },
    { name: stageTitle(stage), path: stagePath(stage) },
    { name: guide.h1, path },
  ];
  const related = tipsForStage(tips, stage).map((tip) => ({ href: `/tips/${tip.slug}`, title: tip.title }));
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
      <GuideArticle guide={guide} photo={pagePhoto(path)} related={related} />
      <SourceList sources={sourcesForStage(stage)} />
      <InContentAd />
    </article>
  );
}
