import { stagePhoto, type HomePhoto } from "@/lib/photos";
import type { StageId } from "@/lib/types";

export function HomePhotoView({
  photo,
  className,
  priority = false,
}: {
  photo: HomePhoto;
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      className={className}
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}

export function StagePhoto({ stage }: { stage: StageId }) {
  const photo = stagePhoto(stage);
  return (
    <figure className="stage-photo">
      <HomePhotoView photo={photo} />
    </figure>
  );
}
