import type { Metadata } from "next";
import { FaqList } from "@/components/faq-list";
import { HomePhotoView } from "@/components/home-photo";
import { InContentAd } from "@/components/ad-regions";
import { UpdatedOn } from "@/components/updated-on";
import { tips } from "@/lib/catalog";
import { heroPhoto, stagePhoto } from "@/lib/photos";
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

const features = [
  ["Your numbers", "Tools use only what you type."],
  ["By stage", "From prep through moving."],
  ["Approved listings", "Paid placements stay hidden until approved."],
  ["Rules vary", "This is not legal or real-estate advice."],
] as const;

export default function HomePage() {
  const latest = publishedTips(tips)
    .toSorted((left, right) => right.updatedOn.localeCompare(left.updatedOn) || left.title.localeCompare(right.title))
    .slice(0, 4);

  return (
    <>
      <section className="hero bleed" aria-labelledby="home-heading">
        <HomePhotoView photo={heroPhoto} className="hero-photo" priority />
        <div className="hero-scrim" />
        <div className="wrap hero-copy">
          <h1 id="home-heading">Practical tips for selling your home</h1>
          <p className="script">for the months before you list</p>
          <p className="lede">
            Plain steps for the months before you list, whether you hire an agent or sell the house yourself. The
            numbers in the tools come from you.
          </p>
          <p>
            <a className="button" href="#stages">
              See the stages
            </a>
          </p>
        </div>
      </section>
      <ul className="feature-row bleed">
        {features.map(([title, text]) => (
          <li key={title}>
            <strong>{title}</strong>
            <span>{text}</span>
          </li>
        ))}
      </ul>
      <section className="section-gap" id="stages" aria-labelledby="stages-heading">
        <h2 id="stages-heading" className="section-heading">
          By stage
        </h2>
        <ul className="photo-grid">
          {STAGE_IDS.map((stage) => (
            <li key={stage}>
              <a className="photo-card" href={stagePath(stage)}>
                <HomePhotoView photo={stagePhoto(stage)} />
                <h3>{stageTitle(stage)}</h3>
                <p>{stageSummary(stage)}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section className="section-gap" id="tools" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="section-heading">
          Tools
        </h2>
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
      </section>
      <section className="band bleed" aria-labelledby="directory-heading">
        <HomePhotoView photo={stagePhoto("pricing")} className="band-photo" />
        <div className="band-scrim" />
        <div className="wrap band-copy">
          <h2 id="directory-heading">Find a pro</h2>
          <p className="lede">By city and state. Only approved paid listings appear.</p>
          <p>
            <a className="button" href="/directory">
              Open the directory
            </a>
          </p>
        </div>
      </section>
      <InContentAd />
      <section className="section-gap" aria-labelledby="latest-heading">
        <h2 id="latest-heading" className="section-heading">
          From the library
        </h2>
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
