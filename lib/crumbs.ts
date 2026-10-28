import { stagePath, stageTitle } from "@/lib/stages";
import type { StageId, Tip } from "@/lib/types";

export type Crumb = {
  name: string;
  path: string;
};

export function tipCrumbs(tip: Pick<Tip, "slug" | "title" | "stage">): Crumb[] {
  return [
    { name: "Home", path: "/" },
    { name: "Tips", path: "/tips" },
    { name: stageTitle(tip.stage), path: stagePath(tip.stage) },
    { name: tip.title, path: `/tips/${tip.slug}` },
  ];
}

export function stageCrumbs(stage: StageId): Crumb[] {
  return [
    { name: "Home", path: "/" },
    { name: "Stages", path: "/stages" },
    { name: stageTitle(stage), path: stagePath(stage) },
  ];
}

export function checklistCrumbs(stage: StageId): Crumb[] {
  const stageName = stageTitle(stage);
  return [
    ...stageCrumbs(stage),
    { name: `${stageName} checklist`, path: `${stagePath(stage)}/checklist` },
  ];
}

export function toolCrumbs(): Crumb[] {
  return [
    { name: "Home", path: "/" },
    { name: "Tools", path: "/tools" },
  ];
}
