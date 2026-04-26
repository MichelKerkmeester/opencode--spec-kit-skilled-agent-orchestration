---
title: "DR-006 -- Invalid or contradictory state halts for repair"
description: "Verify that partial or contradictory scratch artifacts trigger a halt for repair instead of a guessed resume path."
---

# DR-006 -- Invalid or contradictory state halts for repair

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-006`.

---

## 1. OVERVIEW

This scenario validates invalid or contradictory state halts for repair for `DR-006`. The objective is to verify that partial or contradictory scratch artifacts trigger a halt for repair instead of a guessed resume path.

### WHY THIS MATTERS

Deep-research continuity depends on trustworthy state; silently guessing through contradictory artifacts would corrupt later synthesis.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that partial or contradictory scratch artifacts trigger a halt for repair instead of a guessed resume path.
- Real user request: My deep-research scratch folder looks half-broken. Will the workflow repair it automatically or stop?
- Prompt: `As a manual-testing orchestrator, validate the invalid-state halt contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify contradictory or partial deep-research artifacts stop the workflow for repair instead of guessing through initialization. Return a concise user-facing pass/fail verdict.`
- Expected execution process: Inspect the protocol rules, inspect YAML invalid-state handling, then compare the result against README troubleshooting language.
- Desired user-facing outcome: The user is warned clearly that broken state must be repaired or archived before continuing.
- Expected signals: Invalid-state is a named class, both YAML files halt with a repair message, and the docs do not promise silent guessing for contradictory state.
- Pass/fail posture: PASS if the contract consistently halts on contradictory state; FAIL if any source implies silent auto-repair for invalid-state.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the invalid-state halt contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify contradictory or partial deep-research artifacts stop the workflow for repair instead of guessing through initialization. Return a concise user-facing pass/fail verdict.
### Commands
1. `bash: rg -n 'invalid-state|halt for repair|contradictory|guessing' .opencode/skill/sk-deep-research/references/loop_protocol.md .opencode/skill/sk-deep-research/SKILL.md`
2. `bash: rg -n 'on_invalid_state|halt: true|incomplete or contradictory' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml`
3. `bash: rg -n 'State file corrupt|repair|recover' .opencode/skill/sk-deep-research/README.md`
### Expected
Invalid-state is a named class, both YAML files halt with a repair message, and the docs do not promise silent guessing for contradictory state.
### Evidence
Capture the invalid-state rules, the YAML halt messages, and the troubleshooting wording together.
### Pass/Fail
PASS if the contract consistently halts on contradictory state; FAIL if any source implies silent auto-repair for invalid-state.
### Failure Triage
Distinguish invalid-state from recoverable JSONL corruption and verify both YAML files stop rather than continue.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `sk-deep-research`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Invalid-state contract; use `ANCHOR:phase-initialization` |
| `.opencode/skill/sk-deep-research/SKILL.md` | Rule-level guardrails; use `ANCHOR:rules` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Halt behavior; inspect `step_classify_session` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Halt behavior; inspect `step_classify_session` |
| `.opencode/skill/sk-deep-research/README.md` | Troubleshooting boundary; use `ANCHOR:troubleshooting` |

---

## 5. SOURCE METADATA

- Group: INITIALIZATION AND STATE SETUP
- Playbook ID: DR-006
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--initialization-and-state-setup/006-invalid-or-contradictory-state-halts-for-repair.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
