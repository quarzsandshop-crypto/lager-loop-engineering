# Lager Loop Engineering

Safety-first engineering contour for Lager processing. The current mode is:

`L1: observe/dry-run only`

No real DHL credentials, live database credentials, or live write paths are configured in this repository. All checks operate on fixtures and the read-only copy database fixture in `tests/fixtures/`.

## Readiness Check

Run the full safety gate:

```bash
npm run readiness-check
```

The command runs:

- unit tests
- backup-check
- dry-run
- reglement validation
- dashboard/report template validation
- live database immutability guard

## Pull Request Workflow

1. Codex creates a branch, for example `codex/lager-safety-loop`.
2. Codex changes only docs, scripts, fixtures, tests, or CI files needed for the task.
3. Codex runs `npm run readiness-check` locally.
4. Codex opens a pull request.
5. GitHub Actions runs the same `npm run readiness-check`.
6. Claude Code reviews the PR for rule, test, and safety regressions.
7. Merge is allowed only after green CI and completed review.

## Local GitHub Setup

If this folder is not yet connected to GitHub:

```bash
git init
git add .
git commit -m "chore: add lager safety readiness contour"
git branch -M main
git remote add origin <YOUR_REPO_URL>
git push -u origin main
```

For feature work:

```bash
git checkout -b codex/lager-safety-loop
npm run readiness-check
git push -u origin codex/lager-safety-loop
```

## Live Stock Protection

Real stock booking is forbidden in this contour. A change is rejected if it:

- removes or bypasses `backup-check`
- attempts to write to a live database
- lets one tracking number book twice
- processes an item without a carton decision
- chooses Q2 Papier/Plastik without a rule source
- reports a DHL count that does not equal `processed + ignored + not_found`

