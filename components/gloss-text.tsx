import { Fragment } from "react";
import { TermTip } from "@/components/term-tip";
import { splitGlossary } from "@/lib/glossary";

export function GlossText({ text }: { text: string }) {
  return splitGlossary(text).map((part, index) => {
    if (part.kind === "text") {
      return <Fragment key={index}>{part.text}</Fragment>;
    }
    return <TermTip key={`${part.id}-${index}`} word={part.text} definition={part.definition} />;
  });
}
