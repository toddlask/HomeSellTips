import type { Metadata } from "next";
import { UpdatedOn } from "@/components/updated-on";
import { tips } from "@/lib/catalog";
import { HUB_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { stageTitle } from "@/lib/stages";
import { publishedTips } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Tips",
  description: HUB_DESCRIPTIONS.tips,
  path: "/tips",
});

export default function TipsIndexPage() {
  const published = publishedTips(tips).toSorted(
    (left, right) => right.updatedOn.localeCompare(left.updatedOn) || left.title.localeCompare(right.title),
  );
  return (
    <>
      <h1>Tips</h1>
      <p className="lede">Published notes from the library. Older notes that left the active set are in the archive.</p>
      {published.length === 0 ? (
        <p className="panel">No published tips yet.</p>
      ) : (
        <ul className="card-grid">
          {published.map((tip) => (
            <li key={tip.slug}>
              <a className="card" href={`/tips/${tip.slug}`}>
                <h2>{tip.title}</h2>
                <UpdatedOn iso={tip.updatedOn} />
                <p>
                  {stageTitle(tip.stage)}. {tip.summary}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
