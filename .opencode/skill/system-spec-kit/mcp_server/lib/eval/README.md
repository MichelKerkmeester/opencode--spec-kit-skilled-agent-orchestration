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

The eval module provides measurement infrastructure for search quality evaluation. It includes baseline measurement (BM25 MRR@5), ceiling evaluation, ground truth datasets, edge density analysis, quality proxy scoring, K-value sensitivity analysis and an evaluation database for tracking metrics over time.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 10 | eval-db, eval-logger, eval-metrics, eval-quality-proxy, eval-ceiling, bm25-baseline, edge-density, ground-truth-data, ground-truth-generator, k-value-analysis |
| Origin | Sprint 0+ | Foundation measurement established in Sprint 0, expanded in Sprint 1 |
| Last Verified | 2026-02-27 | After Sprint 1-3 completion |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
eval/
 bm25-baseline.ts          # BM25 MRR@5 baseline measurement
 edge-density.ts           # Edge density measurement for graph analysis (Sprint 1)
 eval-ceiling.ts           # Ceiling evaluation (upper bound measurement)
 eval-db.ts                # Evaluation SQLite database management
 eval-logger.ts            # Evaluation run logging
 eval-metrics.ts           # Metric computation (MRR@5, precision, recall)
 eval-quality-proxy.ts     # Quality proxy scoring
 ground-truth-data.ts      # Ground truth dataset definitions
 ground-truth-generator.ts # Ground truth generation from live corpus
 k-value-analysis.ts       # RRF K-value sensitivity analysis
 README.md                 # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `eval-db.ts` | SQLite database for storing evaluation runs and metrics |
| `eval-metrics.ts` | MRR@5, precision@K, recall computation |
| `bm25-baseline.ts` | BM25 baseline MRR@5 measurement (Sprint 0 foundation) |
| `edge-density.ts` | Graph edge density measurement for R10 escalation decisions |
| `ground-truth-data.ts` | Curated ground truth queries and expected results |
| `k-value-analysis.ts` | Grid search for optimal RRF K parameter |

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

Curated query-result pairs for measuring retrieval quality. The generator creates ground truth from the live corpus.

### K-Value Analysis (`k-value-analysis.ts`)

Grid search across RRF K values to identify optimal fusion parameters.

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

**Version**: 1.0.0
**Last Updated**: 2026-02-27
