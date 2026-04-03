---
title: "Feature Specification: Wire PromotionGate to Action"
description: "Connect runShadowEvaluation() promotionGate result to flip adaptive mode or apply threshold changes, closing the adaptive ranking feedback loop."
trigger_phrases:
  - "promotion gate"
  - "adaptive ranking promotion"
  - "shadow evaluation action"
  - "wire promotion"
importance_tier: "normal"
contextType: "implementation"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-persist-tuned-thresholds |
| **Handoff Criteria** | promotionGate result triggers threshold tuning; test proves gate→action path |

### Phase Context

This is **Phase 1** of the adaptive-ranking-prerequisites specification.

**Scope Boundary**: Only the promotionGate→action wiring. Does NOT persist thresholds (Phase 2) or change live ranking order.

**Dependencies**:
- `shadow-evaluation-runtime.ts` returns `promotionGate` from `runShadowEvaluation()`
- `adaptive-ranking.ts` exports `tuneAdaptiveThresholdsAfterEvaluation()` (currently orphaned)
- `shadow-scoring.ts` computes `promotionGate` with `{ pass, ndcg_delta, mrr_delta, kendall_tau, recommendation }`

**Deliverables**:
- Wired promotionGate→action path in shadow evaluation scheduler
- Unit tests proving the connection

---

# Feature Specification: Wire PromotionGate to Action

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete (with review findings) |
| **Created** | 2026-03-31 |
| **Branch** | `system-speckit/024-compact-code-graph` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`runShadowEvaluation()` computes a `promotionGate` result (pass/fail with NDCG/MRR/Kendall-tau metrics and a recommendation), but nothing acts on it. The shadow evaluation scheduler in `context-server.ts` logs the recommendation but never calls `tuneAdaptiveThresholdsAfterEvaluation()` or flips adaptive mode. This breaks the adaptive ranking feedback loop — shadow proposals are evaluated but never improve.

### Purpose
Close the feedback loop: when the shadow evaluation scheduler completes a cycle, feed the `promotionGate` result into `tuneAdaptiveThresholdsAfterEvaluation()` so thresholds are adjusted based on evaluation outcomes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Wire `promotionGate` result from `runShadowEvaluation()` to `tuneAdaptiveThresholdsAfterEvaluation()`
- Add the call in the shadow evaluation scheduler (context-server.ts or shadow-evaluation-runtime.ts)
- Unit test the gate→action path

### Out of Scope
- Persisting tuned thresholds to SQLite (Phase 2)
- Changing live result ordering (future — requires promoted mode work)
- Modifying the promotionGate computation logic itself
- Flipping `SPECKIT_MEMORY_ADAPTIVE_MODE` env var at runtime

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/feedback/shadow-evaluation-runtime.ts` | Modify | After `runShadowEvaluation()`, call `tuneAdaptiveThresholdsAfterEvaluation()` with gate results |
| `mcp_server/lib/cognitive/adaptive-ranking.ts` | Modify | Ensure `tuneAdaptiveThresholdsAfterEvaluation()` accepts the gate result shape cleanly |
| `mcp_server/tests/shadow-evaluation-runtime.vitest.ts` | Modify | Add test: promotionGate pass → thresholds tuned |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Wire promotionGate to tuneAdaptiveThresholdsAfterEvaluation | After `runShadowEvaluation()` returns, `tuneAdaptiveThresholdsAfterEvaluation(db, gateResult)` is called |
| REQ-002 | Gate result shape compatibility | `tuneAdaptiveThresholdsAfterEvaluation()` accepts the `promotionGate` shape from `shadow-scoring.ts` without type errors |
| REQ-003 | No-op when adaptive ranking disabled | If `getAdaptiveMode() === 'disabled'`, the tuning call is skipped gracefully |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Unit test: gate pass → tune called | Vitest test proves that a passing promotionGate triggers threshold adjustment |
| REQ-005 | Unit test: gate fail → tune skipped or uses failure path | Vitest test proves that a failing gate does not promote thresholds |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `tuneAdaptiveThresholdsAfterEvaluation()` is called after every shadow evaluation cycle when adaptive ranking is enabled
- **SC-002**: All existing tests continue to pass (41/41 across adaptive-ranking, adaptive-fusion, shadow-evaluation-runtime suites)
- **SC-003**: New tests cover both gate-pass and gate-fail paths
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 2 (persist thresholds) | Tuned thresholds are in-memory only via WeakMap — lost on restart | Accept for now; Phase 2 adds SQLite persistence |
| Risk | Evaluation uses shadow's own scores as labels | Tuning may reinforce the shadow model's biases | Phase 3 addresses real feedback labels; this phase just wires the path |
| Risk | Breaking existing shadow-evaluation tests | Medium | Run full vitest suite before/after changes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — the GPT 5.4 investigation fully mapped the code path and confirmed the wiring gap
<!-- /ANCHOR:questions -->

---

### Acceptance Scenarios

- **Given** adaptive ranking is enabled and `runShadowEvaluation()` returns a ready promotion gate, **When** the scheduler finishes the cycle, **Then** `tuneAdaptiveThresholdsAfterEvaluation()` is invoked.
- **Given** adaptive ranking is disabled, **When** a shadow evaluation cycle completes, **Then** the tuning path exits without mutating thresholds.
- **Given** the promotion gate fails, **When** the scheduler processes the result, **Then** threshold tuning does not run.
- **Given** the phase regression suite runs after wiring is added, **When** TypeScript and Vitest checks complete, **Then** the new gate-path tests pass with no regressions.

**Post-Implementation Review Findings**

> Deep review completed (15 iterations across two rounds). All P1 findings are fixed. No deferred items remain.

| Priority | Status | Finding |
|----------|--------|---------|
| P1 | FIXED | `tuneAdaptiveThresholdsAfterEvaluation()` only takes a `db` param — it cannot consume the `promotionGate` result (`recommendation`/`ready` fields). Fixed: now gates on `promotionGate.ready`, but the tuner still does not receive gate metrics to inform tuning magnitude. |
| P1 | FIXED | Tuning runs after every passing cycle — no idempotency guard per signal snapshot. The same signal state can trigger repeated threshold adjustments, potentially ratcheting thresholds toward their clamp limits. |
| P1 | FIXED | Watermark now includes `gateResult.recommendation` to prevent skipped tuning on state-only changes. Previously, a cycle with an identical `pass` flag but a changed recommendation would not advance the watermark, causing the tuner to re-run on the same signal snapshot. |
| P1 | FIXED | `memory_validate` now stores `queryText` in the signal record; replay filtering matches against the stored query rather than performing a global cross-query lookup. Shared fix with Phase 3. |
