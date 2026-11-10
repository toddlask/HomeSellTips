import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PagePhoto } from "@/components/home-photo";
import { pageMetadata } from "@/lib/page-meta";
import { pagePhoto } from "@/lib/photos";
import { topicHeading, topicPath, topicSummary, TOPIC_IDS } from "@/lib/topics";

const description =
  "Six seller topics beside the stages: capital gains, mortgage payoff, an inherited house, foundation issues, a pre-listing inspection, and Texas.";

export const metadata: Metadata = pageMetadata({
  title: "Seller topics: tax, loans, foundation, Texas",
  description,
  path: "/topics",
  absoluteTitle: true,
});

export default function TopicsPage() {
  return (
    <>
      <Breadcrumbs crumbs={[{ name: "Home", path: "/" }, { name: "Topics", path: "/topics" }]} linkLast />
      <h1>Topics</h1>
      <p className="lede">Questions that sit beside the stages: tax, the loan, an estate, the foundation, an inspection, and Texas.</p>
      <PagePhoto photo={pagePhoto("/topics")} priority />
      <ul className="card-grid">
        {TOPIC_IDS.map((topic) => (
          <li key={topic}>
            <a className="card" href={topicPath(topic)}>
              <h2>{topicHeading(topic)}</h2>
              <p>{topicSummary(topic)}</p>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
