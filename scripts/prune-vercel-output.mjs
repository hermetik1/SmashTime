import { access, readdir, rm } from "node:fs/promises";
import path from "node:path";

if (process.env.VERCEL === "1") {
  const outputDirectory = path.resolve("out");
  const publicDirectory = path.resolve("public");

  async function removeServerFiles(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await removeServerFiles(entryPath);
      } else if (entry.name.endsWith(".php") || entry.name === ".htaccess") {
        await rm(entryPath);
      }
    }
  }

  await access(outputDirectory).then(() => removeServerFiles(outputDirectory)).catch(() => undefined);
  // Vercel builds run in a disposable checkout. Never publish the IONOS PHP backend source.
  await removeServerFiles(publicDirectory);
}
