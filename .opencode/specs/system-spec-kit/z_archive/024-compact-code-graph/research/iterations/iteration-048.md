# Iteration 048: Query-Intent Router for Code Queries

## Focus

Determine how a query-intent router should distinguish structural code questions from semantic code questions, decide when to route first to CocoIndex, a future code graph, or memory, and define an MVP that fits the current Spec Kit Memory search pipeline without overloading the existing causal-memory `graph` channel.

## Findings

1. The existing `query-router.ts` is a complexity router, not a code-intent router.

   Today, `query-router.ts` outputs only three categories: `simple`, `moderate`, and `complex`. It delegates classification to `classifyQueryComplexity()`, which uses term count, exact trigger-phrase match, and stop-word ratio. The router then maps those tiers to channel subsets: `simple -> [vector, fts]`, `moderate -> [vector, fts, bm25]`, `complex -> [vector, fts, bm25, graph, degree]`. The only intent-aware behavior inside `query-router.ts` is a BM25-preservation escape hatch for `find_spec`, `find_decision`, or artifact classes like `spec`, `plan`, `tasks`, `checklist`, `decision-record`, `implementation-summary`, and `research`. In other words, the current router decides "how much retrieval effort" to spend, not "which retrieval system understands this question best." [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:23-47`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:68-72`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:113-121`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:138-163`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:8-19`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:165-196`]

2. We need a second classifier layer for code-query intent, and its categories should align to the three context systems rather than to generic task verbs.

   The existing intent classifier's 7 categories (`add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`) are useful for weighting memory retrieval, but they are too coarse for deciding between CocoIndex and a future code graph. For code queries, the minimum useful intent set is:

   - `structural_navigation`: callers, callees, imports, exports, references, hierarchy, file outline, entry points
   - `semantic_discovery`: concept search, "where do we do X", similar implementations, pattern discovery
   - `impact_analysis`: "what breaks if", "who depends on this", refactor blast radius, test/config adjacency
   - `execution_path`: request flow, middleware chain, startup wiring, runtime path through symbols/files
   - `decision_context`: why it exists, prior constraints, ADR/spec linkage, previous incidents
   - `mixed_code_lookup`: queries that contain both conceptual language and an implied structural target
   - `session_followup`: deictic follow-ups such as "what calls that?", "where is it tested?", "does this affect auth too?"

   These categories map directly to the three systems:

   - code graph answers topology
   - CocoIndex answers resemblance and concept similarity
   - memory answers rationale, prior work, and session continuity

   This also matches prior packet research: structural context, semantic context, and session context are separate layers and should not be collapsed into one blob. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7-21`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:42-128`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:42-57`]

3. Intent detection should start as a deterministic hybrid: high-precision patterns first, scored heuristics second, session-state resolution third; not LLM-first.

   The repo already has a good precedent for this style. `intent-classifier.ts` combines keywords, regex patterns, and a deterministic centroid scorer, then returns ranked intents. That architecture is a better starting point than an LLM classifier because it is cheap, deterministic, explainable, and easy to tune with evals. For the code-query router, the detection stack should be:

   - Stage A: high-precision structural patterns
     Examples: `what calls`, `who calls`, `where is defined`, `references to`, `imports`, `extends`, `implements`, `entry point`, `call chain`, `dependency path`
   - Stage B: semantic-discovery patterns
     Examples: `find code that`, `similar implementation`, `where do we`, `pattern for`, `example of`
   - Stage C: entity-shape cues
     Examples: file paths, `camelCase`, `PascalCase`, `foo()`, stack traces, `src/...`, `line 123`
   - Stage D: session carry-over
     Resolve pronouns like `that`, `it`, `this flow`, `same module` using the prior turn's resolved anchors
   - Stage E: ranked-intent output
     Return top 2 intents with confidence and gap, not just one label

   Recommendation: do not use an LLM in the request path for v1 routing. If we want smarter routing later, run an LLM or learned classifier in shadow mode offline, compare against heuristic labels, and only graduate it after eval evidence. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:130-195`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:404-485`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:614-622`]

