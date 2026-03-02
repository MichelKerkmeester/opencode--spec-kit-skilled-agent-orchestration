# Checklist: Refinement Phase 4

## P0 — Hard Blockers
- [ ] CHK-001: No existing test regressions (7,008+ tests pass)
- [ ] CHK-002: TypeScript compiles without errors

## P1 — Required
- [ ] CHK-010: `qualityGateActivatedAt` persists to SQLite `config` table
- [ ] CHK-011: Timestamp survives simulated restart (clear memory, reload from DB)
- [ ] CHK-012: `isWarnOnlyMode()` lazy-loads from DB when in-memory is null
- [ ] CHK-013: `setActivationTimestamp()` writes to both memory and DB
- [ ] CHK-020: `effectiveScore()` checks `intentAdjustedScore` before `score`
- [ ] CHK-021: `effectiveScore()` checks `rrfScore` before `score`
- [ ] CHK-022: Stage 3 preserves `stage2Score` for auditability
- [ ] CHK-023: Cross-encoder document mapping uses `effectiveScore()`

## P2 — Optional
- [ ] CHK-030: `resetActivationTimestamp()` also clears DB entry (for tests)
