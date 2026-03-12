---
title: "Implementation Plan: bug-fixes-and-data-integrity [template:level_2/plan.md]"
description: "Audit and remediation plan for 11 bug-fix/data-integrity features in hybrid RAG fusion, focusing on catalog-code-test alignment and regression hardening."
trigger_phrases:
  - "implementation plan"
  - "bug fixes"
  - "data integrity"
  - "hybrid rag fusion"
  - "regression coverage"
  - "safe swap"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: bug-fixes-and-data-integrity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | Spec Kit Memory MCP server + feature-catalog markdown workflow |
| **Storage** | SQLite + markdown artifacts |
| **Testing** | Vitest + manual playbook scenarios |

### Overview
This plan executes a feature-by-feature audit remediation across the 08 bug-fixes-and-data-integrity catalog. It aligns catalog implementation/test tables with real source paths, resolves correctness gaps in targeted runtime modules, and adds missing regressions for high-risk edge cases. Work is sequenced from catalog alignment to code fixes and then verification hardening.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met — 14/14 tasks complete, targeted audited suite passing
- [x] Tests passing (if applicable) — TSC 0 errors, Vitest 49/49 green on audited files
- [x] Docs updated (spec/plan/tasks) — All spec folder artifacts synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Monolith

### Key Components
- **Feature Catalog (`feature_catalog/08--bug-fixes-and-data-integrity/`)**: Source of per-feature "Current Reality", implementation, and test mappings.
- **MCP Server Runtime (`mcp_server/lib` + `mcp_server/handlers`)**: Concrete behavior under audit for dedup, safety guards, scoring, and orchestration.

### Data Flow
Catalog feature definitions are inventoried first, then cross-checked against runtime modules and test suites. Findings are converted into prioritized remediation tasks, followed by targeted code/catalog updates and regression verification against playbook scenarios.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory all 11 feature files and validate implementation/test tables — Agents 1 & 2 completed T001-T005
- [x] Cross-reference playbook scenarios EX-034 and NEW-040..049 — Mapped across F-02, F-03, F-05, F-06, F-07
- [x] Confirm remediation backlog priorities (5x P0, 8x P1, 1x P2) — All 14 tasks prioritized and assigned

### Phase 2: Core Implementation
- [x] Correct catalog pathing and behavior claims (F-02, F-03, F-05, F-06, F-07, F-11) — Agents 1 & 2, T001-T005, T010
- [x] Apply targeted code hardening (explicit exports, spread-max removal, safe-swap semantics) — Agent 3, T006-T007, T009
- [x] Add integration-path coverage for content-hash dedup behavior — Agent 4, T008 (23 tests)

### Phase 3: Verification
- [x] Execute large-array, dedup, rollback, timestamp, and stress regressions — Agents 4 & 5, T011-T014 (49 tests total in audited suite)
- [x] Re-validate catalog entries against updated code/test evidence — All catalog tables cross-checked
- [x] Synchronize spec.md, plan.md, tasks.md, and checklist.md — All artifacts updated
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `folder-scoring`, `co-activation`, `working-memory`, `session-manager` logic | Vitest |
| Integration | save/index dedup path, chunking-orchestrator swap behavior | Vitest |
| Manual | EX-034 and NEW-040..049 scenario validation | Playbook + review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Feature catalog docs (`08--bug-fixes-and-data-integrity`) | Internal | Green | Cannot align findings/tasks without authoritative catalog text |
| MCP server runtime modules and tests | Internal | Green | Verification cannot prove behavior alignment |
| Manual playbook scenarios (EX-034, NEW-040..049) | Internal | Yellow | Coverage mapping remains partial/inconclusive |
| Product decision on force-path safe-swap semantics | Internal | Yellow | F-10 cannot be closed as PASS |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Regression failures, behavior drift, or incorrect catalog mappings introduced by remediation edits.
- **Procedure**: Revert affected commits, rerun targeted Vitest suites, and restore prior catalog text for impacted features.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Catalog Setup) ──────┐
                              ├──► Phase 2 (Fixes) ──► Phase 3 (Verify)
Phase 1.5 (Playbook Map) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Fixes, Playbook Map |
| Playbook Map | Setup | Fixes |
| Fixes | Setup, Playbook Map | Verify |
| Verify | Fixes | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 2-3 hours |
| Core Implementation | High | 6-10 hours |
| Verification | Medium | 3-5 hours |
| **Total** | | **11-18 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Disable or gate the affected behavior path (if runtime-impacting).
2. Revert remediation commits for impacted modules/catalog entries.
3. Re-run targeted regression suites and smoke-check critical search/save/session flows.
4. Notify stakeholders and document rollback rationale in spec artifacts.

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
