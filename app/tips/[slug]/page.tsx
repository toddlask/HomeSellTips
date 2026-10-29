import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InContentAd } from "@/components/ad-regions";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { GlossText } from "@/components/gloss-text";
import { PagePhoto } from "@/components/home-photo";
import { JsonLd } from "@/components/json-ld";
import { SaleWords } from "@/components/sale-words";
import { BackToTop, TipJump } from "@/components/tip-jump";
import { tips } from "@/lib/catalog";
import { tipCrumbs } from "@/lib/crumbs";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { tipMetaDescription } from "@/lib/tip-meta";
import { pageMetadata, tipPageTitle } from "@/lib/page-meta";
import { tipPhoto } from "@/lib/photos";
import { stageTitle } from "@/lib/stages";
import { tipShareImage } from "@/lib/tip-card";
import { getSiteUrl, publishedTips, relatedTips, SITE_NAME } from "@/lib/site";

export function generateStaticParams(): Array<{ slug: string }> {
  return publishedTips(tips).map((tip) => ({ slug: tip.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tip = publishedTips(tips).find((entry) => entry.slug === slug);
  if (!tip) {
    return { title: "Tip" };
  }
  return pageMetadata({
    title: tipPageTitle(tip.title),
    description: tipMetaDescription(tip),
    path: `/tips/${tip.slug}`,
    absoluteTitle: true,
    openGraphType: "article",
    image: tipShareImage(tip),
  });
}

export default async function TipPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tip = publishedTips(tips).find((entry) => entry.slug === slug);
  if (!tip) {
    notFound();
  }
  const related = relatedTips(tips, tip);
  const origin = getSiteUrl();
  const pageUrl = `${origin}/tips/${tip.slug}`;
  const share = tipShareImage(tip);
  const crumbs = tipCrumbs(tip);
  return (
    <article>
      <JsonLd
        data={articleJsonLd({
          headline: tip.title,
          image: `${origin}${share.url}`,
          url: pageUrl,
          authorName: SITE_NAME,
          publisherUrl: origin,
        })}
      />
      <JsonLd data={breadcrumbJsonLd(origin, crumbs)} />
      <TipJump />
      <Breadcrumbs crumbs={crumbs} />
      <h1>{tip.title}</h1>
      <p className="lede">{tip.summary}</p>
      <PagePhoto photo={tipPhoto(tip.slug)} />
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
