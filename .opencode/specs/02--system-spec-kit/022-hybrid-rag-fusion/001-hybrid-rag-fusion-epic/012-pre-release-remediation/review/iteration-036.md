# Iteration 036 -- Wave 4 Ingest, Delete, And Ledger Coverage Sweep

**Agent:** GPT-5.4 (Codex main run)
**Dimension:** correctness, maintainability
**Status:** complete
**Timestamp:** 2026-03-27T16:40:00+01:00

## Findings

No new findings.

## Evidence
- The ingest suite still lacks a caller-visible partial-acceptance assertion for mixed valid and overlength paths.
- Mutation-ledger helpers remain explicitly best-effort without response warnings at the current call sites.
- Delete cascade and checkpoint regressions stayed ruled out, so `HRF-DR-019` and `HRF-DR-020` remain the right abstraction for the mutation advisories.

## Next Adjustment
- Sweep the search-stage heuristics and fail-open paths so every surviving advisory has a current coverage rationale.
