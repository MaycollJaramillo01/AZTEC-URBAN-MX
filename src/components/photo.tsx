import images from "@/data/images.json";
import type { Locale } from "@/lib/i18n";
export type AztecImage = (typeof images)[number];
export const galleryImages = images;
export function getImage(id: string) {
  const image = images.find((item) => item.id === id);
  if (!image) throw new Error(`Unknown photograph: ${id}`);
  return image;
}
export function Photo({
  id,
  locale,
  className = "",
  priority = false,
  sizes = "(max-width: 767px) 100vw, 50vw",
}: {
  id: string;
  locale: Locale;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const photo = getImage(id);
  const largest = photo.variants.at(-1)!;
  return (
    <picture className={`photo ${className}`}>
      <source
        type="image/webp"
        srcSet={photo.variants
          .map((item) => `${item.webp} ${item.width}w`)
          .join(", ")}
        sizes={sizes}
      />
      {/* Responsive derivatives are generated locally, with JPEG fallback and no image server. */}
      <img
        src={largest.jpeg}
        srcSet={photo.variants
          .map((item) => `${item.jpeg} ${item.width}w`)
          .join(", ")}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={locale === "es" ? photo.altEs : photo.altEn}
        style={{ objectPosition: photo.focalPoint }}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
