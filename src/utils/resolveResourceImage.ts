import type { ImageMetadata } from "astro";

const resourceImages = import.meta.glob<ImageMetadata>(
  "/src/images/resources/**/*.{avif,webp,png,jpg,jpeg}",
  { eager: true, import: "default" },
);

const normalizeResourcePath = (value: string) => {
  const trimmed = value.trim();
  const noLeadingSlashes = trimmed.replace(/^\/+/, "");
  const noDotSegments = noLeadingSlashes.replace(/^(\.\.\/)+/, "");
  return noDotSegments.replace(/^images\/resources\//, "");
};

const resolveResourceImage = (value?: string) => {
  if (!value) {
    return undefined;
  }

  const normalized = normalizeResourcePath(value);
  const fullPath = `/src/images/resources/${normalized}`;
  return resourceImages[fullPath];
};

export default resolveResourceImage;
