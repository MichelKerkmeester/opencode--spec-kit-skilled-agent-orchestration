---
title: "DRV-024 -- JSONL reconstruction from review iteration files"
description: "Verify that the JSONL state log can be reconstructed from the review/iterations/ write-once files if the main state file is lost or corrupted."
---

# DRV-024 -- JSONL reconstruction from review iteration files

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-024`.

---

## 1. OVERVIEW

This scenario validates JSONL reconstruction from review iteration files for `DRV-024`. The objective is to verify that the JSONL state log can be reconstructed from the `review/iterations/iteration-NNN.md` write-once files if the main state file is lost or corrupted beyond recovery.

### WHY THIS MATTERS

The write-once iteration files serve as a redundant record of each review cycle. If `deep-review-state.jsonl` is lost or corrupted beyond what graceful degradation can handle, the iteration files provide the raw material to reconstruct the state log and resume the review without starting over.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify JSONL can be reconstructed from review/iterations/ files.
- Real user request: If the state file is completely lost, can I recover the review from the iteration files?
- Prompt: `As a manual-testing orchestrator, validate the JSONL reconstruction contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify each review/iterations/iteration-NNN.md file contains sufficient metadata (iteration number, dimension, findings counts, newFindingsRatio) to reconstruct a valid JSONL state log, that the reconstruction path is documented, and that a reconstructed state log allows the review to resume. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the state format reference for JSONL schema and iteration file schema, then the loop protocol for reconstruction guidance, then the SKILL.md and quick reference for user-facing recovery instructions.
- Desired user-facing outcome: The user is told that iteration files are a safety net and can be used to rebuild the state log if it is lost.
- Expected signals: Iteration files contain metadata matching JSONL fields, reconstruction path is documented or derivable, reconstructed JSONL allows loop resume, and iteration files are write-once (immutable after creation).
- Pass/fail posture: PASS if iteration files contain enough data for reconstruction and the path is documented; FAIL if iteration files lack critical metadata or reconstruction is not feasible.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the JSONL reconstruction contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify each review/iterations/iteration-NNN.md file contains sufficient metadata (iteration number, dimension, findings counts, newFindingsRatio) to reconstruct a valid JSONL state log, that the reconstruction path is documented, and that a reconstructed state log allows the review to resume. Return a concise operator-facing verdict.
### Commands
1. `bash: rg -n 'iteration.*file|iteration-NNN|write.once|iterations/|reconstruction|reconstruct|redundant|backup' .opencode/skill/sk-deep-review/references/state_format.md .opencode/skill/sk-deep-review/references/loop_protocol.md`
2. `bash: rg -n 'iteration.*file|write_once|iterations/|iteration-NNN|reconstruct' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
3. `bash: rg -n 'iteration.*file|write-once|iterations/|iteration-NNN|reconstruct|recovery|backup' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md`
### Expected
Iteration files contain JSONL-compatible metadata, reconstruction path documented, reconstructed JSONL allows resume, and iteration files are write-once.
### Evidence
Capture the iteration file schema, the JSONL field mapping, and any documented reconstruction procedure.
### Pass/Fail
PASS if iteration files contain enough data for reconstruction and the path is documented; FAIL if iteration files lack critical metadata or reconstruction is not feasible.
### Failure Triage
Privilege the state format reference for both JSONL and iteration file schemas; compare field overlap to assess reconstruction feasibility.
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
| `.opencode/skill/sk-deep-review/references/state_format.md` | JSONL schema and iteration file schema; use the state log and findings registry sections |
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Iteration file write-once contract and recovery guidance; use the iteration loop section |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Iteration file creation and state append steps |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Iteration file creation and state append steps |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | State file listing showing iterations/ directory; use `ANCHOR:state-files` |
| `.opencode/skill/sk-deep-review/SKILL.md` | Rules for externalized state; use `ANCHOR:rules` Rule 3 |

---

## 5. SOURCE METADATA

- Group: PAUSE, RESUME, AND FAULT TOLERANCE
- Playbook ID: DRV-024
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
