---
title: "DRV-023 -- Malformed JSONL lines are skipped with defaults"
description: "Verify that malformed JSONL lines in the review state log are skipped gracefully with sensible defaults applied."
---

# DRV-023 -- Malformed JSONL lines are skipped with defaults

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-023`.

---

## 1. OVERVIEW

This scenario validates malformed JSONL lines are skipped with defaults for `DRV-023`. The objective is to verify that when the review state log (`deep-review-state.jsonl`) contains malformed or unparseable lines, they are skipped gracefully and sensible defaults are applied so the loop can continue.

### WHY THIS MATTERS

Agent-written JSONL can be corrupted by truncation, encoding issues, or agent errors mid-write. If the loop fails hard on a single bad line, all prior review progress is lost. Graceful degradation with defaults preserves the review session and lets the operator investigate the corruption later.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify malformed JSONL lines are skipped gracefully in review state.
- Real user request: If the state file gets corrupted partway through, does the whole review fail?
- Prompt: `As a manual-testing orchestrator, validate the malformed JSONL handling contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify when review/deep-review-state.jsonl contains unparseable lines, those lines are skipped without halting the loop, that sensible defaults (e.g., newFindingsRatio = 1.0) are used to prevent premature convergence, and that the skip is logged or visible in the state. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the state format reference for JSONL parsing rules, then the loop protocol or YAML for error handling, then the convergence reference for default values on parse failure.
- Desired user-facing outcome: The user is told that a corrupted state line will not crash the review, and that the loop applies conservative defaults to avoid false convergence.
- Expected signals: Malformed lines are skipped (not crash), defaults applied (e.g., `newFindingsRatio = 1.0` to force continuation), iteration count still derived from valid lines, and the skip is observable.
- Pass/fail posture: PASS if malformed lines are skipped with conservative defaults; FAIL if a bad line crashes the loop or causes false convergence.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DRV-023 | Malformed JSONL lines are skipped with defaults | Verify malformed JSONL lines in review state are skipped gracefully with sensible defaults. | As a manual-testing orchestrator, validate the malformed JSONL handling contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify when review/deep-review-state.jsonl contains unparseable lines, those lines are skipped without halting the loop, that sensible defaults (e.g., newFindingsRatio = 1.0) are used to prevent premature convergence, and that the skip is logged or visible in the state. Return a concise operator-facing verdict. | 1. `bash: rg -n 'malformed|unparseable|skip.*line|parse.*error|JSON.*parse|graceful|default.*ratio|newFindingsRatio.*1\.0' .opencode/skill/sk-deep-review/references/state_format.md .opencode/skill/sk-deep-review/references/convergence.md` -> 2. `bash: rg -n 'malformed|parse_error|skip_line|graceful|default|JSON.*parse|error_handling' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` -> 3. `bash: rg -n 'malformed|corrupt|graceful|JSONL.*error|parse.*fail|default|error handling|fault tolerance' .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md .opencode/command/spec_kit/deep-review.md` | Malformed lines skipped, defaults applied (`newFindingsRatio = 1.0`), iteration count from valid lines, skip is observable. | Capture the JSONL parsing contract from state format, the error handling rules from YAML or loop protocol, and the default values applied on parse failure. | PASS if malformed lines are skipped with conservative defaults; FAIL if a bad line crashes the loop or causes false convergence. | Privilege the state format reference for JSONL schema rules and the convergence reference for default values on degraded input. |

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `sk-deep-review`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-review/references/state_format.md` | JSONL schema and parsing rules; use the state log section |
| `.opencode/skill/sk-deep-review/references/convergence.md` | Default values on parse failure; graceful degradation rules |
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Error handling in iteration loop; use the iteration loop section |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | JSONL parsing and error handling in state read steps |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | JSONL parsing and error handling in state read steps |
| `.opencode/command/spec_kit/deep-review.md` | Error handling documentation; use `## 10. ERROR HANDLING` if present |
| `.opencode/skill/sk-deep-review/SKILL.md` | Rules for state reading; use `ANCHOR:rules` Rule 1 |

---

## 5. SOURCE METADATA

- Group: PAUSE, RESUME, AND FAULT TOLERANCE
- Playbook ID: DRV-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
