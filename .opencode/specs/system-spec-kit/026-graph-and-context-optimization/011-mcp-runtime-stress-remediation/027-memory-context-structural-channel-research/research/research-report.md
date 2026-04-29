# Research Report - memory_context Structural Channel Routing

## 1. Executive Summary

The evidence supports adding `code_graph_query` as an actionable structural retrieval channel inside `memory_context`, but only behind a split-payload response contract and an explicit structural operation planner. `memory_context` already classifies structural/hybrid prompts and builds graph context metadata, but it still executes memory-search flavors instead of dispatching `code_graph_query` (`memory-context.ts:1408-1478`, `memory-context.ts:1639-1645`). The safest implementation path keeps existing document `results` stable and adds a separate structural payload plus explicit envelope routing.

No P0 blockers were found. The top risks are P1 contract risks: duplicated intent rules, lossy flattening, ambiguous envelope channel names, and missing operation/subject planning.

## 2. Research Questions Answered

### RQ1 - What signals reliably distinguish structural from semantic queries?

The strongest existing signal source is `query-intent-classifier.ts`, not the advisor regex set. It scores structural keywords and patterns such as calls, imports, extends, callers, dependencies, outline, impact, graph, hierarchy, and blast radius (`query-intent-classifier.ts:23-45`, `query-intent-classifier.ts:63-72`). It also scores semantic keywords and patterns such as similar, pattern, usage, find, explain, purpose, summarize, and decision (`query-intent-classifier.ts:47-82`). Its ratio-based logic emits `structural`, `semantic`, or `hybrid` with confidence (`query-intent-classifier.ts:123-185`).

The advisor is narrower. It detects relationship and outline prompts like "who calls", "callers of", "what imports", "outline", "dependency", and "what extends" (`context-server.ts:276-286`) and suppresses broader semantic/code-search prompts (`context-server.ts:288-294`). `memory_context` has another local structural regex set (`memory-context.ts:243-253`).

Against the 12-case v1.0.3 corpus, replaying the backend classifier with `expectedChannels.includes("code_graph_query")` as the positive label produced `tp=6`, `fp=0`, `fn=0`, `tn=6`. The corpus exposes 12 cases and expected channels (`corpus.ts:41-90`, `corpus.ts:93-198`; `v1-0-3-summary.json:1-5`). Replaying the advisor regexes against the same channel-family labels produced `tp=0`, `fp=0`, `fn=6`, `tn=6`, because the advisor does not target generic code-graph readiness/fallback prompts. That should not be overread as relationship-intent failure; it does prove the advisor is insufficient as the sole router.

### RQ2 - What is the right merged response shape?

Split-payload is the best fit. Flattening structural data into `results` is lossy because `formatSearchResults()` expects document rows with fields such as `id`, `spec_folder`, `file_path`, `title`, `similarity`, and chunk metadata (`search-results.ts:738-820`). It can also read content from file paths for included content (`search-results.ts:893-990`). `code_graph_query` returns operation-specific shapes: outline nodes, relationship edges, blast-radius groups, blocked payloads, and readiness/error payloads (`query.ts:787-828`, `query.ts:1079-1120`, `query.ts:1145-1497`).

A discriminated union in `results` is richer but would force existing consumers to branch. Current response-envelope and `memory_context` tests expect `data.count` and `data.results`, and `memory_context` currently routes through memory-search style responses (`mcp-response-envelope.vitest.ts:80-139`, `handler-memory-context.vitest.ts:38-53`, `handler-memory-context.vitest.ts:137-179`, `handler-memory-context.vitest.ts:229-245`). The formatter can safely merge extra data without overriding canonical `results` and `count` (`search-results.ts:1072-1106`), making split-payload the cleanest contract.

### RQ3 - Does SearchDecisionEnvelope already cover routing trace?

