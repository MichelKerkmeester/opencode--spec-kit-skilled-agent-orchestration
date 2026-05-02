---
title: "Evaluation Modules"
description: "Retrieval evaluation, baseline comparison, ground-truth handling, ablation runs, and reporting support for the Spec Kit MCP server."
trigger_phrases:
  - "eval modules"
  - "ablation"
  - "eval logger"
  - "quality proxy"
  - "ground truth"
---

# Evaluation Modules

`lib/eval/` contains measurement and analysis code for retrieval quality. Runtime callers use the fail-safe logger and pure scoring helpers. Maintenance callers use baseline, ablation, ground-truth, and dashboard utilities.

## Table of Contents

- [1. OVERVIEW](#1--overview)
- [2. TOPOLOGY](#2--topology)
- [3. KEY FILES](#3--key-files)
- [4. BOUNDARIES](#4--boundaries)
- [5. ENTRYPOINTS](#5--entrypoints)
- [6. VALIDATION](#6--validation)
- [7. RELATED](#7--related)

## 1. OVERVIEW

This folder answers whether retrieval changes improve results, regress quality, or affect channel contribution. It does not own live retrieval. The live path may call into logging and pure metrics, while heavier eval work stays behind explicit tools, flags, or offline scripts.

Runtime role:

- Record query and result telemetry when eval logging is enabled.
- Calculate pure metrics or quality proxy values without side effects.
- Keep disabled paths safe for normal MCP requests.

Maintenance role:

- Compare BM25, memory-state, warm-start, and channel baselines.
- Run ablation and K-value sensitivity checks.
- Generate and expand ground-truth data.
- Produce dashboard and shadow-score reports.

## 2. TOPOLOGY

```text
┌────────────────────┐
│ Retrieval handlers │
└─────────┬──────────┘
          ▼
┌────────────────────┐      ┌────────────────────┐
│ Fail-safe logging  │      │ Pure metric helpers│
└─────────┬──────────┘      └─────────┬──────────┘
          ▼                           ▼
┌────────────────────┐      ┌────────────────────┐
│ Eval SQLite tables │      │ Reports and scores │
└─────────┬──────────┘      └─────────┬──────────┘
          ▼                           ▼
┌─────────────────────────────────────────────────┐
│ Baselines, ablations, ground truth, dashboards  │
└─────────────────────────────────────────────────┘
```

## 3. KEY FILES

| File | Role |
| --- | --- |
| `eval-logger.ts` | Runtime logging hooks for query, channel, and final-result events. No-ops unless `SPECKIT_EVAL_LOGGING=true`. |
| `eval-metrics.ts` | Pure ranking metrics such as MRR, NDCG, recall, precision, MAP, F1, and hit rate. |
| `eval-quality-proxy.ts` | Pure score used for latency and result-quality tradeoff checks. |
| `eval-db.ts` | Eval database bootstrap and schema ownership. |
| `ablation-framework.ts` | Maintenance ablation runner, report formatter, and optional metric persistence. |
| `k-value-analysis.ts` | RRF K-value sweep helpers. |
| `bm25-baseline.ts` | BM25-only baseline measurement and storage helpers. |
| `memory-state-baseline.ts` | Baseline snapshots against active memory-state retrieval. |
| `warm-start-variant-runner.ts` | Warm-start comparison runner for retrieval variants. |
| `ground-truth-data.ts` | Typed static ground-truth definitions. |
| `ground-truth-generator.ts` | Ground-truth generation and diversity checks. |
| `ground-truth-feedback.ts` | Selection-feedback capture and judge-agreement support. |
| `edge-density.ts` | Graph edge-density measurement and reporting helpers. |
| `reporting-dashboard.ts` | Sprint and channel reporting dashboard output. |
| `shadow-scoring.ts` | Read-only comparison and holdout analysis helpers. |

## 4. BOUNDARIES

Owns:

- Eval schema setup and metric snapshots.
- Ground-truth and channel-quality measurement.
- Offline or flag-gated analysis flows.

Does not own:

- Live retrieval ranking decisions.
- Memory document indexing.
- Tool handler routing.
- Test fixtures outside eval data.

## 5. ENTRYPOINTS

| Entrypoint | Caller | Notes |
| --- | --- | --- |
| `logQueryEvent()` and related logger calls | Runtime retrieval handlers | Safe when disabled. |
| `calculateEvalMetrics()` | Tests and eval tools | Pure calculation surface. |
| `calculateQualityProxy()` | Runtime and tests | No database writes. |
| `runAblation()` | Maintenance tools | Storage requires `SPECKIT_ABLATION=true`. |
| `generateGroundTruthDataset()` | Maintenance tools | Updates generated eval data. |
| `generateReportingDashboard()` | Reporting tools | Reads stored eval metrics. |

## 6. VALIDATION

Run focused tests when changing this folder:

```bash
npm test -- mcp_server/tests/eval
npm test -- mcp_server/tests/handlers/eval
```

Run document validation after README edits:

```bash
python3 .opencode/skill/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md
```

## 7. RELATED

- `../search/README.md` documents the live retrieval pipeline.
- `../telemetry/README.md` documents retrieval observability.
- `../../api/README.md` documents tool-facing handler surfaces.
- `../../tests/README.md` documents MCP server test layout.
