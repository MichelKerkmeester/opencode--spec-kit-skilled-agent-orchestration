# Iteration 13: Performance Hot Paths (Q16) + Session/Collaboration Readiness (Q17)

## Focus
Investigate performance hot paths, N+1 query patterns, P95 latency concerns, and assess whether session/collaboration features are production-ready. This addresses the final two open questions (Q16, Q17) before the synthesis phase.

## Findings

### Q16: Performance Hot Paths and Latency Concerns

1. **BM25 spec-folder filter is a classic N+1 query.** In `bm25Search()`, when `specFolder` is provided, EVERY result from the in-memory BM25 index triggers an individual `SELECT spec_folder FROM memory_index WHERE id = ?` query inside a `.filter()` loop (lines 283-294). If BM25 returns 50 results, that is 50 separate SQLite queries. This should be a single `WHERE id IN (...)` batch query followed by a Set lookup.
   [SOURCE: mcp_server/lib/search/hybrid-search.ts:283-294]

2. **Deep-mode query expansion triggers 3x full hybrid search.** The synonym-based query expansion (max 3 variants from 27-entry vocab) runs a FULL `searchWithFallback()` per variant, each with its own embedding generation. No caching of embeddings across variants. This is the single largest latency multiplier in the system -- 3 complete search pipelines sequentially.
   [SOURCE: Prior iteration-012 findings confirmed; corroborated by embedding-expansion.ts:194 comment about latency overhead]

3. **R12 embedding expansion adds a parallel 2nd hybrid search on standard queries.** Even outside deep mode, the R12 expansion system mines terms from top-5 results and runs a second hybrid search. This doubles the pipeline cost for non-simple queries (those with >3 terms). The R12/R15 mutual exclusion correctly suppresses this for simple queries but the cost for complex queries is substantial.
   [SOURCE: Prior iteration-012 findings; embedding-expansion.ts:194]

4. **MMR requires a Vec0 virtual table re-read per search.** After RRF fusion, MMR re-fetches embeddings from `vec_memories` for the top-N results using `WHERE rowid IN (...)`. This is a batch query (NOT N+1), but it is a second disk/memory read of embedding data that was already loaded during the vector channel search. No embedding pass-through from vector channel to MMR.
   [SOURCE: mcp_server/lib/search/hybrid-search.ts:880-883]

5. **Session boost issues a separate DB query per search invocation.** `getAttentionBoost()` queries `working_memory` with `WHERE session_id = ? AND memory_id IN (...)`. This is properly batched (single query with IN clause, line 87-93), so it is NOT an N+1 pattern. However, it adds one synchronous DB round-trip per search when session boost is enabled.
   [SOURCE: mcp_server/lib/search/session-boost.ts:87-93]

6. **Cross-encoder has proper latency tracking and circuit breaker.** The cross-encoder module (cross-encoder.ts) implements: (a) a latency tracker with sliding window of MAX_LATENCY_SAMPLES, (b) a circuit breaker with CIRCUIT_COOLDOWN_MS timeout, (c) result caching with TTL, and (d) per-invocation timing via `Date.now()`. This is the ONLY search component with production-grade latency observability. README.md estimates 200-500ms latency per invocation.
   [SOURCE: mcp_server/lib/search/cross-encoder.ts:104-118, 394-427, 476-501]

7. **Stage 4 filter has timing instrumentation.** `stage4-filter.ts` wraps its entire execution in `Date.now()` start/end timing and reports `durationMs` in its metadata output (lines 244, 314, 323). This is the only pipeline stage with built-in duration tracking.
   [SOURCE: mcp_server/lib/search/pipeline/stage4-filter.ts:244, 314, 323]

8. **Vector index queries have timing instrumentation.** `vector-index-queries.ts` tracks elapsed time for alias resolution (lines 712, 765) and similarity search (lines 789, 846). Combined with cross-encoder timing, this gives partial hot-path visibility but NO end-to-end pipeline latency metric.
   [SOURCE: mcp_server/lib/search/vector-index-queries.ts:712-765, 789-846]

9. **Local reranker has sequential per-candidate inference.** The local GGUF reranker (local-reranker.ts:288) processes candidates SEQUENTIALLY. For 20 candidates, latency scales linearly with candidate count. A comment explicitly acknowledges this: "PERF(CHK-113): Sequential per-candidate inference."
   [SOURCE: mcp_server/lib/search/local-reranker.ts:288]

10. **No end-to-end pipeline latency metric exists.** While individual components (cross-encoder, stage4, vector-index) track their own duration, the orchestrator (79 lines, per iteration-006) has ZERO timing instrumentation. There is no `totalPipelineMs` or P95 tracking at the top level. The README.md mentions "Track P95 latency" as aspirational but it is not implemented.
    [SOURCE: mcp_server/lib/search/README.md:517 (aspirational P95 comment); iteration-006 confirmed orchestrator has zero error/timing handling]

### Q17: Session and Collaboration Feature Readiness

