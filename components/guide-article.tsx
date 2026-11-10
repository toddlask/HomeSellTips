import { FaqListItems } from "@/components/faq-list";
import { RichText } from "@/components/gloss-text";
import { PagePhoto } from "@/components/home-photo";
import type { HomePhoto } from "@/lib/photos";
import type { RoundGuide } from "@/lib/round-parse";

export function GuideArticle({
  guide,
  photo,
  related,
}: {
  guide: RoundGuide;
  photo: HomePhoto;
  related?: { href: string; title: string }[];
}) {
  return (
    <>
      <p className="lede">
        <RichText text={guide.lede} />
      </p>
      <PagePhoto photo={photo} priority />
      {guide.sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
        </section>
      ))}
      <h2>Checklist</h2>
      <ul className="steps">
        {guide.checklist.map((item) => (
          <li key={item}>
            <RichText text={item} />
          </li>
        ))}
      </ul>
      <h2>Worked examples</h2>
      {guide.examples.map((example) => (
        <section key={example.title}>
          <h3>{example.title}</h3>
          {example.paragraphs.map((paragraph) => (
            <p key={paragraph}>
              <RichText text={paragraph} />
            </p>
          ))}
        </section>
      ))}
      <h2>Common mistakes</h2>
      <ul className="steps">
        {guide.mistakes.map((item) => (
          <li key={item}>
            <RichText text={item} />
          </li>
        ))}
      </ul>
      <h2>When to call a pro</h2>
      {guide.callPro.map((paragraph) => (
        <p key={paragraph}>
          <RichText text={paragraph} />
        </p>
      ))}
      {related && related.length > 0 ? (
        <section aria-labelledby="related-notes">
          <h2 id="related-notes">Shorter notes</h2>
          <ul className="related-list">
            {related.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.title}</a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <FaqListItems items={guide.faqs} heading="Questions" group="guide-questions" />
    </>
  );
}
