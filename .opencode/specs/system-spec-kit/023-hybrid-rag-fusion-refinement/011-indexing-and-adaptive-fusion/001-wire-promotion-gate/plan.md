---
title: "Impleme [system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/001-wire-promotion-gate/plan]"
description: "Connect runShadowEvaluation() promotionGate result to tuneAdaptiveThresholdsAfterEvaluation() in the shadow evaluation scheduler, closing the adaptive ranking feedback loop."
trigger_phrases:
  - "promotion gate wiring"
  - "shadow evaluation action"
  - "adaptive ranking tuning"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/001-wire-promotion-gate"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Wire PromotionGate to Action

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM) |
| **Framework** | MCP Server (stdio), better-sqlite3 |
| **Storage** | SQLite (adaptive_signal_events, adaptive_shadow_runs) |
| **Testing** | Vitest |

### Overview
Wire the `promotionGate` result from `runShadowEvaluation()` into `tuneAdaptiveThresholdsAfterEvaluation()` within the shadow evaluation scheduler path. Currently the scheduler logs the recommendation but takes no action. After this change, threshold adjustments will be applied in-memory (persistence deferred to Phase 2).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] `tuneAdaptiveThresholdsAfterEvaluation()` called after shadow evaluation cycle
- [ ] Tests passing (41 existing + 2 new)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Callback injection — shadow evaluation runtime calls tuning function post-evaluation.

### Key Components

```
shadow-evaluation-runtime.ts
  runScheduledShadowEvaluationCycle()
    → executePipeline() (replay)
    → buildAdaptiveShadowProposal()
    → runShadowEvaluation()
    → promotionGate { pass, ndcg_delta, mrr_delta, kendall_tau, recommendation }
    → [NEW] tuneAdaptiveThresholdsAfterEvaluation(db, gateResult)  ← THIS IS THE WIRING

adaptive-ranking.ts
  tuneAdaptiveThresholdsAfterEvaluation(db, evaluationResult)
    → summarizeAdaptiveSignalQuality(db)
    → setAdaptiveThresholdOverrides(db, newOverrides)
    → [in-memory WeakMap — Phase 2 adds SQLite]
```

### Data Flow

```
consumption_log → replay queries → shadow proposals → rank comparison
    → promotionGate metrics → tuneAdaptiveThresholdsAfterEvaluation()
        → adjusts maxAdaptiveDelta, signalWeights, minSignalsForPromotion
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Wire the Call (REQ-001, REQ-002, REQ-003)

**File: `mcp_server/lib/feedback/shadow-evaluation-runtime.ts`**

1. Import `tuneAdaptiveThresholdsAfterEvaluation` and `getAdaptiveMode` from `../cognitive/adaptive-ranking.js`
2. After `runShadowEvaluation()` returns in the scheduler cycle function, add:
   ```typescript
   if (getAdaptiveMode() !== 'disabled' && evaluationResult.promotionGate) {
     tuneAdaptiveThresholdsAfterEvaluation(db, evaluationResult);
   }
   ```
3. Verify `tuneAdaptiveThresholdsAfterEvaluation()` signature accepts the evaluation result shape — if not, adapt the call to extract `{ promotionGate, metrics }` into the expected format

**File: `mcp_server/lib/cognitive/adaptive-ranking.ts`** (if needed)

4. Check that the function signature accepts the shape returned by `runShadowEvaluation()`. May need a thin adapter or type alignment.

### Phase 2: Tests (REQ-004, REQ-005)

**File: `mcp_server/tests/shadow-evaluation-runtime.vitest.ts`**

5. Add test: "when promotionGate passes and adaptive ranking enabled, tuneAdaptiveThresholdsAfterEvaluation is called"
6. Add test: "when adaptive ranking is disabled, tuneAdaptiveThresholdsAfterEvaluation is NOT called"
7. Mock `getAdaptiveMode()` and `tuneAdaptiveThresholdsAfterEvaluation()` to verify call/no-call

### Phase 3: Verify

8. Run full vitest suite: `npx vitest run tests/adaptive-ranking.vitest.ts tests/shadow-evaluation-runtime.vitest.ts tests/adaptive-fusion.vitest.ts`
9. Compile: `npx tsc --noEmit` to check type safety
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Type | File | Validates |
|------|------|------|-----------|
| Gate pass → tune called | Unit | shadow-evaluation-runtime.vitest.ts | REQ-001, REQ-004 |
| Gate fail → tune skipped | Unit | shadow-evaluation-runtime.vitest.ts | REQ-005 |
| Disabled mode → no-op | Unit | shadow-evaluation-runtime.vitest.ts | REQ-003 |
| Existing 41 tests | Regression | all 3 suites | No breakage |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Missing |
|------------|------|--------|-------------------|
| `tuneAdaptiveThresholdsAfterEvaluation` export | Code | Available | Cannot wire without it |
| `runShadowEvaluation` return shape | Code | Available | Must match expected input |
| Phase 2 (persist thresholds) | Successor | Not started | Tuned values lost on restart |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Minimal risk — the tuning call only fires when `SPECKIT_MEMORY_ADAPTIVE_RANKING=true` (currently off). Rollback: revert the import and conditional call in `shadow-evaluation-runtime.ts`.
<!-- /ANCHOR:rollback -->
