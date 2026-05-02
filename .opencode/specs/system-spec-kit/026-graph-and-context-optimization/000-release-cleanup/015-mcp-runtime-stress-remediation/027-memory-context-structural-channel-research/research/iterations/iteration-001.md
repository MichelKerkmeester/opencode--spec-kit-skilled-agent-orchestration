# Iteration 001 - Intent Rule Inventory

## Focus

Inventory intent-detection rules across the advisor, `memory_context`, tool schemas, and query-plan surfaces. This follows the strategy's iteration 1 focus: "Inventory intent-detection rules (advisor + memory_context + tool-schemas + QueryPlan); catalog signals" for RQ1.

## Sources Read

- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:47-55`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:572-589`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:266-340`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:843-867`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1040-1082`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:17-23`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:243-253`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:421-450`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:889-927`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:934-995`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1028-1073`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1122-1208`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1408-1478`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1639-1645`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1737-1774`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/query-intent-classifier.ts:11-19`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/query-intent-classifier.ts:23-82`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/query-intent-classifier.ts:123-185`
- `.opencode/skill/system-spec-kit/mcp_server/lib/query/query-plan.ts:38-47`

## Findings

### P1 - `memory_context` has structural classification but no actionable `code_graph_query` route

The schema describes `memory_context` as the L1 unified entry point that routes to `memory_search` flavors, while `code_graph_query` remains a separate L2 tool with operations for `outline`, callers, imports, and blast radius (`tool-schemas.ts:47-55`, `tool-schemas.ts:572-589`). The handler imports and executes `handleMemorySearch` and `handleMemoryMatchTriggers`, but not `handleCodeGraphQuery` (`memory-context.ts:17-23`, `memory-context.ts:948-995`, `memory-context.ts:1639-1645`). Even when backend query-intent routing classifies a prompt as structural or hybrid, the code calls `buildContext()` for graph metadata and then continues into the normal memory strategy (`memory-context.ts:1408-1478`, `memory-context.ts:1639-1645`). This makes the current feature advisory/augmentative, not a structural retrieval channel.

### P1 - Structural intent rules are duplicated and likely to drift

The advisor owns `STRUCTURAL_MISFIRE_PATTERNS` and suppressions in `context-server.ts` (`context-server.ts:276-294`). `memory_context` owns a separate `STRUCTURAL_ROUTING_PATTERNS` block (`memory-context.ts:243-253`). The backend classifier has a third, broader signal set with structural keywords, semantic keywords, structural regexes, semantic regexes, and ratio-based confidence scoring (`query-intent-classifier.ts:23-82`, `query-intent-classifier.ts:123-185`). These three rule locations do not share one source of truth.

### P1 - Current advisor signal is advisory-only and gated by graph readiness

The advisor returns a structural nudge only when the graph is ready, the activation scaffold is primed, the query is not suppressed, and a structural pattern matches (`context-server.ts:307-340`). The server then injects this into the response after `memory_search` or `memory_context` rather than dispatching a structural backend (`context-server.ts:1040-1082`). That protects callers from graph readiness errors, but it also means the strongest existing signal cannot satisfy structural requests by itself.

### P2 - The classifier can say "structural", but not which `code_graph_query` operation to call

`classifyQueryIntent()` returns only `intent`, `confidence`, `structuralScore`, `semanticScore`, and signals (`query-intent-classifier.ts:11-19`). `code_graph_query` requires an explicit `operation` and `subject` (`tool-schemas.ts:572-589`). `memory_context` has a subject heuristic that can choose the first symbol-like token or keyword fallback (`memory-context.ts:1430-1441`), but there is no operation planner that maps "who calls X" to `calls_to` or "outline file Y" to `outline`.

## New Info Ratio

0.82. This iteration established the current routing topology and found three separate rule surfaces.

## Open Questions Surfaced

- Should the duplicated structural regexes be collapsed into `query-intent-classifier.ts`, or should `memory_context` own a higher-level planner around it?
- What confidence threshold should promote a structural signal from advisory nudge to actionable `code_graph_query` dispatch?
- How should a low-confidence operation or subject plan degrade: advisory-only, split-payload with warning, or semantic fallback?

## Convergence Signal

Continue. The implementation shape depends on corpus behavior, response contracts, and envelope coverage.

