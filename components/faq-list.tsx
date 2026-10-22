import { FAQ_ITEMS, faqJsonLd } from "@/lib/faq";

export function FaqList() {
  const jsonLd = faqJsonLd(FAQ_ITEMS);
  return (
    <section className="section-gap" aria-labelledby="faq-heading">
      <h2 id="faq-heading">Questions</h2>
      <div className="faq-list">
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} name="questions">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
