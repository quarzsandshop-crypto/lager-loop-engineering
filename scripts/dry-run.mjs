import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { MODE, assertReadinessManifest } from "./lib/lager-rules.mjs";

const manifestPath = new URL("../tests/fixtures/dhl-manifest.valid.json", import.meta.url);
const copyDbPath = new URL("../tests/fixtures/copy-db.json", import.meta.url);
const artifactDir = new URL("../artifacts/", import.meta.url);
const reportPath = new URL("../artifacts/dry-run-report.json", import.meta.url);

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

const [manifestRaw, copyDbBefore] = await Promise.all([
  readFile(manifestPath, "utf8"),
  readFile(copyDbPath, "utf8")
]);

const manifest = JSON.parse(manifestRaw);
const totals = assertReadinessManifest(manifest);
const copyDbAfter = await readFile(copyDbPath, "utf8");

const beforeHash = sha256(copyDbBefore);
const afterHash = sha256(copyDbAfter);

if (beforeHash !== afterHash) {
  throw new Error("copy DB changed during dry-run");
}

const report = {
  mode: MODE,
  dhlCount: manifest.dhlCount,
  processed: totals.processed,
  ignored: totals.ignored,
  notFound: totals.not_found,
  decisions: manifest.rows.filter((row) => row.status === "processed"),
  liveDatabaseBeforeHash: beforeHash,
  liveDatabaseAfterHash: afterHash,
  liveDatabaseStatus: "unchanged"
};

await mkdir(artifactDir, { recursive: true });
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log("dry-run: OK - L1 report written to artifacts/dry-run-report.json");
