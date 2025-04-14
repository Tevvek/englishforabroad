import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { deleteUserByEmail } from "./utils/auth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const registeredEmailsPath = path.resolve(
  __dirname,
  "./.registered-emails.json"
);

export default async function globalTeardown() {
  if (!fs.existsSync(registeredEmailsPath)) return;

  const emails: string[] = JSON.parse(
    fs.readFileSync(registeredEmailsPath, "utf-8")
  );

  for (const email of emails) {
    try {
      await deleteUserByEmail(email);
      console.log(`🧹 Deleted test user: ${email}`);
    } catch (err) {
      console.warn(`⚠️ Failed to delete ${email}:`, err);
    }
  }

  // Cleanup the file
  fs.rmSync(registeredEmailsPath);
}
