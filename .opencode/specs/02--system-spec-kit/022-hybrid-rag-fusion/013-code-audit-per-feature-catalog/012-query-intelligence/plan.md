---
title: "Implementation Plan: query-intelligence [template:level_2/plan.md]"
description: "This plan executes a feature-by-feature code audit for the Query Intelligence catalog scope and produces prioritized remediation outputs. The approach combines catalog-to-code verification, test-gap analysis, and standardized PASS/WARN/FAIL reporting."
trigger_phrases:
  - "query intelligence"
  - "query-intelligence"
  - "implementation plan"
  - "code audit"
  - "query complexity router"
  - "relative score fusion"
  - "channel representation"
  - "token budget"
  - "query expansion"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: query-intelligence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js MCP server) |
| **Framework** | Spec Kit Memory search pipeline modules |
| **Storage** | SQLite-backed metadata and in-memory ranking pipeline |
| **Testing** | Vitest suites (unit, integration) + manual catalog review |

### Overview
This plan performs a structured audit of six Query Intelligence features from `feature_catalog/12--query-intelligence/` and maps findings to a prioritized remediation backlog. The implementation approach follows feature inventory, per-feature code/test review, playbook cross-referencing, and synchronized Level 2 documentation outputs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Monolith (catalog-driven audit workflow over Query Intelligence implementation and test surfaces)

### Key Components
- **Feature Catalog (`feature_catalog/12--query-intelligence/`)**: Declares current-reality behavior and source/test inventories.
- **Search Modules (`query-classifier`, `rsf-fusion`, `channel-representation`, `hybrid-search`, `stage1-candidate-gen`)**: Primary implementation evidence.
- **Spec Artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`)**: Structured outputs for scope, execution, remediation, and verification.

### Data Flow
Feature definitions establish expected behavior, implementation/test files are reviewed for correctness and behavior alignment, gaps are classified by severity, and findings are translated into prioritized tasks plus verification checklist state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Feature inventory created for all 6 Query Intelligence features
- [x] Source/test mappings extracted per feature
- [x] Playbook scenario references captured (NEW-060+)

### Phase 2: Core Implementation
- [x] Correctness and standards review executed per feature
- [x] Behavior match validated against catalog "Current Reality"
- [x] PASS/WARN/FAIL findings and recommended fixes documented

### Phase 3: Verification
- [ ] Regression-test gaps validated against actual assertions
- [ ] Priority backlog consistency checked (P0/P1/P2)
- [ ] Documentation synchronized across spec, tasks, and checklist
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Query classifier/router/fusion/channel/token-budget/expansion module logic | Vitest |
| Integration | Hybrid-search pipeline behaviors (trace metadata, channel enforcement, Stage-1 orchestration) | Vitest |
| Manual | Catalog-to-code-to-task traceability review | Markdown review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `feature_catalog/12--query-intelligence/*.md` | Internal | Green | Audit expectations cannot be validated if catalog definitions drift |
| `mcp_server/lib/search/*` and related tests | Internal | Yellow | Incomplete assertions or stale references reduce closure confidence |
| Manual playbook scenarios (NEW-060+) | Internal | Yellow | Per-feature manual coverage remains incomplete without explicit mapping |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Template non-compliance, missing mapped findings, or accidental scope drift.
- **Procedure**: Restore prior docs for `012-query-intelligence/` from git history and reapply mapping with required anchors/comments intact.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Inventory) ──────┐
                          ├──► Phase 2 (Audit) ──► Phase 3 (Verify)
Phase 1.5 (Playbook) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | Audit, Playbook |
| Playbook | Inventory | Audit |
| Audit | Inventory, Playbook | Verify |
| Verify | Audit | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Core Implementation | High | 4-6 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **7-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (git snapshot of `012-query-intelligence/`)
- [ ] Feature flag configured (N/A for docs-only phase)
- [ ] Monitoring alerts set (N/A for docs-only phase)

### Rollback Procedure
1. Revert `012-query-intelligence/` documentation files to last known-good revision.
2. Re-apply Level 2 templates with required anchors and SPECKIT comments.
3. Re-map findings/tasks/checklist counts and verify cross-file consistency.
4. Notify stakeholders if audit conclusions changed during rollback.

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
