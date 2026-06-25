# Tests

Run:

```bash
npm run readiness-check
```

Expected checks:

- `node --test tests/*.test.mjs`
- `node scripts/backup-check.mjs`
- `node scripts/validate-reglement.mjs`
- `node scripts/validate-templates.mjs`
- `node scripts/live-db-guard.mjs --before`
- `node scripts/dry-run.mjs`
- `node scripts/live-db-guard.mjs --after`

The suite must fail when:

- `backup-check` is missing from the readiness command
- a live database write pattern appears outside allowed test assertions
- the same tracking number can be processed twice
- a processed item lacks `cartonDecision`
- Q2 material is selected without an allowed rule source
- DHL count does not equal `processed + ignored + not_found`

