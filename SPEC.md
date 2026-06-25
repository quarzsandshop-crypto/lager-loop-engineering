# Lager Safety Contour Specification

## Scope

This project provides a safety gate around Lager processing. It proves that an executor can change code and documentation while real warehouse data remains unchanged.

## Execution Levels

- `L1`: observe and dry-run only. Current mode.
- `L2`: copy database rehearsal. Not enabled here.
- `L3`: live booking. Forbidden here.

## Readiness Contract

`npm run readiness-check` is the single command that must pass before a branch is reviewable.

The command must:

- run all tests
- verify that backup-check exists and is wired into readiness-check
- execute dry-run against fixture data only
- validate the reglement required terms
- validate dashboard and report templates
- verify that live database fixture content is unchanged

## Dry-Run Output Contract

Dry-run produces `artifacts/dry-run-report.json` with:

- `mode`
- `dhlCount`
- `processed`
- `ignored`
- `notFound`
- `decisions`
- `liveDatabaseBeforeHash`
- `liveDatabaseAfterHash`

The report is invalid if `mode` is not `L1`.

