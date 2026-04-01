---
title: "Tasks: Wire PromotionGate to Action"
description: "Task breakdown for wiring promotionGate result to tuneAdaptiveThresholdsAfterEvaluation"
trigger_phrases:
  - "promotion gate tasks"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Wire PromotionGate to Action

## Task List

- [x] **T1** [P0] Import `tuneAdaptiveThresholdsAfterEvaluation` and `getAdaptiveMode` into `shadow-evaluation-runtime.ts`
- [x] **T2** [P0] Add conditional tuning call after `runShadowEvaluation()` returns in scheduler cycle
- [x] **T3** [P0] Verify type compatibility between evaluation result shape and tuning function signature
- [x] **T4** [P0] Add test: gate pass + adaptive enabled → tune called (`shadow-evaluation-runtime.vitest.ts`)
- [x] **T5** [P0] Add test: gate fail → tune skipped (`shadow-evaluation-runtime.vitest.ts`)
- [x] **T6** [P0] Add test: adaptive disabled → no-op (`shadow-evaluation-runtime.vitest.ts`)
- [x] **T7** [P0] Run full vitest suite (41 existing + 3 new must pass)
- [x] **T8** [P0] Compile check: `npx tsc --noEmit`

## Estimated LOC
~30-50 lines (import + conditional call + 3 test cases)

## Priority
All tasks are P0 — required for phase completion.
