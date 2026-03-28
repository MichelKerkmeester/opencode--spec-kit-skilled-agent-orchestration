---
title: "Ablation studies (eval_run_ablation)"
description: "Covers the dual-mode evaluation tool that runs channel ablations or raw RRF K-sensitivity sweeps."
---

# Ablation studies (eval_run_ablation)

## 1. OVERVIEW

Covers the dual-mode evaluation tool that can run controlled channel ablations or a raw RRF K-sensitivity sweep.

In its default `ablation` mode, the tool tests how important each part of the search system is by turning off one piece at a time and measuring the difference. In `k_sensitivity` mode, it skips ground-truth ablation and instead compares how different RRF K values change the fused ranking built from raw vector, FTS, BM25, graph and optional degree lists for representative queries.

---

## 2. CURRENT REALITY

This tool has two runtime paths behind the same `eval_run_ablation` MCP surface. The default `ablation` path runs controlled studies across the retrieval pipeline's search channels. You disable one channel at a time (vector, BM25, FTS5, graph or trigger) and measure the Recall@20 delta against a full-pipeline baseline. The answer to "what happens if we turn off the graph channel?" becomes a measured number rather than speculation.

The ablation framework uses dependency injection for the search function, making it testable without the full pipeline. Each channel ablation wraps in a try-catch so a failure in one channel's ablation produces partial results rather than a total failure. Statistical significance is assessed via a sign test (exact binomial distribution) because it is reliable with small query sets where a t-test would be unreliable. Verdict classification ranges from CRITICAL (channel removal causes significant regression) through negligible to HARMFUL (channel removal actually improves results). Token-usage summaries now ignore non-positive values, and snapshot persistence skips token-usage rows where baseline, ablated, and delta are all synthetic zeroes.

The MCP handler normalizes chunk-backed hits to canonical parent memory IDs with `parentMemoryId ?? row.id` before scoring. Before reporting results, the ablation path also validates ground-truth alignment: requested query IDs are split into resolved and missing sets, missing IDs are surfaced as warnings, and chunk-backed or orphaned mappings raise an explicit alignment error with guidance to rerun `scripts/evals/map-ground-truth-ids.ts --write`. Operators should only compare stored ablation runs when the active `context-index.sqlite` matches the ground-truth parent IDs and the live search path is still returning up to `recallK` candidates rather than collapsing below `K` because of token-budget truncation.

The alternate `k_sensitivity` path is selected with `mode: 'k_sensitivity'` in the tool schema. That mode accepts optional `queries`, reuses `recallK` as the per-query candidate limit, builds raw fusion lists through the eval search adapters, and returns an RRF K-value recommendation report instead of Recall@20 deltas. It does not persist ablation snapshots or use `groundTruthQueryIds`.

Results from the `ablation` path can be stored in `eval_metric_snapshots` with negative timestamp IDs to distinguish ablation runs from production evaluation runs. Only the `ablation` path requires `SPECKIT_ABLATION=true`; when the flag is off, the MCP handler returns an explicit disabled-flag error and does not execute that branch.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/eval-reporting.ts` | Handler | MCP handler, mode dispatch, and runtime search adapters for both eval paths |
| `mcp_server/lib/eval/ablation-framework.ts` | Lib | Channel-ablation runner, sign test, formatted report, and snapshot persistence |
| `mcp_server/lib/eval/k-value-analysis.ts` | Lib | Raw RRF K-sensitivity analysis and recommendation report |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Eval database initialization and snapshot storage target |
| `mcp_server/lib/eval/eval-metrics.ts` | Lib | Recall, precision, MRR, NDCG, MAP, and hit-rate helpers used by ablation |
| `mcp_server/lib/eval/ground-truth-data.ts` | Lib | Static ground-truth queries and relevance judgments for ablation runs |
| `mcp_server/tool-schemas.ts` | Schema | Public MCP schema for dual-mode ablation arguments |
| `mcp_server/schemas/tool-input-schemas.ts` | Schema | Strict Zod validation for ablation inputs |

### Routing And Registry

| File | Layer | Role |
|------|-------|------|
| `mcp_server/tools/lifecycle-tools.ts` | Routing | Validates and dispatches `eval_run_ablation` tool calls |
| `mcp_server/tools/types.ts` | Routing | Shared typed arg shapes used by lifecycle dispatch |
| `mcp_server/handlers/index.ts` | Registry | Re-exports the eval handlers for tool modules |
| `mcp_server/lib/architecture/layer-definitions.ts` | Registry | Registers `eval_run_ablation` as an L6 analysis tool |
| `mcp_server/api/eval.ts` | API | Stable public eval API barrel for ablation helpers |
| `mcp_server/api/index.ts` | API | Top-level public API barrel that re-exports eval APIs |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/ablation-framework.vitest.ts` | Ablation framework tests |
| `mcp_server/tests/handler-eval-reporting.vitest.ts` | Handler-level eval reporting tests |
| `mcp_server/tests/k-value-optimization.vitest.ts` | K-sensitivity analysis and recommendation tests |

---

## 4. SOURCE METADATA

- Group: Evaluation
- Source feature title: Ablation studies (eval_run_ablation)
- Current reality source: FEATURE_CATALOG.md
