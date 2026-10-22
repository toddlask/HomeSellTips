import type { AdSlotName } from "@/lib/types";

export function normalizePublisherId(raw: string | undefined): string | null {
  if (!raw) {
    return null;
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const withoutPrefix = trimmed.replace(/^ca-/, "");
  if (!/^pub-\d+$/.test(withoutPrefix)) {
    return null;
  }
  return withoutPrefix;
}

export function adsenseClientId(raw: string | undefined): string | null {
  const publisherId = normalizePublisherId(raw);
  if (!publisherId) {
    return null;
  }
  return `ca-${publisherId}`;
}

export function adsTxtLine(raw: string | undefined): string | null {
  const publisherId = normalizePublisherId(raw);
  if (!publisherId) {
    return null;
  }
  return `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`;
}

export function adsTxtBody(raw: string | undefined): string {
  const line = adsTxtLine(raw);
  if (!line) {
    return "";
  }
  return `${line}\n`;
}

export function adSlotId(slot: AdSlotName, env: NodeJS.ProcessEnv = process.env): string {
  switch (slot) {
    case "header":
      return env.ADSENSE_SLOT_HEADER?.trim() ?? "";
    case "in-content":
      return env.ADSENSE_SLOT_IN_CONTENT?.trim() ?? "";
    case "sidebar":
      return env.ADSENSE_SLOT_SIDEBAR?.trim() ?? "";
    default: {
      const exhaustive: never = slot;
      return exhaustive;
    }
  }
}
