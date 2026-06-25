import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const copyDbPath = path.join(root, "tests/fixtures/copy-db.json");
const hashPath = path.join(root, "artifacts/live-db-copy.sha256");
const forbiddenPatterns = [
  /\bLIVE_DATABASE_URL\b/,
  /\bDHL_PASSWORD\b/,
  /\bSIMPLESELL_PASSWORD\b/,
  /\bINSERT\s+INTO\b/i,
  /\bUPDATE\s+\w+\s+SET\b/i,
  /\bDELETE\s+FROM\b/i,
  /\bbookStock\b/,
  /\bwriteLiveDb\b/,
  /\blive\s*booking\b/i
];

const allowedDirs = new Set([".git", "node_modules", "artifacts"]);
const allowedPatternFiles = new Set([
  path.join(root, "scripts/live-db-guard.mjs"),
  path.join(root, "tests/safety.test.mjs"),
  path.join(root, "README.md"),
  path.join(root, "REGLEMENT.md"),
  path.join(root, "SPEC.md"),
  path.join(root, "CONSTRAINTS.md"),
  path.join(root, "TESTS.md")
]);

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!allowedDirs.has(entry.name)) {
        files.push(...(await listFiles(fullPath)));
      }
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function assertNoLiveWritePatterns() {
  const files = await listFiles(root);
  for (const file of files) {
    if (allowedPatternFiles.has(file)) {
      continue;
    }
    const text = await readFile(file, "utf8");
    for (const pattern of forbiddenPatterns) {
      if (pattern.test(text)) {
        throw new Error(`forbidden live write or secret pattern in ${path.relative(root, file)}`);
      }
    }
  }
}

const mode = process.argv[2];
await assertNoLiveWritePatterns();

const copyDb = await readFile(copyDbPath, "utf8");
const currentHash = sha256(copyDb);

if (mode === "--before") {
  await import("node:fs/promises").then(({ mkdir, writeFile }) =>
    mkdir(path.dirname(hashPath), { recursive: true }).then(() => writeFile(hashPath, `${currentHash}\n`))
  );
  console.log("live-db-guard: OK - baseline copy DB hash recorded");
} else if (mode === "--after") {
  const expectedHash = (await readFile(hashPath, "utf8")).trim();
  if (currentHash !== expectedHash) {
    throw new Error("live database copy changed during readiness-check");
  }
  console.log("live-db-guard: OK - copy DB unchanged and no live write patterns found");
} else {
  throw new Error("usage: node scripts/live-db-guard.mjs --before|--after");
}
