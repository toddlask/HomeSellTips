"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { HomePhoto } from "@/lib/photos";

const INTERVAL_MS = 5000;

const HERO_FOCUS: Record<string, string> = {
  "hero-house": "50% 58%",
  "living-room": "50% 62%",
  "exterior-white": "40% 45%",
  kitchen: "52% 48%",
  "dining-room": "50% 60%",
};

export function HeroSlideshow({ photos }: { photos: readonly HomePhoto[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const count = photos.length;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (paused || reduced || count < 2) {
      return;
    }
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [paused, reduced, count]);

  const slideshowClass = paused ? "hero-slideshow is-paused" : "hero-slideshow";

  return (
    <div
      className={slideshowClass}
      data-interval={INTERVAL_MS}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {photos.map((photo, photoIndex) => {
        const active = photoIndex === index;
        return (
          <div
            key={photo.id}
            className={active ? "hero-slide is-active" : "hero-slide"}
            style={{ "--hero-focus": HERO_FOCUS[photo.id] ?? "50% 50%" } as CSSProperties}
            aria-hidden={active ? undefined : true}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              decoding="async"
              fetchPriority={photoIndex === 0 ? "high" : "low"}
              loading={photoIndex === 0 ? "eager" : "lazy"}
            />
          </div>
        );
      })}
      <div className="hero-dots" role="tablist" aria-label="Home photos">
        {photos.map((photo, photoIndex) => (
          <button
            key={photo.id}
            type="button"
            role="tab"
            aria-selected={photoIndex === index}
            aria-label={`Show photo ${photoIndex + 1} of ${count}`}
            className={photoIndex === index ? "is-active" : undefined}
            onClick={() => setIndex(photoIndex)}
          />
        ))}
      </div>
    </div>
  );
}
