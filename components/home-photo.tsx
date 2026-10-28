import Image from "next/image";
import { stagePhoto, type HomePhoto } from "@/lib/photos";
import type { StageId } from "@/lib/types";

const GRID_SIZES = "(min-width: 64rem) 18rem, (min-width: 40rem) 46vw, 92vw";
const STAGE_SIZES = "(min-width: 76rem) 72rem, 92vw";
const CURB_SIZES = "(min-width: 40rem) 36rem, 92vw";

export function HomePhotoView({
  photo,
  className,
  priority = false,
  sizes = GRID_SIZES,
}: {
  photo: HomePhoto;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      className={className}
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      sizes={sizes}
      priority={priority}
    />
  );
}

export function StagePhoto({ stage }: { stage: StageId }) {
  const photo = stagePhoto(stage);
  return (
    <figure className="stage-photo">
      <HomePhotoView photo={photo} priority sizes={STAGE_SIZES} />
    </figure>
  );
}

export function CurbPhoto({ photo }: { photo: HomePhoto }) {
  return <HomePhotoView photo={photo} sizes={CURB_SIZES} />;
}
