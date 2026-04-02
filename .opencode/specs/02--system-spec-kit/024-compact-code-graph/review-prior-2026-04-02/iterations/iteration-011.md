# Review Iteration 11: D1 Correctness Re-verification

## Focus

Re-verify the original hook-slice correctness findings `F001` through `F004` against the current implementation of `compact-inject.ts`, `session-prime.ts`, and `hook-state.ts`.

## Scope

- Reviewed `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- Reviewed `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- Reviewed `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- Spot-checked `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- Spot-checked `.opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts`
- Re-ran the targeted hook Vitest slice for the current code

## Scorecard

- Verdict: CONDITIONAL
- Re-verified findings: 4
- Status changes: 0
- New findings: 0
- Verification:
  - `cd .opencode/skill/system-spec-kit/mcp_server && TMPDIR="$PWD/.tmp/vitest-tmp" npx vitest run tests/hook-state.vitest.ts tests/hook-session-start.vitest.ts tests/hook-precompact.vitest.ts tests/session-token-resume.vitest.ts --reporter=dot`
  - Result: PASS (4 files, 24 tests)
- Confidence: High

## Re-verification Matrix

### F001 — CONFIRMED

- **Finding:** `session-prime.ts` clears `pendingCompactPrime` before stdout injection completes.
- **Evidence:** `handleCompact()` reads the cached payload and immediately clears it via `updateState(sessionId, { pendingCompactPrime: null })` before returning sections.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:49-53] The actual hook output is only formatted and written later in `main()`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:212-215]
- **Assessment:** The control-flow ordering is unchanged from iteration 001. If anything faults after `handleCompact()` returns but before Claude fully consumes stdout, the only cached compact-recovery payload has already been deleted.
- **Severity:** P1 unchanged

### F002 — CONFIRMED

- **Finding:** `hook-state.ts` still swallows save failures, and `compact-inject.ts` still logs cache success unconditionally.
- **Evidence:** `saveState()` catches write/rename failures and only logs them, while `updateState()` always returns the in-memory state object without surfacing persistence success/failure to callers.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:66-95] `compact-inject.ts` still calls `updateState(...)` and immediately logs `Cached compact context ...` regardless of whether persistence actually reached disk.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:234-241]
- **Assessment:** The failure mode remains a false-positive success signal, not a crash. This is still a correctness issue because SessionStart can later miss the payload even though PreCompact reported success.
- **Severity:** P1 unchanged

### F003 — CONFIRMED

- **Finding:** `session-prime.ts` still does not validate `cachedAt` before injecting cached compact payloads.
- **Evidence:** The compact path reads `cachedAt` only to include it in a log message and performs no freshness or expiry check before injecting/clearing the payload.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:49-53] The persisted schema still treats `cachedAt` as passive metadata only.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:20-28] The current regression coverage still codifies that an old cached payload remains readable as-is.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/edge-cases.vitest.ts:142-155]
- **Assessment:** The earlier wording remains accurate. `session-stop.ts` uses `cachedAt` only for duplicate-save suppression on the Stop path, not to reject stale payloads on the compact-read path, so SessionStart can still inject arbitrarily old cached data.
- **Severity:** P2 unchanged

### F004 — CONFIRMED

- **Finding:** `session-prime.ts` still references `workingSet`, but `hook-state.ts` still neither defines nor initializes/persists that field.
- **Evidence:** `handleStartup()` still reads `(state as Record<string, unknown> | null)?.workingSet` and conditionally renders a `Working Memory` section from it.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:121-128] `HookState` still has no `workingSet` field, and the default state assembled by `updateState()` still initializes only `lastSpecFolder`, `sessionSummary`, `pendingCompactPrime`, and `metrics`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-28][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:79-95]
- **Assessment:** This remains dead output logic in the reviewed hook slice. I did not find any current producer in `hook-state.ts` or the target hook files that would make the startup `Working Memory` section reachable.
- **Severity:** P2 unchanged

## New Correctness Issues

No additional D1 correctness findings were confirmed in this re-verification pass.

## Ruled Out During Re-verification

- The immediate `process.exit(0)` after `process.stdout.write(...)` in `session-prime.ts` does not produce a new realistic hook-slice correctness finding at current budgets. A local stdout truncation repro only started truncating at outputs larger than approximately 64 KiB, while the current compact/startup budgets cap hook output near 16 KiB / 8 KiB respectively.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:212-215][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:7-10]

## Summary

Iteration 011 does not change the review outcome. The current code still supports the original four hook-slice findings exactly where iteration 001 placed them: early cache clearing, silent persistence failure, stale-cache acceptance, and unreachable `workingSet` output. The targeted hook tests remain green, but they still cover the happy paths rather than the failure modes behind `F001` and `F002`.
