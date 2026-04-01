---
title: "Phase README: Real Feedback Labels for Evaluation"
description: "Overview of Phase 3, which made shadow replay query-aware and aligned validation metadata with replay matching."
trigger_phrases:
  - "phase 3 readme"
  - "real feedback labels overview"
importance_tier: "normal"
contextType: "implementation"
---
# Phase 3: Real Feedback Labels for Evaluation

This phase fixed the replay-label seam in adaptive ranking. Shadow evaluation now uses real query-scoped outcome and correction feedback instead of labels derived from the shadow proposal itself.

## What Changed

- `getRelevanceFeedback()` now filters by `query` and `metadata.queryText`
- Raw `outcome - correction` totals are normalized into a centered `0..1` range
- Replay skips holdout queries that have no matching query-scoped feedback
- `memory_validate` now stores `queryText` so replay can match validation feedback to the original query

## Key Files

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`

## Verification Anchor

See `implementation-summary.md` and `checklist.md` for the shipped behavior and evidence references into `shadow-evaluation-runtime.ts`, `checkpoints.ts`, and `adaptive-ranking-e2e.vitest.ts`.
