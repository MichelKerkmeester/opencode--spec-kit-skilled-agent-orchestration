---
title: "BM25-only baseline"
description: "Describes the BM25/FTS5-only baseline measurement (MRR@5 of 0.2083) that confirmed lexical search alone still underperforms hybrid retrieval."
---

# BM25-only baseline

## 1. OVERVIEW

Describes the BM25/FTS5-only baseline measurement (MRR@5 of 0.2083) that confirmed lexical search alone still underperforms hybrid retrieval.

This test answered a simple question: "Would basic keyword search be good enough on its own?" By running just keyword matching against 110 test questions and measuring how poorly it performed, the team proved that the more advanced multi-method search approach is worth the extra effort. Without this baseline measurement, you would be guessing whether the added complexity actually helps.

---

## 2. CURRENT REALITY

Running the BM25/FTS5-only baseline path (disabling vector, graph and trigger channels) on the 110-query corpus produced an MRR@5 of 0.2083. That is well below 50% of hybrid performance.

If BM25 had been competitive, the entire multi-channel approach would be questioned. Instead, the gap confirmed that hybrid retrieval adds real value over lexical search. The contingency decision to proceed with the full program was based on this measurement. No opinions, no intuitions, just a number. The current runtime keeps the in-memory BM25 path enabled by default; use `ENABLE_BM25=false` if you need to force the FTS5 fallback for comparison.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/bm25-baseline.ts` | Lib | BM25-only baseline evaluation |
| `mcp_server/lib/eval/eval-metrics.ts` | Lib | Core metric computation |
| `mcp_server/lib/eval/ground-truth-data.ts` | Lib | Ground truth data |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/bm25-baseline.vitest.ts` | BM25 baseline evaluation |
| `mcp_server/tests/eval-metrics.vitest.ts` | Eval metrics computation |
| `mcp_server/tests/ground-truth.vitest.ts` | Ground truth tests |

---

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: BM25-only baseline
- Current reality source: FEATURE_CATALOG.md
- audited_post_018: true
- phase_018_change: aligned the baseline wording with the live BM25/FTS5-only runner and the default-enabled BM25 path

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 011
