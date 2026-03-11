---
title: "Implementation Plan: analysis [template:level_2/plan.md]"
description: "Draft plan dated 2026-03-10 for executing the Analysis feature audit backlog using TypeScript, MCP handlers, SQLite evidence, and Vitest regression coverage."
trigger_phrases:
  - "implementation"
  - "plan"
  - "analysis"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: analysis

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | MCP tool handlers + storage modules |
| **Storage** | SQLite |
| **Testing** | Vitest |

### Overview
This plan converts the Analysis audit methodology into a Level 2 execution structure with explicit phases, quality gates, and rollback safety. It focuses on resolving P0 correctness issues first, then closing P1 standards/test gaps, while tracking P2 documentation cleanup. The approach relies on DB-backed regression validation and consistent cross-document traceability.
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
- [x] Tests passing (if applicable) — 211 across 5 test files
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered MCP handler + storage module architecture with test-first verification loops.

### Key Components
- **Feature Catalog Inputs**: Source of expected behavior per Analysis feature.
- **MCP Server Code Paths**: Handler/storage implementation surfaces under audit.
- **Vitest Suites**: Unit/integration evidence for regressions and behavior parity.

### Data Flow
Feature catalog expectations are mapped to concrete code paths, then validated against existing tests and new regression cases; resulting findings are promoted into prioritized task backlog items.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Inventory all seven Analysis feature definitions and source mappings
- [x] Confirm handler/storage/test file ownership and citation boundaries
- [x] Establish priority mapping for FAIL/WARN findings

### Phase 2: Core Implementation
- [x] Resolve P0 correctness defects (coverage semantics, max-depth flag semantics)
- [x] Implement P1 test and standards remediation backlog
- [x] Record P2 catalog-reference cleanup tasks

### Phase 3: Verification
- [x] Manual testing complete — 211 tests pass across 5 files
- [x] Edge cases handled — orphan edges, natural leaves, depth limits, LI regression
- [x] Documentation updated — all 4 spec docs synchronized
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Causal stats computation, learning thresholds, depth semantics | Vitest |
| Integration | MCP handler flows for causal graph and learning-history behavior | Vitest + SQLite fixtures |
| Manual | Playbook alignment for EX-028..EX-031 and NEW-* coverage mapping | Catalog review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `feature_catalog/06--analysis/*.md` | Internal | Green | Behavior mapping cannot be validated if source definitions are unavailable. |
| `mcp_server/handlers/*.ts` and `lib/storage/*.ts` | Internal | Green | P0/P1 remediation cannot be implemented without these code paths. |
| Vitest regression suites | Internal | Yellow | Deferred suites can delay closure of behavior and coverage gaps. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New regressions, incorrect semantics, or unverifiable findings after Phase 2 changes.
- **Procedure**: Revert specific remediation commits, restore previous test baselines, and re-run focused verification suites.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 2-3 hours |
| Core Implementation | High | 8-12 hours |
| Verification | Medium | 3-4 hours |
| **Total** | | **13-19 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Disable or gate newly introduced behavior that changes output semantics.
2. Revert the most recent remediation commit set.
3. Re-run P0-focused smoke tests for causal stats and drift_why semantics.
4. Notify maintainers and record rollback rationale in phase artifacts.

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
