---
title: "Synthetic ground truth corpus"
description: "Describes the 110-query ground truth corpus covering all seven intent types with hand-written natural language queries, hard negatives and agent consumption findings for realistic retrieval evaluation."
---

# Synthetic ground truth corpus

## 1. OVERVIEW

Describes the 110-query ground truth corpus covering all seven intent types with hand-written natural language queries, hard negatives and agent consumption findings for realistic retrieval evaluation.

To know if search results are right, you need an answer key. This is a collection of 110 test questions with known correct answers, written in everyday language rather than system keywords. It also includes trick questions designed to catch the system returning wrong results. Without this answer key, there would be no reliable way to measure whether changes actually improve or hurt search quality.

---

## 2. CURRENT REALITY

A corpus of 110 query-relevance pairs covers all seven intent types with at least five queries per type and at least three complexity tiers (simple factual, moderate relational, complex multi-hop).

40 queries are hand-written natural language, not derived from trigger phrases. That last detail matters. If your ground truth comes from the same trigger phrases the system already matches against, you are testing the system against itself.

Hard negative queries are included to verify that irrelevant memories rank low. The corpus also incorporates findings from the G-NEW-2 agent consumption analysis, so queries reflect how agents actually use the system rather than how a spec author imagines they do.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/eval/ground-truth-data.ts` | Lib | Ground truth data |
| `mcp_server/lib/eval/ground-truth-generator.ts` | Lib | Synthetic ground truth generator |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/ground-truth.vitest.ts` | Ground truth tests |

---

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: Synthetic ground truth corpus
- Current reality source: FEATURE_CATALOG.md

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 010
