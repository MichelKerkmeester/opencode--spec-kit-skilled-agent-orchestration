# Iteration 3: Graph Subsystem Governance, Error Handling, and Search Integration Audit

## Focus
Audit the graph subsystem's feature-flag governance, sunset coverage, error handling, implementation completeness, causal-edge pipeline, and runtime interaction with search.

## Findings

### 1. Graph feature flags do **not** fit the original 6-flag governance limit as a hard runtime reality

1. **The spec does set a 6-flag governance target.** The consolidated sprint plan says the feature-flag count must remain `<= 6` operative flags, and Sprint 6 explicitly repeats "`Active feature flag count <=6`" with a required sunset audit if exceeded. The handover also describes a 6-slot experiment budget.  
   [SOURCE: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/plan.md:77-82`; `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/007-sprint-6-indexing-and-graph/spec.md:163-189`; `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/handover.md:182`]

2. **Current code exposes more than 6 graph-adjacent runtime knobs.** The graph/search surface currently includes `SPECKIT_GRAPH_UNIFIED`, `SPECKIT_GRAPH_WALK_ROLLOUT`, `SPECKIT_GRAPH_SIGNALS`, `SPECKIT_COMMUNITY_DETECTION`, `SPECKIT_CAUSAL_BOOST`, `SPECKIT_DEGREE_BOOST`, `SPECKIT_AUTO_ENTITIES`, and `SPECKIT_ENTITY_LINKING`. If `SPECKIT_MEMORY_SUMMARIES` is counted as graph-adjacent enrichment in the same post-insert/search family, the surface is larger still.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:13-42`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:150-210`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:67-72`]

3. **Governance is process-only, not enforced by code.** The governance feature doc explicitly says these are operational targets rather than runtime-enforced caps. The repository also contains a `flag-ceiling.vitest.ts` test that validates behavior with **20** flags active simultaneously, which reinforces that the system tolerates many active flags rather than preventing them.  
   [SOURCE: `.opencode/skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md:16-22`; `.opencode/skill/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts:31-132`]

4. **The graph flag inventory is fragmented across multiple files, which weakens governance visibility.** `GRAPH_UNIFIED` lives in `graph-flags.ts`, the main graph family lives in `search-flags.ts`, and `CAUSAL_BOOST` is checked inside `causal-boost.ts`. That means any audit focused only on `search-flags.ts` will undercount the real graph-related control surface.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:13-42`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:150-210`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:67-72`]

**Answer:** No, not if the spec's 6-flag limit is interpreted literally at runtime. The current implementation relies on governance process and audits, not a hard technical ceiling.

### 2. No graph flags have concrete sunset dates in code

5. **I found no graph flag definitions with per-flag sunset metadata or dates.** The graph flag helpers expose enable/disable logic only; they do not carry `sunset`, `expiresAt`, `removeWhen`, or owner metadata.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts:13-42`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:150-210`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:67-72`]

6. **Sunset language exists only in governance/spec docs, not in runtime flag definitions.** Sprint 6 tasks/checklists require sunset reviews and a 90-day lifespan policy, but the actual graph flags have no embedded expiry dates. The only `expiresAt` field I found is in the architecture doc's allowlist schema, and it applies to wildcard allowlist entries rather than these graph flags.  
   [SOURCE: `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/007-sprint-6-indexing-and-graph/tasks.md:120-139`; `.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/007-sprint-6-indexing-and-graph/checklist.md:113`; `.opencode/skill/system-spec-kit/ARCHITECTURE.md:270-279`]

**Answer:** No concrete sunset dates are attached to graph flags in the codebase. Sunset is documented as governance policy, not encoded in the flag definitions.

### 3. Error handling is mostly fail-open; a few paths still swallow failures silently

