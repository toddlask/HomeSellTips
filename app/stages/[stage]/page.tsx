import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AffiliateList } from "@/components/affiliate-list";
import { InContentAd } from "@/components/ad-regions";
import { UpdatedOn } from "@/components/updated-on";
import { affiliateOffers, offersForStage } from "@/lib/affiliates";
import { tips } from "@/lib/catalog";
import { parseStageId } from "@/lib/parse";
import { stageSummary, stageTitle } from "@/lib/stages";
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
  const title = stageTitle(stage);
  const description = stageSummary(stage);
  return {
    title,
    description,
    openGraph: { title, description, url: `/stages/${stage}` },
  };
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
  const offers = offersForStage(stage, affiliateOffers());
  return (
    <>
      <h1>{stageTitle(stage)}</h1>
      <p className="lede">{stageSummary(stage)}</p>
      {stageTips.length === 0 ? (
        <p className="panel">No published tips in this stage yet.</p>
      ) : (
        <ul className="card-grid">
          {stageTips.map((tip) => (
            <li key={tip.slug}>
              <a className="card" href={`/tips/${tip.slug}`}>
                <h2>{tip.title}</h2>
                <UpdatedOn iso={tip.updatedOn} />
                <p>{tip.summary}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
      <InContentAd />
      <AffiliateList offers={offers} />
    </>
  );
}
