# Research Iteration 107: MCP First-Call Priming vs Agent Priming — Overlap and Gaps

## Current State

There are two distinct bootstrap layers, and they are not identical.

First, the MCP server performs **implicit one-shot priming** on the first tool call of the process. In `context-server.ts`, `primeSessionIfNeeded(name, args)` runs before normal dispatch on every first tool call, regardless of tool type. It is not skipped for memory-aware tools. It sets a module-level `sessionPrimed` flag, loads constitutional memories, enriches them with retrieval directives, snapshots code-graph state, computes CocoIndex availability, builds a small `PrimePackage` from the *request args*, and injects the result into response hints/meta. [SOURCE: `context-server.ts:686-710`] [SOURCE: `hooks/memory-surface.ts:315-419`] [SOURCE: `context-server.ts:530-565`]

Second, the `@context-prime` agent performs **explicit bootstrap orchestration**. Its documented 4-step flow is `memory_context(resume)` -> `code_graph_status()` + `ccc_status()` -> `session_health()`, with `session_resume()` as a single-call alternative for steps 1-3. [SOURCE: `context-prime.md:34-39`] [SOURCE: `context-prime.md:57-61`]

`session_resume` is a composite handler, but it is narrower than the agent flow: it directly calls `handleMemoryContext(...)`, reads `graphDb.getStats()`, and checks `isCocoIndexAvailable()`. It returns `memory`, `codeGraph`, `cocoIndex`, and `hints`, but **not** session-health scoring/status. [SOURCE: `handlers/session-resume.ts:45-127`]

`session_health` is the only place that computes session quality/recency/continuity status. It depends on `isSessionPrimed()`, code-graph freshness, and context metrics; it returns `status`, `details`, `qualityScore`, and hints. [SOURCE: `handlers/session-health.ts:50-136`]

### Exact overlap map

| Capability | MCP first-call priming | `@context-prime` / `session_resume` | Overlap |
|---|---|---|---|
| Set "session primed" state | Yes | No direct set; only observes via `session_health` | No |
| Constitutional memories | Yes | No | No |
| Retrieval-directive enrichment | Yes | No | No |
| Memory resume / prior task recovery | No | Yes via `memory_context(resume)` / `session_resume` | No |
| Code graph status/freshness | Yes snapshot | Yes via `code_graph_status` or `session_resume` | **Yes** |
| CocoIndex availability | Yes via `isCocoIndexAvailable()` | Yes via `ccc_status` or `session_resume` | **Yes** |
| Session quality score / recency | No | Yes via `session_health` | No |
| Human-readable markdown package | No, only hints/meta injection | Yes | No |

## Analysis

### What happens when both fire?

If `@context-prime` starts with `memory_context({ mode: "resume" ... })`, the following happens:

1. The first MCP request enters `context-server`.
2. `recordToolCall()` runs, then `primeSessionIfNeeded("memory_context", args)` runs because `sessionPrimed === false`. [SOURCE: `context-server.ts:686-710`]
3. That priming path loads constitutional memories, enriches them, snapshots the code graph, checks CocoIndex availability, builds a `PrimePackage`, and flips `sessionPrimed = true`. [SOURCE: `hooks/memory-surface.ts:365-419`]
4. Because `memory_context` is memory-aware and in `resume` mode, normal tool-dispatch surfacing is skipped, but the compaction-style auto-surface still runs on the same request. [SOURCE: `context-server.ts:717-729`]
5. The actual `memory_context` handler runs.
6. The server injects session-priming hints/meta into the final response envelope. [SOURCE: `context-server.ts:793-816`]
7. Then the agent separately calls `code_graph_status`, `ccc_status`, and `session_health`, but those later calls no longer re-prime because the flag is already set.

So the overlap is real, but it is **partial**, not total:

- It is **not** double memory-resume.
- It **is** double graph-status acquisition.
- It **is** double CocoIndex probing.
- It **is not** double session-quality scoring.
- It **is not** double constitutional-memory loading from the agent path.

### Important nuance: `session_resume` reduces, but does not eliminate, overlap

If `@context-prime` uses `session_resume()` as its first call, outer first-call priming still fires in `context-server` before dispatch. But inside `handleSessionResume`, the sub-call to `handleMemoryContext(...)` is a direct function call, not a nested MCP dispatch, so it does **not** trigger a second `primeSessionIfNeeded()` pass. [SOURCE: `context-server.ts:707-710`] [SOURCE: `handlers/session-resume.ts:54-59`]

That means:

- `session_resume` avoids the agent's extra `code_graph_status` + `ccc_status` calls.
- But it still overlaps once with server priming on graph/Coco snapshot work.
- And it still needs a separate `session_health` call if quality scoring is required.

### Gaps between the two systems

The systems overlap, but they also leave gaps:

1. **Server priming is low-fidelity for task/spec recovery.**
   `buildPrimePackage()` derives `specFolder` and `currentTask` from tool args only. On a first `memory_context(resume)` call, that usually means `currentTask` becomes the literal resume prompt and `specFolder` is often null, so the prime package is less accurate than the actual resumed memory data. [SOURCE: `hooks/memory-surface.ts:320-328`]

