# Sprint 2 Agent S2-A4 — T006 Classification-Based Decay (TM-03) — DONE

## Summary
Task T006: Implemented classification-based decay in `fsrs-scheduler.ts` with env-var feature flag.

## Files Modified

### 1. `.opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/fsrs-scheduler.ts`
- Added `CONTEXT_TYPE_STABILITY_MULTIPLIER` constant (decision=Infinity, research=2.0, implementation/discovery/general=1.0)
- Added `IMPORTANCE_TIER_STABILITY_MULTIPLIER` constant (constitutional/critical=Infinity, important=1.5, normal=1.0, temporary=0.5, deprecated=0.25)
- Added `getClassificationDecayMultiplier(contextType, importanceTier): number` — pure computation, no env check
- Added `applyClassificationDecay(stability, contextType, importanceTier): number` — gated by `SPECKIT_CLASSIFICATION_DECAY`
- Added doc comment on `TIER_MULTIPLIER` explaining relationship with new multipliers (no double-counting)
- Exported all four new symbols

## Files Created

### 2. `.opencode/skill/system-spec-kit/mcp_server/tests/t020-decay.vitest.ts`
- 27 tests across 6 describe blocks:
  - T020-1: Constitutional and critical tiers never decay (6 tests)
  - T020-2: Decision context_type never decays (3 tests)
  - T020-3: Temporary tier decays faster than normal (4 tests)
  - T020-4: Combined context_type and importance_tier multipliers (4 tests)
  - T020-5: Unknown types default to 1.0 (4 tests)
  - T020-6: SPECKIT_CLASSIFICATION_DECAY feature flag gating (6 tests)

## Test Results
- `t020-decay.vitest.ts`: 27/27 passed
- `fsrs-scheduler.vitest.ts`: 55/55 passed (no regressions)
- `unit-fsrs-formula.vitest.ts`: 7/7 passed (no regressions)
- `scoring.vitest.ts`: 21/21 passed (no regressions)

## Decisions Made

### D1: Infinity stability in calculateRetrievability is safe without code change
`calculateRetrievability(Infinity, t)` = `(1 + FSRS_FACTOR * t / Infinity)^DECAY` = `(1 + 0)^(-0.5)` = `1.0`. The existing guard `stability <= 0` does not block Infinity. No modification needed to the core FSRS formula.

### D2: Two separate systems — no double-counting
`TIER_MULTIPLIER` (existing) operates on **elapsed time** in `composite-scoring.ts`. The new `IMPORTANCE_TIER_STABILITY_MULTIPLIER` operates on **stability** in `fsrs-scheduler.ts`. They are separate integration points gated by different activation paths. A doc comment was added to `TIER_MULTIPLIER` explaining the split to prevent future double-application.

### D3: `getClassificationDecayMultiplier` is NOT env-gated
Pure math function, no side effects. Gating only applied in `applyClassificationDecay`. This matches the principle that constants/pure-functions are testable without env manipulation.

### D4: Feature flag accepts "true" OR "1"
Consistent with common Node.js env-var conventions. Any other value (including "false", "0", or unset) disables the feature.

### D5: Infinity * 1.0 check uses isFinite() rather than === Infinity
Handles NaN and edge values cleanly. Either dimension being non-finite short-circuits to Infinity return.
