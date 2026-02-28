# Spec: Comprehensive MCP Server Remediation

> **Parent:** `140-hybrid-rag-fusion-refinement`
> **Phase:** 010-comprehensive-remediation
> **Level:** 3 (500+ LOC across 35+ files)
> **Status:** In Progress

---

## 1. Problem Statement

A full-scope review of the Spec Kit Memory MCP server (covering the 8-sprint `140-hybrid-rag-fusion-refinement` initiative) identified **45+ issues** across 50+ files. Issues span critical bugs, correctness gaps, dead code bloat (~360 lines), performance concerns, and test quality problems.

The test suite currently passes 7026/7027 tests (1 timeout flake). TypeScript compiles clean.

## 2. Scope

### In Scope

**Work Stream 1 — Critical Bugs + Correctness (15 items, 5 batches):**
- B: Database & Schema Safety (frequency_counter crash, DDL in transaction, SQL precedence, .changes guard)
- C: Scoring & Ranking (composite clamp, citation fallback, causal-boost cycles, binomial overflow)
- D: Search Pipeline Safety (summary quality filter, FTS5 tokenization, quality floor)
- E: Guards & Edge Cases (double-count pairs, fallback to wrong memory)
- A: Entity Normalization (divergent normalizeEntityName, duplicate computeEdgeDensity)

**Work Stream 2 — Dead Code Removal (~360 lines, 5 batches):**
- Batch 1: Hot-path dead feature flag branches (RSF, shadow-scoring)
- Batch 2: Dead feature flag functions (isShadowScoringEnabled, isRsfEnabled, isInShadowPeriod)
- Batch 3: Dead module-level state (stmtCache, lastComputedAt, activeProvider, flushCount, config fields)
- Batch 4: Dead functions & exports (computeCausalDepth single-node, getSubgraphWeights, etc.)
- Batch 5: Duplicate code consolidation (overlaps with Batch A)

**Work Stream 3 — Performance + Test Quality (13 items, 6 batches):**
- P1: Quick wins (Math.max spread, full-table scan, O(n) divergence)
- P2: Test quality (timeout flake, db.close leak, tautological tests, duplicate test block)
- P3: Entity linker performance (O(n) includes, N+1 queries)
- P4: SQL-level performance (3 round-trips per upsert, hierarchy scan)

### Out of Scope
- `computeStructuralFreshness` / `computeGraphCentrality` in fsrs.ts (planned features, not dead code)
- `@ts-nocheck` removal in test files (separate PR, requires significant type work)
- 10K bootstrap iterations in bm25-baseline.ts (eval tooling only, not hot path)

## 3. Success Criteria

- [ ] TypeScript compilation clean (`npx tsc --noEmit` exit 0)
- [ ] Full test suite passes (target 7027/7027, fix timeout flake)
- [ ] No references to `frequency_counter` in reconsolidation.ts
- [ ] Single `normalizeEntityName` in entity-linker only
- [ ] Composite scores clamped to [0, 1]
- [ ] Causal-boost CTE uses `UNION` not `UNION ALL`
- [ ] Grep for removed function names returns 0 hits
- [ ] ~360 lines of dead code removed

## 4. Files Modified

### Production (~30 files)
- `handlers/memory-save.ts`
- `lib/cognitive/archival-manager.ts`, `co-activation.ts`, `temporal-contiguity.ts`, `working-memory.ts`
- `lib/eval/ablation-framework.ts`, `shadow-scoring.ts`
- `lib/extraction/entity-extractor.ts`, `extraction-adapter.ts`
- `lib/graph/community-detection.ts`, `graph-signals.ts`
- `lib/scoring/composite-scoring.ts`, `negative-feedback.ts`
- `lib/search/bm25-index.ts`, `causal-boost.ts`, `channel-representation.ts`, `cross-encoder.ts`, `entity-linker.ts`, `fsrs.ts`, `graph-search-fn.ts`, `hybrid-search.ts`, `learned-feedback.ts`, `memory-summaries.ts`, `pipeline/stage1-candidate-gen.ts`, `rsf-fusion.ts`, `spec-folder-hierarchy.ts`, `sqlite-fts.ts`, `tfidf-summarizer.ts`
- `lib/storage/access-tracker.ts`, `causal-edges.ts`, `checkpoints.ts`, `mutation-ledger.ts`, `reconsolidation.ts`

### Tests (~5 files)
- `tests/memory-save-extended.vitest.ts`
- `tests/entity-linker.vitest.ts`
- `tests/integration-search-pipeline.vitest.ts`
- `tests/feature-eval-graph-signals.vitest.ts`
