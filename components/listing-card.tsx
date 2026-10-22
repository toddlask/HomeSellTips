import { categoryLabel } from "@/lib/listings";
import { SPONSORED_LABEL } from "@/lib/placements";
import type { Listing } from "@/lib/types";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="card">
      <p className="sponsored-label">{SPONSORED_LABEL}</p>
      <h3>{listing.name}</h3>
      <p>
        {categoryLabel(listing.category)} · {listing.city}, {listing.state}
      </p>
    </article>
  );
}

export function DirectoryResults({
  listings,
  emptyMessage,
}: {
  listings: readonly Listing[];
  emptyMessage: string;
}) {
  if (listings.length === 0) {
    return (
      <div className="panel">
        <p>{emptyMessage}</p>
        <p>
          Paid listings appear here only after they are approved.{" "}
          <a href="/advertise">Advertise with us</a>.
        </p>
      </div>
    );
  }
  return (
    <ul className="card-grid">
      {listings.map((listing) => (
        <li key={listing.id}>
          <ListingCard listing={listing} />
        </li>
      ))}
    </ul>
  );
}
