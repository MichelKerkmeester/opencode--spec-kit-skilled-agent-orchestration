# Full-context ceiling evaluation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)
- [5. PLAYBOOK COVERAGE](#5--playbook-coverage)
- [6. IN SIMPLE TERMS](#6--in-simple-terms)

## 1. OVERVIEW

Describes the LLM-based ceiling evaluation that ranks all memory titles and summaries to compute a theoretical upper-bound MRR@5, framing how much room for improvement exists between the BM25 floor and the LLM ceiling.

## 2. CURRENT REALITY

How good could retrieval be if the system had perfect recall? To answer that, an LLM receives all memory titles and summaries and ranks them for each ground truth query. The resulting MRR@5 score is the theoretical upper bound. The gap between this ceiling and actual hybrid performance tells you how much room for improvement exists. A 2x2 matrix alongside the BM25 baseline puts both numbers in context: the BM25 floor shows the minimum, the LLM ceiling shows the maximum and the hybrid pipeline sits somewhere between.

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

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: Full-context ceiling evaluation
- Current reality source: feature_catalog.md

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario NEW-008

## 6. IN SIMPLE TERMS

This answers the question: "How good could search results possibly be if the system were perfect?" By asking an AI to rank every single piece of stored knowledge for each test question, you get a best-case score. Comparing that ceiling against actual results tells you how much room for improvement still exists, like knowing the top possible grade so you can see how close you are.