7. **`graph-search-fn.ts` is defensive and non-fatal, but not uniformly observable.** The main causal-edge query path logs a warning and returns `[]` on failure. However, some lower-level helpers silently suppress failures and return defaults: `isFtsTableAvailable()` returns `false` on error with no log, and `computeMaxTypedDegree()` returns the default max degree with no log.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:56-64`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:73-125`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:344-366`]

8. **`graph-signals.ts` fails open and returns neutral scores.** Snapshotting, degree reads, momentum, depth computation, and the top-level `applyGraphSignals()` all catch exceptions, log warnings, and return neutral values (`0`, `{ snapshotted: 0 }`, or the original rows). This avoids search failures but can silently remove graph influence from ranking.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:67-107`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:115-166`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:484-536`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:563-618`]

9. **`community-detection.ts` is similarly fail-open.** Adjacency build, orchestration, assignment loading, persistence, membership lookup, and boost application all catch exceptions, warn, and degrade to empty maps or unchanged rows.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:59-85`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:322-369`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:422-479`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:490-559`]

10. **`causal-boost.ts` also degrades gracefully.** Traversal failures warn and suppress the boost, while `applyCausalBoost()` returns the original result set when disabled, unseeded, or unable to traverse.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:136-216`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:236-310`]

11. **`causal-edges.ts` mixes explicit warnings with a few silent best-effort catches.** Insert/update/delete operations generally warn and return `null`/`false`, with `insertEdge()` rethrowing only lock/busy errors. But cache invalidation and startup index creation deliberately swallow errors with no log, which can hide stale-cache conditions.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:108-119`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:125-138`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:144-232`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:457-563`]

12. **`causal-links-processor.ts` captures per-link failures instead of aborting the save.** Resolution failures and insert failures are accumulated into `errors`/`unresolved`, while duplicates are treated as non-fatal. This is good for resilience, but it also means an incomplete graph can be accepted as a successful save unless callers inspect the returned detail.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:99-168`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:53-67`]

13. **The search pipeline intentionally swallows graph-channel failures at orchestration level.** `hybrid-search.ts` catches graph and degree-channel errors and simply continues without those channels. Stage 2 does the same for causal boost, community boost, and graph signals. This preserves uptime, but ranking can silently degrade to a less graph-aware system under fault/lock conditions.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:646-708`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:598-697`]

**Answer:** Error handling is mostly graceful/fail-open rather than crashy. There are some silent catches and several places where graph functionality can disappear from ranking without turning the request into an error.

### 4. `graph-search-fn.ts` is a real implementation, not a placeholder

14. **`graph-search-fn.ts` is fully implemented.** It checks for `memory_fts`, performs FTS5-backed causal-edge retrieval with a LIKE fallback, converts edge endpoints to numeric memory IDs, deduplicates candidates, supports hierarchy-aware augmentation when `specFolder` is present, and exposes typed-degree scoring utilities plus cache invalidation.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:56-125`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:133-257`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:295-441`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:453-494`]

15. **It is also wired into startup and hybrid candidate generation.** `context-server.ts` constructs the graph search function when `GRAPH_UNIFIED` is enabled and passes it into `hybridSearch.init(...)`. `hybrid-search.ts` then invokes it as the graph candidate channel.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:882-902`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:646-666`]

16. **The implementation is real but narrower than the "unified" name suggests.** It is a causal-edge endpoint retrieval channel, not a full graph-walk search engine. Recursive graph propagation, community injection, and graph signals happen elsewhere (Stage 2), not inside `graph-search-fn.ts`.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts:73-125`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:598-697`]

**Answer:** Functional implementation, not a placeholder.

### 5. Causal edges are created and consumed through multiple live paths, but derived graph metadata is only partially operational

17. **Manual causal edges can be created through the `memory_causal_link` handler.** The handler validates relation types and delegates to `causalEdges.insertEdge(...)`.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:471-540`]

18. **Saved memory files can auto-create causal edges from parsed link declarations.** `memory-save` runs post-insert enrichment, which calls `processCausalLinks(...)`, and that resolves references then inserts edges via `causalEdges.insertEdge(...)`.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:35-67`; `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts:99-168`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:650-667`]

19. **Spec-document chains are also materialized as causal edges.** `memory-index` builds per-folder document maps and calls `createSpecDocumentChain(...)`, which inserts edges like `spec -> plan -> tasks -> implementation_summary` plus supporting edges.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:500-535`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:640-685`]