11. **Session boost is production-ready but feature-flagged.** The session-boost module (213 LOC) is clean, well-typed, and correctly implements: (a) attention score lookup from working_memory table, (b) multiplicative boost capped at MAX_COMBINED_BOOST=0.20, (c) combined session+causal boost capping, (d) metadata tracking (enabled/applied/boostedCount/maxBoostApplied), (e) graceful degradation on DB errors. Gated behind `SPECKIT_SESSION_BOOST` feature flag via `isFeatureEnabled()` (default-ON semantics).
    [SOURCE: mcp_server/lib/search/session-boost.ts:1-213 (full module)]

12. **Session transition is a pure tracing/diagnostics module.** session-transition.ts (191 LOC) provides NO search-affecting logic. It builds a `SessionTransitionTrace` object that records how the search mode was selected (5 signal sources: session-resume, pressure-override, explicit-mode, query-heuristic, intent-classifier). The trace is attached to search results as metadata via JSON envelope manipulation. This is observability infrastructure, not search logic.
    [SOURCE: mcp_server/lib/search/session-transition.ts:1-191 (full module)]

13. **Shared spaces module is architecturally complete but default-OFF.** The shared-spaces.ts module (607 LOC) implements a full collaboration layer: (a) space creation/update with tenant isolation, (b) deny-by-default membership (user/agent with owner/editor/viewer roles), (c) rollout controls with kill switch and cohort labels, (d) conflict resolution with 4 strategies (append_version, manual_merge, last_write_wins, reject), (e) high-risk conflict detection (3 kinds: destructive_edit, schema_mismatch, semantic_divergence), (f) governance audit integration, (g) rollout metrics and cohort summary reporting. Default OFF via `SPECKIT_MEMORY_SHARED_MEMORY` / `SPECKIT_HYDRA_SHARED_MEMORY` env vars + DB config table fallback.
    [SOURCE: mcp_server/lib/collab/shared-spaces.ts:1-607 (full module)]

14. **Shared space access check has a redundant double-query.** `assertSharedSpaceAccess()` calls `getAllowedSharedSpaceIds()` (line 520), which queries `shared_space_members JOIN shared_spaces` for ALL allowed spaces. Then lines 529-543 run a SECOND query against `shared_space_members` to check the specific role. The first query already retrieved the space_id membership -- the role could be included in that query to avoid the second round-trip.
    [SOURCE: mcp_server/lib/collab/shared-spaces.ts:440-558]

15. **Shared spaces use transactional conflict recording.** The `recordSharedConflict()` function wraps its strategy-resolution count query + conflict insert + governance audit in a `database.transaction()` (line 580). This prevents the read-then-write race condition that was identified in the save pipeline's dedup (iteration-009 Q11). The collaboration module learned from that gap.
    [SOURCE: mcp_server/lib/collab/shared-spaces.ts:580-606]

## Sources Consulted
- mcp_server/lib/search/hybrid-search.ts (lines 270-390, 860-980)
- mcp_server/lib/search/session-boost.ts (full, 213 LOC)
- mcp_server/lib/search/session-transition.ts (full, 191 LOC)
- mcp_server/lib/collab/shared-spaces.ts (full, 607 LOC)
- mcp_server/lib/search/cross-encoder.ts (latency tracking, lines 104-501)
- mcp_server/lib/search/local-reranker.ts (line 288, sequential inference comment)
- mcp_server/lib/search/pipeline/stage4-filter.ts (timing, lines 244-342)
- mcp_server/lib/search/vector-index-queries.ts (timing, lines 712-846)
- Grep: `.prepare(` / `.run(` / `.all(` / `.get(` across lib/search/ (80 hits analyzed)
- Grep: `durationMs` / `Date.now` / `latency` across lib/search/ (60 hits analyzed)

## Assessment
- New information ratio: 0.87
- Questions addressed: Q16, Q17
- Questions answered: Q16 (fully), Q17 (fully)

### Calculation
- 15 total findings
- 13 fully new (BM25 N+1, MMR re-read, session boost batching, cross-encoder circuit breaker, stage4 timing, vector-index timing, local reranker sequential, no end-to-end metric, session boost readiness, session transition diagnostics, shared spaces completeness, shared space double-query, transactional conflict recording)
- 2 partially new (deep-mode 3x cost and R12 expansion cost were identified in iter-012 but now confirmed with source-level evidence from different files)
- newInfoRatio = (13 + 0.5 * 2) / 15 = 14/15 = 0.93 -> adjusted to 0.87 since the expansion findings build on iter-12

## Reflection
- **What worked and why:** Grep-first approach for `.prepare(` and `Date.now` across the entire lib/search/ directory was the most efficient way to build a complete DB query census and timing instrumentation map in just 2 tool calls. This revealed both the BM25 N+1 pattern and the absence of end-to-end timing without needing to read every file individually.
- **What did not work and why:** Nothing failed this iteration. All file paths were correct as provided.
- **What I would do differently:** Would have also checked lib/cognitive/ for DB queries since working-memory and co-activation also hit the DB during search. That would complete the full per-search DB query count.

## Recommended Next Focus
Q1 and Q5 remain partially answered. Iteration 14 should cross-validate the top findings from Q16 (BM25 N+1 is the most actionable performance fix) and complete Q5 by checking spec.md claims about channel count, expansion, and collaboration features against the code reality discovered in iterations 12-13. This aligns with Phase 4 (cross-cutting) goals.
