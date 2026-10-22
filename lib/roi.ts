import type { RoiBucket, RoiItem } from "@/lib/types";

export type RoiPreset = {
  id: string;
  bucket: RoiBucket;
  label: string;
};

export function roiBucketLabel(bucket: RoiBucket): string {
  switch (bucket) {
    case "safety-function":
      return "Safety and function";
    case "curb-entry":
      return "Curb and entry";
    case "kitchen-baths":
      return "Kitchen and baths";
    case "paint-floors":
      return "Paint and floors";
    case "leave-for-buyer":
      return "Leave for the buyer";
    default: {
      const exhaustive: never = bucket;
      return exhaustive;
    }
  }
}

export const ROI_PRESETS: readonly RoiPreset[] = [
  { id: "leak", bucket: "safety-function", label: "Repair a leak you can see" },
  { id: "rail", bucket: "safety-function", label: "Secure a loose rail or step" },
  { id: "alarms", bucket: "safety-function", label: "Replace expired smoke or carbon-monoxide alarms" },
  { id: "outlets", bucket: "safety-function", label: "Fix an outlet or light that does not work" },
  { id: "door", bucket: "curb-entry", label: "Clean the front door and hardware" },
  { id: "path", bucket: "curb-entry", label: "Tidy the walkway to the door" },
  { id: "numbers", bucket: "curb-entry", label: "Make the house numbers readable from the street" },
  { id: "caulk", bucket: "kitchen-baths", label: "Replace cracked caulk at a tub or sink" },
  { id: "faucet", bucket: "kitchen-baths", label: "Stop a dripping faucet" },
  { id: "scrub", bucket: "kitchen-baths", label: "Deep-clean the kitchen and baths" },
  { id: "touchup", bucket: "paint-floors", label: "Touch up scuffed paint" },
  { id: "floors", bucket: "paint-floors", label: "Clean floors, or replace a stain you choose to fix" },
  { id: "remodel", bucket: "leave-for-buyer", label: "Full kitchen remodel" },
  { id: "taste", bucket: "leave-for-buyer", label: "A finish that only matches your taste" },
  { id: "windows", bucket: "leave-for-buyer", label: "New windows across the whole house" },
];

export function netOfItem(item: Pick<RoiItem, "cost" | "expectedValue">): number {
  return Math.round((item.expectedValue - item.cost) * 100) / 100;
}

export function rankFixItems(items: readonly RoiItem[]): RoiItem[] {
  return items.toSorted((left, right) => {
    const delta = netOfItem(right) - netOfItem(left);
    if (delta !== 0) {
      return delta;
    }
    return left.label.localeCompare(right.label);
  });
}
