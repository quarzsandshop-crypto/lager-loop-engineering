import { access } from "node:fs/promises";

const copyDbPath = new URL("../tests/fixtures/copy-db.json", import.meta.url);

try {
  await access(copyDbPath);
  console.log("backup-check: OK - copy DB fixture exists");
} catch {
  throw new Error("backup-check failed: tests/fixtures/copy-db.json is required");
}
