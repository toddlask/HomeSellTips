import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AffiliateList } from "@/components/affiliate-list";
import { SourceList } from "@/components/source-list";
import { InContentAd } from "@/components/ad-regions";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { StagePhoto } from "@/components/home-photo";
import { NotAdviceNote } from "@/components/page-byline";
import { affiliateOffers, offersForStage } from "@/lib/affiliates";
import { tips } from "@/lib/catalog";
import { stageCrumbs } from "@/lib/crumbs";
import { sourcesForStage } from "@/lib/page-sources";
import { parseStageId } from "@/lib/parse";
import { stageDescription, stageDocumentTitle, stageHeading, stageNeedsAdviceNote, stagePath, stageSummary } from "@/lib/stages";
import { pageMetadata } from "@/lib/page-meta";
import { stageGuide, stageGuidePath } from "@/lib/round";
import { CFPB_CLOSING, FBI_IC3 } from "@/lib/sources";
import { tipsForStage } from "@/lib/site";
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
    return { title: "Stage" };
  }
  const documentTitle = stageDocumentTitle(stage);
  return pageMetadata({
    title: documentTitle.title,
    description: stageDescription(stage),
    path: `/stages/${stage}`,
    absoluteTitle: documentTitle.absoluteTitle,
  });
}

export default async function StagePage({ params }: { params: Promise<{ stage: string }> }) {
  const { stage: stageParam } = await params;
  let stage: StageId;
  try {
    stage = parseStageId(stageParam);
  } catch {
    notFound();
  }
  const stageTips = tipsForStage(tips, stage);
  const guide = stageGuide(stage);
  const offers = offersForStage(stage, affiliateOffers());
  return (
    <>
      <Breadcrumbs crumbs={stageCrumbs(stage)} />
      <h1>{stageHeading(stage)}</h1>
      <p className="lede">{stageSummary(stage)}</p>
      {stage === "closing" ? (
        <p>
          Seller closing costs come out of the price before you are paid. The{" "}
          <a href={CFPB_CLOSING.href}>{CFPB_CLOSING.label}</a> explains the closing papers. Confirm any wire instructions
          by phone, using a number you already have. Report a swapped instruction to the{" "}
          <a href={FBI_IC3.href}>{FBI_IC3.label}</a>.
        </p>
      ) : null}
      {stageNeedsAdviceNote(stage) ? <NotAdviceNote /> : null}
      <p className="no-print">
        <a href={`${stagePath(stage)}/checklist`}>Print the one-page checklist</a>
      </p>
      <StagePhoto stage={stage} />
      <article className="panel">
        <h2>
          <a href={stageGuidePath(stage)}>{guide.h1}</a>
        </h2>
        <p>{guide.description}</p>
      </article>
      {stageTips.length === 0 ? (
        <p className="panel">No published tips in this stage yet.</p>
      ) : (
        <ul className="card-grid">
          {stageTips.map((tip) => (
            <li key={tip.slug}>
              <a className="card" href={`/tips/${tip.slug}`}>
                <h2>{tip.title}</h2>
                <p>{tip.summary}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
      <SourceList sources={sourcesForStage(stage)} />
      <InContentAd />
      <AffiliateList offers={offers} />
    </>
  );
}
