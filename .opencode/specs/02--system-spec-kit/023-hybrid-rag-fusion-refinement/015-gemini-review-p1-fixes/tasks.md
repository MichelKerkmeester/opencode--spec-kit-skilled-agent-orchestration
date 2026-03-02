# Tasks: Gemini Review P1 Fixes

## P1 #1: Warn-Only Timer Persistence

- [ ] T1: Add DB persistence functions for activation timestamp in `save-quality-gate.ts`
- [ ] T2: Modify `setActivationTimestamp()` to write to SQLite `config` table
- [ ] T3: Add lazy-load in `isWarnOnlyMode()` to recover timestamp from DB
- [ ] T4: Add tests for persistence across restart simulation

## P1 #2: effectiveScore() Fallback Chain

- [ ] T5: Update `effectiveScore()` with full fallback chain
- [ ] T6: Preserve `stage2Score` in Stage 3 reranking output (line 312)
- [ ] T7: Update cross-encoder document mapping to use `effectiveScore()`
- [ ] T8: Add tests for effectiveScore fallback scenarios

## Verification

- [ ] T9: Full test suite passes (7,008+ tests)
- [ ] T10: TypeScript compiles without errors
