import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { tips } from "@/lib/catalog";
import { tipPhoto } from "@/lib/photos";
import { renderTipCard } from "@/lib/render-tip-card";
import { tipCardPath } from "@/lib/tip-card";

async function main() {
  const visible = tips.filter((tip) => tip.status === "published");
  const directory = resolve("public/og/tips");
  await mkdir(directory, { recursive: true });

  let cursor = 0;
  async function worker() {
    while (cursor < visible.length) {
      const tip = visible[cursor];
      cursor += 1;
      if (!tip) {
        return;
      }
      const photo = tipPhoto(tip.slug);
      const card = await renderTipCard({
        title: tip.title,
        photoFile: resolve("public", photo.src.slice(1)),
      });
      await writeFile(resolve("public", tipCardPath(tip.slug).slice(1)), card);
    }
  }

  await Promise.all([worker(), worker(), worker(), worker()]);
  console.log(`Wrote ${visible.length} tip cards.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
