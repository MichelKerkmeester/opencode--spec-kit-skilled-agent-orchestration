---
title: "Core metric computation"
description: "Covers the twelve retrieval quality metrics (MRR@5, NDCG@10, Recall@20, Hit Rate@1 and eight diagnostic metrics) that measure where the pipeline fails, not just whether it fails."
---

# Core metric computation

## 1. OVERVIEW

Covers the twelve retrieval quality metrics (MRR@5, NDCG@10, Recall@20, Hit Rate@1 and eight diagnostic metrics) that measure where the pipeline fails, not just whether it fails.

Think of this like a report card for search quality, but with twelve different grades instead of just one pass/fail. Some grades tell you whether the best answer shows up first, others tell you whether all the right answers are found at all. Together they pinpoint exactly where search is struggling, like a doctor running multiple tests to find the real problem instead of just asking "do you feel sick?"

---

## 2. CURRENT REALITY

Twelve metrics run against logged retrieval data. The four primary ones are MRR@5 (how high does the right answer rank?), NDCG@10 (are results ordered well?), Recall@20 (do we find everything relevant?) and Hit Rate@1 (is the top result correct?).

Eight diagnostic metrics add depth. Inversion rate counts pairwise ranking mistakes. Constitutional surfacing rate tracks whether high-priority memories appear in top results. Importance-weighted recall favors recall of critical content. Cold-start detection rate measures whether fresh memories surface when relevant. Precision@K and F1@K expose precision/recall balance. MAP captures ranking quality across the full relevant set. Intent-weighted NDCG adjusts ranking quality by query type.

IR rank-based metrics now use contiguous 1-based positions within the evaluated top-K slice via `getRankAtIndex() = index + 1`, not external sparse rank labels carried through filtering or reranking. That keeps MRR, NDCG, and MAP aligned with standard IR definitions instead of understating them when rank numbers have gaps.

This battery of metrics means you can diagnose where the pipeline fails, not just whether it fails.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-metrics.ts` | Lib | Core metric computation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/eval-metrics.vitest.ts` | Eval metrics computation |

---

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: Core metric computation
- Current reality source: FEATURE_CATALOG.md

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 006
