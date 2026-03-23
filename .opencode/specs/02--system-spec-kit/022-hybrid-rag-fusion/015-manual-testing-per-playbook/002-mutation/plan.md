---
title: "Implementation Plan: manual-testing-per-playbook mutation phase [template:level_2/plan.md]"
description: "Execution plan for 9 mutation playbook scenarios: preconditions, non-destructive tests, transaction integrity, destructive deletion, and evidence-plus-verdict collection."
trigger_phrases:
  - "mutation execution plan"
  - "phase 002 manual tests"
  - "memory mutation verdict plan"
  - "hybrid rag mutation review"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Plan: manual-testing-per-playbook mutation phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | Markdown |
| **Framework** | spec-kit L2 |
| **Storage** | Filesystem spec folder + linked evidence artifacts |
| **Testing** | manual + MCP |

### Overview

This plan converts the 9 mutation scenarios in the manual testing playbook into an ordered execution workflow for phase 002-mutation. The phase covers non-destructive write and feedback behavior first (EX-006, EX-007, EX-010, M-008, 110), then transaction-integrity fault injection (085), the schema-tightening scenario (101), and finally the two destructive deletion scenarios (EX-008, EX-009) which require a disposable sandbox and named checkpoints before execution.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Playbook files for 02--mutation are accessible at `../../manual_testing_playbook/02--mutation/`
- [ ] Feature catalog files for 02--mutation are accessible at `../../feature_catalog/02--mutation/`
- [ ] Review protocol is loaded from `../../manual_testing_playbook/manual_testing_playbook.md`
- [ ] MCP runtime is healthy and all mutation tools respond
- [ ] Disposable sandbox spec folder and named checkpoints prepared for EX-008 and EX-009
- [ ] Sandbox fixtures for 110 similarity-band saves are in place

### Definition of Done

- [ ] All 9 mutation scenarios have execution evidence tied to the exact documented prompt and command sequence
- [ ] Every scenario has a verdict (PASS, PARTIAL, or FAIL) with rationale using the review protocol acceptance rules
- [ ] Coverage is reported as 9/9 scenarios with no skipped test IDs
- [ ] Checkpoint names for EX-008 and EX-009 confirmed present before destructive steps run
- [ ] Any sandbox mutations, fault injections, or similarity-band test records are restored or explicitly documented before closeout
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Manual mutation test execution pipeline with checkpoint-gated destructive scenarios and review-gated evidence collection.

### Key Components

