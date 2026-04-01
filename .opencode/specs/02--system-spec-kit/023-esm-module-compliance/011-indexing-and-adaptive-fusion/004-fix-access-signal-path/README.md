---
title: "Phase README: Fix Access Signal Path"
description: "Overview of Phase 4, which wired batched adaptive access writes into the stage-2 search pipeline."
trigger_phrases:
  - "phase 4 readme"
  - "access signal path overview"
importance_tier: "normal"
contextType: "implementation"
---
# Phase 4: Fix Access Signal Path

This phase connected adaptive access tracking to the main search pipeline. When `trackAccess` is enabled, the pipeline now writes adaptive access rows through a batched stage-2 helper that sits next to the existing FSRS write-back path.

## What Changed

- `recordAdaptiveAccessSignals()` was added to `stage2-fusion.ts`
- Access writes use one prepared insert and one transaction over the accessed result set
- Stored access rows keep the originating query text
- Failures log a warning without interrupting search delivery

## Key Files

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`

## Verification Anchor

See `checklist.md` for the exact `stage2-fusion.ts` line references and `implementation-summary.md` for the shipped design notes.
