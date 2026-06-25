export const MODE = "L1";

export const ALLOWED_Q2_MATERIAL_RULES = new Set([
  "packaging_not_25kg_majority_stock",
  "simple_marker_confirmed_by_photo",
  "photo_transparent_plastic",
  "photo_opaque_paper",
  "no_bag_photo_majority_stock",
  "known_fixed_material_mapping"
]);

export function assertReadinessManifest(manifest) {
  if (!Number.isInteger(manifest.dhlCount) || manifest.dhlCount < 0) {
    throw new Error("dhlCount must be a non-negative integer");
  }

  if (!Array.isArray(manifest.rows)) {
    throw new Error("rows must be an array");
  }

  const seen = new Set();
  const totals = { processed: 0, ignored: 0, not_found: 0 };

  for (const row of manifest.rows) {
    if (!row.trackingNumber) {
      throw new Error("trackingNumber is required");
    }

    if (seen.has(row.trackingNumber)) {
      throw new Error(`duplicate tracking number: ${row.trackingNumber}`);
    }
    seen.add(row.trackingNumber);

    if (!Object.hasOwn(totals, row.status)) {
      throw new Error(`unsupported row status for ${row.trackingNumber}: ${row.status}`);
    }
    totals[row.status] += 1;

    if (row.status === "processed") {
      assertProcessedRow(row);
    }
  }

  const reconciled = totals.processed + totals.ignored + totals.not_found;
  if (manifest.dhlCount !== reconciled) {
    throw new Error(
      `DHL count mismatch: dhlCount=${manifest.dhlCount}, processed+ignored+not_found=${reconciled}`
    );
  }

  return totals;
}

export function assertProcessedRow(row) {
  if (!row.cartonDecision) {
    throw new Error(`missing carton decision: ${row.trackingNumber}`);
  }

  if (row.family === "Q2" && !ALLOWED_Q2_MATERIAL_RULES.has(row.materialRule)) {
    throw new Error(`Q2 material without allowed rule: ${row.trackingNumber}`);
  }
}
