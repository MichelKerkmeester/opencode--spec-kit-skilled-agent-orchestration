# CR-P0-1: Apply test.skip for Optional Modules

## Summary

Converted 21 instances of silent `if (!optionalMod) return;` patterns to explicit `it.skipIf(!optionalMod)` in `memory-crud-extended.vitest.ts`. Tests now report as "skipped" in vitest output instead of silently passing with zero assertions.

## File Modified

`/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-crud-extended.vitest.ts`

## Pattern Applied

**Before:**
```typescript
it('EXT-CE1: test name', async () => {
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('...'); }
    if (!causalEdgesMod) return; // AI-WHY: Optional module — skip is intentional
    // ... test body
});
```

**After:**
```typescript
it.skipIf(!causalEdgesMod)('EXT-CE1: test name', async () => {
    // AI-WHY: Optional module — test skipped when causalEdgesMod unavailable
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('...'); }
    // ... test body
});
```

## All 21 Conversions

| # | Line | Module | Test ID |
|---|------|--------|---------|
| 1 | ~518 | causalEdgesMod | EXT-CE1 |
| 2 | ~527 | causalEdgesMod | EXT-CE2 |
| 3 | ~534 | causalEdgesMod | EXT-CE3 |
| 4 | ~557 | checkpointsMod | EXT-BD2 |
| 5 | ~566 | checkpointsMod | EXT-BD3 |
| 6 | ~586 | causalEdgesMod | EXT-BD5 |
| 7 | ~604 | checkpointsMod | EXT-BD7 |
| 8 | ~630 | embeddingsSourceMod | EXT-U2 |
| 9 | ~688 | embeddingsSourceMod | EXT-ER1 |
| 10 | ~704 | embeddingsSourceMod | EXT-ER2 |
| 11 | ~714 | embeddingsSourceMod | EXT-ER3 |
| 12 | ~731 | embeddingsSourceMod | EXT-ER4 |
| 13 | ~742 | embeddingsSourceMod | EXT-ER5 |
| 14 | ~936 | folderScoringSourceMod | EXT-FS1 |
| 15 | ~949 | folderScoringSourceMod | EXT-FS2 |
| 16 | ~958 | folderScoringSourceMod | EXT-FS3 |
| 17 | ~973 | folderScoringSourceMod | EXT-FS4 |
| 18 | ~1021 | embeddingsSourceMod | EXT-H4 |
| 19 | ~1215 | mutationLedgerMod | EXT-ML1 |
| 20 | ~1229 | mutationLedgerMod | EXT-ML2 |
| 21 | ~1242 | mutationLedgerMod | EXT-ML3 |

## NOT Modified (by design)

- **65 `throw new Error('Test setup incomplete...')` guards** -- these are required-module guards, not optional-module skips
- **L137-147 try/catch import blocks** -- these correctly handle optional module loading at the module level
- **Mock helper functions** (`installDeleteMocks`, `installBulkDeleteMocks`, etc.) -- these use `if (!mod)` guards for conditional mock setup, which is correct behavior

## Verification

```
vitest --run tests/memory-crud-extended.vitest.ts
  1 passed | 44 passed | 21 skipped (65 total)
  Duration: 650ms
```

All 21 optional-module tests now correctly report as **skipped** rather than silently passing.
