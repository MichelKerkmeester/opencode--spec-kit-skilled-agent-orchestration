---
title: "EX-006 Sandbox Fixture: Memory Ingestion Test"
description: "Disposable fixture memory for EX-006 new memory ingestion test in Phase 002 mutation manual testing packet."
trigger_phrases:
  - "ex006 ingestion fixture"
  - "sandbox mutation ingestion test"
  - "phase 002 mutation memory save"
  - "manual testing memory indexing"
importance_tier: "normal"
contextType: "general"
---

<!-- ANCHOR:continue-session -->
<a id="continue-session"></a>

## CONTINUE SESSION

Continue Phase 002 mutation manual testing. This fixture validates the memory_save ingestion pipeline for EX-006.

<!-- /ANCHOR:continue-session -->

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

- **Spec folder**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/002-mutation/`
- **Sandbox folder**: `specs/test-sandbox-mutation/`
- **Test ID**: EX-006 — New memory ingestion
- **Phase**: Phase 002 (Mutation)
- **Status**: Sandbox fixture created, awaiting ingestion test

<!-- /ANCHOR:project-state-snapshot -->

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## DECISIONS

- **D-001**: Use `test-sandbox-mutation` as the disposable sandbox spec folder to isolate all mutation test artifacts from production data.
- **D-002**: Fixture files include 4+ trigger phrases and all mandatory template sections to pass quality gate and template contract validation.
- **D-003**: Each fixture targets exactly one test scenario to maintain clear evidence attribution during verdict assignment.

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## CONVERSATION

This fixture was created during Phase 002 mutation manual testing execution. The Spec Kit Memory system uses a multi-stage ingestion pipeline: file read, metadata extraction, quality scoring, sufficiency check, embedding generation, PE gate evaluation, and index insertion. This fixture exercises the complete pipeline end-to-end for test scenario EX-006.

The expected outcome is a CREATE action (no prior memory with matching content exists in the sandbox folder), with the memory becoming searchable via `memory_search()` and visible in `memory_stats()`.

<!-- /ANCHOR:session-history -->

<!-- ANCHOR:recovery-hints -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

- File path: `specs/test-sandbox-mutation/memory/fixture-ex006-ingestion.md`
- Expected save action: CREATE
- Expected search query: `memory_search("EX-006 Sandbox Fixture")`
- Expected stats delta: +1 memory in `test-sandbox-mutation` folder
- If ingestion fails: check quality gate thresholds, verify anchor structure, confirm embedding provider health

<!-- /ANCHOR:recovery-hints -->

<!-- ANCHOR:metadata -->
<a id="memory-metadata"></a>

## MEMORY METADATA

| Field | Value |
|-------|-------|
| Test ID | EX-006 |
| Scenario | New memory ingestion |
| Sandbox | test-sandbox-mutation |
| Created | 2026-03-19 |
| Disposable | Yes |

<!-- /ANCHOR:metadata -->
