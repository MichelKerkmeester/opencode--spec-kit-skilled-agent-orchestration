# Iteration 3: Graph Channel + Search Subsystem Status

## Focus
Investigate the graph channel's functional status, feature flag gating, dead code in graph modules (community-detection.ts, graph-signals.ts), and whether the 5-factor vs legacy 6-factor scoring model selection is actually exercised in production code. Addresses Q4 (graph channel dead code) and Q7 (scoring model selection).

## Findings

### Graph Channel: Fully Functional (NOT NULL/Stub)

1. **graph-search-fn.ts is a complete, production-ready search channel** with FTS5-backed causal edge queries, LIKE fallback, hierarchy-aware augmentation, deduplication, and typed-degree computation. The factory function `createUnifiedGraphSearchFn()` returns a proper `GraphSearchFn` that queries `causal_edges` joined to `memory_fts` via BM25. This is NOT a stub or NULL channel.
   [SOURCE: mcp_server/lib/search/graph-search-fn.ts:1-494]

2. **Graph channel is gated by `SPECKIT_GRAPH_UNIFIED` env var (default-ON via `isFeatureEnabled` semantics).** The `isGraphUnifiedEnabled()` function in graph-flags.ts delegates to `isFeatureEnabled('SPECKIT_GRAPH_UNIFIED')`, which uses default-on semantics (only disabled when explicitly set to `'false'`). This means the graph channel is active by default in all environments.
   [SOURCE: mcp_server/lib/search/graph-flags.ts:16-18]

3. **Graph-walk rollout uses a 3-state ladder: `off` | `trace_only` | `bounded_runtime`**, controlled by `resolveGraphWalkRolloutState()` in search-flags.ts. `isGraphWalkRuntimeEnabled()` returns true only at `bounded_runtime` state. `isGraphWalkTraceEnabled()` returns true for both `trace_only` and `bounded_runtime`. The rollout state defaults to `bounded_runtime` in applyGraphSignals.
   [SOURCE: mcp_server/lib/search/graph-flags.ts:26-42, mcp_server/lib/graph/graph-signals.ts:575]

### Graph Signals: Comprehensive 3-Signal System

4. **graph-signals.ts implements 3 distinct graph-based scoring signals:** (a) Momentum -- degree change over 7-day window via `degree_snapshots` table, bonus up to +0.05; (b) Causal depth -- longest-path depth via SCC-based DAG computation, bonus up to +0.05; (c) Graph-walk -- 2-hop undirected connectivity among candidate rows, bonus bounded by `STAGE2_GRAPH_BONUS_CAP` from ranking-contract.ts. All three are applied additively in `applyGraphSignals()`.
   [SOURCE: mcp_server/lib/graph/graph-signals.ts:550-619]

5. **Momentum uses degree snapshot comparison** (`degree_snapshots` table stores daily degree counts). Current degree minus 7-day-ago degree = momentum. Session-cached with 10K entry bound and full-clear eviction strategy.
   [SOURCE: mcp_server/lib/graph/graph-signals.ts:110-193]

6. **Causal depth uses Tarjan's SCC algorithm** to handle cycles, then computes longest-path on the condensed DAG. This is a sophisticated approach that prevents infinite loops in cyclic causal graphs while still ranking structurally deep nodes higher.
   [SOURCE: mcp_server/lib/graph/graph-signals.ts:328-471]

### Community Detection: Fully Implemented with Louvain Escalation

7. **community-detection.ts is a complete community detection module** with BFS connected-component labelling, Louvain modularity optimization for escalation when largest component >50% of nodes, persistence via `community_assignments` table, session debounce with content-hash fingerprinting, and a query helper `getCommunityMembers()` plus `applyCommunityBoost()` for co-retrieval injection (max 3 injected, 0.3x score factor).
   [SOURCE: mcp_server/lib/graph/community-detection.ts:1-575]

