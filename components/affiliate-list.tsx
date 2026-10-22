import { AFFILIATE_DISCLOSURE } from "@/lib/affiliates";
import type { AffiliateOffer } from "@/lib/types";

export function AffiliateList({ offers }: { offers: readonly AffiliateOffer[] }) {
  if (offers.length === 0) {
    return null;
  }
  return (
    <aside className="panel" aria-label="Affiliate links">
      <h2>Related supplies</h2>
      <ul>
        {offers.map((offer) => (
          <li key={offer.kind}>
            <a href={offer.href} rel="sponsored noopener noreferrer">
              {offer.label}
            </a>
            <p>{AFFILIATE_DISCLOSURE}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
