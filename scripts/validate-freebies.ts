import { readdir, readFile } from "fs/promises";
import { join } from "path";
import { parse } from "yaml";

interface FreebieData {
  title?: string;
  subtitle?: string;
  description?: string;
  brevoListId?: number;
  slug?: string;
  buttonText?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface ValidationError {
  file: string;
  errors: string[];
}

const REQUIRED_FIELDS = [
  "title",
  "description",
  "brevoListId",
  "slug",
];

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

async function validateFreebies() {
  console.log("🔍 Validating freebie files...\n");

  const freebiesDir = join(process.cwd(), "src/data/freebies");
  const validationErrors: ValidationError[] = [];
  const slugs = new Set<string>();

  try {
    const files = await readdir(freebiesDir);
    const mdFiles = files.filter((file) => file.endsWith(".md"));

    if (mdFiles.length === 0) {
      console.log("⚠️  No freebie files found in src/data/freebies/");
      process.exit(0);
    }

    for (const file of mdFiles) {
      const errors: string[] = [];
      const filePath = join(freebiesDir, file);
      const content = await readFile(filePath, "utf-8");

      // Extract frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        errors.push("No frontmatter found");
        validationErrors.push({ file, errors });
        continue;
      }

      let data: FreebieData;
      try {
        data = parse(frontmatterMatch[1]) as FreebieData;
      } catch (e) {
        errors.push(`Invalid YAML in frontmatter: ${e}`);
        validationErrors.push({ file, errors });
        continue;
      }

      // Check required fields
      for (const field of REQUIRED_FIELDS) {
        if (!data[field as keyof FreebieData]) {
          errors.push(`Missing required field: ${field}`);
        }
      }

      // Validate slug format
      if (data.slug) {
        if (!SLUG_PATTERN.test(data.slug)) {
          errors.push(
            `Invalid slug format: "${data.slug}". Must be lowercase letters, numbers, and hyphens only.`
          );
        }

        // Check for duplicate slugs
        if (slugs.has(data.slug)) {
          errors.push(`Duplicate slug: "${data.slug}"`);
        }
        slugs.add(data.slug);
      }

      // Validate brevoListId
      if (data.brevoListId !== undefined) {
        if (
          typeof data.brevoListId !== "number" ||
          data.brevoListId <= 0 ||
          !Number.isInteger(data.brevoListId)
        ) {
          errors.push(
            `Invalid brevoListId: must be a positive integer, got "${data.brevoListId}"`
          );
        }
      }

      // Validate buttonText if present
      if (data.buttonText !== undefined) {
        if (typeof data.buttonText !== "string" || data.buttonText.trim() === "") {
          errors.push("buttonText must be a non-empty string if provided");
        }
      }

      if (errors.length > 0) {
        validationErrors.push({ file, errors });
      }
    }

    // Report results
    if (validationErrors.length === 0) {
      console.log(`✅ All ${mdFiles.length} freebie file(s) are valid!\n`);
      process.exit(0);
    } else {
      console.log(`❌ Found validation errors in ${validationErrors.length} file(s):\n`);
      for (const { file, errors } of validationErrors) {
        console.log(`  📄 ${file}:`);
        for (const error of errors) {
          console.log(`     ❌ ${error}`);
        }
        console.log();
      }
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error reading freebie files:", error);
    process.exit(1);
  }
}

validateFreebies();
