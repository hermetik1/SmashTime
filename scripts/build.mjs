import { spawnSync } from "node:child_process";
import { cp, mkdtemp, rm, symlink } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ionosExport = process.env.VERCEL !== "1";
let buildRoot = root;
let temporaryRoot;

try {
  if (ionosExport) {
    temporaryRoot = await mkdtemp(path.join(os.tmpdir(), "smashtime-ionos-build-"));
    buildRoot = temporaryRoot;
    await cp(root, temporaryRoot, { recursive: true, filter: source => !["node_modules", ".next", ".git", ".vercel", "out", "artifacts"].some(name => source === path.join(root, name) || source.startsWith(path.join(root, name) + path.sep)) });
    await symlink(path.join(root, "node_modules"), path.join(temporaryRoot, "node_modules"), "junction");
    await rm(path.join(temporaryRoot, "app", "api"), { recursive: true, force: true });
  }
  const env = { ...process.env, ...(ionosExport ? { IONOS_STATIC_EXPORT: "1" } : {}) };
  const nextBin = path.join(buildRoot, "node_modules", "next", "dist", "bin", "next");
  const result = spawnSync(process.execPath, [nextBin, "build", ...(ionosExport ? ["--webpack"] : [])], { cwd: buildRoot, env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status ?? 1;
} finally {
  if (temporaryRoot && (process.exitCode === 0 || process.exitCode === undefined)) {
    await rm(path.join(root, "out"), { recursive: true, force: true });
    await cp(path.join(temporaryRoot, "out"), path.join(root, "out"), { recursive: true });
  }
  if (temporaryRoot) await rm(temporaryRoot, { recursive: true, force: true });
}

if (process.exitCode === 0 || process.exitCode === undefined) {
  const prune = spawnSync(process.execPath, [path.join(root, "scripts", "prune-vercel-output.mjs")], { cwd: root, env: process.env, stdio: "inherit" });
  if (prune.error) throw prune.error;
  if (prune.status !== 0) process.exitCode = prune.status ?? 1;
}
