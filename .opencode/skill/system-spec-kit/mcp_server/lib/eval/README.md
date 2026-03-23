---
title: "Evaluation Modules"
description: "Evaluation, baseline measurement and quality metrics for the Spec Kit Memory search pipeline."
trigger_phrases:
  - "eval modules"
  - "bm25 baseline"
  - "edge density"
  - "ground truth"
---

# Evaluation Modules

> Evaluation, baseline measurement and quality metrics for the Spec Kit Memory search pipeline.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. RELATED RESOURCES](#4--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The eval module provides measurement infrastructure for search quality evaluation. It includes baseline measurement (BM25 MRR@5), ground truth datasets, edge density analysis, quality proxy scoring, K-value sensitivity analysis, ground truth expansion via feedback, shadow scoring for A/B comparison, ablation studies for channel contribution analysis, a reporting dashboard for metric aggregation and trend analysis, and an evaluation database for tracking metrics over time.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 14 + 1 data file | eval-db, eval-logger, eval-metrics, eval-quality-proxy, bm25-baseline, edge-density, ground-truth-data, ground-truth-generator, k-value-analysis, ground-truth-feedback, memory-state-baseline, reporting-dashboard, shadow-scoring, ablation-framework, data/ground-truth.json |
| Origin | Sprint 0+ | Foundation measurement established in Sprint 0, expanded in Sprints 1-7 |
| Last Verified | 2026-03-01 | After Sprint 10 comprehensive remediation |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
eval/
 ablation-framework.ts     # Controlled channel ablation studies (R13-S3, Sprint 7)
 bm25-baseline.ts          # BM25 MRR@5 baseline measurement
 data/
   ground-truth.json       # Static ground truth query-result pairs (JSON dataset)
 edge-density.ts           # Edge density measurement for graph analysis (Sprint 1)
 eval-db.ts                # Evaluation SQLite database management
 eval-logger.ts            # Evaluation run logging
 eval-metrics.ts           # Metric computation (MRR@5, precision, recall, F1)
 eval-quality-proxy.ts     # Quality proxy scoring
 ground-truth-data.ts      # Ground truth dataset definitions
 ground-truth-feedback.ts  # Ground truth expansion via implicit feedback + deterministic judge (Sprint 4)
 ground-truth-generator.ts # Ground truth generation from live corpus
 k-value-analysis.ts       # RRF K-value sensitivity analysis
 memory-state-baseline.ts  # Baseline retrieval/isolation metrics snapshot
 README.md                 # This file
 reporting-dashboard.ts    # Full reporting dashboard with sprint/channel aggregation (R13-S3, Sprint 7)
 shadow-scoring.ts         # Shadow scoring A/B comparison infrastructure (Sprint 4; write path disabled Sprint 7)
```

### Key Files

| File | Purpose |
|------|---------|
| `eval-db.ts` | SQLite database for storing evaluation runs and metrics |
| `eval-metrics.ts` | MRR@5, precision@K, recall, F1 computation |
| `bm25-baseline.ts` | BM25 baseline MRR@5 measurement (Sprint 0 foundation) |
| `edge-density.ts` | Graph edge density measurement for R10 escalation decisions |
| `ground-truth-data.ts` | Hand-verified ground truth queries and expected results |
| `k-value-analysis.ts` | Grid search for optimal RRF K parameter |
| `ground-truth-feedback.ts` | Collects implicit feedback from user selections; deterministic heuristic judge for relevance labeling |
| `memory-state-baseline.ts` | Captures baseline retrieval and isolation metrics before roadmap rollout changes |
| `reporting-dashboard.ts` | Aggregates per-sprint and per-channel metrics; generates text and JSON reports with trend analysis |
| `shadow-scoring.ts` | Runs parallel scoring paths without affecting production; logs comparison data for A/B evaluation |
| `ablation-framework.ts` | Selectively disables channels to measure Recall@20 delta; paired sign-test for statistical significance |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Evaluation Database (`eval-db.ts`)

Manages a SQLite database (`speckit-eval.db`) for tracking evaluation runs, metric snapshots and regression detection across sprints.

### BM25 Baseline (`bm25-baseline.ts`)

Measures BM25-only MRR@5 as the retrieval floor. Sprint 0 established the baseline at 0.2083.

### Edge Density (`edge-density.ts`)

Measures causal graph edge density to inform R10 escalation decisions. Added in Sprint 1 (T003).

### Ground Truth (`ground-truth-data.ts`, `ground-truth-generator.ts`)

Hand-verified query-result pairs for measuring retrieval quality. The generator creates ground truth from the live corpus.

### K-Value Analysis (`k-value-analysis.ts`)

Grid search across RRF K values to identify optimal fusion parameters.

### Ground Truth Feedback (`ground-truth-feedback.ts`)

Expands ground truth datasets via two mechanisms: (1) implicit feedback from user memory selections persisted to the eval DB, and (2) a deterministic heuristic judge that scores query-memory relevance using lexical overlap with 4-band classification. Designed for replacement with a model-backed judge without changing persistence or agreement APIs. Added in Sprint 4.

### Reporting Dashboard (`reporting-dashboard.ts`)

Full reporting dashboard for the R13-S3 evaluation infrastructure. Aggregates metrics per sprint and per channel from `eval_metric_snapshots`, with trend analysis and formatted report output in text and JSON. `limit` applies after sprint grouping so the most recent sprint groups are kept intact, returned totals/summaries reflect the included report scope after filters, and channel results are grouped per included run/channel before sprint aggregation so large per-query histories do not starve the kept sprint groups. Read-only queries against the eval DB. Added in Sprint 7.

### Shadow Scoring (`shadow-scoring.ts`)

Runs a parallel scoring path alongside production results without affecting production output. Logs both production and shadow scores for A/B comparison. The shadow write path (`runShadowScoring`, `logShadowComparison`) was permanently disabled in Sprint 7; read-only analysis functions remain available. Added in Sprint 4.

### Ablation Framework (`ablation-framework.ts`)

Controlled ablation studies for search channel contribution analysis. Selectively disables one search channel at a time (vector, bm25, fts5, graph, trigger), measures Recall@20 delta against a full-pipeline baseline, and uses a paired sign-test for statistical significance. Results are stored in `eval_metric_snapshots` with negative timestamp IDs. Gated behind `SPECKIT_ABLATION=true`. Added in Sprint 7.

<!-- /ANCHOR:features -->

---

## 4. RELATED RESOURCES
<!-- ANCHOR:related -->

| Document | Purpose |
|----------|---------|
| [lib/README.md](../README.md) | Parent library overview |
| [search/README.md](../search/README.md) | Search pipeline that eval measures |
| [scoring/README.md](../scoring/README.md) | Scoring modules measured by eval |

<!-- /ANCHOR:related -->

---

**Version**: 1.1.0
**Last Updated**: 2026-03-01
