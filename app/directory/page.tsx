import type { Metadata } from "next";
import { DirectoryResults } from "@/components/listing-card";
import { PlacementBanner } from "@/components/placement-banner";
import { productionListings, productionPlacements } from "@/lib/catalog";
import { todayIso } from "@/lib/dates";
import { categoryLabel, directoryEmptyMessage, filterListings } from "@/lib/listings";
import { activeCategorySponsor } from "@/lib/placements";
import { parseCategoryQuery } from "@/lib/parse";
import { PRO_CATEGORIES } from "@/lib/types";
import { parseStateCode, US_STATES } from "@/lib/us-states";

export const metadata: Metadata = {
  title: "Find a pro",
  description: "Search admin-approved paid home-sale pros by city and state. Empty until a listing is approved.",
  openGraph: {
    title: "Find a pro",
    description: "Search admin-approved paid home-sale pros by city and state.",
    url: "/directory",
  },
};

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; state?: string; category?: string }>;
}) {
  const query = await searchParams;
  const city = query.city?.trim() ?? "";
  const state = parseStateCode(query.state);
  const category = parseCategoryQuery(query.category);
  const today = todayIso();
  const matches = filterListings(productionListings, { city, state, category }, today);
  const sponsor = category ? activeCategorySponsor(productionPlacements, category, today) : null;
  return (
    <>
      <h1>Find a pro</h1>
      <p className="lede">
        Search by city and state. Production listings are limited to paid placements an admin has approved. There are
        none until that happens.
      </p>
      <form className="panel" method="get" action="/directory">
        <div className="form-grid">
          <label htmlFor="directory-city">
            City
            <input id="directory-city" name="city" defaultValue={city} />
          </label>
          <label htmlFor="directory-state">
            State
            <select id="directory-state" name="state" defaultValue={state}>
              <option value="">Any state</option>
              {US_STATES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="directory-category">
            Service
            <select id="directory-category" name="category" defaultValue={category ?? ""}>
              <option value="">Any service</option>
              {PRO_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {categoryLabel(item)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit">Search</button>
      </form>
      {sponsor ? <PlacementBanner placement={sponsor} /> : null}
      <DirectoryResults listings={matches} emptyMessage={directoryEmptyMessage({ city, state, category })} />
    </>
  );
}
