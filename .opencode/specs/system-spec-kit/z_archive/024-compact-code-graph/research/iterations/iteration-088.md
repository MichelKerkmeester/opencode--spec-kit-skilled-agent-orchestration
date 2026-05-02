# Iteration 88: Verify Review P1 Findings 1-3 Against Current Hook Code

## Focus
Verify the current code status of deep review P1 findings 1-3:

1. Compact-recovery payload lifecycle in `hook-state.ts` + `session-prime.ts`
2. Persistence success/failure signaling in `hook-state.ts`
3. Stop-hook recursion guard behavior in `session-stop.ts`

## Findings

### 1. P1-1 — CONFIRMED
The underlying durability issue still exists, but with a narrower mechanism than the review text claimed.

`session-prime` **does** read the cached payload before clearing it: `handleCompact()` loads state, checks `state?.pendingCompactPrime`, then copies `payload` and `cachedAt` out of `state.pendingCompactPrime`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:39-50]

However, it clears `pendingCompactPrime` immediately afterward via `updateState(sessionId, { pendingCompactPrime: null })` **before** formatting and writing the recovery output to stdout.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:52-61][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:212-215]

So the exact subclaim `pendingCompactPrime` is nulled before `session-prime` reads it is inaccurate, but the more important failure mode remains: if anything fails after the clear and before Claude consumes `process.stdout.write(output)`, the one-shot compact-recovery payload has already been discarded.

### 2. P1-2 — CONFIRMED
Persistence failures can still look like successful saves.

`saveState()` returns `void`, wraps the atomic write in a `try/catch`, and only logs on failure; it does not return a success flag or throw to callers.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:65-76]

`updateState()` always returns the merged in-memory state object after calling `saveState(sessionId, state)`, regardless of whether the write actually reached disk.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:78-95]

Callers then emit success-shaped behavior with no persistence acknowledgement. In particular, `compact-inject` calls `updateState(...)` to cache the compact payload and immediately logs `Cached compact context (...) for session ...`, even though no durable-save confirmation exists.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:223-241]

That means filesystem/write failures can still be reported externally as if the cache save succeeded.

### 3. P1-3 — FALSE_POSITIVE
This specific bug does **not** match the current `session-stop` implementation.

The current guard is only:

```ts
if (input.stop_hook_active === false) {
  hookLog('info', 'session-stop', 'Stop hook not active, skipping');
  return;
}
```

So ordinary Stop execution is skipped only when Claude explicitly sends `stop_hook_active: false`; otherwise the normal stop workflow continues.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:87-91]

The hook input type also exposes `stop_hook_active?: boolean` and does **not** define any `isAutoSurface` flag.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:13-21]

A repo search across `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/*.ts` found no `isAutoSurface` references, and `git log -S'isAutoSurface' -- .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` returned no matches on 2026-03-31. That makes this finding a false positive against current code rather than a recently fixed bug.[SOURCE: repo search in current session, 2026-03-31][SOURCE: git log -S'isAutoSurface' for session-stop.ts in current session, 2026-03-31]

## Verdict Summary

| Finding | Status | Notes |
| --- | --- | --- |
| P1-1 | CONFIRMED | Payload is cleared before stdout injection completes, though not before it is first read |
| P1-2 | CONFIRMED | `saveState()` still swallows write failures and gives callers no success/failure signal |
| P1-3 | FALSE_POSITIVE | No `isAutoSurface` guard exists in current `session-stop.ts`; only `stop_hook_active === false` skips work |

## Ruled Out
- The precise P1-1 subclaim that `pendingCompactPrime` is cleared before `session-prime` reads it.
- The P1-3 theory that a current `isAutoSurface` recursion guard blocks ordinary Stop execution.

## Dead Ends
- Spec memory retrieval did not surface prior stored context for these exact P1 claims, so verification relied on current source inspection and local git history.
