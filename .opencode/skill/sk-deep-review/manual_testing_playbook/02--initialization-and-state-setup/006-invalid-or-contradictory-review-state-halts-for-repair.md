---
title: "DRV-006 -- Invalid or contradictory review state halts for repair"
description: "Verify that invalid state (missing JSONL, corrupted config, contradictory artifacts) halts with a repair message instead of proceeding."
---

# DRV-006 -- Invalid or contradictory review state halts for repair

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-006`.

---

## 1. OVERVIEW

This scenario validates invalid or contradictory review state halts for repair for `DRV-006`. The objective is to verify that invalid state (missing JSONL, corrupted config, contradictory artifacts) halts with a repair message instead of proceeding.

### WHY THIS MATTERS

Partial or corrupted state can produce silent misclassifications or incorrect convergence results. The system must detect invalid state and halt rather than silently corrupting the review.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that invalid state (missing JSONL, corrupted config, contradictory artifacts) halts with a repair message instead of proceeding.
- Real user request: What happens if some of my review state files got deleted or corrupted mid-session?
- Prompt: `As a manual-testing orchestrator, validate the invalid-state detection contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify step_classify_session classifies partial, missing, or contradictory review state as "invalid-state" and halts with a repair message. Return a concise user-facing pass/fail verdict.`
- Expected execution process: Inspect the YAML classify step for the invalid-state classification rules, then check the halt message, then verify the migration step handles conflicting canonical and legacy state.
- Desired user-facing outcome: The user is told that the system will not silently proceed on corrupted state but will halt and ask them to repair or archive the invalid review packet.
- Expected signals: The classify step has an explicit "invalid-state" classification for partial or contradictory combinations; it halts with a descriptive message; the migration step also halts on canonical/legacy conflicts.
- Pass/fail posture: PASS if invalid state consistently triggers a halt with an actionable repair message; FAIL if any invalid state combination proceeds silently.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the invalid-state detection contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify step_classify_session classifies partial, missing, or contradictory review state as "invalid-state" and halts with a repair message. Return a concise user-facing pass/fail verdict.
### Commands
1. `bash: rg -n 'invalid.state|on_invalid|halt|repair|contradictory|partial' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
2. `bash: rg -n 'invalid.state|on_invalid|halt|repair' .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
3. `bash: rg -n 'on_conflict|on_canonical_present|contradictory' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml`
### Expected
The classify step has an explicit "invalid-state" classification for partial or contradictory combinations; it halts with a descriptive message; the migration step halts on canonical/legacy conflicts.
### Evidence
Capture the classify step invalid-state rule, the halt message text, and the migration conflict handling.
### Pass/Fail
PASS if invalid state consistently triggers a halt with an actionable repair message; FAIL if any invalid state combination proceeds silently.
### Failure Triage
Enumerate all possible partial-state combinations (config only, JSONL only, strategy only, pairs without the third) and verify each maps to invalid-state.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `sk-deep-review`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Session classification and migration; inspect `step_classify_session` and `step_migrate_legacy_review_state` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Session classification; inspect `step_classify_session` |
| `.opencode/skill/sk-deep-review/SKILL.md` | Phase detection guidance; use `ANCHOR:smart-routing` |

---

## 5. SOURCE METADATA

- Group: INITIALIZATION AND STATE SETUP
- Playbook ID: DRV-006
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--initialization-and-state-setup/006-invalid-or-contradictory-review-state-halts-for-repair.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
