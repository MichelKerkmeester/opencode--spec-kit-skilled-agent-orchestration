# Iteration 001 — Correctness

**Dimension:** D1 Correctness
**Status:** complete
**Agent:** Claude Opus 4.6 (direct code review)

## Findings

No P0 findings for correctness.

### P2-C01: truncateInline() has edge case when maxChars < 3

**Severity:** P2
**Source:** `lib/code-graph/startup-brief.ts:31`
**Evidence:** `return normalized.slice(0, maxChars - 3).trimEnd() + '...'` — if `maxChars` is less than 3, the slice index is negative, producing an empty string + `...` = `"..."`. The constant `SUMMARY_MAX_CHARS = 240` prevents this in practice, but the function signature accepts any `number`.
**Impact:** Minor robustness gap. Cannot be triggered with current callers.
**Fix:** Add a guard: `if (maxChars < 4) return normalized.slice(0, 1);` — or document the minimum.

### P2-C02: compactPath() doesn't handle absolute paths with leading separators consistently

**Severity:** P2
**Source:** `lib/code-graph/startup-brief.ts:35`
**Evidence:** `filePath.replace(/\\/g, '/').split('/').filter(Boolean)` — `.filter(Boolean)` removes empty strings from leading `/`, which is correct. But a path like `///deep/nested/file.ts` would yield the same as `/deep/nested/file.ts`. No functional impact since all paths come from `StartupHighlight.filePath` which is already normalized.
**Impact:** Cosmetic only — no functional bug.
**Fix:** No fix needed; behavior is acceptable.

## Summary
**P0=0 P1=0 P2=2**

## Notes
The core logic in `buildStartupBrief()`, `buildGraphOutline()`, and `buildSessionContinuity()` is correct:
- Ready/empty/missing state mapping is accurate
- Null-safety is thorough (all external calls wrapped in try/catch)
- Array operations handle empty arrays (highlights.length > 0 guard)
- Dynamic imports are correctly used for optional modules
