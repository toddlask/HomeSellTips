import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UpdatedOn } from "@/components/updated-on";
import { tips } from "@/lib/catalog";
import { parseStageId } from "@/lib/parse";
import { stageTitle } from "@/lib/stages";
import { archivedTips } from "@/lib/site";
import { STAGE_IDS, type StageId } from "@/lib/types";

export const metadata: Metadata = {
  title: "Archived tips",
  description: "Seller tips that are no longer in the active HomeSellTips library.",
  openGraph: {
    title: "Archived tips",
    description: "Seller tips that are no longer in the active HomeSellTips library.",
    url: "/archive",
  },
};

export default async function ArchivePage({ searchParams }: { searchParams: Promise<{ stage?: string }> }) {
  const query = await searchParams;
  let stage: StageId | null = null;
  if (query.stage) {
    try {
      stage = parseStageId(query.stage);
    } catch {
      notFound();
    }
  }
  const archived = archivedTips(tips).filter((tip) => (stage ? tip.stage === stage : true));
  return (
    <>
      <h1>Archived tips</h1>
      <p className="lede">These notes stayed useful, but the active library now covers the same job.</p>
      <form className="panel no-print" method="get" action="/archive">
        <label htmlFor="archive-stage">
          Stage
          <select id="archive-stage" name="stage" defaultValue={stage ?? ""}>
            <option value="">All stages</option>
            {STAGE_IDS.map((item) => (
              <option key={item} value={item}>
                {stageTitle(item)}
              </option>
            ))}
          </select>
        </label>
        <button type="submit">Filter</button>
      </form>
      {archived.length === 0 ? (
        <p className="panel">No archived tips in this stage.</p>
      ) : (
        <ul className="card-grid">
          {archived.map((tip) => (
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
    </>
  );
}
