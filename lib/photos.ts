import type { StageId } from "@/lib/types";

export const PEXELS_LICENSE = "Pexels License";
export const PEXELS_LICENSE_URL = "https://www.pexels.com/license/";

export type HomePhoto = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  photographer: string;
  sourcePage: string;
  license: typeof PEXELS_LICENSE;
  licenseUrl: typeof PEXELS_LICENSE_URL;
};

function photo(entry: Omit<HomePhoto, "license" | "licenseUrl">): HomePhoto {
  return { ...entry, license: PEXELS_LICENSE, licenseUrl: PEXELS_LICENSE_URL };
}

export const heroPhoto = photo({
  id: "hero-house",
  src: "/photos/hero-house.webp",
  width: 1600,
  height: 1000,
  alt: "Two-story house with gray siding, a dark roof, three garage doors, and warm lights in the windows at dusk.",
  photographer: "Binyamin Mellish",
  sourcePage: "https://www.pexels.com/photo/brown-and-gray-painted-house-in-front-of-road-106399/",
});

const kitchen = photo({
  id: "kitchen",
  src: "/photos/kitchen.webp",
  width: 1200,
  height: 800,
  alt: "White kitchen with black handles, a black tile backsplash, a stainless range hood, and a double sink by a window.",
  photographer: "Curtis Adams",
  sourcePage: "https://www.pexels.com/photo/modern-kitchen-interior-19227245/",
});

const livingRoom = photo({
  id: "living-room",
  src: "/photos/living-room.webp",
  width: 1200,
  height: 800,
  alt: "Living room with a white sofa, a fireplace, tall windows, and dark wood floors.",
  photographer: "Curtis Adams",
  sourcePage: "https://www.pexels.com/photo/bright-living-room-interior-design-5008385/",
});

const exteriorWhite = photo({
  id: "exterior-white",
  src: "/photos/exterior-white.webp",
  width: 1400,
  height: 900,
  alt: "White geometric house with a recessed front door, a small tree, and a lawn under a clear sky.",
  photographer: "Pixasquare Studio",
  sourcePage: "https://www.pexels.com/photo/white-2-storey-house-near-trees-1115804/",
});

const bedroom = photo({
  id: "bedroom",
  src: "/photos/bedroom.webp",
  width: 1200,
  height: 800,
  alt: "White bed with an iron headboard, two pillows, and matching lamps on a paneled wall.",
  photographer: "Erik Mclean",
  sourcePage: "https://www.pexels.com/photo/contemporary-white-bedroom-interior-in-a-cabin-8266829/",
});

const facade = photo({
  id: "facade-glass",
  src: "/photos/facade-glass.webp",
  width: 1200,
  height: 800,
  alt: "Cream gable wall with a tall wood-framed window, wood French doors, and a green side door.",
  photographer: "Mike Bird",
  sourcePage: "https://www.pexels.com/photo/white-2-storey-house-145661/",
});

const diningRoom = photo({
  id: "dining-room",
  src: "/photos/dining-room.webp",
  width: 1200,
  height: 800,
  alt: "White dining table and chairs in front of tall windows, with a brick wall to the left.",
  photographer: "Max Vakhtbovych",
  sourcePage: "https://www.pexels.com/photo/interior-of-light-dining-room-with-panoramic-balcony-doors-7061333/",
});

const bathroom = photo({
  id: "bathroom",
  src: "/photos/bathroom.webp",
  width: 1200,
  height: 800,
  alt: "Double vanity with a gray counter, white cabinets, and a view into a bedroom.",
  photographer: "Get Lost Mike",
  sourcePage: "https://www.pexels.com/photo/the-interior-of-a-bathroom-7710006/",
});

const movingBoxes = photo({
  id: "moving-boxes",
  src: "/photos/moving-boxes.webp",
  width: 1200,
  height: 800,
  alt: "Cardboard boxes stacked beside a window, with a plant on the sill and two pillows on a box.",
  photographer: "cottonbro studio",
  sourcePage: "https://www.pexels.com/photo/4569338/",
});

const stagePhotos: Record<StageId, HomePhoto> = {
  "prep-and-repairs": kitchen,
  staging: livingRoom,
  pricing: exteriorWhite,
  "listing-photos": bedroom,
  "agent-vs-fsbo": facade,
  "offers-and-negotiation": diningRoom,
  closing: bathroom,
  moving: movingBoxes,
};

export function stagePhoto(stage: StageId): HomePhoto {
  switch (stage) {
    case "prep-and-repairs":
    case "staging":
    case "pricing":
    case "listing-photos":
    case "agent-vs-fsbo":
    case "offers-and-negotiation":
    case "closing":
    case "moving":
      return stagePhotos[stage];
    default: {
      const exhaustive: never = stage;
      return exhaustive;
    }
  }
}

export function allPhotos(): HomePhoto[] {
  return [heroPhoto, ...Object.values(stagePhotos)];
}
