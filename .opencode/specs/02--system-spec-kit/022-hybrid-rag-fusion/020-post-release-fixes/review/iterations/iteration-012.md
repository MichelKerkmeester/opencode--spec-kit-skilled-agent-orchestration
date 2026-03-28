# Iteration 012 -- Traceability: manual-testing wrapper denominators and orphans

**Agent:** GPT-5.4 (Codex main run)
**Dimension:** traceability
**Status:** complete
**Timestamp:** 2026-03-27T16:57:00+01:00

## Findings

### HRF-DR-006 [P1] 015 manual-testing wrapper is materially stale and self-contradictory
- **File:line:** `015/spec.md:3,40,79-100,170-171`; `015/checklist.md:47,132`; `015/plan.md:162`; `MANUAL_TESTING_PLAYBOOK.md:151,179`
- **Evidence:** The wrapper still advertises `231` scenario files, `272` IDs, `19` categories, and `222` features while the root playbook now states `290` scenarios, `255` features, and zero orphan scenario files. The wrapper simultaneously claims zero orphans and still tracks orphan remediation workstreams.
- **Recommendation:** Rebuild the wrapper's denominator, orphan, and workstream claims from the live root playbook and current filesystem.

## Next Adjustment
- Audit the public operator-facing README/install surfaces that likely still publish stale counts and versions.
