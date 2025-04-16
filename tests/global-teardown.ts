import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { deleteUserByEmail } from "./utils/auth";
import { to } from "@/utils/to";

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
    const [error] = await to(deleteUserByEmail(email));
    if (error) {
      console.warn(`⚠️ Failed to delete ${email}:`, error);
    }
    console.log(`🧹 Deleted test user: ${email}`);
  }

  // Cleanup the file
  fs.rmSync(registeredEmailsPath);
}
