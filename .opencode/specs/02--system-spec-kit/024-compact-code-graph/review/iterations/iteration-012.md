# Iteration 012: D1 Correctness Re-Verification

## Focus

Re-verify the prior D1 findings from iterations 002 and 006 against the current `session-stop.ts`, `claude-transcript.ts`, and `shared.ts` sources.

## Findings

No P0 issues found.

### [P1] CONFIRMED — normal Stop events still skip the full post-stop path

- `main()` still returns immediately when `input.stop_hook_active === false`, before transcript parsing, spec-folder detection, summary extraction, or any auto-save branch can run.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:87-91]
- `HookInput.stop_hook_active` remains an optional boolean in the shared stdin contract, but the Stop hook still has no alternative "normal stop" path once that explicit `false` guard fires.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:13-21][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:81-91]
- Status: **CONFIRMED**. The current code still matches the earlier control-flow defect exactly.
- Impact: ordinary Claude Stop events continue to bypass transcript parsing, token snapshot refresh, spec-folder detection, summary extraction, and all stop-time persistence logic.
- Fix: invert or narrow the guard so the normal Stop event reaches the post-stop pipeline and only the recursive/self-triggered continuation path exits early.

### [P1] CONFIRMED — the reachable Stop branch still uses `pendingCompactPrime` as a pseudo save bookmark instead of persisting context

- Duplicate-save suppression still keys off `state.pendingCompactPrime.cachedAt`, so the Stop hook decides whether a recent save exists by looking at the compaction handoff cache.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:147-156]
- When the completion-token threshold is exceeded, the reachable branch still rewrites `pendingCompactPrime` with a resume reminder string instead of invoking any real persistence flow.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:159-167]
- `pendingCompactPrime` is still the compact-recovery payload field in persistent hook state, and the compact/session-start path continues to write and consume that same field.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:15-25][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:40-53]
- Status: **CONFIRMED**. The reachable branch still never performs the required save and still overloads the compaction cache as its duplicate-save marker.
- Impact: stop-time save semantics remain coupled to compact recovery state, so a recent compact cache can suppress Stop behavior and the Stop branch can overwrite recovery payloads without producing a durable context artifact.
- Fix: track stop-save completion in its own state field and call the intended persistence flow directly instead of reusing `pendingCompactPrime`.

### [P2] CONFIRMED — transcript parsing still retains cache buckets while dropping them from total-token and cost math

- `parseTranscript()` still accumulates `cacheCreationTokens` and `cacheReadTokens`, but `usage.totalTokens` only adds `prompt + completion` and excludes both cache buckets.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:87-99]
- `estimateCost()` still computes cost from `promptTokens` and `completionTokens` only; cached-token fields never influence the returned dollar estimate.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts:119-142]
- The targeted token-tracking tests still verify that cache buckets are parsed, but they do not assert cache-inclusive `totalTokens` or cost behavior, so the accounting gap remains uncovered by regression tests.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts:77-94][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-stop-token-tracking.vitest.ts:97-135]
- Status: **CONFIRMED**. The parser still preserves cache sub-counts while under-reporting aggregate usage and estimated cost.
- Impact: stop-time token accounting can look internally inconsistent and can understate usage/cost whenever Claude prompt caching is involved.
- Fix: decide whether cached tokens belong in aggregate usage and cost, then make `totalTokens`, `estimateCost()`, and the tests follow the same contract.

## Verified Healthy

- Re-ran `TMPDIR="$PWD/.tmp/vitest-tmp" npx vitest run tests/hook-stop-token-tracking.vitest.ts tests/edge-cases.vitest.ts --reporter=verbose` from `.opencode/skill/system-spec-kit/mcp_server`; the targeted slice passed (2 files, 21 tests).
- No additional correctness issue surfaced in `shared.ts` beyond the already-known Stop-hook guard semantics and transcript-accounting gap.

## Summary

- P0: 0 findings
- P1: 2 findings re-verified
- P2: 1 finding re-verified
- newFindingsRatio: 0.00
- Net result: the prior session-stop and transcript-accounting findings remain accurate in the current code, and this pass did not uncover a new D1 defect in the reviewed slice.
