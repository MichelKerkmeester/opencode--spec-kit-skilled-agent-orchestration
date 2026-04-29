# Iteration 004 - SearchDecisionEnvelope Coverage Map

## Focus

Map the structural fusion paths onto `SearchDecisionEnvelope`, `QueryPlan`, trust tree, degraded readiness, and routing trace fields. This follows the strategy's iteration 4 focus for RQ3.

## Sources Read

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.ts:44-59`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.ts:61-104`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.ts:152-160`
- `.opencode/skill/system-spec-kit/mcp_server/lib/query/query-plan.ts:38-47`
- `.opencode/skill/system-spec-kit/mcp_server/lib/query/query-plan.ts:90-109`
- `.opencode/skill/system-spec-kit/mcp_server/lib/query/query-plan.ts:153-187`
- `.opencode/skill/system-spec-kit/mcp_server/lib/query/query-plan.ts:229-258`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:29-48`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:69-79`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:145-203`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1320-1348`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1737-1797`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1161-1223`
- `.opencode/skill/system-spec-kit/mcp_server/tests/query-plan-emission.vitest.ts:23-34`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w8-search-decision-envelope.vitest.ts:13-89`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts:169-176`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts:230-310`
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:29-40`
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:152-156`
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:221-240`
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:25-49`
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:65-123`
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:190-203`

## Findings

### P1 - The envelope has the right trace primitives, but current channel names are ambiguous for code graph routing

`SearchDecisionEnvelope` carries `queryPlan`, trust tree, degraded readiness, timing, and calibration fields (`search-decision-envelope.ts:44-59`). `QueryPlan` already has `selectedChannels`, `skippedChannels`, `routingReasons`, and `fallbackPolicy` (`query-plan.ts:38-47`). However, the current router's `ChannelName` union is `vector`, `fts`, `bm25`, `graph`, and `degree` (`query-router.ts:29-48`). In this context `graph` belongs to memory-search graph/degree routing, not necessarily `code_graph_query`. Structural fusion needs an explicit `code_graph_query` selected channel or an equivalent unambiguous backend-route field.

### P1 - `memory_context` currently emits two routing stories that can diverge

`memory_context` attaches backend query intent metadata with `routedBackend` and `classificationKind: "backend-routing"` (`memory-context.ts:1737-1752`). It then builds `contextQueryPlan` via `routeQuery(normalizedInput)` and uses that in `SearchDecisionEnvelope` (`memory-context.ts:1761-1797`). Because `routeQuery()` emits search-router channels (`query-router.ts:145-203`), the envelope can report vector/fts/bm25/graph/degree while `queryIntentRouting` says the backend intent is structural. That is a contract erosion risk unless the implementation merges the structural backend route into the envelope query plan.

### P1 - Trust tree and degraded readiness cover code-graph readiness, not operation-level routing

The trust tree input has a `codeGraph` block with canonical readiness and trust state (`trust-tree.ts:25-49`), and the trust tree maps that into response trust signals (`trust-tree.ts:65-123`, `trust-tree.ts:190-203`). Shared payload types also model structural trust and graph edge enrichment (`shared-payload.ts:152-156`, `shared-payload.ts:221-240`). These fields explain whether the graph can be trusted. They do not record which structural operation, subject, confidence, or fallback decision was selected.

### P2 - Existing memory-search envelope tests are reusable for structural fusion

The memory-search tests already assert camel/snake envelope parity and populated envelope fields (`handler-memory-search-live-envelope.vitest.ts:169-176`, `handler-memory-search-live-envelope.vitest.ts:230-310`). The generic envelope tests cover trust tree, rerank, shadow, calibration, and degraded readiness composition (`w8-search-decision-envelope.vitest.ts:13-89`). Structural routing can add tests by reusing this pattern and asserting `selectedChannels` includes `code_graph_query` when the split structural payload is present.

## New Info Ratio

0.28. The iteration confirmed that the envelope mostly covers traceability, but the route source and channel vocabulary need tightening.

## Open Questions Surfaced

- Should `code_graph_query` be added to the search router channel vocabulary, or should `memory_context` build a local QueryPlan extension with string channels?
- Should operation/subject/confidence live only in response `data.structural.route`, or also in the envelope?
- Should a structural fallback be recorded as `skippedChannels: ["code_graph_query"]` with degraded readiness, or as a selected channel with `status: "blocked"`?

## Convergence Signal

Approaching. RQ3 is substantially answered; final iteration should synthesize a planning packet.

