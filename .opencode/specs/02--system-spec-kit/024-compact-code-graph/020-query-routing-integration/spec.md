# Phase 020: Query-Intent Routing Integration

## What This Is

The v2 remediation added a `classifyQueryIntent()` function that can tell if a question is structural ("who calls X?") or semantic ("find code similar to Y"). But it's not connected to anything. This phase wires it in and adds two convenience tools.

## Plain-English Summary

**Problem:** Users have to know which tool to call. Want structural info? Use `code_graph_context`. Want semantic search? Use `memory_search`. Most users don't know the difference and shouldn't have to.

**Solution:** Make `memory_context` smart — it classifies the query automatically and routes to the right backend. Also create a `session_resume` composite tool that does the 3-4 calls a user needs on resume in one shot.

## What to Build

### Part 1: Auto-Routing in memory_context (from research iter 099)

Add a backend-routing step at the top of `memory_context`:

```
User query → classifyQueryIntent()
  → "structural" (calls, imports, extends) → code_graph_context
  → "semantic" (find, similar, explain) → memory_search (existing)
  → "hybrid" (ambiguous) → run both, merge results
```

Every response includes metadata: `{ queryIntent, routedBackend, fallbackApplied }` so the LLM can see what happened.

If the structural backend returns empty → automatically falls back to semantic.

**Files to change:**
- `handlers/memory-context.ts` — add routing phase before existing logic
- `handlers/code-graph/context.ts` — accept routed requests
- `lib/code-graph/code-graph-context.ts` — handle routed queries
- `tool-schemas.ts` — add classification metadata to response schema

### Part 2: `session_resume` Composite Tool (from research iter 101)

One tool that does what users always need on resume:
1. Calls `memory_context({ mode: "resume" })`
2. Calls `code_graph_status()`
3. Calls `ccc_status()`
4. Merges results into one response

Saves 2-3 round trips and ~400-900 tokens per session resume.

**Files to change:**
- New `mcp_server/handlers/session-resume.ts`
- `mcp_server/tool-schemas.ts` — register tool
- `mcp_server/tools/context-tools.ts` — wire into dispatcher

### Part 3: Passive Context Enrichment (from research iter 102)

Replace ad-hoc enrichment in `context-server.ts` with a proper pipeline:

```
Tool response → runPassiveEnrichment()
  → Code graph: add relevant symbols near mentioned files
  → Session continuity: warn if context may be stale
  → Memory: surface high-confidence triggered memories
```

With hard guards: max 250ms latency, max 200 tokens, no recursive enrichment.

**Files to change:**
- New `lib/enrichment/passive-enrichment.ts`
- New `lib/enrichment/code-graph-enricher.ts`
- `mcp_server/context-server.ts` — call enrichment pipeline

## Cross-Runtime Impact

| Runtime | Before | After |
|---------|--------|-------|
| All runtimes | Manual tool selection | Automatic backend routing |
| Non-hook CLIs | 3-4 calls to resume | 1 `session_resume` call |

## Estimated LOC: 500-900
## Risk: MEDIUM — routing logic must not break existing memory_context behavior
## Dependencies: Phase 019 (code graph auto-trigger) recommended first

---

## Implementation Status (Post-Review Iterations 041-050)

| Item | Status | Evidence |
|------|--------|----------|
| Part 1: Auto-routing in memory_context | DONE | memory-context.ts:1087-1145 — classifyQueryIntent routing with structural/semantic/hybrid |
| Part 2: session_resume composite tool | DONE | handlers/session-resume.ts (128 lines), tool registered |
| Part 3: Passive Context Enrichment | DONE | F057 — lib/enrichment/passive-enrichment.ts (180 LOC); wired into context-server.ts response path |
| Query intent metadata in response | DONE | queryIntentMetadata appended at line 1391 |
| Structural fallback to semantic | DONE | Falls through if totalNodes === 0 |

### Review Findings (iter 044, 047)
- F050 (P2): subject=normalizedInput passes prose as symbol name. FIXED (code-identifier heuristic extraction in memory-context.ts)
- F051 (P2): Duplicated CocoIndex path check in session-resume.ts. FIXED (shared helper lib/utils/cocoindex-path.ts)
- F052 (P2): session_resume missing metric event. FIXED (added recordMetricEvent in iter 041-050 fixes)
- F057 (P1): Passive enrichment pipeline (Part 3). FIXED (lib/enrichment/passive-enrichment.ts, wired into context-server.ts)
