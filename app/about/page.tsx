import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { aboutPageJsonLd } from "@/lib/jsonld";
import {
  ABOUT_ADVERTISE_AFTER,
  ABOUT_ADVERTISE_BEFORE,
  ABOUT_ADVERTISE_LINK,
  ABOUT_DESCRIPTION,
  ABOUT_LEDE,
  ABOUT_METHOD_AFTER,
  ABOUT_METHOD_BEFORE,
  ABOUT_METHOD_HEADING,
  ABOUT_SECTIONS,
  ABOUT_TITLE,
} from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { CFPB_CLOSING, FBI_IC3, IRS_PUB_523, NAR_SETTLEMENT } from "@/lib/sources";
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
      <section>
        <h2>{ABOUT_METHOD_HEADING}</h2>
        <p>
          {ABOUT_METHOD_BEFORE} <a href={IRS_PUB_523.href}>IRS Publication 523</a>, the{" "}
          <a href={CFPB_CLOSING.href}>CFPB</a>, the <a href={FBI_IC3.href}>FBI IC3</a>, and the{" "}
          <a href={NAR_SETTLEMENT.href}>NAR settlement facts</a>. {ABOUT_METHOD_AFTER}
        </p>
      </section>
      <p>
        {ABOUT_ADVERTISE_BEFORE} <a href="/advertise">{ABOUT_ADVERTISE_LINK}</a>. {ABOUT_ADVERTISE_AFTER}
      </p>
    </>
  );
}
