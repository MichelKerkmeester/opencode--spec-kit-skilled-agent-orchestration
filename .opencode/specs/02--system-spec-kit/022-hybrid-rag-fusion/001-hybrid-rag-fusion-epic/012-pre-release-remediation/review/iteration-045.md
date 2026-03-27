# Iteration 045 -- Wave 2 Graph And Scoring Breadth

**Agent:** GPT-5.4 (Codex main run)
**Dimension:** correctness, maintainability
**Status:** complete
**Timestamp:** 2026-03-27T17:13:00+01:00

## Findings

No new findings.

## Evidence
- The pass over `10--graph-signal-activation` and `11--scoring-and-calibration` mainly remapped existing active issues onto live feature entries.
- `11--scoring-and-calibration/15-tool-level-ttl-cache.md` now sits in the code-unsound bucket because the active registry still includes the stale in-flight reuse defect in `lib/cache/tool-cache.ts`.

## Next Adjustment
- Continue breadth on query-intelligence and pipeline architecture, then consolidate the broader tooling and flag-reference review.
