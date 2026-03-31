# Research Iteration 099: Query-Intent Routing Integration

## Focus
Investigate how `classifyQueryIntent()` should integrate with `code_graph_context`, `memory_context`, and `memory_search` for automatic structural vs semantic query routing.

## Findings

### Current State

`classifyQueryIntent()` lives in `lib/code-graph/query-intent-classifier.ts` and returns `{ intent, confidence, structuralScore, semanticScore, matchedKeywords }`, where `intent` is `structural | semantic | hybrid`. It is a pure heuristic classifier: token split, keyword hits, regex pattern hits, weighted scoring, then a >65% threshold for structural or semantic, otherwise hybrid. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/query-intent-classifier.ts:8-16`, `:20-68`, `:106-162`]

It is currently orphaned: repo search finds only its definition, no consumers. Meanwhile `memory_context` already auto-routes only across retrieval modes (`quick/deep/focused/resume`) using the separate task-intent classifier from `intent-classifier.ts`, and `memory_search` uses that same classifier for ranking weights, not backend selection. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:584-637`, `:829-901`, `:1032-1351`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:563-598`, `:661-696`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7-29`, `:404-506`]

Important distinction: the `graph` channel inside `memory_search` is a causal-memory graph over `memory_index`/`causal_edges`, not the code graph behind `code_graph_context`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1107-1123`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:89-145`, `:150-252`]

Also, `code_graph_context` exposes an `input` field in schema/handler, but the underlying builder only resolves from `subject` or `seeds`; `input` is effectively unused today. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:660-690`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:86-148`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:48-63`]

### Problem

Users still have to know when to call `code_graph_context` vs `memory_search`. `memory_context` is marketed as the smart entry point, but today it only chooses *mode*, not *backend*. Structural questions like "who calls X?" or "show import tree for Y" are not automatically routed to the code graph, while semantic discovery questions stay in the same memory retrieval path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:509-518`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:847-883`]

## Proposals

### Proposal A: Transparent Auto-Routing in memory_context

- Description: Make `memory_context` the primary consumer of `classifyQueryIntent()`. In `mode: "auto"`, classify the query first:
  - `structural` -> call `code_graph_context`
  - `semantic` -> keep current `memory_search` path
  - `hybrid` -> run both and merge a bounded response
  Keep existing `intent-classifier.ts` after routing: semantic branch still uses task intent for ranking; structural branch may map query text to `queryMode` (`impact` for caller queries, `outline` for structure queries, else `neighborhood`).
- LOC estimate: 120-220
- Files to change:
  - `handlers/memory-context.ts`
  - `handlers/code-graph/context.ts`
  - `lib/code-graph/code-graph-context.ts`
  - `tool-schemas.ts`
  - docs/tests
- Dependencies:
  - lightweight queryMode mapper
  - fallback when code graph cannot resolve `subject/seeds`
  - merge envelope for hybrid results
- Risk: MEDIUM — best UX fit, but structural routing needs anchor resolution/fallback because `code_graph_context` does not consume free-text well today.

### Proposal B: Unified Query Tool with Intent Classification

- Description: Add a new `smart_query`/`unified_search` tool that owns cross-backend routing and leaves existing tools unchanged.
- LOC estimate: 180-320
- Files to change:
  - new handler/tool registration
  - `tool-schemas.ts`
  - tool registry/context server/docs/tests
- Dependencies:
  - shared result envelope
  - documentation and runtime tool discovery updates
- Risk: HIGH — duplicates `memory_context`'s role, expands API surface, and creates long-term ambiguity between two "smart entry points."

### Proposal C: code_graph_context Auto-Fallback to Semantic

- Description: When `code_graph_context` gets no resolved anchors, or when query intent is semantic/hybrid, let it optionally fall back to `memory_search` and report that fallback.
- LOC estimate: 70-140
- Files to change:
  - `handlers/code-graph/context.ts`
  - maybe `lib/code-graph/code-graph-context.ts`
  - docs/tests
- Dependencies:
  - response envelope unification
  - avoid surprising direct-tool callers
- Risk: MEDIUM — useful safety net, but it muddies a tool whose contract is currently explicitly graph-focused.

### Proposal D: Classification Metadata in Tool Responses

- Description: Add query-intent metadata to responses so the LLM can see what happened or what should happen next:
  - `queryIntent.type/confidence/scores`
  - `routedBackend`
  - `fallbackApplied`
  - `suggestedTool` when explicit tools are used directly
- LOC estimate: 30-80
- Files to change:
  - `handlers/memory-context.ts`
  - `handlers/memory-search.ts`
  - `handlers/code-graph/context.ts`
  - docs/tests
- Dependencies:
  - stable response-meta schema
- Risk: LOW — no behavior change by itself, strong observability value.

## Recommendation

Best approach: **Proposal A + Proposal D**, with a narrow piece of **Proposal C** as a fallback rule.

Why:
- `memory_context` is already the documented L1 "smart entry point," so backend routing belongs there.
- `intent-classifier.ts` and `query-router.ts` should stay **orthogonal**:
  - `classifyQueryIntent()` = choose backend (`code_graph_context` vs `memory_search`)
  - `classifyIntent()` = semantic task intent for weighting/mode selection
  - `routeQuery()` = choose channels *inside* hybrid memory search
- `memory_search` should **not** transparently reroute to code graph by default; it is already an explicit lower-level semantic tool.
- `code_graph_context` should remain explicit, but may expose fallback metadata or a semantic fallback only when resolution fails.

## Cross-Runtime Impact

| Runtime | Current Query Routing | After Implementation | Parity Change |
|---------|----------------------|---------------------|---------------|
| Copilot / OpenCode | User/prompt must choose `memory_context` vs `code_graph_context`; `memory_context` only auto-picks mode | `memory_context` auto-picks backend and keeps explicit tools optional | High |
| Claude Code | Same manual choice, runtime behavior depends on prompting habits | Same smart L1 routing via MCP | High |
| Codex CLI | Same manual tool split | Same smart L1 routing via MCP | High |
| Gemini CLI | Same manual tool split | Same smart L1 routing via MCP | High |

## Next Steps

1. Add a backend-routing phase to `memory_context` before current mode execution.
2. Define a small routing result shape: `backend = structural | semantic | hybrid`, plus confidence and scores.
3. Structural branch: call `code_graph_context`, infer `queryMode` heuristically, if no anchors resolve fall back to semantic search.
4. Semantic branch: keep current `memory_search` flow unchanged, continue using `intent-classifier.ts` and `query-router.ts`.
5. Hybrid branch: run both, merge top-level summaries and cap result size under existing `memory_context` token-budget enforcement.
6. Add response metadata so runtimes can see `queryIntent`, `routedBackend`, and `fallbackApplied`.

## Metadata
- Model: GPT-5.4 via Copilot CLI
- Effort: high
