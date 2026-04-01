---
title: "Phase README: End-to-End Integration Test"
description: "Overview of Phase 5, which documented and verified the shipped adaptive ranking lifecycle suite."
trigger_phrases:
  - "phase 5 readme"
  - "adaptive ranking e2e overview"
importance_tier: "normal"
contextType: "implementation"
---
# Phase 5: End-to-End Integration Test

This phase documents the lifecycle regression suite in `tests/adaptive-ranking-e2e.vitest.ts`. The suite uses real in-memory SQLite state and real adaptive ranking logic, while mocking a small set of runtime dependencies that sit outside the lifecycle boundary.

## What Changed

- The docs now describe the shipped four-scenario test file instead of an idealized single no-mock test
- Phase 3 and Phase 4 seams are called out explicitly
- Seed counts now match the assertions in the suite, including `clearedSignals: 23` and `clearedRuns: 2`
- The scheduled replay case is documented as a targeted, deterministic seam test

## Key Files

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`

## Verification Anchor

See `implementation-summary.md` and `checklist.md` for references into `adaptive-ranking-e2e.vitest.ts` and the related runtime modules.
