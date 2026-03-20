---
title: "EX-009 Deprecated Fixture 02: Bulk Delete Target"
description: "Second disposable deprecated-tier fixture for EX-009 tier-based bulk deletion test in Phase 002 mutation testing."
trigger_phrases:
  - "ex009 deprecated fixture two"
  - "sandbox bulk delete second target"
  - "phase 002 second deprecated memory"
  - "manual testing bulk delete pair"
importance_tier: "deprecated"
contextType: "general"
---

<!-- ANCHOR:continue-session -->
<a id="continue-session"></a>

## CONTINUE SESSION

Continue Phase 002 mutation manual testing. This is the second deprecated-tier fixture paired with fixture 01 for EX-009 bulk delete verification.

<!-- /ANCHOR:continue-session -->

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

- **Spec folder**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/002-mutation/`
- **Sandbox folder**: `specs/test-sandbox-mutation/`
- **Test ID**: EX-009 — Tier cleanup with safety (DESTRUCTIVE)
- **Phase**: Phase 002 (Mutation)
- **Status**: Second deprecated fixture, paired with fixture 01 to ensure deletion count > 1

<!-- /ANCHOR:project-state-snapshot -->

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## DECISIONS

- **D-001**: Create a distinct second fixture with its own title and trigger phrases to avoid PE gate deduplication via REINFORCE action.
- **D-002**: Both deprecated fixtures target the same sandbox folder for scoped bulk deletion.
- **D-003**: Different content from fixture 01 ensures the PE gate evaluates this as a CREATE rather than a duplicate detection.

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## CONVERSATION

Second deprecated fixture created to ensure the EX-009 test captures a meaningful deletion count rather than a trivial single-item deletion. The bulk delete tool counts all matches within the tier and specFolder scope, so having two fixtures confirms the count mechanism works correctly.

<!-- /ANCHOR:session-history -->

<!-- ANCHOR:recovery-hints -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

- File path: `specs/test-sandbox-mutation/memory/fixture-ex009-deprecated-02.md`
- Expected tier: deprecated
- Paired with: fixture-ex009-deprecated-01.md
- Combined expected deletion count: 2 deprecated fixtures in sandbox
- If save produces REINFORCE instead of CREATE: content is too similar to fixture 01, differentiate further

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
| Fixture number | 02 of 02 |
| Created | 2026-03-19 |

<!-- /ANCHOR:metadata -->
