# Plan: Comprehensive MCP Server Remediation

> **Phase:** 010-comprehensive-remediation
> **Approach:** 3-wave parallel agent delegation

---

## Execution Strategy

### Wave 1 (parallel — 10 agents)

| Agent | Model | Batch | Files | Items |
|-------|-------|-------|-------|-------|
| 1 | opus | WS1-B: Database & Schema Safety | reconsolidation.ts, checkpoints.ts, causal-edges.ts, memory-save.ts | B1-B4 |
| 2 | opus | WS1-C + 1c: Scoring & Ranking | composite-scoring.ts | C1, C2, 1c |
| 3 | opus | WS1-C2: Causal-boost + Ablation | causal-boost.ts, ablation-framework.ts | C3, C4 |
| 4 | opus | WS1-D: Search Pipeline Safety | stage1-candidate-gen.ts, sqlite-fts.ts, bm25-index.ts, channel-representation.ts | D1-D3 |
| 5 | opus | WS1-E: Guards & Edge Cases | temporal-contiguity.ts, extraction-adapter.ts | E1, E2 |
| 6 | sonnet | WS2-1: Dead hot-path branches | hybrid-search.ts | 1a, 1b |
| 7 | sonnet | WS2-3: Dead module-level state | archival-manager.ts, community-detection.ts, cross-encoder.ts, access-tracker.ts, working-memory.ts | 3a-3e |
| 8 | sonnet | WS2-4: Dead functions & exports | graph-signals.ts, graph-search-fn.ts, negative-feedback.ts, causal-edges.ts, co-activation.ts | 4a-4e |
| 9 | sonnet | WS3-P1: Quick wins | tfidf-summarizer.ts, memory-summaries.ts, mutation-ledger.ts | P1a-P1c |
| 10 | sonnet | WS3-P2: Test quality | memory-save-extended.vitest.ts, entity-linker.vitest.ts, integration-search-pipeline.vitest.ts, feature-eval-graph-signals.vitest.ts | P2a-P2d |

### Wave 2 (after Wave 1 completes — 3 agents)

| Agent | Model | Batch | Files | Depends On |
|-------|-------|-------|-------|------------|
| 11 | opus | WS1-A: Entity normalization | entity-extractor.ts, entity-linker.ts | WS2-4 (4b overlap) |
| 12 | sonnet | WS2-2: Dead flag functions | shadow-scoring.ts, rsf-fusion.ts, learned-feedback.ts | WS2-1 (call site removal) |
| 13 | sonnet | WS3-P4: SQL-level performance | causal-edges.ts, spec-folder-hierarchy.ts | WS1-B (B3 in same file) |
| 14 | sonnet | WS3-P3: Entity linker perf | entity-linker.ts | WS1-A (same file) |

### Wave 3 (cleanup + verification)

1. Run full test suite: `npx vitest run`
2. Run TypeScript check: `npx tsc --noEmit`
3. Spot-check critical fixes
4. Dead code verification grep

## Dead Code Analysis

All items marked for removal were verified as truly dead:
- Feature flags: `@deprecated Eval complete (Sprint 7 audit)` annotations
- Shadow period: graduated to default-ON, function always returns false
- Novelty boost: evaluated, confirmed marginal value, always returns 0
- Module state: never populated/never read (verified via grep)
- Functions: never called outside their own module (verified via grep)

**Exception — KEPT as planned features (not dead):**
- `computeStructuralFreshness` / `computeGraphCentrality` in `fsrs.ts` — Module header says "Augments FSRS stability scores with graph centrality." These are unfinished architectural components, not concluded experiments.
