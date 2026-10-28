import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { pageMetadata } from "@/lib/page-meta";
import { parseStageId } from "@/lib/parse";
import { STAGE_CHECKLISTS } from "@/lib/stage-checklists";
import { stagePath, stageTitle } from "@/lib/stages";
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
    return { title: "Checklist" };
  }
  const title = `${stageTitle(stage)} checklist`;
  return pageMetadata({
    title,
    description: `A one-page printable checklist for ${stageTitle(stage).toLowerCase()}.`,
    ogDescription: `Printable checklist for ${stageTitle(stage).toLowerCase()}.`,
    path: `${stagePath(stage)}/checklist`,
  });
}

export default async function StageChecklistPage({ params }: { params: Promise<{ stage: string }> }) {
  const { stage: stageParam } = await params;
  let stage: StageId;
  try {
    stage = parseStageId(stageParam);
  } catch {
    notFound();
  }
  const items = STAGE_CHECKLISTS[stage];
  return (
    <article className="checklist-sheet">
      <p className="no-print">
        <a href={stagePath(stage)}>{stageTitle(stage)}</a>
      </p>
      <h1>{stageTitle(stage)} checklist</h1>
      <p className="lede">One page. Check a box, or print it and use a pen.</p>
      <PrintButton />
      <ul className="checklist">
        {items.map((item) => (
          <li key={item}>
            <label>
              <input type="checkbox" />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </article>
  );
}
