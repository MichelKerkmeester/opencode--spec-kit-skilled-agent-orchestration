# Plan — Memory Save Quality Root Cause Fixes

## Approach

All 8 fixes are independent — no ordering constraints. Implemented in 3 phases by severity.

## Phase 1: Medium severity (decision + status + blocker)

1. **Fix 1** — Decision deduplication: Differentiate CONTEXT from RATIONALE for string-form decisions
2. **Fix 2** — Session status: Add observation-based fallback for `nextSteps` detection
3. **Fix 3** — Blocker false-positive: Replace broad keyword regex with structural patterns

## Phase 2: Low severity (quality gates)

4. **Fix 4** — Pattern specificity: Remove generic matchers, require >=2 word-boundary keyword matches
5. **Fix 5** — Trigger phrase quality: Expand TECHNICAL_SHORT_WORDS, filter short-generic bigrams, apply tech filter in relaxed mode
6. **Fix 6** — File path separator: Support em dash, en dash, and colon separators

## Phase 3: Low severity (rendering)

7. **Fix 7** — Tree thinning: Lower threshold 300→150, cap at 3 children per merge
8. **Fix 8** — Conversation synthesis: Generate messages from structured JSON data

## Review Process

- Two independent GPT-5.4 ultra-think reviews
- First review identified 2 issues (Fix 4 substring matching, Fix 5 over-aggressive filter) — both addressed
- Second review: all 8 fixes PASS, ready to ship

## Files Modified

| File | Fixes |
|------|-------|
| `scripts/extractors/decision-extractor.ts` | 1 |
| `scripts/extractors/collect-session-data.ts` | 2 |
| `scripts/extractors/session-extractor.ts` | 3 |
| `scripts/extractors/implementation-guide-extractor.ts` | 4 |
| `shared/trigger-extractor.ts` | 5 |
| `scripts/utils/input-normalizer.ts` | 6 |
| `scripts/core/tree-thinning.ts` | 7 |
| `scripts/extractors/conversation-extractor.ts` | 8 |
| `scripts/tests/semantic-signal-golden.vitest.ts` | 5 (golden update) |
| `shared/dist/trigger-extractor.js` | 5 (rebuild) |
