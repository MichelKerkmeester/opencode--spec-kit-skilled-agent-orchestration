---
title: "Full-context ceiling evaluation"
description: "Describes the LLM-based ceiling evaluation that ranks all memory titles and summaries to compute a theoretical upper-bound MRR@5, framing how much room for improvement exists between the BM25 floor and the LLM ceiling."
---

# Full-context ceiling evaluation

## 1. OVERVIEW

Describes the LLM-based ceiling evaluation that ranks all memory titles and summaries to compute a theoretical upper-bound MRR@5, framing how much room for improvement exists between the BM25 floor and the LLM ceiling.

**DEPRECATED:** `eval-ceiling.ts` was never wired into the production pipeline. The full-context ceiling baseline is retained for reference only.

This answers the question: "How good could search results possibly be if the system were perfect?" By asking an AI to rank every single piece of stored knowledge for each test question, you get a best-case score. Comparing that ceiling against actual results tells you how much room for improvement still exists, like knowing the top possible grade so you can see how close you are.

---

## 2. CURRENT REALITY

`eval-ceiling.ts` is marked `@deprecated` and retained only as a reference baseline.

How good could retrieval be if the system had perfect recall? To answer that, an LLM receives all memory titles and summaries and ranks them for each ground truth query. The resulting MRR@5 score is the theoretical upper bound. The gap between this ceiling and actual hybrid performance tells you how much room for improvement exists. A 2x2 matrix alongside the BM25 baseline puts both numbers in context: the BM25 floor shows the minimum, the LLM ceiling shows the maximum and the hybrid pipeline sits somewhere between.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/eval-ceiling.ts` | Lib | Full context ceiling evaluation |
| `mcp_server/lib/eval/eval-metrics.ts` | Lib | Core metric computation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/ceiling-quality.vitest.ts` | Ceiling evaluation and quality proxy validation |
| `mcp_server/tests/eval-metrics.vitest.ts` | Eval metrics computation |

---

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: Full-context ceiling evaluation
- Current reality source: feature_catalog.md

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 008
