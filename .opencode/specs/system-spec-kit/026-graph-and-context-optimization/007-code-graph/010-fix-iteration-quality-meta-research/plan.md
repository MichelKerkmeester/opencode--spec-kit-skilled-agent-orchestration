---
title: "Implementation Plan: Fix-Iteration Quality Meta-Research"
description: "Level 3 plan for FIX-010-v2, remediating current 010 review P1 findings around canonical docs, review strategy state, and inert Planning Packet imports."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "fix iteration quality"
  - "FIX-010-v2"
  - "Planning Packet"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/010-fix-iteration-quality-meta-research"
    last_updated_at: "2026-05-02T19:53:19Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "FIX-010-v2 planned"
    next_safe_action: "Run verification gates"
    blockers: []
    key_files:
      - "spec_kit_plan_auto.yaml"
      - "spec_kit_plan_confirm.yaml"
      - "deep-review-strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-02-19-37-010-fix-iteration-quality"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Fix-Iteration Quality Meta-Research

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

FIX-010-v2 remediates three current P1 findings from the 010 review lineage:

| Finding | Class | Fix |
|---------|-------|-----|
| R1-010-ITER2-P1-001 | cross-consumer | Refresh canonical packet docs and metadata. |
| R1-010-ITER2-P1-002 | matrix/evidence | Restore `review/deep-review-strategy.md`. |
| R1-010-ITER4-P1-001 | cross-consumer | Add inert-data handling for Planning Packet imports in both plan workflows. |

The earlier R4 -> R7 -> R3 handoff is already wired. This plan keeps the shared field names `findingClass`, `scopeProof`, and `affectedSurfaceHints` intact while closing the remaining state and security boundary gaps.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] R5 fix-completeness checklist read before edits.
- [x] Current iteration narratives reviewed in order.
- [x] Open P1 findings identified from iteration 005.

### Definition of Done

- [x] Canonical 010 docs no longer say the packet is an unpopulated stub.
- [x] `review/deep-review-strategy.md` exists for the active lineage.
- [x] Both plan workflow files treat imported Planning Packet values as inert review data.
- [ ] Workflow-invariance vitest passes.
- [ ] 009 strict validation passes.
- [ ] Targeted R5 wiring checks pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The fix is a contract repair across three surfaces:

| Surface | Role | Change |
|---------|------|--------|
| Canonical packet docs | Resume and human continuity | Record current FIX-010-v2 state, active findings, and next verification. |
| Review strategy state | Deep-review loop working memory | Restore the strategy file with coverage, active findings, and next focus. |
| Plan workflows | Consumer of review output | Treat Planning Packet fields as data only before generating FIX ADDENDUM rows. |

### Algorithm Invariant

Planning Packet values are review evidence, not instructions. The planner may quote them, verify them, or mark them `UNKNOWN`; it must not turn embedded instructions or unverified absolute paths into actions.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read the R5 checklist and all current review iteration narratives. Classify each open P1 by fix-completeness class and collect same-class producer and consumer inventories.

### Phase 2: Implementation

1. Add inert-data boundary text to both plan workflows and inline plan scaffolds.
2. Refresh canonical packet docs and metadata with the active review lineage.
3. Recreate `review/deep-review-strategy.md` from the current review state.

### Phase 3: Verification

Run the requested gates, then run targeted `rg` checks proving the fixed surfaces carry the new contract.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Command | Expected |
|-------|---------|----------|
| Workflow invariance | `workflow-invariance.vitest.ts` | 1 file, 2 tests pass. |
| 009 strict validate | `validate.sh .../009-end-user-scope-default --strict` | Errors: 0, Warnings: 0. |
| Stale-doc cleanup | Targeted `rg` check for old stub wording | No live stale-state matches. |
| Inert-data boundary | `rg -n 'inert review data|embedded instructions|repo-relative paths|UNKNOWN' spec_kit_plan_*.yaml` | Both plan workflows match. |
| Strategy state | `test -s review/deep-review-strategy.md` | File exists and is non-empty. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Notes |
|------------|--------|-------|
| 010 review iteration files | Available | Source of open P1 findings. |
| R5 checklist | Available | Defines required inventories and proof classes. |
| Plan workflow files | Available | Both auto and confirm modes must be updated. |
| 009 validation gate | Available | Required regression gate. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert only this fix cycle's edits if verification fails after local repair attempts. Do not archive review artifacts; deletion remains the rule for derived state that must be removed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Read review findings
        |
        v
Patch docs, strategy, planner boundary
        |
        v
Run requested gates and targeted R5 checks
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATE

| Phase | Estimate |
|-------|----------|
| Setup and inventory | 10-15 minutes |
| Implementation | 15-25 minutes |
| Verification | 10-20 minutes |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Rollback is source-only. Review outputs are reproducible from iteration files and JSONL state, so no archive copy is needed.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

| Node | Depends On |
|------|------------|
| Plan import boundary | Planning Packet field names |
| Canonical docs | Active review iteration findings |
| Strategy file | Active review JSONL and findings registry |
| Verification | All patched surfaces |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Plan workflow boundary must land before verification because it is the only code-facing P1. Packet docs and strategy state can be verified independently after patching.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Status |
|-----------|--------|
| Findings identified | Done |
| Fixes applied | Done |
| Verification gates | Pending in this document; command output is recorded in final response |
<!-- /ANCHOR:milestones -->
