# Iteration 011 -- Traceability: feature catalog wrapper denominators

**Agent:** GPT-5.4 (Codex main run)
**Dimension:** traceability
**Status:** complete
**Timestamp:** 2026-03-27T16:50:00+01:00

## Findings

### HRF-DR-005 [P1] 006 feature-catalog wrapper publishes stale current-state denominators
- **File:line:** `006-feature-catalog/spec.md:47-49,55-56`
- **Evidence:** The wrapper first calls the live tree `224 / 275`, then later `255 / 275`, while the fresh filesystem truth is `255` feature files and `290` playbook files across `21` numbered categories.
- **Recommendation:** Rewrite the current-state notes and denominator claims so the wrapper matches live repo truth and keeps older counts clearly historical.

## Verified OK
- The historical addenda remain useful as milestone notes when explicitly framed as historical.

## Next Adjustment
- Run the same denominator/orphan consistency check on the manual-testing wrapper.