Mostly, but it needs explicit structural channel vocabulary. `SearchDecisionEnvelope` already carries `queryPlan`, trust tree, degraded readiness, timing, and calibration fields (`search-decision-envelope.ts:44-59`). `QueryPlan` has `selectedChannels`, `skippedChannels`, `routingReasons`, and `fallbackPolicy` (`query-plan.ts:38-47`). However, the current router channel vocabulary is `vector`, `fts`, `bm25`, `graph`, and `degree` (`query-router.ts:29-48`), where `graph` refers to the memory-search graph channel, not necessarily `code_graph_query`.

`memory_context` also currently emits two routing stories: `queryIntentRouting` says backend intent and routed backend (`memory-context.ts:1737-1752`), while the envelope uses `routeQuery(normalizedInput)` (`memory-context.ts:1761-1797`). Fusion should make those agree by adding `code_graph_query` to selected/skipped channels when structural dispatch is selected or skipped.

## 3. Top Workstreams

| Workstream | Priority | Evidence | Outcome |
|------------|----------|----------|---------|
| Centralize structural intent scoring | P1 | Three rule surfaces exist in advisor, memory_context, and classifier (`context-server.ts:276-294`, `memory-context.ts:243-253`, `query-intent-classifier.ts:23-82`) | One shared classifier source for routing |
| Add structural operation planner | P1 | Classifier lacks `operation`; code_graph_query requires `operation` and `subject` (`query-intent-classifier.ts:11-19`, `tool-schemas.ts:572-589`) | Route plan with operation, subject, confidence, fallback |
| Implement split-payload response | P1 | Formatter preserves canonical results and merges extraData (`search-results.ts:1072-1106`) | `data.results` remains documents; `data.structural` holds graph output |
| Align envelope trace | P1 | QueryPlan has trace fields, but router channel vocabulary is ambiguous (`query-plan.ts:38-47`, `query-router.ts:29-48`) | `selectedChannels` / `skippedChannels` include `code_graph_query` |
| Expand gold tests | P1 | Existing corpus under-tests direct relationship operation planning (`corpus.ts:41-198`) | New direct callers/imports/outline/hybrid cases |

## 4. Cross-System Insights

`memory_context` is already partway through the fusion: it classifies structural/hybrid prompts, builds graph context, attaches query-intent routing metadata, and builds a search decision envelope (`memory-context.ts:1408-1478`, `memory-context.ts:1737-1797`). The missing piece is not "detect structural"; it is "plan and execute a structural operation without eroding the document-search contract."

The formatter contract is the main reason split-payload wins. `formatSearchResults()` is optimized around memory documents (`search-results.ts:738-820`), while `code_graph_query` intentionally returns graph-native operation payloads (`query.ts:1145-1497`). The systems can share an MCP envelope, but they should not share the same result row schema.

The envelope is close to sufficient. The routing trace should use existing `selectedChannels`, `skippedChannels`, and `routingReasons` fields (`query-plan.ts:38-47`), with `code_graph_query` as an explicit channel name. Operation-level detail can live in `data.structural.route` unless implementation discovers downstream audit tooling that needs it inside the envelope.

## 5. Active Findings Registry

| Severity | Finding | Evidence | Disposition |
|----------|---------|----------|-------------|
| P1 | `memory_context` structural classification is not actionable routing | `memory-context.ts:1408-1478`, `memory-context.ts:1639-1645` | Fix in implementation phase |
| P1 | Structural rules are duplicated and likely to drift | `context-server.ts:276-294`, `memory-context.ts:243-253`, `query-intent-classifier.ts:23-82` | Centralize classifier usage |
| P1 | Advisor patterns are too narrow to be the sole router | `context-server.ts:276-294`; corpus labels in `corpus.ts:41-198` | Use advisor only as UX hint or fallback |
| P1 | Flattened response shape is lossy | `search-results.ts:738-820`, `query.ts:1145-1497` | Use split-payload |
| P1 | Envelope channels are ambiguous for `code_graph_query` | `query-plan.ts:38-47`, `query-router.ts:29-48` | Emit explicit `code_graph_query` channel |
| P1 | Operation/subject planner is missing | `query-intent-classifier.ts:11-19`, `tool-schemas.ts:572-589`, `memory-context.ts:1430-1441` | Add bounded planner with confidence and fallback |
| P2 | Split structural payload needs token-budget handling | `context-server.ts:1115-1160` | Add acceptance test |
| P2 | Cache semantics need per-channel freshness discipline | `tool-cache.ts:98-105`, `tool-cache.ts:310-318`, `tool-cache.ts:388-452` | Treat as implementation gate, not design blocker |

