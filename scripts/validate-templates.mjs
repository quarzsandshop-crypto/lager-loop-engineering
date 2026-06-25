import { readFile } from "node:fs/promises";

const dashboard = JSON.parse(
  await readFile(new URL("../templates/dashboard-template.json", import.meta.url), "utf8")
);
const reportTemplate = await readFile(new URL("../templates/report-template.md", import.meta.url), "utf8");

const widgets = new Set(dashboard.requiredWidgets);
const requiredWidgets = ["mode", "dhlCount", "processed", "ignored", "notFound", "liveDatabaseStatus"];
const missingWidgets = requiredWidgets.filter((widget) => !widgets.has(widget));
if (missingWidgets.length > 0) {
  throw new Error(`dashboard template missing widgets: ${missingWidgets.join(", ")}`);
}

const requiredPlaceholders = ["{{mode}}", "{{dhlCount}}", "{{processed}}", "{{ignored}}", "{{notFound}}", "{{liveDatabaseStatus}}"];
const missingPlaceholders = requiredPlaceholders.filter((placeholder) => !reportTemplate.includes(placeholder));
if (missingPlaceholders.length > 0) {
  throw new Error(`report template missing placeholders: ${missingPlaceholders.join(", ")}`);
}

console.log("validate-templates: OK");
