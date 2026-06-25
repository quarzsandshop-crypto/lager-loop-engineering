import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";

const requiredSteps = [
  ["tests", "npm", ["test"]],
  ["backup-check", "node", ["scripts/backup-check.mjs"]],
  ["reglement", "node", ["scripts/validate-reglement.mjs"]],
  ["templates", "node", ["scripts/validate-templates.mjs"]],
  ["live-db-before", "node", ["scripts/live-db-guard.mjs", "--before"]],
  ["dry-run", "node", ["scripts/dry-run.mjs"]],
  ["live-db-after", "node", ["scripts/live-db-guard.mjs", "--after"]]
];

function runStep([name, command, args]) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: "inherit", shell: process.platform === "win32" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${name} failed with exit code ${code}`));
      }
    });
  });
}

async function assertBackupCheckWired() {
  const source = await readFile(new URL("./readiness-check.mjs", import.meta.url), "utf8");
  if (!source.includes("backup-check.mjs")) {
    throw new Error("readiness-check must include backup-check");
  }
}

await assertBackupCheckWired();

for (const step of requiredSteps) {
  console.log(`\n== ${step[0]} ==`);
  await runStep(step);
}

console.log("\nreadiness-check: OK - L1 observe/dry-run only");