## 6. Planning Packet

| Recommendation | Leverage | Feasibility | Owning Packet | Recommended Phase | Dependencies | Acceptance Criteria Sketch |
|----------------|----------|-------------|---------------|-------------------|--------------|----------------------------|
| Implement split-payload structural route in `memory_context` | High | Medium | `028-memory-context-structural-routing-implementation` | Phase 1 | RQ2 contract decision | Structural prompts return `data.structural` while `data.results` remains document-shaped; existing memory_context tests still pass |
| Centralize structural classification through `query-intent-classifier.ts` | High | High | `028-memory-context-structural-routing-implementation` | Phase 1 | Rule inventory from this report | Advisor and memory_context no longer maintain divergent routing regexes, or local patterns are wrappers around shared classifier outputs |
| Add structural operation planner | High | Medium | `028-memory-context-structural-routing-implementation` | Phase 2 | Shared classifier | "who calls X" maps to relationship op, "imports of Y" maps to import op, "outline file" maps to outline; low-confidence plans fall back safely |
| Align SearchDecisionEnvelope trace | Medium | High | `028-memory-context-structural-routing-implementation` | Phase 2 | Split payload route | `selectedChannels` / `skippedChannels` / `routingReasons` include `code_graph_query`; `data.structural.route` records operation, subject, confidence, fallback |
| Expand gold corpus and handler tests | High | High | `028-memory-context-structural-routing-implementation` | Phase 3 | Operation planner | Add direct callers/imports/outline/hybrid tests and replay v1.0.3 corpus without regressions |

Top recommendation: implement split-payload routing first, because it unlocks structural retrieval without breaking the memory document result contract.

## 7. Convergence Audit

| Iteration | New Info Ratio | Signal |
|-----------|----------------|--------|
| 1 | 0.82 | continue |
| 2 | 0.63 | continue |
| 3 | 0.44 | approaching |
| 4 | 0.28 | approaching |
| 5 | 0.16 | converged |

Stop reason: maxIterationsReached. The early-stop rule did not trigger because no two consecutive iterations were below the 0.10 threshold.

## 8. Sources

- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:47-55`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:572-589`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:266-340`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:843-867`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1040-1082`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1115-1160`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:17-23`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:243-253`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:421-450`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:889-927`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:934-995`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1028-1073`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1122-1208`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1320-1348`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1408-1478`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1639-1797`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/query-intent-classifier.ts:11-19`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/query-intent-classifier.ts:23-82`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/query-intent-classifier.ts:123-185`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:27-37`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:426-456`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:787-828`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1079-1120`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/query.ts:1145-1497`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/query-result-adapter.ts:6-55`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/query-result-adapter.ts:209-247`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:738-820`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:893-990`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:1072-1106`
- `.opencode/skill/system-spec-kit/mcp_server/lib/query/query-plan.ts:38-47`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:29-48`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.ts:44-104`
- `.opencode/skill/system-spec-kit/mcp_server/lib/rag/trust-tree.ts:25-123`
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/corpus.ts:41-198`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-search-decision-gold-battery/measurements/v1-0-3-summary.json:1-203`
- `specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/021-search-decision-gold-battery/findings-v1-0-3.md:20-103`

## 9. Open Questions

- What exact structural payload key should become contract: `data.structural` or `data.structuralResults`?
- Should structural-only routing skip semantic `memory_search`, or should it always include semantic fallback hints?
- What confidence threshold should promote operation plans to execution?
- Should operation and subject planning live in the code graph module, memory_context handler, or a new shared router module?
- Should `code_graph_query` be added to the router channel vocabulary, or only to `memory_context`'s local QueryPlan emission?

