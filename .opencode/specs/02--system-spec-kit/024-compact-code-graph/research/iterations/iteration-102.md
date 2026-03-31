# Research Iteration 102: Passive Context Enrichment via Tool-Dispatch Middleware

## Focus
Investigate how the MCP server can passively enrich tool results with code graph context, session state, or memory hints without explicit user/LLM requests.

## Findings

### Current State

`context-server.ts` already has two passive-enrichment phases around `dispatchTool()`: a pre-dispatch phase for session priming and memory auto-surface, and a post-dispatch phase for graph/context injection before final token-budget enforcement (`context-server.ts:651-800`).

Existing passive enrichment patterns are already meaningful, but fragmented.

On the first tool call, `primeSessionIfNeeded()` injects constitutional memories plus code-graph status once per session (`hooks/memory-surface.ts:282-321`).

On later non-memory-aware tool calls, `autoSurfaceAtToolDispatch()` extracts a context hint from args and surfaces triggered memories, with recursion guards and a 4k token cap (`hooks/memory-surface.ts:350-373`, `187-237`).

After the tool returns, `resolveDispatchGraphContext()` extracts file paths from tool args, builds a compact graph neighborhood with hard limits and a 250ms timeout, then stores it in `meta.graphContext` (`context-server.ts:308-517`, `722-758`).

Envelopes already support `hints` and `meta`, and token counts are recomputed after decoration (`hooks/response-hints.ts:86-133`, `lib/response/envelope.ts:16-35`, `116-139`).

Two important gaps remain:

First, passive enrichment is mostly **arg-derived**, not **result-derived**. If a tool response reveals new files/symbols, the server does not enrich from that output.

Second, session continuity data exists in `session-manager.ts` (`specFolder`, `currentTask`, `pendingWork`, interrupted-session recovery), but it is not currently injected into normal tool responses (`lib/session/session-manager.ts:1020-1233`).

