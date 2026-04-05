# Iteration 3 (GPT-5.4): Phase 3 Graph Modules Audit

## Focus
Audit Phase 3 unified graph retrieval modules: graph-signals.ts, community-detection.ts, graph-search-fn.ts, causal-edges.ts. Focus on graph signal atomicity, cleanup completeness on memory deletion, cache invalidation, and test coverage.

## Findings

1. **Dead Code (P1): N2a momentum and N2c community retrieval are effectively dead in production** — `applyGraphSignals()` reads `degree_snapshots` (graph-signals.ts:135) and `applyCommunityBoost()` reads `community_assignments` (community-detection.ts:490). Stage 2 calls them (stage2-fusion.ts:659, 678). But no non-test callers of `snapshotDegrees()`, `detectCommunities()`, or `storeCommunityAssignments()` exist. Momentum stays 0 and community injection is a no-op unless an external job populates those tables.
   — SOURCE: graph-signals.ts:67,135; community-detection.ts:322,443,490; stage2-fusion.ts:659,678

2. **Bug (P1): Memory-delete path leaves typed-degree cache stale** — `deleteAncillaryMemoryRows()` removes graph rows via raw SQL (vector-index-mutations.ts:38). Then `deleteEdgesForMemory()` is called (memory-crud-delete.ts:95,113) but finds no rows to delete (already gone), so `clearDegreeCache()` never fires (causal-edges.ts:552). `runPostMutationHooks()` clears graph-signals cache but not degree cache (mutation-hooks.ts:67). Hybrid search continues using stale degree scores (hybrid-search.ts:671).
   — SOURCE: vector-index-mutations.ts:38,448; memory-crud-delete.ts:95,113; causal-edges.ts:552; mutation-hooks.ts:67; hybrid-search.ts:671

3. **Architecture (P2): Graph table cleanup not universal across delete paths** — `deleteAncillaryMemoryRows()` is the safe path. But raw `DELETE FROM memory_index` without that helper exists in: orphan chunk auto-clean (vector-index-queries.ts:1376), reconsolidation cleanup (reconsolidation.ts:519). Reconsolidation only removes `vec_memories` and `memory_artifacts` (reconsolidation.ts:532), leaving graph residue path-dependent.
   — SOURCE: vector-index-mutations.ts:38; vector-index-queries.ts:1376; reconsolidation.ts:519,532

4. **Architecture (P2): Graph signal scoring not snapshot-consistent under concurrent writes** — `applyGraphSignals()` computes momentum, depth, and graph-walk in separate passes (graph-signals.ts:571-574) without a read transaction. `snapshotDegrees()` reads `causal_edges` before opening its write transaction (graph-signals.ts:71,90). With WAL enabled (context-server.ts:882), concurrent writes can interleave, producing mixed old/new graph state.
   — SOURCE: graph-signals.ts:71,90,571-574; context-server.ts:882

5. **Test Gap (P2): graph-roadmap-finalization.vitest.ts covers only happy paths** — Tests check deterministic sort (line 23), telemetry serialization (lines 37,75,119), and mocked microbenchmark (line 190). Never touches degree_snapshots, community_assignments, delete cleanup, orphaned edges, or cache invalidation. graph-health/adaptive helpers are test-only in practice.
   — SOURCE: graph-roadmap-finalization.vitest.ts:23,37,75,119,190

6. **Test Gap (P3): Tests validate only low-level happy path, not real delete wiring** — `causal-edges-unit.vitest.ts` proves `deleteEdgesForMemory()` invalidates degree cache (line 678), but no test covers the handler path where edges are already deleted via raw SQL before `deleteEdgesForMemory()` is called — exactly where the stale-cache bug slips through.
   — SOURCE: causal-edges-unit.vitest.ts:678

## Sources Consulted
- graph-signals.ts (full file)
- community-detection.ts (full file)
- graph-search-fn.ts (degree computation, cache)
- causal-edges.ts (edge deletion, cache invalidation)
- stage2-fusion.ts:659-678 (graph signal consumers)
- hybrid-search.ts:668-692 (degree scores in search)
- vector-index-mutations.ts:38 (deleteAncillaryMemoryRows)
- memory-crud-delete.ts:95-113 (handler delete path)
- mutation-hooks.ts:67 (post-mutation cache clearing)
- reconsolidation.ts:519-532 (alternative delete path)
- vector-index-queries.ts:1376 (orphan chunk cleanup)
- graph-roadmap-finalization.vitest.ts (test coverage)
- causal-edges-unit.vitest.ts:678 (cache invalidation test)
- context-server.ts:882 (WAL mode)

## Assessment
- New information ratio: 0.85 — Graph dead code and stale degree cache after delete are novel; non-universal cleanup paths expand the delete-omission pattern from iteration 2
- Questions addressed: Q1 (bugs — stale cache), Q4 (dead code in graph modules), Q5 (test gaps)

## Recommended Next Focus
- Quantify the cross-cutting transaction pattern (Codex-5.3 is handling this)
- Consolidate findings into final verdict with prioritized fix list
