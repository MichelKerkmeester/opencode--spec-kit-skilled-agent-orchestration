---
title: "Implementation Plan: manual-testing-per-playbook mutation phase [template:level_1/plan.md]"
description: "Phase 002 defines the execution plan for seven mutation manual tests in the Spec Kit Memory system. It sequences preconditions, sandboxed execution for destructive scenarios, evidence capture, and review-protocol verdicting for mutation-focused scenarios."
trigger_phrases:
  - "mutation execution plan"
  - "phase 002 manual tests"
  - "memory mutation verdict plan"
  - "hybrid rag mutation review"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: manual-testing-per-playbook mutation phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | Markdown |
| **Framework** | spec-kit L1 |
| **Storage** | Filesystem spec folder + linked evidence artifacts |
| **Testing** | manual + MCP |

### Overview
This plan converts the mutation scenarios in the manual testing playbook into an ordered execution workflow for Phase 002. The phase covers non-destructive write and feedback behavior first (EX-006, EX-007, EX-010, NEW-110), then transaction-integrity fault injection (NEW-085), and finally the two destructive deletion scenarios (EX-008, EX-009) which require a disposable sandbox and named checkpoints before execution.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Exact prompts, command sequences, and pass criteria were extracted from [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md).
- [x] Feature mappings for all 7 mutation tests were confirmed against the cross-reference index and mutation feature files.
- [x] Verdict rules from [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) were loaded for PASS/PARTIAL/FAIL handling.
- [x] Sandbox and checkpoint requirements for EX-008 and EX-009 were identified and documented.
- [x] Disposable sandbox spec folder (`specs/test-sandbox-mutation/`) is prepared with test fixtures for EX-008, EX-009, and NEW-110.

