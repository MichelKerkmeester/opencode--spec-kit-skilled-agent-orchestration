---
title: "Implementation Plan: query-intelligence [template:level_2/plan.md]"
description: "This plan synchronizes Level 2 Query Intelligence artifacts to verified review-fix outcomes across code, tests, and catalog documentation."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
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
This plan closes artifact drift after review-fix execution by synchronizing Level 2 documentation with verified repository outcomes. The approach uses a fixed source-of-truth changed-file set, evidence-first verification reporting, and checklist total reconciliation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Acceptance criteria met and reflected consistently across all five in-scope artifacts
- [x] Targeted verification passing where applicable; repo-wide `npm run check` warning remains explicitly documented as out of scope
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Monolith (catalog-driven audit workflow over Query Intelligence implementation and test surfaces)

### Key Components
- **Verified Code/Test Fixes**: `hybrid-search.ts`, `trace-propagation.vitest.ts`, `stage1-expansion.vitest.ts`, and `channel-enforcement.ts` capture the runtime/test changes this phase must represent; `search-results-format.vitest.ts` remains part of the mirrored targeted verification surface.
- **Feature Catalog (`.opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/03-channel-min-representation.md`)**: Updated stale test counts and serves as documentation truth source.
- **Spec Artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)**: Required synchronized outputs for Level 2 closure.

### Data Flow
Verified repository changes are mapped into spec artifacts, verification evidence is normalized across files, checklist totals are recalculated, and deferred out-of-scope items are explicitly preserved.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Collected authoritative changed-file list from prior review-fix execution
- [x] Confirmed in-scope artifact set (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`)
- [x] Established verification outcomes to propagate unchanged across artifacts

### Phase 2: Core Implementation
- [x] Updated spec scope from docs-only framing to implementation+sync framing
- [x] Updated tasks/checklist/implementation summary evidence to match verified code/test/catalog fixes
- [x] Preserved Level 2 anchors, SPECKIT comments, and template sections while correcting drift

### Phase 3: Verification
- [x] Verification evidence aligned to known outcomes (tests, ESLint, alignment verifier, repo-wide check warning)
- [x] Priority checklist totals reconciled to checklist body counts
- [x] Documentation synchronized across all five in-scope artifacts
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `stage1-expansion.vitest.ts` embeddings mock path and expansion orchestration coverage | Vitest |
| Integration | `trace-propagation.vitest.ts` production-path query complexity propagation coverage plus `search-results-format.vitest.ts` targeted output-format coverage | Vitest |
| Static Analysis | Changed-file lint verification | ESLint |
| Manual | Cross-artifact evidence consistency and checklist total reconciliation | Markdown review |

### Verification Outcomes
- Targeted tests passed: 6 files, 165 tests.
- Targeted ESLint on changed in-scope files passed.
- Alignment verifier passed: 0 findings.
- `npm run check` failed due to pre-existing unrelated repo-wide lint/type issues (out of scope).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Verified changed-file inventory from prior tasks | Internal | Green | Without authoritative file list, artifact synchronization may misstate delivered work |
| `scripts/spec/validate.sh` | Internal | Yellow | Completion claims cannot be made without validation; prior pass returned warnings that this continuation resolves |
| Manual playbook scenarios (NEW-060+) | Internal | Yellow | CHK-042 remains deferred and must stay explicitly marked out-of-scope |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Template non-compliance, missing mapped findings, or accidental scope drift.
- **Procedure**: Restore prior docs for `012-query-intelligence/` from git history and reapply synchronization with verified evidence set.
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
- [x] Backup created (git history available for `012-query-intelligence/`)
- [x] Feature flag configured (N/A for documentation synchronization phase)
- [x] Monitoring alerts set (N/A for documentation synchronization phase)

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