8. **Community detection debounce uses a 3-part hash** (`count:maxId:checksum`) to detect any edge mutation including delete+insert sequences that maintain the same count. This fixes a prior bug (F22) where edge-count-only debounce missed update scenarios.
   [SOURCE: mcp_server/lib/graph/community-detection.ts:327-336]

### Typed-Degree: 5th RRF Channel

9. **graph-search-fn.ts provides the "5th RRF channel" via typed-degree computation.** Edge type weights (caused=1.0, derived_from=0.9, enabled=0.8, contradicts=0.7, supersedes=0.6, supports=0.5) are multiplied by edge strength, log-normalized, and capped at 0.15. This is batch-computed with an in-memory cache and constitutional memory exclusion (prevents artificial inflation).
   [SOURCE: mcp_server/lib/search/graph-search-fn.ts:29-432]

### 5-Factor vs Legacy 6-Factor: Legacy is Live, 5-Factor is Opt-In Only

10. **The 5-factor model is NEVER activated in production code.** `use_five_factor_model: true` appears only in a JSDoc comment and in test files (five-factor-scoring.vitest.ts). No production caller in `lib/` passes this option. `calculateCompositeScore()` defaults to the legacy 6-factor model. The 5-factor model exists, is tested, and is structurally complete, but is effectively dormant -- waiting for a caller to opt in.
    [SOURCE: Grep across mcp_server/lib/ for "use_five_factor_model: true" -- 0 production hits. Only mcp_server/lib/scoring/composite-scoring.ts:613 (doc comment) and test files]

11. **Both models are structurally complete with different factor sets:** Legacy 6-factor uses similarity(0.30), importance(0.25), recency(0.10), popularity(0.15), tierBoost(0.05), retrievability(0.15). Five-factor uses temporal(0.25), usage(0.15), importance(0.25), pattern(0.20), citation(0.15). The 5-factor model drops similarity and recency as independent factors, replacing them with pattern alignment and citation signals.
    [SOURCE: mcp_server/lib/scoring/composite-scoring.ts:120-136]

## Sources Consulted
- `mcp_server/lib/search/graph-search-fn.ts` (full file, 494 lines)
- `mcp_server/lib/search/graph-flags.ts` (full file, 42 lines)
- `mcp_server/lib/graph/graph-signals.ts` (full file, 643 lines)
- `mcp_server/lib/graph/community-detection.ts` (full file, 575 lines)
- `mcp_server/lib/scoring/composite-scoring.ts` (lines 1-655)
- Grep: `use_five_factor_model` across mcp_server/lib/ and mcp_server/tests/

## Assessment
- New information ratio: 0.91
- Questions addressed: Q4 (graph channel dead code), Q7 (5-factor vs 6-factor)
- Questions answered: Q4 (graph channel is NOT NULL/dead -- it is a complete, default-ON system with 3 graph signals, community detection with Louvain, and typed-degree as 5th RRF channel), Q7 (legacy 6-factor is live; 5-factor is opt-in but never activated in production)

## Reflection
- What worked and why: Reading graph-search-fn.ts and graph-signals.ts in full gave a complete picture of the graph subsystem in a single pass. The graph channel is far more mature than the dispatch context suggested ("investigate NULL state") -- it has sophisticated algorithms (Tarjan SCC, Louvain modularity), multiple caching layers, and careful error handling. The Grep for `use_five_factor_model: true` across production code was the definitive test for Q7.
- What did not work and why: Dispatch context had wrong path prefix again (shared/ vs mcp_server/) -- required a Glob discovery step. This is a recurring issue across all iterations.
- What I would do differently: For the next iteration, pre-verify file paths via a single Glob before attempting reads.

## Recommended Next Focus
Iteration 4: Cross-system alignment scan -- compare the 80K spec.md claims against actual code reality. Also investigate how graph-signals.ts `applyGraphSignals()` is called from the pipeline (where in the 4-stage pipeline does graph signal application happen?) and whether community detection `applyCommunityBoost()` is integrated into the main search pipeline or only available as a standalone function.
