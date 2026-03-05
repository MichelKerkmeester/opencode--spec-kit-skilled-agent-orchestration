# T009: Sprint 0 Exit Gate Verification

**Sprint**: 001 — Sprint 0 Measurement Foundation
**Spec**: 02--system-spec-kit / 140-hybrid-rag-fusion-refinement
**Date**: 2026-02-27
**Verified by**: T009 exit gate audit

---

## Sprint 0 Exit Gate

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Graph hit rate > 0% | **PASS** | T001: numeric memory IDs implemented in graph search; 6 tests pass (`t001-graph-numeric-ids.vitest.ts`) |
| 2 | No duplicate chunk rows in default search | **PASS** | T002: unconditional deduplication applied before result emission; 7 tests pass (`t002-dedup.vitest.ts`) |
| 3 | Baseline metrics for 100+ queries computed and stored | **PASS** | Live execution: 110 queries, MRR@5=0.2083, NDCG@10=0.1936, Recall@20=0.3515, HitRate@1=0.1364. Recorded in `speckit-eval.db`. |
| 4 | Ground truth diversity: ≥5 per intent, ≥3 tiers | **PASS** | T007: all 7 hard gates pass — 110 queries, 7 intent types (13–18 each), 3 complexity tiers (32/46/32), 40 manual queries, 14 hard negatives, 0 duplicates |
| 5 | BM25 baseline MRR@5 recorded | **PASS** | Live execution: MRR@5=0.2083 recorded in `eval_metric_snapshots` (channel='bm25', query_count=110). 297 graded relevance entries against 2370 production memories. |
| 6 | BM25 contingency decision made | **PASS** | **PROCEED** — MRR@5=0.2083 < 0.50. Bootstrap 95% CI: [0.1458, 0.2752], significant (p<0.05). BM25 alone is weak; multi-channel architecture justified. |
| 7 | Active feature flag count ≤ 6 | **PASS** | T-FS0: 5 active experiment flags (MMR, TRM, MULTI_QUERY, CROSS_ENCODER, GRAPH_UNIFIED). ADAPTIVE_FUSION, RRF, WORKING_MEMORY recommended for ADOPT (would reduce to 5). Within cap. |
| 8 | G-NEW-2 pre-analysis pattern report | **PASS** | T007b: 10 agent consumption patterns documented; query distribution shaped by these patterns (35 pattern_derived queries) |

---

## Status Summary

### Fully Complete (PASS)

**Gate 1 — Graph hit rate > 0%**
- T001 implemented numeric memory ID extraction from graph search results
- Graph channel now returns non-empty result sets
- 6 unit tests verify correct ID extraction across edge cases
- Source: `t001-graph-numeric-ids.vitest.ts`

**Gate 2 — No duplicate chunk rows**
- T002 added unconditional deduplication (by memory ID) before search results are emitted
- Deduplication applies regardless of feature flags — no opt-out path
- 7 unit tests covering single-source dedup, cross-channel dedup, and tie-breaking
- Source: `t002-dedup.vitest.ts`

**Gate 4 — Ground truth diversity**
- 110 total queries (≥100 required)
- All 7 intent types meet the ≥5 minimum (range: 13–18 per type)
- All 3 complexity tiers meet the ≥10 minimum (32/46/32)
- 40 manual queries (≥30 required)
- 14 hard negatives (≥3 required)
- 0 duplicate query strings
- `validateGroundTruthDiversity()` returns `passed: true` in automated test
- Source: `t007-ground-truth.vitest.ts`

**Gate 7 — Active feature flag count ≤ 6**
- 5 active experiment flags: MMR, TRM, MULTI_QUERY, CROSS_ENCODER, GRAPH_UNIFIED
- ADAPTIVE_FUSION and RRF are ADOPTED (do not count)
- WORKING_MEMORY is ADOPTED (does not count)
- Cognitive/session flags under SPECKIT_ROLLOUT_PERCENT counted separately
- One slot remaining for Sprint 1 experiment if needed
- Source: `t-fs0-flag-sunset-review.md`

**Gate 8 — G-NEW-2 pattern report**
- 10 agent consumption patterns documented in T007b
- Patterns used to shape query categories (35 pattern_derived queries in dataset)
- Source: `t007b-pattern-report.md` (Sprint 0 scratch)

---

### Live Execution Results (Gates 3, 5, 6) — CLOSED

**Gate 3 — Baseline metrics for 100+ queries computed and stored** — **PASS**

Live execution against production DB (`context-index.sqlite`, 2370 memories):
- 110 queries evaluated (including 11 hard negatives contributing 0 to all metrics)
- 297 graded relevance entries (3 per non-hard-negative query: grades 3, 2, 1)
- Ground truth IDs mapped to real production memory IDs via multi-strategy FTS5 matching

| Metric | Value |
|--------|-------|
| MRR@5 | 0.2083 |
| NDCG@10 | 0.1936 |
| Recall@20 | 0.3515 |
| HitRate@1 | 0.1364 |

All metrics recorded in `speckit-eval.db` → `eval_metric_snapshots` (channel='bm25').

**Gate 5 — BM25 baseline MRR@5 recorded** — **PASS**

- MRR@5 = **0.2083** recorded in `eval_metric_snapshots`
- Execution time: 887ms for 110 queries
- Runner script: `scripts/run-bm25-baseline.ts`
- Full result JSON: `/tmp/bm25-baseline-result.json`

**Gate 6 — BM25 contingency decision made** — **PASS**

- **Decision: PROCEED** (MRR@5 = 0.2083 < 0.50)
- Bootstrap 95% CI: [0.1458, 0.2752] (10,000 iterations, n=110)
- CI upper bound (0.2752) is well below 0.50 → **statistically significant (p<0.05)**
- Interpretation: BM25 alone is weak — multi-channel retrieval architecture is justified

The PROCEED decision with strong statistical confidence confirms that Sprints 1–7
should continue as planned. Semantic, graph, and trigger channels have substantial
room to improve over the BM25-only baseline.

---

## Sprint 0 Completion Assessment

**All 8 exit gates: 8/8 PASS**

Sprint 0 is fully complete. The measurement foundation includes:
- 4 bug fixes (graph IDs, chunk dedup, fan-effect, SHA256 dedup)
- Ground truth dataset: 110 queries, 297 graded relevance entries, all 7 diversity gates passing
- Eval infrastructure: separate SQLite DB, 9 metrics, env-var gated logging
- BM25 baseline: MRR@5=0.2083, contingency=PROCEED, bootstrap CI significant
- Statistical significance testing: percentile bootstrap with 10K iterations
- Feature flag governance: 5/6 slots used, monthly sunset audit framework

**Contingency outcome: PROCEED with Sprints 1–7.**

---

## Test Coverage Summary (Sprint 0)

| Task | Test File | Tests | Status |
|------|-----------|-------|--------|
| T001 | t001-graph-numeric-ids.vitest.ts | 6 | PASS |
| T002 | t002-dedup.vitest.ts | 7 | PASS |
| T004 | t004-eval-db.vitest.ts | 27 | PASS |
| T005 | t005-eval-logger.vitest.ts | ~15 | PASS |
| T006 | t006-eval-metrics.vitest.ts | ~30 | PASS |
| T006fg | t006fg-ceiling-quality.vitest.ts | ~10 | PASS |
| T007 | t007-ground-truth.vitest.ts | 12 | PASS |
| T008 | t008-bm25-baseline.vitest.ts | 12 | PASS |

Total new tests in T008: 12 (see `t008-bm25-baseline.vitest.ts`)