4. The routing table should choose a primary system and an augmentation policy, not just a winner.

   Recommended routing table:

   | Intent category | Primary | Secondary | Tertiary | Default policy |
   | --- | --- | --- | --- | --- |
   | `structural_navigation` | Code Graph | CocoIndex | Memory | Graph-first, semantic expansion only if anchor weak |
   | `semantic_discovery` | CocoIndex | Code Graph | Memory | Semantic-first, then graph-expand top anchors |
   | `impact_analysis` | Code Graph | Memory | CocoIndex | Graph-first neighborhood + memory constraints |
   | `execution_path` | Code Graph | CocoIndex | Memory | Graph-first if concrete anchor exists; otherwise semantic-first |
   | `decision_context` | Memory | CocoIndex | Code Graph | Memory-first, graph only after code anchor identified |
   | `mixed_code_lookup` | CocoIndex | Code Graph | Memory | Two-stage semantic-to-graph cascade |
   | `session_followup` | Prior route inherits | One additional system if needed | Memory | Continue prior anchor unless confidence drops |

   Important implementation detail: the existing 5-channel hybrid search remains the retrieval engine only for the memory system. A future code graph should not be squeezed into today's `graph` lane, because the current `graph` and `degree` lanes are explicitly causal-memory features, not code-structure features. Prior packet work already recommended that if code graph ever becomes a fused search lane, it should be a sixth lane named `code_graph`, not a reinterpretation of `graph`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:245-257`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/README.md:204-216`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:4-6`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:18-24`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:35-58`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:50-58`]

5. Routing should be selective-soft, not always-hard and not always-query-everything.

   A hard router is too brittle for real developer queries, because many code questions mix structural and semantic signals. But an always-query-all router wastes latency and token budget, and it blurs explainability. The best compromise is selective-soft routing:

   - hard-single when confidence is high and cue family is explicit
     Examples: `what calls handleMemoryContext`, `where is SessionStart defined`, `why did we choose PreCompact`
   - soft-two-stage when top intent is mixed or confidence gap is narrow
     Example: run CocoIndex first, extract 1-3 anchors, then run code graph on those anchors
   - soft-three-system only for research/debug cases with unresolved ambiguity or when the first two systems disagree materially

   Suggested thresholds:

   - hard-single if top intent confidence >= 0.80 and top1-top2 gap >= 0.20
   - soft-two-stage if confidence is 0.55-0.79 or gap < 0.20
   - memory augmentation when decision/history terms appear, or when the conversation is clearly continuing prior packet work

   This matches the repo's existing bias toward deterministic routing with safe fallbacks and ranked intents, while avoiding "blast all channels" as the default. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:126-199`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:379-485`]

6. Cody and Cursor both behave like hybrid context routers, but mostly through context-system composition and explicit anchors rather than a documented public "intent router."

   Cody's public docs say a new chat starts with default context for the opened file and current repository, and when repository plus files are `@`-mentioned, Cody searches the repository while prioritizing the mentioned files. Users can also `@`-mention repositories, files, line ranges, and symbols. That implies Cody favors exact explicit anchors first, then broadens into repository search. Cursor's docs describe separate context systems for codebase indexing, `@Files & Folders`, `@Recent Changes`, rules, and memories. That implies a split between semantic indexing, explicit file/folder targeting, session-recency context, and durable instruction/memory context.

   Inference from the sources: neither product publicly documents a visible "structural vs semantic" classifier, but both expose the same architectural pattern we need:

   - explicit anchors route deterministically
   - semantic indexing handles open-ended conceptual search
   - recent changes and durable rules/memories influence follow-up behavior

   That is strong support for our three-system model. The gap is that we want to make the routing explicit, inspectable, and local to our MCP/server rather than mostly hidden behind product UX. [SOURCE: https://sourcegraph.com/docs/cody/capabilities/chat] [SOURCE: https://sourcegraph.com/docs/cody/core-concepts/context] [SOURCE: https://docs.cursor.com/id/chat/codebase] [SOURCE: https://docs.cursor.com/ko/context/%40-symbols/%40-files-and-folders] [SOURCE: https://docs.cursor.com/pt-BR/context/%40-symbols/%40-recent-changes] [SOURCE: https://docs.cursor.com/ko/context/rules]

7. The new router should sit above the existing 5-channel hybrid search, not inside it at first.

   Today, `hybrid-search.ts` uses `routeQuery()` only to pick which memory-search channels are active. It then gathers channel candidates, fuses them with weighted RRF, and adjusts weights by the existing 7 intent classes. The `graph` channel currently calls `graphSearchFn(query, ...)`, which is backed by `causal_edges`; the `degree` lane is a typed-degree reranker over those same memory nodes. So the current 5-channel system is a memory-retrieval subsystem, not a general cross-system router.

   Recommended layering:

   - Layer 1: query-intent router
     Output: primary system, secondary system, route confidence, anchor extraction plan
   - Layer 2a: CocoIndex request
   - Layer 2b: code graph request
   - Layer 2c: memory request via existing `memory_context` / `memory_search`
   - Layer 3: result merger / explanation formatter

   For MVP, memory remains internally powered by `vector + fts5 + bm25 + graph + degree`. Code graph stays external to that fusion stack. Only after we have a normalized code-artifact result model should we consider adding a `code_graph` lane to RRF. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:674-705`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:999-1043`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1054-1168`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1211-1243`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:88-145`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:50-58`]

