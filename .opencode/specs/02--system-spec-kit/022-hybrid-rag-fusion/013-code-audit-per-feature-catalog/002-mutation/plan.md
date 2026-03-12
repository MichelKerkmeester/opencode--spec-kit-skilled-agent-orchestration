---
title: "Implementation Plan: 002-Mutation Code Audit"
description: "Execution plan for auditing and remediating mutation-feature correctness issues in the Spec Kit Memory MCP server using a feature-centric review and verification pipeline."
trigger_phrases: ["implementation", "plan", "002-mutation", "audit per feature", "mutation remediation"]
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: 002-Mutation Code Audit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | None |
| **Storage** | SQLite (`better-sqlite3`) |
| **Testing** | Vitest |

### Overview
Phase 002 executed a feature-centric audit of all 10 mutation features and closed 9 original remediation tasks (3 P0, 6 P1). The March 11, 2026 re-audit then closed the remaining mutation-specific gaps that were still present after the earlier review rounds, and refreshed the evidence to match current verification state.
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
- [x] Tests passing for mutation scope (`npx tsc --noEmit` clean, focused mutation suites green, full suite currently `254 passed files / 5 unrelated failed files` and `7331 passed / 8 failed / 1 skipped / 30 todo` tests)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Feature-centric audit pipeline

### Key Components
- **Feature Inventory Layer**: Enumerates mutation feature catalog entries and source/test mappings.
- **Per-Feature Audit Loop**: Applies correctness, standards, behavior, and test-gap checks for each feature.
- **Remediation Workstreams**: Implements and validates fixes grouped by priority (P0/P1).
- **Verification Layer**: Runs TSC/tests and consolidates evidence in tasks/checklist/review rounds.

### Data Flow
Catalog definitions are inventoried first, then each feature is traced to implementation and tests. Findings are converted into prioritized tasks, fixes are applied and verified, and final outcomes are recorded through checklist validation plus cross-AI review closure.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inventory
- [x] **Step 1: Feature Inventory**
- [x] Read all 10 feature `.md` files in `feature_catalog/02--mutation/`
- [x] Extract source file lists (implementation + tests)
- [x] Map features to manual playbook scenarios (`EX-006..EX-010`, `NEW-*`)

### Phase 2: Audit per Feature
- [x] **Step 2: Code Review Per Feature**
- [x] Correctness checks: logic bugs, null/undefined handling, error paths
- [x] Standards checks: `sk-code--opencode` TypeScript checklist
- [x] Behavior checks: implementation vs "Current Reality"
- [x] Edge-case checks: boundaries, empty input, concurrency
- [x] **Step 3: Test Coverage Assessment**
- [x] Verify tests exist for listed files
- [x] Verify tests assert described feature behavior
- [x] Document gaps between documented behavior and assertions
- [x] **Step 4: Manual Test Playbook Cross-Reference**
- [x] Map to scenarios `EX-006..EX-010`, `NEW-*`
- [x] Mark missing or weak scenario coverage

### Phase 3: Fix + Verify
- [x] **Step 5: Findings Report + Remediation Closure**
- [x] Produce structured findings per feature: PASS/WARN/FAIL, issues, violations, gaps, recommendations
- [x] Complete all remediation tasks T-01 through T-09
- [x] Verify closure with TypeScript compile and test results
- [x] Record post-fix status and current re-audit verification state (superseding the older `R11: 98/100 APPROVE` snapshot)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static Type Check | Compile-time validation for all touched TypeScript paths | `npx tsc --noEmit` |
| Targeted Regression | Task-specific suites (e.g., confidence tracker, history, CRUD/update/delete flows) | Vitest |
| Manual Verification | Per-feature audit evidence review, playbook cross-reference, post-fix validation | Repository + audit artifacts |

### sk-code--opencode Checklist (Per File)
- [x] Naming: camelCase functions, PascalCase types/interfaces
- [x] Imports: explicit, no barrel re-exports of side-effect modules
- [x] Types: strict TypeScript, no `any` without justification
- [x] Error handling: typed errors, no swallowed catches
- [x] Null safety: optional chaining, nullish coalescing
- [x] Constants: UPPER_SNAKE_CASE, no magic numbers
- [x] Functions: single responsibility, < 50 lines preferred
- [x] Comments: only where logic is non-obvious
- [x] Exports: explicit named exports
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Mutation feature catalog (`feature_catalog/02--mutation`) | Internal | Green | Audit cannot reliably map behavior claims to source files. |
| MCP server TypeScript modules and handlers | Internal | Green | Core mutation paths cannot be evaluated or remediated. |
| Vitest test suite and fixtures | Internal | Yellow | Some broader repository suites still fail outside mutation scope; mutation-focused suites are now concrete and green. |
| Cross-AI review loop | External process | Green | Lower confidence in closure quality if not completed. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Regression introduced by remediation, or audit fix violates expected runtime behavior.
- **Procedure**: Revert affected commits/worktree changes for mutation-fix files, rerun `npx tsc --noEmit` and targeted Vitest suites, then restore prior known-good behavior and re-open impacted tasks.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Inventory) ───► Phase 2 (Audit per Feature) ───► Phase 3 (Fix + Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | Audit per Feature |
| Audit per Feature | Inventory | Fix + Verify |
| Fix + Verify | Audit per Feature | Final completion reporting |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | Medium | 2-4 hours |
| Audit per Feature | High | 8-14 hours |
| Fix + Verify | High | 10-18 hours |
| **Total** | | **20-36 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (git history/worktree state available)
- [x] Feature flag impact reviewed where applicable
- [x] Monitoring/check validation path defined via compile/tests

### Rollback Procedure
1. Revert changed mutation files to last known-good revision.
2. Re-run `npx tsc --noEmit`.
3. Re-run targeted Vitest suites for touched modules.
4. Re-open failed tasks in `tasks.md` with updated evidence.

### Data Reversal
- **Has data migrations?** Yes (history schema migration adjustments)
- **Reversal procedure**: Restore previous schema revision and rerun migration tests before redeploying.
<!-- /ANCHOR:enhanced-rollback -->
