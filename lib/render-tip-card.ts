import { createElement } from "react";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { TIP_CARD_HEIGHT, TIP_CARD_WIDTH } from "@/lib/tip-card";

export async function renderTipCard(input: { title: string; photoFile: string }): Promise<Buffer> {
  const png = await sharp(input.photoFile)
    .resize(TIP_CARD_WIDTH, TIP_CARD_HEIGHT, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();
  const src = `data:image/png;base64,${png.toString("base64")}`;
  const response = new ImageResponse(
    createElement(
      "div",
      { style: { display: "flex", width: "100%", height: "100%", position: "relative" } },
      createElement("img", { src, width: TIP_CARD_WIDTH, height: TIP_CARD_HEIGHT }),
      createElement(
        "div",
        {
          style: {
            position: "absolute",
            left: "48px",
            bottom: "40px",
            width: "1104px",
            display: "flex",
            padding: "22px 28px",
            background: "rgba(99, 62, 40, 0.92)",
            color: "#f7f1ea",
            fontSize: 48,
            lineHeight: 1.15,
          },
        },
        input.title,
      ),
    ),
    { width: TIP_CARD_WIDTH, height: TIP_CARD_HEIGHT },
  );
  const rendered = Buffer.from(await response.arrayBuffer());
  return sharp(rendered).jpeg({ quality: 82 }).toBuffer();
}
