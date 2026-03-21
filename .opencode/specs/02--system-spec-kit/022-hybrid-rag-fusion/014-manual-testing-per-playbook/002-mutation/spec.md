---
title: "Feature Specification: manual-testing-per-playbook mutation phase [template:level_1/spec.md]"
description: "Phase 002 documents the mutation manual test packet for the Spec Kit Memory system. It breaks seven mutation scenarios out of the central playbook so testers can execute prompts, command sequences, evidence capture, and verdict criteria from one bounded folder."
trigger_phrases:
  - "mutation manual testing"
  - "phase 002 mutation"
  - "spec kit memory mutation tests"
  - "hybrid rag fusion mutation playbook"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook mutation phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [`../spec.md`](../spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual mutation scenarios for the Spec Kit Memory system currently live inside the central playbook and need a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated mutation packet, Phase 002 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results. Two of the seven scenarios (EX-008 and EX-009) are destructive and require sandbox isolation — without a bounded packet, the sandbox precondition requirement risks being overlooked.

### Purpose
Provide a single mutation-focused specification that maps all seven Phase 002 test IDs to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook. Explicitly call out destructive tests to ensure sandbox and checkpoint requirements are never bypassed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| EX-006 | New memory ingestion | [`../../feature_catalog/02--mutation/01-memory-indexing-memorysave.md`](../../feature_catalog/02--mutation/01-memory-indexing-memorysave.md) | `Index memory file and report action` | `memory_save(filePath)` -> `memory_stats()` -> `memory_search(title)` |
| EX-007 | Metadata + re-embed update | [`../../feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md`](../../feature_catalog/02--mutation/02-memory-metadata-update-memoryupdate.md) | `Update memory title and triggers` | `memory_update(id,title,triggers)` -> `memory_search(new title)` |
| EX-008 | Atomic single delete (**DESTRUCTIVE**) | [`../../feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md`](../../feature_catalog/02--mutation/03-single-and-folder-delete-memorydelete.md) | `Delete memory ID and verify removal` | `checkpoint_create(name:"pre-ex008-delete",specFolder:"<sandbox-spec>")` -> `memory_delete(id)` -> `memory_search(old title)` |
| EX-009 | Tier cleanup with safety (**DESTRUCTIVE**) | [`../../feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md`](../../feature_catalog/02--mutation/04-tier-based-bulk-deletion-memorybulkdelete.md) | `Delete deprecated tier in scoped folder` | `checkpoint_create(name:"pre-ex009-bulk-delete",specFolder:"<sandbox-spec>")` -> `memory_bulk_delete(tier,specFolder:"<sandbox-spec>")` -> `checkpoint_list(specFolder:"<sandbox-spec>")` |
| EX-010 | Feedback learning loop | [`../../feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md`](../../feature_catalog/02--mutation/05-validation-feedback-memoryvalidate.md) | `Record positive validation with queryId` | `memory_validate(memoryId,helpful:true,queryId)` |
| 085 | Confirm atomic wrapper behavior | [`../../feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md`](../../feature_catalog/02--mutation/06-transaction-wrappers-on-mutation-handlers.md) | `Validate mutation transaction wrappers.` | `1) inject mid-step fault 2) verify rollback 3) confirm consistent state` |
| 110 | Confirm 5-action PE decision engine during save | [`../../feature_catalog/02--mutation/08-prediction-error-save-arbitration.md`](../../feature_catalog/02--mutation/08-prediction-error-save-arbitration.md) | `Validate prediction-error save arbitration actions.` | `1) save a memory with unique content → expect CREATE action 2) save identical content → expect REINFORCE (similarity >=0.95) 3) save slightly modified content (no contradiction) → expect UPDATE (0.85-0.94) 4) save modified content with contradiction → expect SUPERSEDE (0.85-0.94 + contradiction) 5) save loosely related content → expect CREATE_LINKED (0.70-0.84) 6) query memory_conflicts table entries for action/similarity/contradiction columns 7) save with force:true → verify PE arbitration bypassed` |

### Out of Scope
- Executing the seven mutation scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-mutation phases from `001-retrieval/` and `003-discovery/` through `019-feature-flag-reference/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 002 mutation requirements, test inventory, and acceptance criteria |
| `plan.md` | Create | Phase 002 mutation execution plan and review workflow |
| `tasks.md` | Create | Phase 002 task tracker for setup, execution, and verification work |
| `checklist.md` | Create | Phase 002 QA verification checklist |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document EX-006 new memory ingestion with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS if indexed and retrievable and the save does not report `INSUFFICIENT_CONTEXT_ABORT` or template-contract failure |
| REQ-002 | Document EX-007 metadata and re-embed update with its exact prompt, update-then-search command sequence, evidence target, and feature link. | PASS if updated title retrievable |
| REQ-003 | Document EX-008 atomic single delete with its exact destructive prompt, checkpoint-then-delete-then-search command sequence, sandbox restriction, evidence target, and feature link. | PASS if deleted item not found and checkpoint exists |
| REQ-004 | Document EX-009 tier cleanup with safety with its exact bulk-delete prompt, checkpoint-then-bulk-delete-then-list command sequence, sandbox restriction, evidence target, and feature link. | PASS if scoped deletions in sandbox and checkpoint present |
| REQ-005 | Document EX-010 feedback learning loop with its exact validation prompt, command sequence, evidence target, and feature link. | PASS if feedback persisted and metadata returned |
| REQ-006 | Document 085 transaction wrapper atomicity with its exact fault-injection prompt, rollback-verification sequence, evidence target, and feature link. | PASS if injected faults trigger complete rollback and DB state is fully consistent after recovery |
| REQ-007 | Document 110 prediction-error save arbitration with its exact PE-decision prompt, all-five-action similarity-band sequence, memory_conflicts table check, force:true bypass verification, evidence target, and feature link. | PASS if all 5 PE actions trigger at correct similarity thresholds and force:true bypasses the decision engine |

No P1 items are defined for this phase; all seven mutation scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 mutation tests are documented with exact prompts, exact command sequences, linked feature catalog entries, and playbook-derived pass criteria.
- **SC-002**: `plan.md` defines how evidence, verdicts, and coverage for EX-006, EX-007, EX-008, EX-009, EX-010, 085, and 110 will be collected.
- **SC-003**: Reviewers can audit every Phase 002 scenario using this folder plus the linked playbook (`../../manual_testing_playbook/manual_testing_playbook.md`) and review protocol (`../../manual_testing_playbook/review_protocol.md`).
- **SC-004**: Destructive tests EX-008 and EX-009 are explicitly flagged in both the scope table and risks section, with sandbox and checkpoint preconditions clearly stated.
- **SC-005**: The phase packet contains no placeholder or template text and is ready for manual execution planning.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for exact prompts, commands, evidence targets, and pass/fail criteria | Treat the playbook as source of truth and update this phase packet only from that document |
| Dependency | [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review and do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/02--mutation/`](../../feature_catalog/02--mutation/) | Supplies feature context for each mutation scenario | Keep every test row linked to its mapped mutation feature file |
| Dependency | MCP runtime plus mutation sandbox corpus | Required to execute `memory_save`, `memory_update`, `memory_delete`, `memory_bulk_delete`, and `memory_validate` scenarios safely | Run destructive tests in an isolated sandbox and preserve checkpoint/restart instructions in the plan |
| Risk | **EX-008 (DESTRUCTIVE)**: `memory_delete` with `id` is irreversible within a session if the checkpoint is not created first | Critical | Run ONLY inside a disposable sandbox spec folder (e.g., `specs/test-sandbox`); create and record `checkpoint_create(name:"pre-ex008-delete", ...)` before invoking delete |
| Risk | **EX-009 (DESTRUCTIVE)**: `memory_bulk_delete` targeting a tier can wipe all deprecated memories in a folder if `specFolder` is not scoped to the sandbox | Critical | Run ONLY inside a disposable sandbox spec folder; create and record `checkpoint_create(name:"pre-ex009-bulk-delete", ...)` before bulk delete; never run without explicit `specFolder:"<sandbox-spec>"` |
| Risk | 085 requires fault injection into the mutation path which can destabilize a shared database if not isolated | High | Use a separate test database or sandbox environment; verify post-rollback DB state with `memory_health()` before running subsequent tests |
| Risk | 110 PE arbitration testing writes to `memory_conflicts` table and creates multiple memory records; fixture pollution can taint subsequent retrieval tests | Medium | Scope all PE test saves to a disposable sandbox folder; clean up or checkpoint before and after the scenario |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **OQ-1 (EX-008 fixture) — RESOLVED**: Sandbox fixture `specs/test-sandbox-mutation/memory/fixture-ex008-delete-target.md` (ID 25372) served as the canonical delete target. Template-contract-compliant memory file with 6 mandatory sections and 4+ trigger phrases ensures reproducibility.
- **OQ-2 (EX-009 config) — RESOLVED**: Tier `deprecated` with no `olderThanDays` filter, scoped to `specFolder:"test-sandbox-mutation"`. Two deprecated fixtures (IDs 25373, 25374) ensured non-empty count. Actual deletion count was 3 (one additional deprecated record from force-resave operations).
- **OQ-3 (085 fault injection) — RESOLVED**: Client-side fault injection is **infeasible**. `transaction-manager.ts` uses better-sqlite3's synchronous `database.transaction()` wrapper — no external injection point accessible from MCP client. **Fallback applied**: vitest suite (139/139 tests pass) covers rollback behavior (T192: atomic save wrapping, T194: file cleanup on DB failure, T191a/b: nested transaction handling). Code inspection confirms `runInTransaction()` auto-rolls back on exception.
- **OQ-4 (110 sandbox) — RESOLVED**: Sandbox folder `specs/test-sandbox-mutation/` held all similarity-band test saves. The `memory_conflicts` table was not cleared before the scenario — PE gate logs all decisions including no-candidate CREATEs (T-09 audit trail). Base fixture (ID 25377) saved as CREATE; force re-save produced UPDATE (ID 25416). All 5 threshold bands verified via code inspection and vitest; live MCP testing demonstrated CREATE and UPDATE actions.
<!-- /ANCHOR:questions -->

---
