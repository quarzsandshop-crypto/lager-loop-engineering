import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { assertReadinessManifest, assertProcessedRow, MODE } from "../scripts/lib/lager-rules.mjs";

test("mode is L1 observe/dry-run only", () => {
  assert.equal(MODE, "L1");
});

test("valid manifest reconciles DHL totals", async () => {
  const manifest = JSON.parse(await readFile(new URL("./fixtures/dhl-manifest.valid.json", import.meta.url), "utf8"));
  assert.deepEqual(assertReadinessManifest(manifest), {
    processed: 2,
    ignored: 1,
    not_found: 1
  });
});

test("duplicate tracking numbers fail", () => {
  const manifest = {
    dhlCount: 2,
    rows: [
      { trackingNumber: "DUP", status: "ignored" },
      { trackingNumber: "DUP", status: "not_found" }
    ]
  };

  assert.throws(() => assertReadinessManifest(manifest), /duplicate tracking number/);
});

test("processed rows require carton decision", () => {
  assert.throws(
    () =>
      assertProcessedRow({
        trackingNumber: "NO_CARTON",
        status: "processed",
        family: "Q1"
      }),
    /missing carton decision/
  );
});

test("Q2 material requires allowed rule", () => {
  assert.throws(
    () =>
      assertProcessedRow({
        trackingNumber: "Q2_BAD_RULE",
        status: "processed",
        family: "Q2",
        material: "Papier",
        cartonDecision: "carton_25kg_standard"
      }),
    /Q2 material without allowed rule/
  );
});

test("DHL count must reconcile with processed ignored and not_found", () => {
  const manifest = {
    dhlCount: 3,
    rows: [
      { trackingNumber: "ONE", status: "ignored" },
      { trackingNumber: "TWO", status: "not_found" }
    ]
  };

  assert.throws(() => assertReadinessManifest(manifest), /DHL count mismatch/);
});

test("readiness-check wires backup-check", async () => {
  const source = await readFile(new URL("../scripts/readiness-check.mjs", import.meta.url), "utf8");
  assert.match(source, /backup-check\.mjs/);
});
