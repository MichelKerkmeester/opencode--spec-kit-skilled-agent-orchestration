---
title: "BM25-only baseline"
description: "Describes the FTS5-only baseline measurement (MRR@5 of 0.2083) that confirmed hybrid retrieval adds real value over keyword search alone."
---

# BM25-only baseline

## 1. OVERVIEW

Describes the FTS5-only baseline measurement (MRR@5 of 0.2083) that confirmed hybrid retrieval adds real value over keyword search alone.

This test answered a simple question: "Would basic keyword search be good enough on its own?" By running just keyword matching against 110 test questions and measuring how poorly it performed, the team proved that the more advanced multi-method search approach is worth the extra effort. Without this baseline measurement, you would be guessing whether the added complexity actually helps.

---

## 2. CURRENT REALITY

Running FTS5 alone (disabling vector, graph and trigger channels) on the 110-query corpus produced an MRR@5 of 0.2083. That is well below 50% of hybrid performance.

If BM25 had been competitive, the entire multi-channel approach would be questioned. Instead, the gap confirmed that hybrid retrieval adds real value over keyword search. The contingency decision to proceed with the full program was based on this measurement. No opinions, no intuitions, just a number. The in-memory BM25 channel (distinct from FTS5) now runs only when `ENABLE_BM25` is explicitly enabled; default runtime behavior leaves FTS5 as the lexical baseline. Reproducing a true in-memory BM25-only comparison therefore requires opting in to the BM25 flag first, while the FTS5-only lexical baseline can still run with the default configuration.

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

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 011