8. Ambiguous queries should route by anchor acquisition: semantic first when the target is fuzzy, structural first when the target is explicit.

   Example: `find the auth middleware that validates tokens`

   This is ambiguous because:

   - `find` plus behavior description looks semantic
   - `middleware` implies a structural role in the runtime chain
   - `validates tokens` may not match exact symbol names

   The best behavior is:

   1. classify as `mixed_code_lookup`
   2. run CocoIndex first to find likely candidate files/symbols
   3. extract anchors such as `authMiddleware`, `verifyJwt`, `middleware/auth.ts`
   4. run code graph on those anchors for callers, import path, placement in request flow
   5. optionally query memory if packet/session context suggests prior auth decisions or known incidents

   By contrast, `what calls verifyJwtToken` should go graph-first because the target symbol is already explicit. So ambiguity should not mean "query everything"; it should mean "acquire anchor, then switch systems." The existing ranked-intent pattern in `intent-classifier.ts` is useful here because it already returns more than one plausible intent. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:379-485`] [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:28-40`]

9. Follow-up queries should inherit route state, anchors, and unresolved ambiguity from the previous turn.

   A code-query router that ignores follow-up context will misclassify short messages like `what calls that?`, `where is it tested?`, or `does this affect startup too?` The router should keep a lightweight session object:

   - `lastIntent`
   - `lastRoutePlan`
   - `lastPrimarySystem`
   - `resolvedAnchors` such as file paths, symbol IDs, graph node IDs
   - `lastSpecFolder`
   - `ambiguityState`

   Follow-up rules:

   - if the query contains pronouns or ellipsis, boost `session_followup`
   - if the prior turn resolved a concrete symbol/file anchor, reuse it
   - if the prior route was semantic-first and yielded a strong anchor, the follow-up should usually flip to graph-first
   - if the prior route was memory-first and the user pivots to implementation impact, carry forward the memory constraint but switch primary to graph or CocoIndex

   This aligns with prior packet research that session context should remain a separate layer and with public Cursor docs that emphasize memories, rules, and recent changes as persistent contextual signals. [SOURCE: `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:42-57`] [SOURCE: https://docs.cursor.com/pt-BR/context/%40-symbols/%40-recent-changes] [SOURCE: https://docs.cursor.com/ko/context/rules]

10. The minimum viable router is a heuristic cascade, and that is enough to start.

   MVP recommendation:

   - keep the current complexity router for memory-internal channel selection
   - add a new `codeQueryIntentRouter()` above it
   - support only 5 intent outputs in v1:
     - `structural_navigation`
     - `semantic_discovery`
     - `impact_analysis`
     - `decision_context`
     - `mixed_code_lookup`
   - use:
     - regex/pattern rules
     - lexical cue scoring
     - entity-shape detection
     - previous-turn anchor inheritance
   - output:
     - top intent
     - secondary intent
     - confidence
     - route plan
     - extracted anchors

   Suggested v1 policy:

   - `structural_navigation` -> code graph only
   - `semantic_discovery` -> CocoIndex only
   - `impact_analysis` -> code graph then memory
   - `decision_context` -> memory then CocoIndex
   - `mixed_code_lookup` -> CocoIndex then code graph

   Then add telemetry before adding sophistication:

   - predicted intent
   - systems queried
   - whether a secondary query was needed
   - whether anchors were found
   - whether the user reformulated the query

   That gives us enough signal to tune the heuristic thresholds or later train a smarter classifier. Inference from the sources: the highest-value graduation path is not "replace heuristics with an LLM." It is "keep heuristics as the fast path, then use eval evidence to decide whether a learned reranker or shadow classifier is worth the added complexity." [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:404-485`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:138-163`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:999-1043`]

## Evidence

- Existing router and classifier internals:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:23-163`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts:8-199`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:7-22`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:42-205`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:404-485`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:10-39`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:52-125`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts:156-301`

- Existing hybrid search and graph behavior:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:674-705`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:999-1265`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:4-58`
  - `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:88-145`
  - `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:245-257`
  - `.opencode/skill/system-spec-kit/mcp_server/README.md:204-276`

- Relevant prior packet research:
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-044.md:50-58`
  - `.opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-045.md:28-57`

- External product and standards references:
  - https://sourcegraph.com/docs/cody/capabilities/chat
  - https://sourcegraph.com/docs/cody/core-concepts/context
  - https://docs.cursor.com/id/chat/codebase
  - https://docs.cursor.com/ko/context/%40-symbols/%40-files-and-folders
  - https://docs.cursor.com/pt-BR/context/%40-symbols/%40-recent-changes
  - https://docs.cursor.com/ko/context/rules
  - https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/
  - https://microsoft.github.io/language-server-protocol/specifications/lsif/0.5.0/specification/

## New Information Ratio (0.0-1.0)

0.68

## Novelty Justification

Earlier packet work established that structural context, semantic context, and session context should stay distinct, and that a future code graph should not overload the current causal-memory `graph` lane. This iteration adds the missing operational layer: a concrete intent taxonomy for code queries, a primary/secondary routing table across the three systems, ambiguity handling via anchor acquisition, follow-up query inheritance rules, and an MVP rollout path that can ship as heuristics before any learned classifier work.

## Recommendations for Our Implementation

1. Keep the current `query-router.ts` exactly where it is conceptually: memory-internal channel routing by complexity. Do not repurpose it to mean structural-vs-semantic routing.

2. Add a new top-level router module for code queries, for example `code-query-intent-router.ts`, whose job is to choose between `cocoindex`, `code_graph`, and `memory`, then optionally call the existing memory router only if memory is selected.

3. Implement v1 with deterministic heuristics only:
   - regex cue bank
   - lexical scoring
   - symbol/path/stack-trace anchor detection
   - previous-turn anchor inheritance
   - ranked top-2 intents

4. Start with 5 intents, not 7:
   - `structural_navigation`
   - `semantic_discovery`
   - `impact_analysis`
   - `decision_context`
   - `mixed_code_lookup`

5. Use selective-soft routing:
   - hard-single for explicit structural or decision queries
   - semantic-to-graph cascade for mixed queries
   - graph-plus-memory for impact analysis

6. Treat today's `graph` and `degree` lanes as memory-only. If we later fuse code graph into hybrid retrieval, add a new sixth lane named `code_graph` and evaluate it separately.

7. Add router telemetry before adding sophistication:
   - predicted intent
   - confidence and gap
   - systems queried
   - anchors extracted
   - secondary-query escalation
   - final answer path

8. Evaluate the router with query sets grouped by intent family, especially:
   - pure structural
   - pure semantic
   - mixed anchor-acquisition
   - follow-up pronoun queries
   - decision-plus-code impact queries
