import type { Metadata } from "next";
import { FaqList } from "@/components/faq-list";
import { HomePhotoView } from "@/components/home-photo";
import { InContentAd } from "@/components/ad-regions";
import { JsonLd } from "@/components/json-ld";
import { tips } from "@/lib/catalog";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { HUB_DESCRIPTIONS } from "@/lib/page-copy";
import { heroPhoto, stagePhoto } from "@/lib/photos";
import { stagePath, stageSummary, stageTitle } from "@/lib/stages";
import { pageMetadata } from "@/lib/page-meta";
import { CALCULATOR_NOTE, getSiteUrl, publishedTips, SITE_NAME, TOOL_LINKS } from "@/lib/site";
import { STAGE_IDS } from "@/lib/types";

export const metadata: Metadata = pageMetadata({
  title: `${SITE_NAME} · Before you list`,
  description: HUB_DESCRIPTIONS.home,
  path: "/",
  absoluteTitle: true,
});

const features = [
  ["By stage", "From prep through moving."],
  ["Your numbers", "Tools use only what you type."],
  ["Rules vary", "This is not legal or real-estate advice."],
] as const;

export default function HomePage() {
  const latest = publishedTips(tips)
    .toSorted((left, right) => right.updatedOn.localeCompare(left.updatedOn) || left.title.localeCompare(right.title))
    .slice(0, 4);

  const origin = getSiteUrl();
  return (
    <>
      <JsonLd data={websiteJsonLd(origin, SITE_NAME)} />
      <JsonLd data={organizationJsonLd(origin, SITE_NAME)} />
      <section className="hero bleed" aria-labelledby="home-heading">
        <HomePhotoView photo={heroPhoto} className="hero-photo" priority sizes="100vw" />
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
        <p className="section-note">{CALCULATOR_NOTE}</p>
        <ul className="tool-grid">
          {TOOL_LINKS.map((tool) => (
            <li key={tool.href}>
              <a className="card" href={tool.href}>
                <h3>{tool.title}</h3>
                <p>{tool.text}</p>
              </a>
            </li>
          ))}
        </ul>
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
