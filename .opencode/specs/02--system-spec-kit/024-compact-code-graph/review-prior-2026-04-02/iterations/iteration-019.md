# Iteration 019: D1 Correctness Re-verification

## Focus

Check the `memory-surface.ts` + `hooks/index.ts` integration specifically around `autoSurfaceAtCompaction()` and verify whether the live Claude `PreCompact` / `SessionStart` hook path actually consumes that auto-surface contract, including constitutional-memory surfacing and compaction-budget enforcement.

## Re-verified Items

### `autoSurfaceAtCompaction()` result shape - CORRECT ON THE MCP TOOL PATH

- `autoSurfaceAtCompaction()` still returns the same `AutoSurfaceResult | null` contract as the other memory-surface helpers: `{ constitutional, triggered, surfaced_at, latencyMs }`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:26-36][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:300-317]
- The MCP runtime path still consumes that shape correctly. `context-server.ts` calls `autoSurfaceAtCompaction(...)` only for `memory_context` requests with `mode === 'resume'`, then injects the returned object into response metadata via `appendAutoSurfaceHints(...)`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:325-377]
- The current runtime tests still assert that exact behavior for the tool path, including the compaction-hook call and response metadata shape.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts:978-1041][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:500-630]

### `COMPACTION_TOKEN_BUDGET` enforcement inside `memory-surface.ts` - CORRECT FOR THE HELPER ITSELF

- `autoSurfaceAtCompaction()` still delegates to `autoSurfaceMemories(..., COMPACTION_TOKEN_BUDGET, 'compaction')`, so the helper path itself does route through `enforceAutoSurfaceTokenBudget(...)`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:136-186][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:300-317]
- The dedicated tests still verify that the helper result is trimmed or dropped until its estimated token count is `<= COMPACTION_TOKEN_BUDGET`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:609-630]

## New Findings

### [P1] F022 - the live Claude compaction hook path bypasses `memory-surface.ts` entirely, so hook-injected compact recovery never receives the constitutional/triggered auto-surface payload that `autoSurfaceAtCompaction()` promises

- `hooks/index.ts` re-exports `autoSurfaceAtCompaction()` and the rest of the memory-surface helpers, and `context-server.ts` imports that export surface for the MCP tool-dispatch runtime.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/index.ts:4-18][SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:57-57][SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:325-377]
- But the live Claude `PreCompact` hook is a separate external-process script. `compact-inject.ts` does not import `memory-surface.ts` or `hooks/index.ts`; instead it builds its own `MergeInput` object from transcript heuristics, hardcodes `constitutional: ''` and `triggered: ''`, and passes that object directly into `mergeCompactBrief(...)`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:17-18][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:141-203]
- The paired `SessionStart` hook also never consumes `AutoSurfaceResult`. `session-prime.ts` simply reads the cached `pendingCompactPrime.payload` string and emits it as `Recovered Context (Post-Compaction)`.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:38-72][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:184-216]
- `mergeCompactBrief(...)` does have explicit slots for `constitutional` and `triggered`, but the live hook caller always supplies those slots as empty strings, so the hook-recovery payload can never surface constitutional rules or triggered memories through that path even when `memory-surface.ts` could have produced them.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:10-16][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/compact-merger.ts:126-153][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:183-189]
- The current hook-focused tests reinforce this blind spot: `hook-precompact.vitest.ts` and `hook-session-start.vitest.ts` only assert raw string cache/write/read behavior and generic truncation, not that the live Claude hook path ever calls `autoSurfaceAtCompaction()` or includes constitutional/triggered content.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts:22-83][SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts:22-89]
- Impact: the reviewed system has two different “compaction” behaviors. The MCP tool path can surface constitutional memories and triggered memories with the `AutoSurfaceResult` contract, but the real Claude compaction lifecycle hook cannot. As a result, the hook path drops the highest-priority memory surface entirely and can never preserve those memories across the compaction boundary.

## Ruled Out

- No new missing-`await` defect was confirmed in this slice. The relevant async paths still await `parseHookStdin()`, `withTimeout(...)`, `autoSurfaceAtCompaction(...)` on the MCP side, and the surrounding promise-returning helper calls where they are actually used.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:205-239][SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:168-216][SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:330-347]
- No new off-by-one bug was confirmed inside `memory-surface.ts` itself for the helper-level compaction budget. The helper contract is consistent; the defect is that the live Claude hook path does not use it.

## Summary

- `autoSurfaceAtCompaction()` helper contract: **runtime-correct on the MCP tool path**
- `COMPACTION_TOKEN_BUDGET` inside `memory-surface.ts`: **helper-level enforcement confirmed**
- New correctness finding: **`F022` [P1]**
- New findings delta: `+0 P0`, `+1 P1`, `+0 P2`
- Recommended next focus: unify the real Claude `PreCompact` / `SessionStart` pipeline with the shared `memory-surface` compaction helper, or explicitly retire the claim that hook recovery preserves constitutional/triggered memory surfaces.
