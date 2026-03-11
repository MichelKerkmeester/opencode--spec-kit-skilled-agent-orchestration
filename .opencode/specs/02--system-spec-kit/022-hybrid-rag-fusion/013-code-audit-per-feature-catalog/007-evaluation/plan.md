---
title: "Implementation Plan: evaluation [template:level_2/plan.md]"
description: "Implement Evaluation-category audit remediation by reconciling behavior claims, closing handler test gaps, and preserving existing MCP/SQLite workflows."
trigger_phrases:
  - "implementation"
  - "plan"
  - "evaluation"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: evaluation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | MCP tool handlers/services |
| **Storage** | SQLite |
| **Testing** | Vitest |

### Overview
This plan executes the Evaluation-phase audit findings by focusing on one P0 behavior mismatch and targeted handler-level test/documentation gaps. The approach preserves existing architecture, updates behavior claims or implementation where needed, and verifies outcomes with focused Vitest coverage.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable) — 97/97
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Modular MCP handler + service-layer audit/remediation workflow

### Key Components
- **Evaluation feature catalog docs**: Define expected Current Reality and test inventory claims.
- **Eval reporting handlers/services**: Implement runtime behavior for ablation and dashboard paths.

### Data Flow
Feature catalog expectations are mapped to handler/service implementations, compared against SQLite-backed query behavior, then validated via targeted Vitest coverage and documented as prioritized findings.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read both Evaluation feature docs and extract implementation/test references
- [x] Map manual playbook coverage (`EX-032`, `EX-033`)
- [x] Confirm audit criteria and expected outputs

### Phase 2: Core Implementation
- [x] Reconcile F-02 `eval_final_results` behavior mismatch (code or catalog) — catalog claim corrected
- [x] Add handler-level tests for dashboard and ablation flows — 16 tests in handler-eval-reporting.vitest.ts
- [x] Remove stale test-file references and finalize remediation tasks — confirmed clean, no stale refs

### Phase 3: Verification
- [x] Manual testing complete — 97/97 tests pass
- [x] Edge cases handled — channel normalization, recallK boundaries, disabled flag, DB unavailable
- [x] Documentation updated — all spec docs synchronized
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Handler argument normalization, defaults, and error branches | Vitest |
| Integration | MCP dispatch to eval handlers with SQLite-backed behavior checks | Vitest + SQLite fixtures |
| Manual | Playbook scenario parity (`EX-032`, `EX-033`) and findings traceability | Feature catalog + audit artifacts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `feature_catalog/07--evaluation/*.md` accuracy | Internal | Yellow | Findings cannot be finalized against incorrect baseline claims |
| Eval reporting modules (`handlers/eval-reporting.ts`, `lib/eval/reporting-dashboard.ts`) | Internal | Green | Remediation implementation/testing blocked if interfaces change unexpectedly |
| Vitest evaluation test harness | Internal | Green | Verification cannot be completed confidently |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Regression in eval handler behavior, failing targeted tests, or unresolved behavior parity after attempted remediation.
- **Procedure**: Revert remediation commits, restore prior catalog assertions if needed, and rerun baseline Vitest coverage before reattempt.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ─────────┐
                         ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Mapping) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Mapping, Core |
| Mapping | Setup | Core |
| Core | Setup, Mapping | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Medium | 3-6 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **5-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Disable/remap the affected evaluation behavior change.
2. Revert code or documentation deltas to last known-good revision.
3. Run targeted Vitest coverage for ablation/dashboard flows.
4. Record rollback rationale and follow-up remediation plan.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
