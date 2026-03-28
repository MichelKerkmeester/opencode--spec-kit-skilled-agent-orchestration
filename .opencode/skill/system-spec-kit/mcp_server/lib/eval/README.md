---
title: "Evaluation Modules"
description: "Evaluation, logging, baselines, quality proxies, ablation, and reporting for the memory retrieval pipeline."
trigger_phrases:
  - "eval modules"
  - "ablation"
  - "eval logger"
  - "quality proxy"
---

# Evaluation Modules

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. IMPLEMENTED STATE](#3--implemented-state)
- [4. RELATED](#4--related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`lib/eval/` contains the measurement stack for retrieval quality, eval logging, baseline comparisons, and rollout reporting. The directory currently has 14 TypeScript modules plus the static `data/ground-truth.json` fixture.

The current surface covers:

- Eval database bootstrap and logging.
- Metric computation and quality proxy scoring.
- BM25 baselines, ablations, k-sensitivity, and state baselines.
- Ground-truth generation plus feedback-based expansion.
- Reporting dashboard and read-only shadow comparison analysis.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:structure -->
## 2. STRUCTURE

| File | Purpose |
|---|---|
| `ablation-framework.ts` | Controlled channel ablation runs, formatting, and storage helpers |
| `bm25-baseline.ts` | BM25-only baseline measurement and baseline metric persistence |
| `edge-density.ts` | Graph edge-density measurement and reporting helpers |
| `eval-db.ts` | Eval database bootstrap and schema management |
| `eval-logger.ts` | Fail-safe query, channel, and final-result logging hooks |
| `eval-metrics.ts` | MRR, NDCG, recall, precision, F1, MAP, hit-rate, inversion-rate, and constitutional metrics |
| `eval-quality-proxy.ts` | Pure quality proxy formula for latency/result quality tradeoff scoring |
| `ground-truth-data.ts` | Static typed ground-truth definitions |
| `ground-truth-feedback.ts` | Selection-feedback capture and judge-agreement helpers |
| `ground-truth-generator.ts` | Ground-truth dataset generation and diversity validation |
| `k-value-analysis.ts` | RRF K-value sweep helpers |
| `memory-state-baseline.ts` | Retrieval/isolation baseline snapshots against the active memory DB |
| `reporting-dashboard.ts` | Sprint/channel aggregation and formatted dashboard output |
| `shadow-scoring.ts` | Read-only shadow comparison helpers and holdout analysis |

<!-- /ANCHOR:structure -->
<!-- ANCHOR:implemented-state -->
## 3. IMPLEMENTED STATE

- `eval-logger.ts` is intentionally fail-safe: when `SPECKIT_EVAL_LOGGING` is not exactly `true`, its public functions no-op instead of risking production retrieval paths.
- `eval-quality-proxy.ts` is a pure calculation module with no DB writes, making it safe for inline quality scoring and tests.
- `ablation-framework.ts` and the handler layer gate mutation-style ablation storage behind `SPECKIT_ABLATION=true`.
- `reporting-dashboard.ts` is the current reporting surface for sprint/channel aggregation.
- `shadow-scoring.ts` retains comparison and analysis helpers, but the legacy write path is retired; the module is now effectively read-only analysis support.
- `ground-truth-feedback.ts` is the bridge between implicit user selections, stored labels, and judge-agreement analysis.

<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:related -->
## 4. RELATED

- `../README.md`
- `../search/README.md`
- `../../api/README.md`
- `../../tests/README.md`

<!-- /ANCHOR:related -->
