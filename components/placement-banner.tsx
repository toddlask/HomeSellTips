import { productionPlacements } from "@/lib/catalog";
import { todayIso } from "@/lib/dates";
import { selectSitewideHeader, SPONSORED_LABEL } from "@/lib/placements";
import type { Placement } from "@/lib/types";

export function PlacementBanner({ placement }: { placement: Placement }) {
  return (
    <aside className="placement" aria-label="Sponsored placement">
      <p className="sponsored-label">{SPONSORED_LABEL}</p>
      <a href={placement.href} rel="sponsored noopener noreferrer">
        {placement.sponsorName}
      </a>
      <p>{placement.message}</p>
    </aside>
  );
}

export function HeaderSponsor() {
  const placement = selectSitewideHeader(productionPlacements, todayIso());
  if (!placement) {
    return null;
  }
  return (
    <div className="wrap">
      <PlacementBanner placement={placement} />
    </div>
  );
}
