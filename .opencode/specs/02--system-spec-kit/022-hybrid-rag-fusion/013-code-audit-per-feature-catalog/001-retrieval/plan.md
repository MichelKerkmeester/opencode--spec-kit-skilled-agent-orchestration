---
title: "Implementation Plan: 001-Retrieval Code Audit"
description: "Feature-centric audit and fix plan for nine retrieval features, with scoped regression verification and honest full-suite baseline reporting."
trigger_phrases: ["implementation", "plan", "retrieval", "audit", "plan core"]
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: 001-Retrieval Code Audit
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
| **Storage** | SQLite / `better-sqlite3` |
| **Testing** | Vitest |

### Overview
The retrieval layer was audited feature-by-feature against the Spec Kit Memory feature catalog to confirm documented behavior matches implementation and tests. Where mismatches were found, this plan drove focused correctness and test-quality fixes instead of broad refactors. The phase now closes with a clean TypeScript gate and green retrieval-targeted verification, while documenting unrelated repository-wide failures explicitly as out-of-scope.
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
- [x] Retrieval-targeted verification passing (`10` suites, `365` passed, `0` failed)
- [x] Docs updated (spec/plan/tasks)
- [x] Full-suite baseline recorded with out-of-scope failures called out explicitly
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Feature-centric audit pipeline.

### Key Components
- **Feature Catalog (`.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/`)**: Source of expected Current Reality behavior per feature.
- **Retrieval Implementation Surface (`mcp_server/handlers`, `mcp_server/lib`)**: Audited code paths where mismatches and standards issues were validated and fixed.
- **Shared Runtime Algorithm Surface (`shared/algorithms`, `shared/dist/algorithms`)**: Convergence-scoring behavior used by retrieval fusion logic.
- **Retrieval Test Surface (`mcp_server/tests`)**: Regression and contract verification for corrected behavior and assertion quality.
- **Task Evidence Layer (`tasks.md`, `checklist.md`, `implementation-summary.md`)**: Per-task proof of completion with scoped vs full-suite verification separation.

### Data Flow
Feature metadata and declared sources are inventoried first, then each feature's implementation and tests are reviewed against documented behavior and standards. Findings are prioritized (P0/P1/P2), fixed in-place with targeted regressions, and re-verified through type checks plus retrieval-targeted test suites. Full repository suite status is retained as context but not used as the retrieval completion gate because current failures are outside retrieval scope.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inventory
- [x] **Step 1: Feature Inventory**
- [x] Read all 9 feature markdown files in `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/`
- [x] Extract implementation/test source lists
- [x] Map features to manual playbook scenarios (EX-001..EX-009)

### Phase 2: Audit Per Feature
- [x] **Step 2: Code Review Per Feature**
- [x] Correctness: logic bugs, off-by-one, null/undefined handling, error paths
- [x] Standards: `sk-code--opencode` TypeScript checklist
- [x] Behavior: implementation matches catalog "Current Reality"
- [x] Edge cases: boundaries, empty inputs, concurrent access
- [x] **Step 3: Test Coverage Assessment**
- [x] Verify listed test files exist and align with behavior claims
- [x] Identify and document test gaps
- [x] **Step 4: Manual Test Playbook Cross-Reference**
- [x] Map features to EX-001..EX-009 where available
- [x] Record coverage gaps where mapping is missing or stale

### Phase 3: Fix + Verify
- [x] **Step 5: Findings Report and Closure**
- [x] Produce structured findings (PASS/WARN/FAIL, issues, mismatches, gaps, fixes)
- [x] Implement prioritized fixes (T-01 through T-09)
- [x] Re-run verification gates (`tsc --noEmit --pretty false`, retrieval-targeted Vitest set, full-suite baseline)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Retrieval helpers and scoring/calibration logic | Vitest |
| Integration | Handler-level retrieval behavior and fallback pipelines | Vitest |
| Baseline | Repository-wide health snapshot (out-of-scope failures documented, not masked) | Vitest |

### `sk-code--opencode` Checklist (Per File, Preserved)
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
| Retrieval feature catalog files | Internal | Green | Audit cannot validate behavior/source mapping |
| Retrieval implementation modules | Internal | Green | Findings cannot be verified or fixed |
| Retrieval Vitest suites | Internal | Green | Regression confidence cannot be established |
| TypeScript compile gate (`tsc --noEmit`) | Internal | Green | Standards/correctness closure cannot be claimed |
| Full-suite baseline (`vitest run`) | Internal | Yellow (out-of-scope failures present) | Must be reported accurately to avoid false green claim |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New regressions in retrieval handlers/search behavior, failing retrieval test suites, or type-check breakage.
- **Procedure**: Revert the specific retrieval patches introduced by T-01 through T-09, restore previous catalog references where required, then re-run retrieval verification suites.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Inventory) ──► Phase 2 (Audit Per Feature) ──► Phase 3 (Fix + Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | Audit Per Feature |
| Audit Per Feature | Inventory | Fix + Verify |
| Fix + Verify | Audit Per Feature | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | Medium | 1-2 hours |
| Audit Per Feature | High | 4-6 hours |
| Fix + Verify | Medium | 2-3 hours |
| **Total** | | **7-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (documentation and evidence retained in spec folder history)
- [x] Feature flag configured (N/A for this audit-only scope)
- [x] Monitoring alerts set (N/A for this audit-only scope)

### Rollback Procedure
1. Revert offending retrieval changes linked to failed task IDs.
2. Re-run targeted retrieval Vitest suites and `tsc --noEmit` on reverted state.
3. Validate catalog-to-code consistency for affected features.
4. Record rollback outcome in spec folder artifacts.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