- **Preconditions pack**: Playbook, review protocol, feature catalog links, MCP runtime baseline, sandbox spec folder, and named checkpoints for destructive scenarios.
- **Execution layer**: Manual operator actions plus MCP calls to `memory_save`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_validate`, `checkpoint_create`, and `checkpoint_list`.
- **Evidence bundle**: Tool outputs, checkpoint listings, DB state snapshots, rollback traces, PE arbitration action logs, and fault-injection recovery evidence captured per scenario.
- **Verdict layer**: Review protocol checks that classify each scenario as PASS, PARTIAL, or FAIL.

### Data Flow

`preconditions + sandbox setup -> execute exact prompt/commands -> capture evidence -> apply verdict rules`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions

- [ ] Verify source documents are open: playbook, review protocol, and linked mutation feature files
- [ ] Confirm MCP runtime access for all mutation tools and checkpoint tools
- [ ] Prepare a disposable sandbox spec folder with known fixture memories for EX-008, EX-009, and 110
- [ ] Record baseline environment state and confirm no active checkpoints from previous runs conflict with planned names

### Phase 2: Non-Destructive Tests

- [ ] Run EX-006 — `memory_save` ingestion pipeline, quality gate, and post-save retrievability
- [ ] Run EX-007 — `memory_update` embedding regeneration and updated-title retrievability
- [ ] Run EX-010 — `memory_validate` feedback persistence, confidence adjustment, and auto-promotion metadata
- [ ] Run M-008 — Per-memory history log scenario
- [ ] Run 110 — Prediction-error save arbitration across all five similarity bands

### Phase 3: Schema and Transaction Tests

- [ ] Run 101 — `memory_delete` confirm schema tightening
- [ ] Run 085 — Transaction wrapper atomicity; if fault injection is infeasible from MCP client, apply vitest fallback and document the limitation

### Phase 4: Destructive Tests

- [ ] Run EX-008: create checkpoint before executing `memory_delete`; confirm checkpoint visible before delete runs; verify post-deletion absence
- [ ] Run EX-009: create checkpoint before executing `memory_bulk_delete`; confirm `specFolder` explicitly scoped to sandbox; verify deletion count and checkpoint list
- [ ] Maintain sandbox isolation — all operations scoped to the disposable sandbox folder

### Phase 5: Evidence Collection and Verdict

- [ ] For each scenario, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes
- [ ] Apply the review protocol acceptance checks (preconditions satisfied, prompt/commands as written, expected signals present, evidence readable, outcome rationale explicit)
- [ ] Assign PASS, PARTIAL, or FAIL per scenario and summarize phase coverage as 9/9 with linked evidence references
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Scenario ID | Scenario Name | Execution Type |
|-------------|---------------|----------------|
| EX-006 | Memory indexing (memory_save) | MCP |
| EX-007 | Memory metadata update (memory_update) | MCP |
| M-008 | Feature 09 Direct Manual Scenario (Per-memory History Log) | MCP |
| EX-008 | Single and folder delete (memory_delete) | manual (destructive — sandbox required) |
| EX-009 | Tier-based bulk deletion (memory_bulk_delete) | manual (destructive — sandbox required) |
| EX-010 | Validation feedback (memory_validate) | MCP |
| 085 | Transaction wrappers on mutation handlers | manual |
| 101 | memory_delete confirm schema tightening | MCP |
| 110 | Prediction-error save arbitration | manual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Playbook `../../manual_testing_playbook/02--mutation/` | Internal | Unknown | Scenario steps unavailable |
| Review protocol `../../manual_testing_playbook/manual_testing_playbook.md` | Internal | Unknown | Verdicts cannot be applied consistently |
| Feature catalog `../../feature_catalog/02--mutation/` | Internal | Unknown | Cross-reference cannot be verified |
| MCP runtime (all mutation tools and checkpoint tools) | Internal | Unknown | Mutation scenarios cannot be executed |
| Disposable sandbox spec folder with fixture memories | Internal | Unknown | Destructive and PE tests cannot run safely |
| Fault injection mechanism for 085 | Internal | Unknown | Transaction rollback may require vitest fallback |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger for EX-008**: Deletion leaves sandbox in unexpected state or checkpoint was not created before delete.
- **Procedure for EX-008**: Restore named checkpoint via `checkpoint_restore`, verify restore with `memory_search`, discard compromised evidence before retrying.
- **Trigger for EX-009**: Bulk delete affects more records than expected or unscoped records were deleted.
- **Procedure for EX-009**: Restore named checkpoint via `checkpoint_restore`, confirm recovery with `checkpoint_list()` and `memory_stats()`, restart from checkpoint step.
- **Trigger for 085**: Fault injection leaves database in a partial state.
- **Procedure for 085**: Run `memory_health()` to assess consistency; if degraded, restore nearest valid checkpoint and rerun from clean baseline.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Preconditions) ──► Phase 2 (Non-Destructive) ──► Phase 3 (Schema/Transaction) ──► Phase 4 (Destructive) ──► Phase 5 (Verdict)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Preconditions | None | All |
| Non-Destructive (EX-006, EX-007, EX-010, M-008, 110) | Preconditions | Schema/Transaction |
| Schema/Transaction (085, 101) | Preconditions | Destructive |
| Destructive (EX-008, EX-009) | Preconditions + Sandbox setup | Verdict |
| Evidence + Verdict | All execution phases | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Preconditions | Low | 20-40 min |
| Non-destructive tests (5 scenarios) | Medium | 45-75 min |
| Schema and transaction tests (2 scenarios) | Medium | 30-60 min |
| Destructive tests (2 scenarios) | High | 30-45 min |
| Evidence collection and verdict | Low | 20-30 min |
| **Total** | | **2.5-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Execution Checklist

- [ ] Sandbox spec folder created and contains only test fixtures
- [ ] No active checkpoints conflict with planned checkpoint names (pre-ex008-delete, pre-ex009-bulk-delete)
- [ ] Baseline environment state recorded

### Rollback Procedure

1. Stop execution of current scenario
2. Restore appropriate named checkpoint
3. Verify restore with `memory_search` or `memory_stats`
4. Run `memory_health()` to confirm database integrity
5. Re-run affected scenario from scratch

### Data Reversal

- **Has data mutations?** Yes — EX-008 deletes a memory, EX-009 bulk-deletes a tier, 110 creates multiple memory records
- **Reversal procedure**: Restore named checkpoints created immediately before each destructive step
<!-- /ANCHOR:enhanced-rollback -->
