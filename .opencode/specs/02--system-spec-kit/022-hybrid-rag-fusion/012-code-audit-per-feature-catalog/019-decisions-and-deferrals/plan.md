---
title: "Implementation Plan: decisions-and-deferrals [template:level_2/plan.md]"
description: "Implementation planning for the decisions-and-deferrals feature audit, including phased remediation and verification strategy."
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
trigger_phrases:
  - "implementation"
  - "plan"
  - "decisions"
  - "deferrals"
  - "audit methodology"
  - "verification"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: decisions-and-deferrals

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + Markdown documentation |
| **Framework** | Spec Kit Memory MCP (`mcp_server`) |
| **Storage** | SQLite/vector schema migration references |
| **Testing** | Vitest + feature-catalog/source consistency review |

### Overview
This plan operationalized the decisions-and-deferrals audit by closing both prior WARN areas: F-02 evidence completeness for graph signals and F-03 sentence-boundary extraction behavior. The strict-closure pass also resolved the historical auto-entity data question with a deterministic rebuild path and regression coverage.
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
Structured audit workflow with finding-to-task traceability.

### Key Components
- **Feature Catalog Entries**: Source of declared current reality for all five features
- **Implementation References**: `mcp_server/lib/**` modules and migration touchpoints
- **Test References**: `mcp_server/tests/**` coverage validation
- **Spec Documents**: `spec.md`, `tasks.md`, `plan.md`, `checklist.md` as audit control surface

### Data Flow
Audit inputs (feature catalog + source/test references) are reviewed per feature, findings are normalized into PASS/WARN status, and actionable remediations are tracked through tasks and checklist verification evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Feature inventory reviewed across all five entries
- [x] Existing findings consolidated into structured statuses
- [x] Audit criteria baseline established

### Phase 2: Core Implementation
- [x] Update graph centrality feature inventory and test references
- [x] Apply entity extractor Rule-3 regex correction
- [x] Add regression tests for sentence-boundary capture and graph signals gaps

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
| Unit | `computeGraphMomentum`, `computeCausalDepth`, Rule-3 extraction logic | Vitest |
| Integration | Feature-catalog/source-file consistency and migration-v19 references | Markdown + code review |
| Manual | Feature-by-feature PASS/WARN verification and checklist evidence updates | Spec documents |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `feature_catalog/10--graph-signal-activation/` and `feature_catalog/13--memory-quality-and-indexing/` entries | Internal | Green | Source-of-truth evidence remains aligned to current implementation |
| `mcp_server/lib/graph/graph-signals.ts` | Internal | Green | F-02 runtime evidence reconciled to existing implementation |
| `mcp_server/lib/extraction/entity-extractor.ts` | Internal | Green | F-03 sentence-boundary behavior fixed |
| `mcp_server/tests/entity-extractor.vitest.ts` and graph tests | Internal | Green | Targeted regression verification passed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Rewritten documentation loses finding fidelity or introduces incorrect status mapping
- **Procedure**: Restore previous versions of `spec.md`, `tasks.md`, `plan.md`, and `checklist.md` from git history
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
| Setup | Low | 30-60 minutes |
| Core Implementation | Medium | 2-4 hours |
| Verification | Medium | 1-2 hours |
| **Total** | | **3.5-7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Revert documentation changes for this folder to the last known-good commit.
2. Re-apply only validated findings and status mappings.
3. Re-run checklist verification for P0/P1 items.
4. Notify stakeholders if downstream audit consumers used incorrect statuses.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (documentation-only rewrite)
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
