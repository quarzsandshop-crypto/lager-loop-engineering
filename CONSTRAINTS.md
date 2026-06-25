# Constraints

- Do not connect real DHL accounts.
- Do not connect real SimpleSell accounts.
- Do not connect real live database credentials.
- Do not write to live stock data.
- Do not push to `main` without explicit user approval.
- Use fixtures or database copies for every automated check.
- Preserve `L1: observe/dry-run only` until a separate approved migration changes the mode.
- Treat any missing carton decision as a hard failure.
- Treat any ambiguous Q2 material decision as a hard failure unless it has an allowed rule source.

