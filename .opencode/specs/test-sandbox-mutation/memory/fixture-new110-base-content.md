---
title: "NEW-110 PE Base Content: Prediction Error Gate Test"
description: "Base fixture for NEW-110 PE decision engine testing — subsequent saves with varying similarity trigger different PE actions."
trigger_phrases:
  - "new110 pe base fixture"
  - "prediction error gate base content"
  - "phase 002 pe arbitration test"
  - "manual testing similarity bands"
importance_tier: "normal"
contextType: "general"
---

<!-- ANCHOR:continue-session -->
<a id="continue-session"></a>

## CONTINUE SESSION

Continue Phase 002 mutation manual testing. This is the base reference memory for the NEW-110 prediction-error save arbitration test. Subsequent saves with varying content similarity will trigger different PE actions.

<!-- /ANCHOR:continue-session -->

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

- **Spec folder**: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/002-mutation/`
- **Sandbox folder**: `specs/test-sandbox-mutation/`
- **Test ID**: NEW-110 — 5-action PE decision engine during save
- **Phase**: Phase 002 (Mutation)
- **Status**: Base content fixture created, awaiting similarity-band test saves
- **Threshold constants**: DUPLICATE=0.95, HIGH_MATCH=0.85, MEDIUM_MATCH=0.70, LOW_MATCH=0.50

<!-- /ANCHOR:project-state-snapshot -->

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## DECISIONS

- **D-001**: This base content establishes the reference point against which subsequent saves are compared for similarity scoring by the prediction-error gate.
- **D-002**: The content describes PE gate thresholds and behavior to provide semantic substance that subsequent fixtures can match at varying similarity levels.
- **D-003**: The `memory_conflicts` table will be queried after all 5 actions to verify action, similarity, and contradiction columns are populated correctly.
- **D-004**: A final `force:true` save will verify PE arbitration bypass mechanism works correctly.

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## CONVERSATION

This fixture was created for the NEW-110 prediction-error save arbitration test. The Spec Kit Memory system uses a prediction-error gate with five actions based on cosine similarity thresholds between new and existing content embeddings. The thresholds are defined in `prediction-error-gate.ts` as constants: DUPLICATE at 0.95 triggers REINFORCE, HIGH_MATCH at 0.85 triggers UPDATE or SUPERSEDE depending on contradiction detection, MEDIUM_MATCH at 0.70 triggers CREATE_LINKED, and anything below triggers CREATE. The contradiction detection system uses pattern matching for negation, replacement, deprecation, correction, clarification, prohibition, obsolescence, and explicit contradiction markers with specificity-based confidence scores.

<!-- /ANCHOR:session-history -->

<!-- ANCHOR:recovery-hints -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

- File path: `specs/test-sandbox-mutation/memory/fixture-new110-base-content.md`
- Expected first save action: CREATE (no prior match)
- Subsequent test saves target similarity bands: 0.95+ (REINFORCE), 0.85-0.94 (UPDATE/SUPERSEDE), 0.70-0.84 (CREATE_LINKED)
- If PE actions don't match expected bands: check embedding provider health, verify threshold constants, inspect memory_conflicts table

<!-- /ANCHOR:recovery-hints -->

<!-- ANCHOR:metadata -->
<a id="memory-metadata"></a>

## MEMORY METADATA

| Field | Value |
|-------|-------|
| Test ID | NEW-110 |
| Scenario | 5-action PE decision engine |
| Sandbox | test-sandbox-mutation |
| PE Thresholds | 0.95/0.85/0.70/0.50 |
| Created | 2026-03-19 |
| Disposable | Yes |

<!-- /ANCHOR:metadata -->
