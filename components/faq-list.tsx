import { RichText } from "@/components/gloss-text";
import { FAQ_ITEMS, faqJsonLd, type FaqItem } from "@/lib/faq";

export function FaqListItems({ items, heading, group = "questions" }: { items: readonly FaqItem[]; heading: string; group?: string }) {
  const jsonLd = faqJsonLd(items);
  return (
    <section className="section-gap" aria-labelledby="faq-heading">
      <h2 id="faq-heading">{heading}</h2>
      <div className="faq-list">
        {items.map((item) => (
          <details key={item.question} name={group}>
            <summary>{item.question}</summary>
            <p>
              <RichText text={item.answer} />
            </p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}

export function FaqList() {
  return <FaqListItems items={FAQ_ITEMS} heading="Questions" />;
}
