import { IRS_PUB_523 } from "@/lib/sources";
import type { TopicAdvice } from "@/lib/topics";

export function AdviceNote({ kind }: { kind: TopicAdvice }) {
  switch (kind) {
    case "tax":
      return (
        <p className="note">
          This is not tax advice. Read <a href={IRS_PUB_523.href}>{IRS_PUB_523.label}</a> and ask a tax advisor before you file.
        </p>
      );
    case "estate":
      return (
        <p className="note">
          This is not legal or tax advice. Read <a href={IRS_PUB_523.href}>{IRS_PUB_523.label}</a> and ask a lawyer and a tax advisor.
        </p>
      );
    case "money":
      return <p className="note">This is not legal or financial advice. Your note, your servicer, and your contract control the numbers.</p>;
    case "texas":
      return (
        <p className="note">This is not legal advice. Texas forms and seller duties depend on the facts of this sale.</p>
      );
    case "none":
      return null;
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}
