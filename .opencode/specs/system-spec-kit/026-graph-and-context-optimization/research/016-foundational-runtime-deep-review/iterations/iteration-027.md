# Iteration 27 — Domain 2: State Contract Honesty (7/10)

## Investigation Thread
I stayed on the requested state-honesty seams, but filtered out the source-local collapses already captured in Iterations 021-026. This pass traced two still-additive downstream consumers: (1) the graph-lifecycle branch inside `post-insert.ts`, where "skipped" graph refresh is still serialized as success and paired with a follow-up action that does not actually unblock the skipped branch, and (2) the structural-routing guidance surfaces that still steer callers into `code_graph_query` even though the handler can return success-shaped payloads after readiness preflight never completed.

## Findings

### Finding R27-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`
- **Lines:** `187-200`
- **Severity:** P1
- **Description:** The graph-lifecycle lane now has a deeper state-honesty failure than the already-known boolean collapse: `post-insert.ts` records `graphLifecycle = true` whenever `onIndex(...)` returns, even when `onIndex(...)` explicitly reports `skipped: true`, and the advertised `runEnrichmentBackfill` follow-up does not enable the flags that cause those skip branches. The result is a save surface that can say graph enrichment "ran" while the only suggested recovery action still leaves graph lifecycle disabled.
- **Evidence:** `post-insert.ts:187-200` sets `enrichmentStatus.graphLifecycle = true` after every successful `onIndex(...)` call and only logs when `indexResult.skipped` is false. But `graph-lifecycle.ts:495-513` returns `{ skipped: true }` when graph refresh is off, entity linking is disabled, or content is empty, and the direct suite asserts those no-work branches in `tests/graph-lifecycle.vitest.ts:652-668`. The follow-up API only flips `SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` before rerunning the index scan (`api/indexing.ts:111-129`), as confirmed by `tests/follow-up-api.vitest.ts:102-130`; it does not enable `SPECKIT_GRAPH_REFRESH_MODE` or `SPECKIT_ENTITY_LINKING`, which are the gates that drive `onIndex(...)` skipping. Meanwhile the save-path harness still normalizes post-insert to all-green `graphLifecycle: true` / `executionStatus: { status: 'ran' }` stubs (`tests/handler-memory-save.vitest.ts:546-557`, `2287-2307`).
- **Downstream Impact:** Operators and agents can follow the documented enrichment-recovery path and still never get graph refresh, while the save response remains success-shaped and warning-free. That breaks the action boundary between "graph freshness pending but recoverable" and "graph lifecycle is administratively disabled or skipped for this document."

### Finding R27-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- **Lines:** `801-816`
- **Severity:** P1
- **Description:** The system's structural-routing guidance still treats `code_graph_query` as the authoritative next step whenever structural context looks ready or stale, but the direct query handler still has the already-documented honesty gap where readiness preflight failure is collapsed into a normal `status: "ok"` payload. That means the runtime's own routing layer can steer agents into a tool whose failure branch is observationally similar to an actually empty graph.
- **Evidence:** `context-server.ts:801-816` tells non-hook runtimes that structural questions should use `code_graph_query`, and the same routing posture is locked into higher-level tests: `tests/structural-contract.vitest.ts:55-65` asserts the ready-state recommendation contains `code_graph_query`, while `tests/graph-first-routing-nudge.vitest.ts:145-155` asserts structural queries are nudged toward `preferredTool: 'code_graph_query'`. But `handlers/code-graph/query.ts:319-334` still seeds readiness as `freshness: 'empty'` / `reason: 'readiness check not run'`, swallows `ensureCodeGraphReady(...)` exceptions, and then returns normal success payloads through `handlers/code-graph/query.ts:340-364` and `551-564`. The direct handler coverage remains happy-path only: `tests/code-graph-query-handler.vitest.ts:12-18` hoists a fresh readiness result for the suite, and `tests/code-graph-query-handler.vitest.ts:66-145` only exercises successful query emission.
- **Downstream Impact:** Callers following the runtime's own recovery and routing hints can be pushed toward `code_graph_query` when the structural backend is not actually ready, then receive a success-shaped empty/unknown payload instead of a clear repair-first signal. That weakens the promised recovery order of "session_bootstrap -> session_resume -> code_graph_scan" by letting the direct query surface masquerade as a valid read even when readiness never completed.

## Novel Insights
- The remaining Domain 2 risk is increasingly a **control-plane honesty** problem, not just a producer-side one. The runtime now has multiple places where advisory or recovery surfaces point callers toward actions that do not actually align with the hidden state machine beneath them.
- Re-reading the five requested seams showed that the raw collapses themselves are mostly already documented. The additive value in this pass was proving where those collapses are still being amplified by surrounding guidance: the save path advertises a recovery action that cannot unblock one skipped lane, and the runtime's structural-routing surfaces still recommend a query tool whose readiness-failure branch is success-shaped.

## Next Investigation Angle
Trace the next consumer hop for both seams: which callers, if any, inspect per-step enrichment outcomes instead of `postInsertEnrichment.status`, and which runtime/bootstrap surfaces gate `code_graph_query` on canonical graph readiness rather than on higher-level advisory status alone.
