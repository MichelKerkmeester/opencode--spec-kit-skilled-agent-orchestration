---
title: "DR-037 -- Cross-reference verification detects spec-code misalignment"
description: "Verify that review iteration checks spec claims vs code, checklist [x] vs evidence, and SKILL.md vs agent files."
---

# DR-037 -- Cross-reference verification detects spec-code misalignment

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-037`.

---

## 1. OVERVIEW

This scenario validates cross-reference verification for `DR-037`. The objective is to verify that review iteration checks spec claims vs code, checklist [x] vs evidence, and SKILL.md vs agent files.

### WHY THIS MATTERS

Documentation rot is one of the most common quality failures in evolving codebases. If a spec folder claims a feature is complete but the code disagrees, or a checklist marks items done without supporting evidence, the review must catch these misalignments rather than treating documentation as ground truth.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that review iteration checks spec claims vs code, checklist [x] vs evidence, and SKILL.md vs agent files.
- Real user request: Will the review catch it if my spec says something is done but the code doesn't match?
- Orchestrator prompt: Validate cross-reference verification for sk-deep-research review mode. Confirm that the @deep-review agent checks spec claims against code, checklist [x] items against evidence, and SKILL.md content against agent files, per the deep-review agent §1 and §5, `loop_protocol.md` §6 (Step 3a), and the review auto YAML `step_compile_review_report` Section 6.
- Expected execution process: Inspect the deep-review agent section 1 for cross-reference rules, then `loop_protocol.md` section 6 (Step 3a) for 6 cross-reference protocols, then the deep-review agent section 5 for the iteration Cross-Reference Results output format.
- Desired user-facing outcome: The user understands that the review actively verifies documentation claims against code reality and will flag any misalignment as a finding.
- Expected signals: Cross-reference checks are defined for spec-vs-code, checklist-vs-evidence, and SKILL.md-vs-agent; misalignments produce findings with file:line evidence.
- Pass/fail posture: PASS if all three cross-reference check types are defined and produce actionable findings; FAIL if any check type is missing or produces vague output.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-037 | Cross-reference verification detects spec-code misalignment | Verify that review iteration checks spec claims vs code, checklist [x] vs evidence, and SKILL.md vs agent files. | Validate cross-reference verification. Confirm the @deep-review agent checks spec-vs-code, checklist-vs-evidence, and SKILL.md-vs-agent per the agent §1/§5, `loop_protocol.md` §6 (Step 3a), and the review auto YAML `step_compile_review_report` §6. | 1. `bash: rg -n 'cross.reference|spec.*code|checklist.*evidence|SKILL.md.*agent' .opencode/agent/deep-review.md` -> 2. `bash: rg -n 'cross.reference|spec.*code|checklist|SKILL.md' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 3. `bash: rg -n 'cross.reference|misalignment|verification' .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml` | Cross-reference checks defined for all three types, misalignments produce findings with file:line evidence. | Capture cross-reference rules from the agent §1/§5, 6 protocols from `loop_protocol.md` §6 Step 3a, and output format from review auto YAML `step_compile_review_report` §6. | PASS if all three cross-reference check types are defined and produce actionable findings; FAIL if any check type is missing or output is vague. | Start with the deep-review agent §1 for cross-reference rules, then check `loop_protocol.md` §6 Step 3a for 6 protocols, then the agent §5 for iteration output format. |

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
| `.opencode/agent/deep-review.md` | Deep-review agent definition; use §1 for cross-reference verification rules |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Loop protocol; use §6 for cross-reference iteration dispatch |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml` | Review auto YAML workflow; use `step_compile_review_report` §6 for cross-reference output format |

---

## 5. SOURCE METADATA

- Group: REVIEW MODE
- Playbook ID: DR-037
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--review-mode/037-cross-reference-verification-detects-misalignment.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
