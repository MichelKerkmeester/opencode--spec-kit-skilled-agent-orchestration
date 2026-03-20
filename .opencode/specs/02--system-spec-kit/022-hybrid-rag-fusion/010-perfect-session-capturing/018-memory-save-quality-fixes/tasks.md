# Tasks — Memory Save Quality Root Cause Fixes

## Phase 1: Medium severity
- [x] Fix 1: Decision deduplication — CONTEXT ≠ RATIONALE ≠ CHOSEN
- [x] Fix 2: Session status — observation-based nextSteps fallback
- [x] Fix 3: Blocker false-positive — structural patterns replace broad keywords

## Phase 2: Low severity (quality gates)
- [x] Fix 4: Pattern specificity — remove generic matchers, word-boundary >=2 threshold
- [x] Fix 5: Trigger phrase quality — TECHNICAL_SHORT_WORDS (70+ entries), short-generic filter, relaxed mode fix
- [x] Fix 6: File path separator — em dash, en dash, colon support

## Phase 3: Low severity (rendering)
- [x] Fix 7: Tree thinning — threshold 300→150, 3-child cap per merge
- [x] Fix 8: Conversation synthesis — structured JSON → synthetic messages

## Review & Verification
- [x] Rebuild shared/dist after Fix 5 changes
- [x] Run tests: 106/106 pass, 0 regressions
- [x] Update golden test expectations (Fix 5: "the error" → "fixed null pointer memory")
- [x] Ultra-think review #1: identified Fix 4 substring bug + Fix 5 over-aggressive filter
- [x] Apply review fixes: word-boundary regex (Fix 4), expanded allowlist (Fix 5)
- [x] Ultra-think review #2: all 8 fixes PASS, ready to ship
- [x] Apply final review note: added programming keywords (try/for/if/do/io/fs/os/db/id/ip)
- [x] Final test run: 106/106 pass