Also, `WorkingSetTracker` exists and is useful for recency-aware enrichment, but appears not yet wired into dispatch (`lib/code-graph/working-set-tracker.ts:16-153`).

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`; `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/working-set-tracker.ts`]

### Problem

Tool responses are not fully isolated today, but passive enrichment is still **ad hoc** rather than a coherent middleware system.

The LLM gets some memory hints and some graph metadata, but only from selective hooks, mostly keyed off request args. That misses higher-value opportunities like enriching around files discovered in tool output, warning about stale/interrupted session state, or ranking surfaced memories by what the session is actually touching.

The real problem is not "no enrichment"; it is "uncoordinated enrichment with weak relevance control."

## Proposals

### Proposal A: Code Graph Symbol Enrichment

- Description: Extend the current dispatch graph path so enrichment can use both tool args and normalized tool output. If a response mentions file paths, symbols, or anchors, append a compact graph neighborhood or impact summary for just those top entities.
- LOC estimate: 120-220
- Files to change: `context-server.ts`, new helper such as `lib/enrichment/code-graph-enricher.ts`, possibly `lib/code-graph/code-graph-context.ts`
- Dependencies: `graphDb`, existing path extraction logic, optional symbol extraction, existing envelope `meta/hints`
- Risk: MEDIUM — the graph path already exists, so this is an extension, but false-positive symbol matching and latency creep are real risks

This is the strongest near-term lever because the server already has a working graph enrichment skeleton; it just needs to move from arg-only to arg-plus-result.

### Proposal B: Session Continuity Headers

- Description: Add a very small continuity block on tool responses, such as active spec folder, current task, interrupted-session recovery state, or "pending work exists." This should be warnings-first, not a verbose status dump.
- LOC estimate: 80-140
- Files to change: `context-server.ts`, new helper such as `hooks/session-continuity.ts`, `lib/session/session-manager.ts` usage only
- Dependencies: `saveSessionState()/recoverState()/getInterruptedSessions()` in `session-manager.ts`
- Risk: LOW — data model already exists; the main challenge is avoiding stale or noisy headers

Best version: only emit when there is actionable signal, like mismatch, interruption recovery, or missing spec-folder continuity.

### Proposal C: Relevant Memory Auto-Surface

- Description: Generalize the current memory-surface hook so any tool call can surface a tiny set of relevant memories, ranked by trigger match, recency, and working-set overlap instead of always favoring constitutional + phrase matches alone.
- LOC estimate: 90-170
- Files to change: `hooks/memory-surface.ts`, `context-server.ts`, possibly wiring `working-set-tracker.ts`
- Dependencies: trigger matcher, constitutional cache, working-set signal, retrieval directives
- Risk: MEDIUM — useful when precise, harmful when repetitive; this is the proposal most likely to add noise if not tightly budgeted

Constitutional memories should stay first-call only; use later calls for high-confidence triggered memories.

### Proposal D: Token-Budgeted Enrichment Pipeline

- Description: Replace today's ad hoc sequence with an explicit enrichment middleware pipeline, e.g. `session -> memory -> graph`, each with eligibility rules, hard token/latency budgets, and degradation order. Make the response profile (`quick/research/debug/resume`) influence how much of that enrichment becomes visible.
- LOC estimate: 180-320
- Files to change: `context-server.ts`, new `lib/enrichment/passive-enrichment.ts`, `hooks/memory-surface.ts`, possibly `lib/response/profile-formatters.ts`, tests
- Dependencies: existing envelope helpers, token counting, current graph hook, current memory hook, session manager
- Risk: MEDIUM — central dispatch changes are always sensitive, but this is the cleanest long-term architecture

This is the only proposal that solves token bloat, ordering, and circularity in one place.

## Recommendation

Best approach: **Proposal D as the framework, with Proposal A as the first concrete enricher and Proposal B as a lightweight second enricher. Use Proposal C only in a narrowed form.**

Why this wins:

The server already has the right primitives: pre-dispatch hook points, envelope metadata, token counting, response hints, graph queries, and session state. What it lacks is a single coordinator.

The middleware should run exactly once per tool call, never by recursively calling MCP tools. It should read directly from DB/helpers, mark `meta.enrichment = { appliedSources, skippedSources, budgetUsed }`, and short-circuit for memory-aware/code-graph tools.

Recommended budget shape:

- Reserve 15-20% slack for the base tool result.
- Session continuity: 40-80 tokens max.
- Memory hints: 120-180 tokens max.
- Graph enrichment: 180-300 tokens max.
- Degrade in this order: extra evidence -> graph neighbors -> memory items -> continuity details.
- Put terse actionable text in `hints`, richer structure in `meta`.

Passive enrichment helps when it is **specific, sparse, and actionable**. It hurts when it becomes ambient background text. The correct design is "inject only the next-most-useful context under a fixed budget."

## Cross-Runtime Impact

| Runtime | Current Enrichment | After Implementation | Parity Change |
|---------|-------------------|---------------------|---------------|
| Copilot / OpenCode | First-call session priming, arg-based memory hints, arg-based graph meta | Unified result-aware enrichment, continuity warnings, budgeted hints/meta | Moderate improvement |
| Claude Code | Same server-side behavior, depends on client consumption of `hints/meta` | Same enriched payload with less runtime-specific prompting | High parity gain |
| Codex CLI | Same server-side behavior | Same enriched payload; better consistency with other runtimes | High parity gain |
| Gemini CLI | Same server-side behavior | Same enriched payload; server becomes the shared context layer | High parity gain |

The key cross-runtime insight is that server-side enrichment improves parity automatically. Any runtime that consumes this MCP server benefits without runtime-specific prompt hacks.

## Next Steps

1. Extract current enrichment flow in `context-server.ts` into a single `runPassiveEnrichment()` coordinator.
2. Keep existing recursion guards, then add an explicit `enrichmentDepth/appliedSources` guard so enrichment never triggers enrichment.
3. Extend graph enrichment from request-arg analysis to result-aware analysis, but cap it hard by latency and tokens.
4. Add continuity warnings from `session-manager` only when actionable: interrupted recovery, missing spec folder continuity, pending work, or stale session handoff.
5. Narrow memory auto-surface to high-confidence triggered items plus working-set overlap; keep constitutional memory priming first-call only.
6. Add tests for noise control: zero-signal calls, over-budget calls, recursive-skip cases, and profile-aware shaping.

## Metadata
- Model: GPT-5.4 via Copilot CLI
- Effort: high
