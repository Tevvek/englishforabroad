import type { ImageMetadata } from "astro";

const freebieImages = import.meta.glob<ImageMetadata>(
  "/src/assets/freebies/**/*.{avif,webp,png,jpg,jpeg}",
  { eager: true, import: "default" },
);

const normalizeFreebiePath = (value: string) => {
  const trimmed = value.trim();
  const noLeadingSlashes = trimmed.replace(/^\/+/, "");
  const noDotSegments = noLeadingSlashes.replace(/^(\.\.\/)+/, "");
  return noDotSegments.replace(/^freebies\//, "");
};

const resolveFreebieImage = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const normalized = normalizeFreebiePath(value);
  const fullPath = `/src/assets/freebies/${normalized}`;
  return freebieImages[fullPath];
};

export default resolveFreebieImage;
