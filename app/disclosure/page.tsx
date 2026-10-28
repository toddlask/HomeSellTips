import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-meta";

export const metadata: Metadata = pageMetadata({
  title: "Ad and affiliate disclosure",
  description: "How HomeSellTips labels sponsored placements, ads, and affiliate links.",
  path: "/disclosure",
});

export default function DisclosurePage() {
  return (
    <>
      <h1>Ad and affiliate disclosure</h1>
      <h2>Sponsored placements</h2>
      <p>
        Category banners and the sitewide header are paid placements. Each one shows a Sponsored label. They appear
        only after admin approval and disappear on the end date stored with the placement.
      </p>
      <h2>Display ads</h2>
      <p>
        Header, in-content, and sidebar ad slots exist only when an AdSense publisher id and a slot id are set. The ad
        script does not load until you accept cookies. Empty boxes are not shown when ads are not configured.
      </p>
      <h2>Affiliate links</h2>
      <p>
        Links for moving boxes, a home warranty, or staging supplies stay off unless the affiliate flag is turned on and
        a URL is set. When a link is shown, the affiliate disclosure sits next to it. A commission, if any, does not
        change the price you pay.
      </p>
      <p>
        <a href="/advertise">Advertise with us</a> explains the paid products.
      </p>
    </>
  );
}
