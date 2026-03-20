---
title: "EX-008 Delete Target: Sandbox Fixture"
description: "Disposable fixture memory designated as the EX-008 atomic single delete target in Phase 002 mutation testing."
trigger_phrases:
  - "ex008 delete target fixture"
  - "sandbox mutation delete target"
  - "phase 002 atomic delete test"
  - "manual testing single delete"
importance_tier: "normal"
contextType: "general"
---

<!-- ANCHOR:continue-session -->
<a id="continue-session"></a>

## CONTINUE SESSION

Continue Phase 002 mutation manual testing. This fixture is the designated delete target for EX-008 atomic single delete test.

<!-- /ANCHOR:continue-session -->

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

- **Spec folder**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/002-mutation/`
- **Sandbox folder**: `specs/test-sandbox-mutation/`
- **Test ID**: EX-008 — Atomic single delete (DESTRUCTIVE)
- **Phase**: Phase 002 (Mutation)
- **Status**: Fixture created, awaiting checkpoint and delete test

<!-- /ANCHOR:project-state-snapshot -->

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## DECISIONS

- **D-001**: This memory is the canonical EX-008 delete target. Its ID will be captured at index time and used in the `memory_delete(id)` call.
- **D-002**: Checkpoint `pre-ex008-delete` must be created in the sandbox folder before deletion proceeds.
- **D-003**: Post-deletion search for "EX-008 Delete Target" must return zero results to confirm successful removal from the index.

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## CONVERSATION

This fixture was created for the EX-008 destructive test scenario. The test follows the destructive scenario rules from the review protocol: checkpoint before delete, sandbox-only execution, and post-deletion verification via search. The `memory_delete(id)` tool removes the memory from the index and confirms deletion. The checkpoint provides a rollback path if needed.

<!-- /ANCHOR:session-history -->

<!-- ANCHOR:recovery-hints -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

- File path: `specs/test-sandbox-mutation/memory/fixture-ex008-delete-target.md`
- Expected lifecycle: CREATE on save, DELETE during test, absent from search after deletion
- Checkpoint name: `pre-ex008-delete`
- If delete fails: restore checkpoint, verify sandbox folder, retry with correct memory ID

<!-- /ANCHOR:recovery-hints -->

<!-- ANCHOR:metadata -->
<a id="memory-metadata"></a>

## MEMORY METADATA

| Field | Value |
|-------|-------|
| Test ID | EX-008 |
| Scenario | Atomic single delete |
| Sandbox | test-sandbox-mutation |
| Created | 2026-03-19 |
| Disposable | Yes — intended to be deleted |

<!-- /ANCHOR:metadata -->
