import { AdSlot } from "@/components/ad-slot";
import { adSlotId, adsenseClientId } from "@/lib/ads";
import type { AdSlotName } from "@/lib/types";

function slotConfig(slot: AdSlotName): { clientId: string; slotId: string } | null {
  const clientId = adsenseClientId(process.env.ADSENSE_PUBLISHER_ID);
  const slotId = adSlotId(slot);
  if (!clientId || !slotId) {
    return null;
  }
  return { clientId, slotId };
}

export function HeaderAd() {
  const config = slotConfig("header");
  if (!config) {
    return null;
  }
  return <AdSlot clientId={config.clientId} slotId={config.slotId} position="header" />;
}

export function InContentAd() {
  const config = slotConfig("in-content");
  if (!config) {
    return null;
  }
  return <AdSlot clientId={config.clientId} slotId={config.slotId} position="in-content" />;
}

export function SidebarAd() {
  const config = slotConfig("sidebar");
  if (!config) {
    return null;
  }
  return <AdSlot clientId={config.clientId} slotId={config.slotId} position="sidebar" />;
}
