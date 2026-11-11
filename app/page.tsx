import type { Metadata } from "next";
import { FaqList } from "@/components/faq-list";
import { HomePhotoView } from "@/components/home-photo";
import { InContentAd } from "@/components/ad-regions";
import { JsonLd } from "@/components/json-ld";
import { ZillowHomeBanner } from "@/components/zillow-banner";
import { tips } from "@/lib/catalog";
import { allGuides, publishedTopicTips, ROUND_UPDATED_ON, stageGuidePath } from "@/lib/round";
import { topicGuidePath, topicHeading, topicPath, topicSummary, TOPIC_IDS, type TopicId } from "@/lib/topics";
import { organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { HUB_DESCRIPTIONS } from "@/lib/page-copy";
import { heroPhoto, pagePhoto, stagePhoto } from "@/lib/photos";
import { stagePath, stageSummary, stageTitle } from "@/lib/stages";
import { pageMetadata } from "@/lib/page-meta";
import { CALCULATOR_NOTE, getSiteUrl, publishedTips, SITE_NAME, TOOL_LINKS } from "@/lib/site";
import { STAGE_IDS, type StageId } from "@/lib/types";

export const metadata: Metadata = pageMetadata({
  title: "Tips for Selling Your House: Helpful Ideas Before You List",
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
  const latest = [
    ...publishedTips(tips).map((tip) => ({
      href: `/tips/${tip.slug}`,
      title: tip.title,
      summary: tip.summary,
      updatedOn: tip.updatedOn,
    })),
    ...publishedTopicTips().map((tip) => ({
      href: `/tips/${tip.slug}`,
      title: tip.title,
      summary: tip.summary,
      updatedOn: tip.updatedOn,
    })),
    ...allGuides().map((guide) => ({
      href: guide.kind === "stage" ? stageGuidePath(guide.id as StageId) : topicGuidePath(guide.id as TopicId),
      title: guide.h1,
      summary: guide.description,
      updatedOn: ROUND_UPDATED_ON,
    })),
  ]
    .toSorted((left, right) => right.updatedOn.localeCompare(left.updatedOn) || left.title.localeCompare(right.title))
    .slice(0, 6);

  const origin = getSiteUrl();
  return (
    <>
      <JsonLd data={websiteJsonLd(origin, SITE_NAME)} />
      <JsonLd data={organizationJsonLd(origin, SITE_NAME)} />
      <section className="hero bleed" aria-labelledby="home-heading">
        <HomePhotoView photo={heroPhoto} className="hero-photo" priority sizes="100vw" />
        <div className="hero-scrim" />
        <div className="wrap hero-copy">
          <h1 id="home-heading">Helpful Ideas for Selling Your Home</h1>
          <p className="subhead">Tips for selling your house, stage by stage.</p>
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
      <ZillowHomeBanner />
      <section className="section-gap" id="tools" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="section-heading">
          Tools
        </h2>
        <p className="section-note">{CALCULATOR_NOTE} Each one starts with an example you can replace.</p>
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
      <section className="section-gap" id="topics" aria-labelledby="topics-heading">
        <h2 id="topics-heading" className="section-heading">
          Topics
        </h2>
        <ul className="photo-grid">
          {TOPIC_IDS.map((topic) => (
            <li key={topic}>
              <a className="photo-card" href={topicPath(topic)}>
                <HomePhotoView photo={pagePhoto(topicPath(topic))} />
                <h3>{topicHeading(topic)}</h3>
                <p>{topicSummary(topic)}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <InContentAd />
      <section className="section-gap" aria-labelledby="updated-guides">
        <h2 id="updated-guides" className="section-heading">
          Recently updated guides
        </h2>
        <ul className="card-grid">
          {latest.map((tip) => (
            <li key={tip.href}>
              <a className="card" href={tip.href}>
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
