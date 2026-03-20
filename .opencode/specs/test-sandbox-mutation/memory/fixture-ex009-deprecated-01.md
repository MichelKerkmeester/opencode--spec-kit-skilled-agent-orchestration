---
title: "EX-009 Deprecated Fixture 01: Bulk Delete Target"
description: "Disposable deprecated-tier fixture for EX-009 tier-based bulk deletion test in Phase 002 mutation testing."
trigger_phrases:
  - "ex009 deprecated fixture"
  - "sandbox mutation bulk delete target"
  - "phase 002 tier cleanup test"
  - "manual testing bulk deletion"
importance_tier: "deprecated"
contextType: "general"
---

<!-- ANCHOR:continue-session -->
<a id="continue-session"></a>

## CONTINUE SESSION

Continue Phase 002 mutation manual testing. This deprecated-tier fixture is the first bulk delete target for EX-009.

<!-- /ANCHOR:continue-session -->

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

- **Spec folder**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/002-mutation/`
- **Sandbox folder**: `specs/test-sandbox-mutation/`
- **Test ID**: EX-009 — Tier cleanup with safety (DESTRUCTIVE)
- **Phase**: Phase 002 (Mutation)
- **Status**: Deprecated fixture created, paired with fixture 02 for bulk delete count verification

<!-- /ANCHOR:project-state-snapshot -->

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## DECISIONS

- **D-001**: Set importance_tier to "deprecated" in frontmatter so this memory is targeted by the tier-based bulk delete tool.
- **D-002**: Scope the bulk delete to `specFolder:"test-sandbox-mutation"` to prevent accidental deletion of production deprecated memories.
- **D-003**: Two deprecated fixtures are created (01 and 02) to verify the deletion count is greater than one.

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## CONVERSATION

This fixture was created for the EX-009 tier-based bulk deletion test. The `memory_bulk_delete` tool auto-creates a checkpoint before executing, and the test verifies both the deletion count and checkpoint presence via `checkpoint_list()`. The scoped deletion with `specFolder` parameter ensures only sandbox deprecated memories are affected.

<!-- /ANCHOR:session-history -->

<!-- ANCHOR:recovery-hints -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

- File path: `specs/test-sandbox-mutation/memory/fixture-ex009-deprecated-01.md`
- Expected tier: deprecated
- Expected bulk delete count contribution: 1 of 2 deprecated fixtures in sandbox
- If bulk delete fails: check specFolder scope, verify tier assignment, restore auto-checkpoint

<!-- /ANCHOR:recovery-hints -->

<!-- ANCHOR:metadata -->
<a id="memory-metadata"></a>

## MEMORY METADATA

| Field | Value |
|-------|-------|
| Test ID | EX-009 |
| Scenario | Tier cleanup with safety |
| Sandbox | test-sandbox-mutation |
| Tier | deprecated |
| Created | 2026-03-19 |
| Disposable | Yes — intended for bulk deletion |

<!-- /ANCHOR:metadata -->