2. **`session_resume` is still missing session-health semantics.**
   It returns memory + graph + CocoIndex, but not the recency/continuity quality score that `@context-prime` wants. [SOURCE: `handlers/session-resume.ts:34-39`]

3. **`@context-prime` currently duplicates server-owned ambient checks.**
   The agent does active calls for graph/Coco even though the server already captured those on the first request.

## Proposals

### Proposal A — Keep both, but make them explicitly complementary
Keep MCP first-call priming as the universal ambient safety net, and slim `@context-prime` down to:
- `session_resume()`
- `session_health()`

Remove separate `code_graph_status()` and `ccc_status()` from the agent flow.

This preserves:
- universal first-call safety for all clients,
- constitutional memory injection,
- `sessionPrimed` semantics for `session_health`,
- explicit quality scoring.

It removes the biggest avoidable duplication in the agent path.
**Estimated change:** 15-30 LOC in agent instructions, 20-40 LOC docs/tests. Total ~35-70 LOC.

### Proposal B — Add a single composite MCP tool for explicit bootstrap
Create `session_bootstrap()` or extend `session_resume({ includeHealth: true })` so one tool returns:
- `memory`
- `codeGraph`
- `cocoIndex`
- `health`
- `hints`

Then make `@context-prime` a thin presenter over that one tool.

This keeps server priming as ambient first-call metadata, while the explicit bootstrap tool becomes the canonical recovery payload. The overlap remains only at the "first call captured ambient context" layer, which is acceptable and intentional.

**Estimated change:**
- shared bootstrap collector/refactor: ~60-100 LOC
- handler/schema wiring: ~60-100 LOC
- tests/docs: ~80-140 LOC
Total ~200-340 LOC.

### Proposal C — Eliminate `@context-prime`
Have the orchestrator call MCP tools directly and render the result itself.

This is feasible because `@context-prime` is mostly orchestration/presentation, not unique data access. But it removes a convenient read-only abstraction and pushes formatting/fallback policy up into every caller. It also does **not** eliminate server first-call priming overlap by itself.

**Estimated change:** ~40-90 LOC if only call sites are changed; more if multiple orchestrators depend on current agent behavior.

### Proposal D — Suppress server priming for bootstrap tools
Skip `primeSessionIfNeeded()` when first tool is `memory_context(resume)` or `session_resume`.

This looks tempting, but it is the riskiest option. It would either:
- break the universal "first call primes session" contract, or
- force `session_resume` / `memory_context` to replicate priming side effects, including `sessionPrimed` state and constitutional-memory surfacing.

That would spread priming semantics across multiple handlers and make `session_health` behavior harder to reason about.
**Estimated change:** ~120-220 LOC plus regression risk.
**Not recommended.**

## Recommendation

Treat the two mechanisms as **complementary**, not competing:

- **MCP first-call priming** should remain the universal, passive, one-shot safety net.
- **Explicit bootstrap** should become the canonical recovery/status payload.

Concretely, the best near-term design is:

1. Keep `primeSessionIfNeeded()` exactly as the ambient first-call layer.
2. Stop using `@context-prime`'s 4-call path.
3. Change `@context-prime` to call `session_resume()` + `session_health()` only.
4. Longer-term, fold those into a single `session_bootstrap()` response and make `@context-prime` just a markdown formatter over that.

This preserves the valuable parts of both systems:

- server-side priming still works for any client, even if no bootstrap agent runs,
- constitutional memories still auto-surface on the first call,
- `session_health` still has a consistent notion of "primed,"
- explicit bootstrap still returns real recovered state instead of the low-fidelity arg-derived `PrimePackage`.

In short: **do not remove MCP first-call priming; de-duplicate the agent path instead.**

## Implementation Plan

### Phase 1 — Low-risk de-duplication
Update `@context-prime` workflow from:

- `memory_context(resume)`
- `code_graph_status`
- `ccc_status`
- `session_health`

to:

- `session_resume`
- `session_health`

Also update agent docs to state that `session_resume` is the default path, not just an alternative.
**Estimated LOC:** ~35-70.

### Phase 2 — Unify explicit bootstrap shape
Either:
- extend `session_resume` with `health`, or
- add `session_bootstrap` as a new composite tool.

Return one JSON payload with:
- `memory`
- `codeGraph`
- `cocoIndex`
- `health`
- `hints`

Keep response envelopes compatible with current metadata injection from first-call priming.
**Estimated LOC:** ~120-200.

### Phase 3 — Extract shared snapshot helpers
Refactor graph/Coco snapshot logic into a shared helper used by:
- `primeSessionIfNeeded()`
- `session_resume` / `session_bootstrap`
- optionally `session_health`

This avoids future drift in freshness thresholds and probe semantics.
**Estimated LOC:** ~60-110.

### Phase 4 — Regression coverage
Add tests for:

- first call to `session_resume` still marks session as primed,
- `session_health` after `session_resume` reports `primed`,
- `@context-prime` no longer requires standalone `code_graph_status` / `ccc_status`,
- first-call priming remains one-shot,
- bootstrap payload still includes health when expected.

**Estimated LOC:** ~80-140.

### Total estimate

- **Minimal practical fix:** ~35-70 LOC
- **Recommended full cleanup:** ~260-410 LOC