20. **Causal edges are consumed in several different search/ranking paths.**
   - Graph candidate generation via `graphSearchFn`
   - Degree-based reranking via `computeDegreeScores`
   - 2-hop causal neighbor amplification via `applyCausalBoost`
   - Momentum/depth/graph-walk scoring via `applyGraphSignals`
   - Explicit causal-chain traversal via `getCausalChain`
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:646-708`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:598-697`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:400-451`]

21. **The core causal-edge pipeline is complete enough to be live.** Creation, deletion, traversal, stats, and direct search consumption are all implemented and wired.

22. **But the "derived graph metadata" pipeline is incomplete in production.** `snapshotDegrees()` and `detectCommunities()/storeCommunityAssignments()` exist, but I found no production caller that periodically snapshots degrees or recomputes/persists community assignments. The references I found outside the module are tests only. Stage 2's `applyCommunityBoost()` reads `community_assignments`, and momentum reads `degree_snapshots`; without a production refresh path, community injection can remain empty/stale and momentum can remain zero.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:67-107`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:322-479`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:656-697`; grep across `mcp_server/**/*.ts` for `snapshotDegrees(` / `storeCommunityAssignments(` / `detectCommunities(` returned only module definitions plus tests]

**Answer:** The causal-edge creation/consumption path is mostly complete and live. The community-assignment and degree-snapshot maintenance path is not obviously completed in production wiring.

### 6. I did not find a classic DB race, but I did find stale-state and observability risks between graph operations and search

23. **The server does have basic concurrency hygiene.** `context-server.ts` forces SQLite WAL mode, and edge writes use transactions in the causal-edge layer. That reduces classic read/write contention risk and means searches should see consistent committed snapshots.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:879-888`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:188-218`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:490-517`]

24. **The larger risk is stale derived state rather than torn reads.** Search reads current `causal_edges`, but community injection depends on persisted `community_assignments`, and momentum depends on historical `degree_snapshots`. Because I did not find a production refresh job/hook for those tables, graph-derived ranking can lag behind the actual edge graph indefinitely.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts:422-559`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:67-107`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:656-697`]

25. **Cache invalidation is best-effort, not guaranteed.** `invalidateDegreeCache()` swallows failures, and mutation hooks clear graph-signal cache but not every graph-related cache/snapshot table. That is not a direct race condition, but it does create opportunities for stale graph influence after mutations.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:108-119`; `.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:67-79`]

26. **There is also a deletion/invalidation gap worth watching.** Some ancillary cleanup code deletes `causal_edges`, `degree_snapshots`, and `community_assignments` directly as best-effort SQL, which bypasses the dedicated causal-edge mutation helpers. If that path runs without an outer graph-cache invalidation step, cached graph-derived scores can become stale.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:38-78`]

27. **Under fault/lock conditions, the system will usually degrade silently rather than fail loudly.** That makes production races harder to notice: graph channels can disappear from ranking while the request still succeeds.  
   [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:646-708`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:598-697`]

**Answer:** I did not find an obvious transactional race that corrupts search results, but I did find meaningful stale-state risk between graph mutations and graph-derived search enrichments, plus several fail-open paths that can mask those problems.

## Bottom line

- **Governance:** The codebase no longer reflects a literal 6-flag graph/search ceiling; it relies on governance process, not runtime enforcement.
- **Sunsets:** No graph flags have encoded sunset dates.
- **Implementation:** `graph-search-fn.ts` is real and live.
- **Pipeline completeness:** Core causal-edge creation/consumption is live, but community assignment maintenance and degree snapshot maintenance appear only partially wired.
- **Reliability:** The subsystem prioritizes graceful degradation over strict failure surfacing, which keeps search available but makes graph regressions easier to miss.

## Sources Consulted

- `mcp_server/lib/search/graph-flags.ts`
- `mcp_server/lib/search/graph-search-fn.ts`
- `mcp_server/lib/graph/graph-signals.ts`
- `mcp_server/lib/graph/community-detection.ts`
- `mcp_server/lib/search/causal-boost.ts`
- `mcp_server/handlers/causal-links-processor.ts`
- `mcp_server/lib/storage/causal-edges.ts`
- Additional runtime wiring checked in:
  - `mcp_server/context-server.ts`
  - `mcp_server/lib/search/hybrid-search.ts`
  - `mcp_server/lib/search/pipeline/stage2-fusion.ts`
  - `mcp_server/handlers/save/post-insert.ts`
  - `mcp_server/handlers/memory-save.ts`
  - `mcp_server/handlers/memory-index.ts`
  - `mcp_server/handlers/mutation-hooks.ts`
  - `mcp_server/lib/search/vector-index-mutations.ts`
  - `mcp_server/tests/flag-ceiling.vitest.ts`
  - Relevant 022 spec and sprint docs
