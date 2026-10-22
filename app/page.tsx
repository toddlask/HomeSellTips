import type { Metadata } from "next";
import { FaqList } from "@/components/faq-list";
import { InContentAd } from "@/components/ad-regions";
import { UpdatedOn } from "@/components/updated-on";
import { tips } from "@/lib/catalog";
import { stagePath, stageSummary, stageTitle } from "@/lib/stages";
import { publishedTips, SITE_NAME } from "@/lib/site";
import { STAGE_IDS } from "@/lib/types";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} · Practical tips before you sell` },
  description: "Practical US home-selling tips for the months before you list, with calculators that use only the numbers you enter.",
  openGraph: {
    title: `${SITE_NAME} · Practical tips before you sell`,
    description: "Practical US home-selling tips for the months before you list, with calculators that use only the numbers you enter.",
    url: "/",
  },
};

const tools = [
  { href: "/tools/net-proceeds", title: "Net proceeds", text: "Price minus payoff, commissions, costs, credits, and repairs." },
  { href: "/tools/commission", title: "Commission comparison", text: "Full service, FSBO with a buyer agent, and FSBO paying neither." },
  { href: "/tools/what-to-fix", title: "What to fix first", text: "Rank projects by the cost and value you enter." },
  { href: "/tools/checklist", title: "Prep checklist", text: "A list you can print and check off." },
];

export default function HomePage() {
  const latest = publishedTips(tips)
    .toSorted((left, right) => right.updatedOn.localeCompare(left.updatedOn) || left.title.localeCompare(right.title))
    .slice(0, 4);

  return (
    <>
      <h1>Practical tips for selling your home</h1>
      <p className="lede">
        Plain steps for the months before you list, whether you hire an agent or sell the house yourself. The numbers in
        the tools come from you.
      </p>
      <section className="section-gap" aria-labelledby="stages-heading">
        <h2 id="stages-heading">By stage</h2>
        <ul className="card-grid">
          {STAGE_IDS.map((stage) => (
            <li key={stage}>
              <a className="card" href={stagePath(stage)}>
                <h3>{stageTitle(stage)}</h3>
                <p>{stageSummary(stage)}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="section-gap" aria-labelledby="tools-heading">
        <h2 id="tools-heading">Tools</h2>
        <ul className="tool-grid">
          {tools.map((tool) => (
            <li key={tool.href}>
              <a className="card" href={tool.href}>
                <h3>{tool.title}</h3>
                <p>{tool.text}</p>
              </a>
            </li>
          ))}
        </ul>
        <p>
          <a href="/directory">Find a pro</a> by city and state. Only approved paid listings appear.
        </p>
      </section>
      <InContentAd />
      <section className="section-gap" aria-labelledby="latest-heading">
        <h2 id="latest-heading">From the library</h2>
        <ul className="card-grid">
          {latest.map((tip) => (
            <li key={tip.slug}>
              <a className="card" href={`/tips/${tip.slug}`}>
                <h3>{tip.title}</h3>
                <UpdatedOn iso={tip.updatedOn} />
                <p>{tip.summary}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <FaqList />
    </>
  );
}
