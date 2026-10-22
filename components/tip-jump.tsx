import { stagePath, stageTitle } from "@/lib/stages";
import { STAGE_IDS } from "@/lib/types";

export function TipJump() {
  return (
    <nav className="jump-nav no-print" aria-label="Jump to stage">
      {STAGE_IDS.map((stage) => (
        <a key={stage} href={stagePath(stage)}>
          {stageTitle(stage)}
        </a>
      ))}
    </nav>
  );
}

export function BackToTop() {
  return (
    <a className="to-top no-print" href="#main">
      Back to top
    </a>
  );
}
