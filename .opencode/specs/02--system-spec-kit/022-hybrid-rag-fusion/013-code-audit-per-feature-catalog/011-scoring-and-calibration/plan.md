---
# <!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
title: "Implementation Plan: scoring-and-calibration [template:level_2/plan.md]"
description: "This plan records how the scoring-and-calibration audit moved from findings to completed remediation, including the approved follow-up fixes used to close the phase cleanly."
template_source: "plan-core + level2-verify | v2.2"
trigger_phrases:
  - "implementation"
  - "plan"
  - "scoring"
  - "calibration"
  - "feature audit"
  - "rrf"
  - "coherence"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: scoring-and-calibration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec docs + TypeScript implementation and Vitest tests |
| **Framework** | SpecKit Level 2 templates + feature-catalog remediation workflow |
| **Storage** | Repository docs and existing SQLite-backed MCP storage |
| **Testing** | Targeted/package-local Vitest, prior TSC and eslint verification, plus spec validation |

### Overview
This plan now reflects a completed remediation workflow rather than a future proposal. The phase closed the original scoring-and-calibration implementation tasks, then applied a narrow follow-up patch for access-tracker threshold flush behavior, targeted regression coverage, and RRF wording alignment before final documentation synchronization.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Feature-oriented remediation workflow over existing MCP server modules, tests, and feature-catalog artifacts.

### Key Components
- **Feature Catalog**: Holds current-reality claims and source/test mappings for the scoring-and-calibration features.
- **MCP Runtime**: Contains the scoring, fusion, reranking, and access-tracking implementation surfaces corrected during the phase.
- **Spec Folder**: Carries the closure state, verification evidence, and final narrative for the completed work.

### Data Flow
Audit findings were normalized into tasks, executed in runtime and catalog files, verified through targeted tests, then synchronized into the Level 2 phase docs once the approved follow-up patch landed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Feature inventory captured
- [x] Findings normalized by severity
- [x] Document templates aligned

### Phase 2: Core Implementation
- [x] Address P0 remediation items
- [x] Address P1 remediation items
- [x] Address P2 verification/test-gap items

### Phase 3: Verification
- [x] Manual testing complete
- [x] Edge cases handled
- [x] Documentation updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Scoring, reranking, and access-tracker regressions | Vitest |
| Integration | Handler-path, storage, and fusion behavior touched by completed tasks | Vitest |
| Manual | Feature-catalog to implementation trace review plus spec-folder validation | Audit review + `validate.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/*.md` | Internal | Green | Behavior claims cannot be reconciled against the delivered catalog narrative |
| Targeted suites under `.opencode/skill/system-spec-kit/mcp_server/tests/` | Internal | Green | Follow-up fixes would lose regression coverage |
| Level 2 templates under `.opencode/skill/system-spec-kit/templates/level_2/` | Internal | Green | Structure and anchors may drift from standard |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any shipped scoring/calibration remediation or follow-up fix introduces regression or invalidates catalog claims.
- **Procedure**: Revert the affected change set, restore the last known passing targeted-suite baseline, and reopen the impacted task IDs in `tasks.md`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Tracing) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Tracing |
| Tracing | Setup | Core |
| Core | Setup, Tracing | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | High | 1-2 days |
| Verification | Medium | 2-4 hours |
| **Total** | | **2-3 days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Disable or revert the impacted scoring/calibration path.
2. Revert the affected remediation commit set.
3. Re-run targeted regression suites for the touched modules.
4. Reconcile feature-catalog narratives and reopen impacted tasks.

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
