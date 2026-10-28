import type { Tip } from "@/lib/types";

export const TIP_CARD_WIDTH = 1200;
export const TIP_CARD_HEIGHT = 630;

export function tipCardPath(slug: string): string {
  return `/og/tips/${slug}.jpg`;
}

export function tipShareImage(tip: Pick<Tip, "slug" | "title">) {
  return {
    url: tipCardPath(tip.slug),
    width: TIP_CARD_WIDTH,
    height: TIP_CARD_HEIGHT,
    alt: tip.title,
  } as const;
}
