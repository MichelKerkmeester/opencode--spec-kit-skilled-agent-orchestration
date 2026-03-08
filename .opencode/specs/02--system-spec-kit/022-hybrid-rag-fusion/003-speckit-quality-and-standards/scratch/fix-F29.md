# F29 README Fix Report

## Scope
- Base directory: `.opencode/skill/system-spec-kit/`
- Files updated: `shared/README.md`, `scripts/README.md`, `scripts/test-fixtures/README.md`

## 1) HVR banned words
- Result: no tracked `README.md` files contained `straightforward`, `robust`, or `seamless` (case-insensitive) after verification.

## 2) Stale counts (verified and corrected)
- `shared/README.md`: updated top-level subdirectory count to **9**.
- `scripts/README.md`: updated `rules/` count to **18** shell rules, `lib/` to **12** TypeScript libraries, and `evals/` to **18** evaluation/audit scripts.
- `mcp_server/README.md`: no explicit handler/lib module count statements found that required updates (actual inventory: 29 handler TS files, 24 `lib/` subdirectories).

## 3) Broken markdown checks
- Unclosed code blocks: **0**
- Broken link syntax (`[text](url`): **0**

## 4) Missing referenced files
- Resolved: `scripts/test-fixtures/README.md` now links to `../spec/validate.sh` (previous path did not exist).
- Remaining missing local references: 0

## 5) Module/folder count claims
- Verified and corrected where claims were stale in target README files.
