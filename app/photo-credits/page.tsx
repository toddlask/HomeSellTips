import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { tips } from "@/lib/catalog";
import { photoCreditCrumbs } from "@/lib/crumbs";
import { INFO_DESCRIPTIONS } from "@/lib/page-copy";
import { pageMetadata } from "@/lib/page-meta";
import { parseStageId } from "@/lib/parse";
import { topicTipBySlug } from "@/lib/round";
import { parseTopicId, topicHeading } from "@/lib/topics";
import { photoPlacements, type HomePhoto } from "@/lib/photos";
import { stageTitle } from "@/lib/stages";
import { TOOL_LINKS } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Photo credits",
  description: INFO_DESCRIPTIONS.credits,
  path: "/photo-credits",
});

function pageLabel(path: string): string {
  if (path === "/") {
    return "Home";
  }
  if (path === "/tips") {
    return "Tips";
  }
  if (path === "/stages") {
    return "Stages";
  }
  if (path === "/tools") {
    return "Tools";
  }
  if (path === "/topics") {
    return "Topics";
  }
  if (path.startsWith("/stages/") && path.endsWith("/guide")) {
    return `${stageTitle(parseStageId(path.split("/")[2] ?? ""))} guide`;
  }
  if (path.startsWith("/stages/")) {
    return stageTitle(parseStageId(path.slice("/stages/".length)));
  }
  if (path.startsWith("/topics/") && path.endsWith("/guide")) {
    return `${topicHeading(parseTopicId(path.split("/")[2] ?? ""))} guide`;
  }
  if (path.startsWith("/topics/")) {
    return topicHeading(parseTopicId(path.split("/")[2] ?? ""));
  }
  if (path.startsWith("/tips/")) {
    const slug = path.slice("/tips/".length);
    return tips.find((tip) => tip.slug === slug)?.title ?? topicTipBySlug(slug)?.title ?? slug;
  }
  return TOOL_LINKS.find((tool) => tool.href === path)?.title ?? path;
}

function CreditThumb({ photo }: { photo: HomePhoto }) {
  return (
    // Plain img so the credits test can render this page in node, and so the thumbs skip the image optimizer.
    // eslint-disable-next-line @next/next/no-img-element -- node test renders this page
    <img
      src={photo.src}
      alt={photo.alt}
      width={160}
      height={107}
      loading="lazy"
      decoding="async"
    />
  );
}

export default function PhotoCreditsPage() {
  return (
    <>
      <Breadcrumbs crumbs={photoCreditCrumbs()} linkLast />
      <h1>Photo credits</h1>
      <p className="lede">Every picture on the site, with the page that uses it.</p>
      <ul className="photo-credits">
        {photoPlacements().map((credit) => (
          <li key={credit.photo.id}>
            <CreditThumb photo={credit.photo} />
            <div>
              <p>
                {credit.pages.map((path, index) => (
                  <span key={path}>
                    {index > 0 ? ", " : null}
                    <a href={path}>{pageLabel(path)}</a>
                  </span>
                ))}
              </p>
              <p>
                Photograph by {credit.photo.photographer}. <a href={credit.photo.sourcePage}>Source</a>.{" "}
                <a href={credit.photo.licenseUrl}>{credit.photo.license}</a>.
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
