import type { ReviewStatus } from "@/lib/types";

export function reviewStatusLabel(status: ReviewStatus): string {
  switch (status) {
    case "open":
      return "Open";
    case "approved":
      return "Approved";
    default: {
      const exhaustive: never = status;
      return exhaustive;
    }
  }
}
