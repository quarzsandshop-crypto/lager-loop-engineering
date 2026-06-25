import { readFile } from "node:fs/promises";

const reglement = await readFile(new URL("../REGLEMENT.md", import.meta.url), "utf8");
const required = [
  "L1: observe/dry-run only",
  "tracking number may be processed once",
  "cartonDecision",
  "Q2 material",
  "DHL count",
  "backup check"
];

const missing = required.filter((term) => !reglement.toLowerCase().includes(term.toLowerCase()));
if (missing.length > 0) {
  throw new Error(`REGLEMENT.md missing required terms: ${missing.join(", ")}`);
}

console.log("validate-reglement: OK");
