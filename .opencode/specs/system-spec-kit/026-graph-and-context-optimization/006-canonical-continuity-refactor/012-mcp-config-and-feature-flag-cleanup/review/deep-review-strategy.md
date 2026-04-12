# Deep Review Strategy: 012-mcp-config-and-feature-flag-cleanup

## Review Dimensions

- [x] Correctness - Five checked-in config surfaces inspected for `MEMORY_DB_PATH`, `EMBEDDINGS_PROVIDER`, and `_NOTE_7_FEATURE_FLAGS` parity
- [x] Security - Checked-in config surfaces inspected for local path leakage and host-specific state
- [x] Traceability - Runtime defaults verified against packet claims in `spec.md`, `checklist.md`, and `implementation-summary.md`
- [x] Maintainability - Cross-runtime config consistency reviewed against the claimed "identical env block" closeout

## Completed Dimensions

| Dimension | Iteration | Verdict |
|-----------|-----------|---------|
| Correctness | 001 | PASS |
| Security | 002 | CONDITIONAL |
| Traceability | 003 | PASS |
| Maintainability | 002-003 | CONDITIONAL |

## Running Findings

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 1 |
| P2 | 0 |

## What Worked

- Direct line-by-line comparison of the five checked-in MCP surfaces quickly ruled out `MEMORY_DB_PATH` regressions and `_NOTE_7_FEATURE_FLAGS` drift.
- Verifying `rollout-policy.ts`, `cross-encoder.ts`, and `vector-index-store.ts` after the config pass kept the review tied to actual runtime semantics instead of packet claims alone.

## What Failed

- The packet's parity story still overstates the current reality because `.gemini/settings.json` keeps a machine-specific absolute `cwd`.

## Exhausted Approaches

- Rechecked the other four config surfaces for an equivalent absolute path override; none were found.
- Rechecked the runtime default files for a compensating requirement that Gemini must stay absolute; none were documented.

## Next Focus

Review complete. The narrow remediation is to align `.gemini/settings.json` with the repo-relative convention already used by the other checked-in MCP configs and then rerun the five-file parity sweep.
