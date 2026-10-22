import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InContentAd } from "@/components/ad-regions";
import { UpdatedOn } from "@/components/updated-on";
import { tips } from "@/lib/catalog";
import { stagePath, stageTitle } from "@/lib/stages";
import { tipStatusLabel } from "@/lib/site";

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
  return {
    title: tip.title,
    description: tip.summary,
    robots: tip.status === "archived" ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: tip.title,
      description: tip.summary,
      type: "article",
      url: `/tips/${tip.slug}`,
      publishedTime: `${tip.updatedOn}T00:00:00.000Z`,
      modifiedTime: `${tip.updatedOn}T00:00:00.000Z`,
    },
  };
}

export default async function TipPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tip = tips.find((entry) => entry.slug === slug);
  if (!tip || (tip.status !== "published" && tip.status !== "archived")) {
    notFound();
  }
  return (
    <article>
      <p>
        <a href={stagePath(tip.stage)}>{stageTitle(tip.stage)}</a>
      </p>
      {tip.status === "archived" ? <p className="archive-flag">{tipStatusLabel(tip.status)}</p> : null}
      <h1>{tip.title}</h1>
      <UpdatedOn iso={tip.updatedOn} />
      <p className="lede">{tip.summary}</p>
      {tip.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
      <h2>What to do</h2>
      <ol className="steps">
        {tip.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <InContentAd />
    </article>
  );
}
