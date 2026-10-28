import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { aboutPageJsonLd } from "@/lib/jsonld";
import {
  ABOUT_ADVERTISE_AFTER,
  ABOUT_ADVERTISE_BEFORE,
  ABOUT_ADVERTISE_LINK,
  ABOUT_DESCRIPTION,
  ABOUT_LEDE,
  ABOUT_SECTIONS,
  ABOUT_TITLE,
} from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { getSiteUrl, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  path: "/about",
});

export default function AboutPage() {
  const origin = getSiteUrl();
  return (
    <>
      <JsonLd data={aboutPageJsonLd(origin, SITE_NAME, ABOUT_DESCRIPTION)} />
      <h1>{ABOUT_TITLE}</h1>
      <p className="lede">{ABOUT_LEDE}</p>
      {ABOUT_SECTIONS.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
      <p>
        {ABOUT_ADVERTISE_BEFORE} <a href="/advertise">{ABOUT_ADVERTISE_LINK}</a>. {ABOUT_ADVERTISE_AFTER}
      </p>
    </>
  );
}
