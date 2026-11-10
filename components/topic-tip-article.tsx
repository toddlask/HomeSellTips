import { InContentAd } from "@/components/ad-regions";
import { AdviceNote } from "@/components/advice-note";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RichText } from "@/components/gloss-text";
import { PagePhoto } from "@/components/home-photo";
import { JsonLd } from "@/components/json-ld";
import { PageByline } from "@/components/page-byline";
import { SourceList } from "@/components/source-list";
import { BackToTop, TipJump } from "@/components/tip-jump";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { tipPhoto } from "@/lib/photos";
import { topicTipsFor, type TopicTip } from "@/lib/round";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
import { sourcesForTopic, topicAdvice, topicGuidePath, topicHeading, topicPath } from "@/lib/topics";

export function TopicTipArticle({ tip }: { tip: TopicTip }) {
  const origin = getSiteUrl();
  const pageUrl = `${origin}/tips/${tip.slug}`;
  const photo = tipPhoto(tip.slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Tips", path: "/tips" },
    { name: topicHeading(tip.topic), path: topicPath(tip.topic) },
    { name: tip.title, path: `/tips/${tip.slug}` },
  ];
  const related = topicTipsFor(tip.topic).filter((entry) => entry.slug !== tip.slug).slice(0, 4);
  return (
    <article>
      <JsonLd
        data={articleJsonLd({
          headline: tip.title,
          image: `${origin}${photo.src}`,
          url: pageUrl,
          authorName: SITE_NAME,
          publisherUrl: origin,
        })}
      />
      <JsonLd data={breadcrumbJsonLd(origin, crumbs)} />
      <TipJump />
      <Breadcrumbs crumbs={crumbs} />
      <h1>{tip.title}</h1>
      <PageByline />
      <AdviceNote kind={topicAdvice(tip.topic)} />
      <p className="lede">{tip.summary}</p>
      <p>
        This note is one task. The full guide is{" "}
        <a href={topicGuidePath(tip.topic)}>{topicHeading(tip.topic)}</a>.
      </p>
      <PagePhoto photo={photo} />
      {tip.body.map((paragraph) => (
        <p key={paragraph}>
          <RichText text={paragraph} />
        </p>
      ))}
      <h2>What to do</h2>
      <ol className="steps">
        {tip.steps.map((step) => (
          <li key={step}>
            <RichText text={step} />
          </li>
        ))}
      </ol>
      <SourceList sources={sourcesForTopic(tip.topic)} />
      {related.length > 0 ? (
        <section aria-labelledby="related-tips">
          <h2 id="related-tips">More from {topicHeading(tip.topic)}</h2>
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