### Definition of Done
- [x] All 7 mutation scenarios have execution evidence tied to the exact documented prompt and command sequence.
- [x] Every scenario has a verdict and rationale using the review protocol acceptance rules.
- [x] Coverage is reported as 7/7 scenarios for Phase 002 with no skipped test IDs.
- [x] Checkpoint names for EX-008 (`pre-ex008-delete`) and EX-009 (`pre-ex009-bulk-delete`) are confirmed present in `checkpoint_list()` output before the destructive step runs.
- [x] Any sandbox mutations, fault injections, or similarity-band test records are restored or explicitly documented before closeout.
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
- [x] Verify source documents are open: playbook, review protocol, and linked mutation feature files.
- [x] Confirm MCP runtime access for `memory_save`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_validate`, and checkpoint tools.
- [x] Prepare a disposable sandbox spec folder (`specs/test-sandbox-mutation/`) with known fixture memories for EX-008, EX-009, and NEW-110.
- [x] Record baseline environment state and confirm no active checkpoints from previous runs conflict with planned checkpoint names.

### Phase 2: Non-Destructive Tests
- [x] Run EX-006 to verify the `memory_save` ingestion pipeline, quality gate, template-contract enforcement, and post-save retrievability. **PASS** — ID 25371, CREATE, quality 1.0, searchable.
- [x] Run EX-007 to verify `memory_update` triggers embedding regeneration on title change and the updated title becomes retrievable. **PASS** — Title updated, embedding regenerated, searchable rank #1.
- [x] Run EX-010 to verify `memory_validate` persists positive feedback, adjusts confidence, and returns auto-promotion metadata. **PASS** — Confidence 0.60, validationCount 1, autoPromotion metadata returned.
- [x] Run NEW-110 sequentially across all five similarity bands. **PARTIAL** — CREATE and UPDATE demonstrated live; all 5 bands verified via code inspection + vitest 139/139. `force:true` re-save produced UPDATE (ID 25416).

### Phase 3: Transaction-Integrity Test
- [x] Run NEW-085 only in an isolated database or sandbox environment. **PARTIAL** — Fault injection infeasible from MCP client (better-sqlite3 synchronous transactions). Vitest fallback: 139/139 tests pass (T192/T194/T191a/b). Code inspection confirms auto-rollback on exception.
- [x] ~~If the fault injection mechanism is unavailable~~ Fault injection confirmed unavailable; vitest fallback applied per plan risk mitigation.

### Phase 4: Destructive Tests
- [x] Run EX-008: checkpoint `pre-ex008-delete` created (ID 10), `memory_delete(25372)` deleted 1 memory, post-deletion search confirms absence. **PASS**
- [x] Run EX-009: checkpoint `pre-ex009-bulk-delete` created (ID 11), auto-checkpoint created (ID 12), `memory_bulk_delete(tier:"deprecated", specFolder:"test-sandbox-mutation")` deleted 3 deprecated memories. **PASS**
- [x] Sandbox isolation maintained — all operations scoped to `test-sandbox-mutation`.

### Phase 5: Evidence Collection and Verdict
- [x] For each scenario, capture prompt, exact command sequence, raw output, expected signals, and reviewer notes.
- [x] Apply the review protocol acceptance checks: preconditions satisfied, prompt/commands executed as written, expected signals present, evidence readable, outcome rationale explicit.
- [x] Assign PASS, PARTIAL, or FAIL per scenario and summarize phase coverage as 7/7 scenarios (5 PASS, 2 PARTIAL, 0 FAIL).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type (manual/MCP) |
|---------|---------------|--------------|-----------------------------|
| EX-006 | New memory ingestion | `Index memory file and report action` | MCP |
| EX-007 | Metadata + re-embed update | `Update memory title and triggers` | MCP |
| EX-008 | Atomic single delete | `Delete memory ID and verify removal` | manual (destructive — sandbox required) |
| EX-009 | Tier cleanup with safety | `Delete deprecated tier in scoped folder` | manual (destructive — sandbox required) |
| EX-010 | Feedback learning loop | `Record positive validation with queryId` | MCP |
| NEW-085 | Confirm atomic wrapper behavior | `Validate mutation transaction wrappers.` | manual |
| NEW-110 | Confirm 5-action PE decision engine during save | `Validate prediction-error save arbitration actions.` | manual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Internal | Green | Exact prompts, commands, evidence targets, and pass criteria cannot be verified |
| [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Internal | Green | Verdicts and coverage rules cannot be applied consistently |
| [`../../feature_catalog/02--mutation/`](../../feature_catalog/02--mutation/) | Internal | Green | Test-to-feature context and review triage lose their canonical reference |
| MCP runtime for `memory_save`, `memory_update`, `memory_delete`, `memory_bulk_delete`, `memory_validate`, and checkpoint tools | Internal | Green | MCP runtime healthy (v1.7.2), all tools responsive |
| Disposable sandbox spec folder and rollback checkpoints for EX-008 and EX-009 | Internal | Green | `specs/test-sandbox-mutation/` created with 6 fixture memories and 4 checkpoints |
| Fault injection mechanism (mock adapter or controlled DB mutation) for NEW-085 | Internal | Yellow | Client-side injection infeasible; vitest fallback applied (139/139 pass) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any destructive scenario (EX-008, EX-009) leaves the sandbox in a state that could taint later scenarios, or fault injection (NEW-085) leaves the database in a partial state.
- **Procedure for EX-008**: Restore `pre-ex008-delete` checkpoint via `checkpoint_restore(name:"pre-ex008-delete")`, verify restore with `memory_search(old title)`, and discard compromised evidence before retrying.
- **Procedure for EX-009**: Restore `pre-ex009-bulk-delete` checkpoint via `checkpoint_restore(name:"pre-ex009-bulk-delete")`, confirm recovery with `checkpoint_list()` and `memory_stats()`, and restart the scenario from the checkpoint step.
- **Procedure for NEW-085**: Run `memory_health()` to assess database consistency after a failed rollback; if the health report shows a degraded state, restore the nearest valid checkpoint and rerun the fault injection from a clean baseline.
<!-- /ANCHOR:rollback -->

---
