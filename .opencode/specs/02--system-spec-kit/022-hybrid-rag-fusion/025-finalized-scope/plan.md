---
title: "Implementation Plan: Refinement Phase 5 Finalized Scope [template:level_2/plan.md]"
description: "Execution plan finalized across tranche-1 through tranche-4 with completed summary alignment, runtime hardening, and verification evidence."
SPECKIT_TEMPLATE_SOURCE: "plan-core + level2-verify | v2.2"
trigger_phrases:
  - "refinement phase 5 plan"
  - "tranche 1"
  - "isInShadowPeriod"
  - "save-quality-gate"
  - "config table ensure"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Refinement Phase 5 Finalized Scope

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, TypeScript, Bash |
| **Primary Targets** | Two summary docs + `save-quality-gate.ts` |
| **Validation** | Child `validate.sh` + targeted `vitest` commands |
| **Parent / Predecessor** | Parent `022-hybrid-rag-fusion`, predecessor `024-timer-persistence-stage3-fallback` |

### Overview
This plan records completed tranche continuity from tranche-1 through tranche-4 with bounded scope: summary alignment corrections, `save-quality-gate.ts` robustness/activation-window continuity, hybrid-search canonical dedup plus tier-2 `forceAllChannels` hardening, and parent-summary P2 documentation polish. Verification evidence is captured in this child folder.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Child scope lists only the three implementation fixes.
- [x] Task IDs and checklist items map directly to those fixes.
- [x] Verification commands are defined for docs and TypeScript runtime behavior.

### Definition of Done
- [x] `summary_of_existing_features.md` wording is aligned (RSF/shadow/fallback/floor/reconsolidation).
- [x] `summary_of_new_features.md` contradiction around `isInShadowPeriod` is removed.
- [x] `save-quality-gate.ts` config-table ensure behavior is robust across DB handle changes and persisted activation-window continuity.
- [x] Hybrid-search canonical dedup and tier-2 `forceAllChannels` fallback hardening are completed with regression coverage.
- [x] Child validation and targeted tests pass with evidence captured in `checklist.md` and `implementation-summary.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Constrained remediation flow: docs alignment fixes first, runtime robustness fix second, verification and evidence capture last.

### Key Components
- **Summary Alignment Fix A**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md`
- **Summary Alignment Fix B**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md`
- **Runtime Robustness Fix**: `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts`
- **Evidence Layer**: child `tasks.md`, `checklist.md`, and `implementation-summary.md`

### Data Flow
Source wording and behavior mismatches are corrected in targeted files, then validated through command outputs. Evidence links are recorded in checklist and implementation summary to close P0/P1 criteria.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Child Doc Alignment (Completed)
- [x] Update `spec.md` to lock scope to the three fixes.
- [x] Update `plan.md` with exact implementation and test phases.
- [x] Update `tasks.md` and `checklist.md` with fix-mapped IDs and commands.
- [x] Initialize `implementation-summary.md` for tranche continuity tracking.

### Phase 2: Summary-Doc Fixes (Completed)
- [x] Edit `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md` for RSF/shadow/fallback/floor/reconsolidation wording alignment.
- [x] Edit `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md` to remove `isInShadowPeriod` contradiction.

### Phase 3: save-quality-gate Robustness Fix (Completed)
- [x] Edit `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts` to ensure config-table setup remains valid when DB handle changes.
- [x] Add focused tests for DB reinitialization/handle-change behavior in existing quality-gate test files (`WO6`, `WO7`).

### Phase 4: Tranche-2 Continuation (Completed)
- [x] Apply canonical ID dedup in `combinedLexicalSearch()` and legacy `hybridSearch()` for mixed ID representations.
- [x] Add regression tests `T031-LEX-05` and `T031-BASIC-04` in `hybrid-search.vitest.ts`.

### Phase 5: Tranche-3 Continuation (Completed)
- [x] Preserve persisted activation timestamp across restart in `save-quality-gate.ts` and add regression test `WO7`.
- [x] Add and plumb `forceAllChannels` for tier-2 fallback in `hybrid-search.ts` with regression test `C138-P0-FB-T2`.
- [x] Apply targeted parent-summary alignment corrections (gating/instrumentation/hook-scope/dead-code references).

### Phase 6: Tranche-4 P2 Documentation Polish (Completed)
- [x] Apply parent-summary P2 polish updates A-F in targeted summary files.
- [x] Update child status docs to finalized completed-state wording.
- [x] Run child validation and expanded targeted tests; capture evidence in `tasks.md`, `checklist.md`, and `implementation-summary.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Commands |
|-----------|-------|----------|
| Spec validation | Child Level 2 docs quality and structure | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/025-finalized-scope"` |
| Targeted unit/integration | Quality-gate persistence behavior, hybrid-search regression coverage, and adjacent integration wiring | `npm run test --workspace=mcp_server -- tests/hybrid-search.vitest.ts tests/save-quality-gate.vitest.ts tests/mpab-quality-gate-integration.vitest.ts` (PASS, 3 files, 176 tests) |
| Manual contradiction review | Summary-doc consistency checks | `rg -n "RSF|shadow|fallback|floor|reconsolidation" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_existing_features.md && rg -n "isInShadowPeriod" .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/000-feature-overview/summary_of_new_features.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing summary source content | Internal | Green | Cannot complete wording/contradiction corrections safely |
| Existing quality-gate tests and vitest workspace | Internal | Green | Runtime robustness fix cannot be proven |
| Parent/predecessor context references | Internal | Green | Scope lineage clarity degrades |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any fix introduces contradiction regression, test failures, or new validation errors.
- **Procedure**: Revert only the failing file change, rerun targeted verification commands, and document blocker evidence in `checklist.md`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Doc Alignment) -> Phase 2 (Summary Fixes) -> Phase 3 (save-quality-gate Fix) -> Phase 4 (Tranche-2 Continuation) -> Phase 5 (Tranche-3 Continuation) -> Phase 6 (Tranche-4 Polish)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | Existing child docs | Phases 2-6 |
| Phase 2 | Phase 1 | Phase 6 closeout |
| Phase 3 | Phase 1 | Phase 6 closeout |
| Phase 4 | Phases 2 and 3 | Phase 5-6 |
| Phase 5 | Phase 4 | Phase 6 |
| Phase 6 | Phases 4 and 5 | Tranche closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Doc alignment | Low-Medium | 1-2 hours |
| Phase 2: Summary-doc fixes | Medium | 2-4 hours |
| Phase 3: save-quality-gate fix + tests | Medium-High | 3-6 hours |
| Phase 4: Verification + evidence | Medium | 1-2 hours |
| **Total** | | **7-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline child validation output captured.
- [x] Planned edits were restricted to targeted tranche files.
- [x] Targeted test commands are confirmed runnable.

### Rollback Procedure
1. Stop further tranche changes.
2. Revert failing change set only.
3. Re-run validation and targeted tests.
4. Record rollback details and blockers in checklist evidence.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- End of filled Level 2 implementation plan for child 016 (tranche-1 through tranche-4 aligned). -->
