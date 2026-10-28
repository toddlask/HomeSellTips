import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InContentAd } from "@/components/ad-regions";
import { GlossText } from "@/components/gloss-text";
import { StagePhoto } from "@/components/home-photo";
import { JsonLd } from "@/components/json-ld";
import { SaleWords } from "@/components/sale-words";
import { BackToTop, TipJump } from "@/components/tip-jump";
import { UpdatedOn } from "@/components/updated-on";
import { tips } from "@/lib/catalog";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { pageMetadata, tipPageTitle } from "@/lib/page-meta";
import { stagePhoto } from "@/lib/photos";
import { stagePath, stageTitle } from "@/lib/stages";
import { getSiteUrl, relatedTips, tipStatusLabel } from "@/lib/site";

export function generateStaticParams(): Array<{ slug: string }> {
  return tips
    .filter((tip) => tip.status === "published" || tip.status === "archived")
    .map((tip) => ({ slug: tip.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tip = tips.find((entry) => entry.slug === slug && (entry.status === "published" || entry.status === "archived"));
  if (!tip) {
    return { title: "Tip" };
  }
  const photo = stagePhoto(tip.stage);
  const updated = `${tip.updatedOn}T00:00:00.000Z`;
  return pageMetadata({
    title: tipPageTitle(tip.title),
    description: tip.summary,
    path: `/tips/${tip.slug}`,
    absoluteTitle: true,
    robots: tip.status === "archived" ? { index: false, follow: true } : { index: true, follow: true },
    openGraphType: "article",
    publishedTime: updated,
    modifiedTime: updated,
    image: { url: photo.src, width: photo.width, height: photo.height, alt: photo.alt },
  });
}

export default async function TipPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tip = tips.find((entry) => entry.slug === slug);
  if (!tip || (tip.status !== "published" && tip.status !== "archived")) {
    notFound();
  }
  const photo = stagePhoto(tip.stage);
  const related = relatedTips(tips, tip);
  const origin = getSiteUrl();
  const updated = `${tip.updatedOn}T00:00:00.000Z`;
  const pageUrl = `${origin}/tips/${tip.slug}`;
  return (
    <article>
      <JsonLd
        data={articleJsonLd({
          headline: tip.title,
          datePublished: updated,
          dateModified: updated,
          image: `${origin}${photo.src}`,
          url: pageUrl,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(origin, [
          { name: "Home", path: "/" },
          { name: stageTitle(tip.stage), path: stagePath(tip.stage) },
          { name: tip.title, path: `/tips/${tip.slug}` },
        ])}
      />
      <TipJump />
      <p>
        <a href={stagePath(tip.stage)}>{stageTitle(tip.stage)}</a>
      </p>
      {tip.status === "archived" ? <p className="archive-flag">{tipStatusLabel(tip.status)}</p> : null}
      <StagePhoto stage={tip.stage} />
      <h1>{tip.title}</h1>
      <UpdatedOn iso={tip.updatedOn} />
      <p className="lede">{tip.summary}</p>
      {tip.body.map((paragraph) => (
        <p key={paragraph}>
          <GlossText text={paragraph} />
        </p>
      ))}
      <h2>What to do</h2>
      <ol className="steps">
        {tip.steps.map((step) => (
          <li key={step}>
            <GlossText text={step} />
          </li>
        ))}
      </ol>
      <SaleWords />
      {related.length > 0 ? (
        <section aria-labelledby="related-tips">
          <h2 id="related-tips">More from {stageTitle(tip.stage)}</h2>
          <ul className="related-list">
            {related.map((entry) => (
              <li key={entry.slug}>
                <a href={`/tips/${entry.slug}`}>{entry.title}</a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <InContentAd />
      <BackToTop />
    </article>
  );
}
