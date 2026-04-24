---
title: "Feature Specification [system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/002-mutation/spec]"
description: "Test specification for the mutation category: 9 playbook scenarios covering memory_save, memory_update, memory_delete, memory_bulk_delete, memory_validate, transaction wrappers, delete schema tightening, and prediction-error save arbitration."
trigger_phrases:
  - "mutation manual testing"
  - "phase 002 mutation"
  - "spec kit memory mutation tests"
  - "hybrid rag fusion mutation playbook"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/002-mutation"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: manual-testing-per-playbook mutation phase

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-03-22 |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Phase** | 002-mutation |
| **Predecessor** | [001-retrieval](../001-retrieval/spec.md) |
| **Successor** | [003-discovery](../003-discovery/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mutation feature category of the hybrid-RAG-fusion system requires structured manual verification against the official playbook. Each of the 9 mutation scenarios must be executed, verdicted, and evidenced independently. Two scenarios (EX-008 and EX-009) are destructive and require sandbox isolation — without a bounded phase packet, sandbox preconditions risk being overlooked.

### Purpose

Execute every mutation-category playbook scenario, record a PASS/FAIL/PARTIAL verdict for each, and capture supporting evidence so the mutation layer of the system-spec-kit memory system is fully verified. Explicitly call out destructive tests to ensure sandbox and checkpoint requirements are never bypassed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Executing all 9 mutation playbook scenarios listed in Section 4
- Recording PASS/FAIL/PARTIAL verdicts with evidence for each scenario
- Cross-referencing each scenario against the feature catalog (02--mutation)
- Maintaining sandbox isolation for destructive scenarios EX-008 and EX-009
- Updating checklist.md and tasks.md as execution proceeds

### Out of Scope

- Retrieval scenarios (covered in 001-retrieval)
- Discovery, lifecycle, analysis, evaluation, or other category scenarios
- Code changes or bug fixes discovered during testing (tracked separately)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `tasks.md` | Modify | Update task status as scenarios are executed |
| `checklist.md` | Modify | Mark items complete with evidence references |
| `implementation-summary.md` | Modify | Complete after all scenarios are verdicted |

### Scenario Registry

| # | Scenario ID | Scenario Name | Feature Catalog Ref |
|---|-------------|---------------|---------------------|
| 1 | 002 | Audit phase scenarios | See parent spec |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Scenarios to Execute

All 9 scenarios below are P0. Each must receive a PASS, FAIL, or PARTIAL verdict before this phase is considered complete.

| Scenario ID | Scenario Name | Playbook File | Feature Catalog Reference |
|-------------|---------------|---------------|--------------------------|
| EX-006 | Memory indexing (memory_save) | `../../manual_testing_playbook/02--mutation/006-memory-indexing-memory-save.md` | 02--mutation / 01-memory-indexing-memorysave.md |
| EX-007 | Memory metadata update (memory_update) | `../../manual_testing_playbook/02--mutation/007-memory-metadata-update-memory-update.md` | 02--mutation / 02-memory-metadata-update-memoryupdate.md |
| M-008 | Feature 09 Direct Manual Scenario (Per-memory History Log) | `../../manual_testing_playbook/02--mutation/008-feature-09-direct-manual-scenario-per-memory-history-log.md` | 02--mutation / 10-per-memory-history-log.md |
| EX-008 | Single and folder delete (memory_delete) — **DESTRUCTIVE** | `../../manual_testing_playbook/02--mutation/008-single-and-folder-delete-memory-delete.md` | 02--mutation / 03-single-and-folder-delete-memorydelete.md |
| EX-009 | Tier-based bulk deletion (memory_bulk_delete) — **DESTRUCTIVE** | `../../manual_testing_playbook/02--mutation/009-tier-based-bulk-deletion-memory-bulk-delete.md` | 02--mutation / 04-tier-based-bulk-deletion-memorybulkdelete.md |
| EX-010 | Validation feedback (memory_validate) | `../../manual_testing_playbook/02--mutation/010-validation-feedback-memory-validate.md` | 02--mutation / 05-validation-feedback-memoryvalidate.md |
| 085 | Transaction wrappers on mutation handlers | `../../manual_testing_playbook/02--mutation/085-transaction-wrappers-on-mutation-handlers.md` | 02--mutation / 06-transaction-wrappers-on-mutation-handlers.md |
| 101 | memory_delete confirm schema tightening | `../../manual_testing_playbook/02--mutation/101-memory-delete-confirm-schema-tightening.md` | 02--mutation / 03-single-and-folder-delete-memorydelete.md |
| 110 | Prediction-error save arbitration | `../../manual_testing_playbook/02--mutation/110-prediction-error-save-arbitration.md` | 02--mutation / 08-prediction-error-save-arbitration.md |

### P1 — Supporting Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-M01 | Evidence captured per scenario | Each executed scenario has a recorded observation or output excerpt |
| REQ-M02 | Feature catalog cross-reference verified | Each scenario's catalog reference confirmed present and accurate |
| REQ-M03 | Destructive scenario safety gates documented | EX-008 and EX-009 each have a named checkpoint confirmed before the destructive step runs |

### P1 - Packet Governance Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-901 | 002-mutation packet keeps execution evidence and verdict documentation synchronized | `tasks.md`, `checklist.md`, and `implementation-summary.md` stay aligned for 002-mutation |
| REQ-902 | 002-mutation packet keeps execution evidence and verdict documentation synchronized | `tasks.md`, `checklist.md`, and `implementation-summary.md` stay aligned for 002-mutation |
| REQ-903 | 002-mutation packet keeps execution evidence and verdict documentation synchronized | `tasks.md`, `checklist.md`, and `implementation-summary.md` stay aligned for 002-mutation |
| REQ-904 | 002-mutation packet keeps execution evidence and verdict documentation synchronized | `tasks.md`, `checklist.md`, and `implementation-summary.md` stay aligned for 002-mutation |
| REQ-905 | 002-mutation packet keeps execution evidence and verdict documentation synchronized | `tasks.md`, `checklist.md`, and `implementation-summary.md` stay aligned for 002-mutation |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 mutation scenarios executed and verdicted (PASS, FAIL, or PARTIAL)
- **SC-002**: All P0 checklist items marked with evidence
- **SC-003**: Destructive tests EX-008 and EX-009 executed only in a scoped sandbox with checkpoints confirmed in advance
- **SC-004**: tasks.md reflects final execution status for every scenario task
- **SC-005**: implementation-summary.md completed with aggregate results
### Acceptance Scenarios

**Given** the `002-mutation` phase packet, **when** a reviewer opens the scenario mapping, **then** every scenario listed for the phase has a bounded execution target and a documented acceptance rule.

**Given** the `002-mutation` phase packet, **when** execution evidence is reviewed, **then** verdict notes can be traced through `tasks.md`, `checklist.md`, and `implementation-summary.md`.

**Given** the `002-mutation` phase packet, **when** a reviewer checks neighboring navigation, **then** the packet points back to the parent and to the adjacent numbered phase where one exists.

**Given** strict validation runs on the `002-mutation` phase packet, **when** the validator checks structure, **then** the packet satisfies Level 2 requirement and acceptance-scenario minimums.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Parent plan `../plan.md` | Execution order and environment setup | Read parent plan before starting |
| Dependency | Playbook folder `../../manual_testing_playbook/02--mutation/` | Scenario steps not available | Confirm playbook files accessible before execution |
| Dependency | Feature catalog `../../feature_catalog/02--mutation/` | Cross-reference cannot be verified | Confirm catalog files accessible before execution |
| Dependency | MCP runtime for mutation tools | Scenarios cannot be executed | Verify MCP runtime healthy before starting |
| Risk | **EX-008 (DESTRUCTIVE)**: `memory_delete` is irreversible without a prior checkpoint | Critical | Run ONLY inside a disposable sandbox spec folder; create named checkpoint before invoking delete |
| Risk | **EX-009 (DESTRUCTIVE)**: `memory_bulk_delete` can wipe all memories in a tier if not scoped | Critical | Run ONLY inside a disposable sandbox spec folder with explicit `specFolder` parameter; create checkpoint first |
| Risk | 085 requires fault injection into the mutation path | High | Use isolated database or sandbox; verify DB state with `memory_health()` after rollback test |
| Risk | 110 PE arbitration writes to `memory_conflicts` table | Medium | Scope all PE test saves to a disposable sandbox folder; checkpoint before and after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

## 10. OPEN QUESTIONS

- None at time of writing. Questions discovered during execution should be noted in scratch/ and tracked here.
<!-- /ANCHOR:questions -->
