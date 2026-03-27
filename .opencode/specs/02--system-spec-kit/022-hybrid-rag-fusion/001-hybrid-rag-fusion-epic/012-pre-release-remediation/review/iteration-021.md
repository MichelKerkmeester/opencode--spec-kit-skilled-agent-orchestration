# Iteration 021 -- Wave 1 Save And Embedding Pipeline

**Agent:** GPT-5.4 (Codex main run)
**Dimension:** correctness, security
**Status:** complete
**Timestamp:** 2026-03-27T15:52:00+01:00

## Findings

- `HRF-DR-010 [P1]` TM-04 semantic dedup drops scope when the callback only forwards `specFolder`, so governed or shared saves can be blocked by an unrelated scope.
- `HRF-DR-011 [P1]` PE arbitration omits `scope`, so reinforce or supersede decisions can cross scope boundaries.
- `HRF-DR-012 [P2]` Scoped save behavior still lacks direct regression coverage in the save and embedding suites.

## Evidence
- `handlers/memory-save.ts:405-421,463-466,805-811`
- `handlers/save/dedup.ts:79-119,151-192`
- `handlers/save/pe-orchestration.ts:27-50`
- `handlers/pe-gating.ts:64-89`
- `tests/handler-memory-save.vitest.ts`
- `tests/memory-save-pipeline-enforcement.vitest.ts`
- `tests/memory-save-ux-regressions.vitest.ts`
- Segment-2 start baselines replayed before lane work: `012 validate` = FAIL, `022 --recursive` = PASS WITH WARNINGS, `npm test` = PASS

## Next Adjustment
- Move to vector-store and indexing integrity to see whether scope or cache defects repeat outside the save path.
