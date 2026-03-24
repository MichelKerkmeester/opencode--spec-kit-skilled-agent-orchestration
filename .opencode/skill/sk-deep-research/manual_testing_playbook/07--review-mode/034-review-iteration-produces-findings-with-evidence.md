---
title: "DR-034 -- Review iteration produces P0/P1/P2 findings with file:line evidence"
description: "Verify that the @deep-review agent writes iteration files with Scorecard, Findings (P0/P1/P2), Cross-Reference Results, and Assessment."
---

# DR-034 -- Review iteration produces P0/P1/P2 findings with file:line evidence

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-034`.

---

## 1. OVERVIEW

This scenario validates review iteration output quality for `DR-034`. The objective is to verify that the @deep-review agent writes iteration files with Scorecard, Findings (P0/P1/P2), Cross-Reference Results, and Assessment.

### WHY THIS MATTERS

Every review finding must carry file:line evidence to be actionable. If the iteration output lacks structured severity classification or concrete code references, operators cannot triage or remediate — the review degrades to opinion rather than audit.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the @deep-review agent writes iteration files with Scorecard, Findings (P0/P1/P2), Cross-Reference Results, and Assessment.
- Real user request: After a review iteration runs, what exactly does it produce — and does every finding point to a specific file and line?
- Orchestrator prompt: Validate review iteration output for sk-deep-research. Confirm that the @deep-review agent produces iteration files containing a Scorecard, Findings classified as P0/P1/P2 with file:line evidence, Cross-Reference Results, and an Assessment section.
- Expected execution process: Inspect the deep-review agent for iteration output format requirements, then `state_format.md` section 8 for the review state schema, then the review YAML `step_dispatch` for how iteration output is written.
- Desired user-facing outcome: The user understands that each review iteration produces structured findings with severity levels and concrete file:line evidence, not vague observations.
- Expected signals: Iteration file contains Scorecard, P0/P1/P2 findings with file:line references, Cross-Reference Results, and Assessment; all findings include evidence anchors.
- Pass/fail posture: PASS if iteration output includes all required sections and every finding has file:line evidence; FAIL if sections are missing or findings lack concrete evidence.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-034 | Review iteration produces P0/P1/P2 findings with file:line evidence | Verify that @deep-review agent writes iteration files with Scorecard, Findings (P0/P1/P2), Cross-Reference Results, and Assessment. | Validate review iteration output. Confirm the @deep-review agent produces iteration files with Scorecard, P0/P1/P2 findings with file:line evidence, Cross-Reference Results, and Assessment, per the deep-review agent spec, `state_format.md` §8, and review YAML `step_dispatch`. | 1. `bash: rg -n 'Scorecard|P0|P1|P2|file:line|findings|iteration' .opencode/agent/deep-review.md` -> 2. `bash: rg -n 'review|Scorecard|findings|P0|P1|P2' .opencode/skill/sk-deep-research/references/state_format.md` -> 3. `bash: rg -n 'step_dispatch|iteration|findings|output' .opencode/command/spec_kit/assets/spec_kit_deep-research_review-auto.yaml` | Iteration file contains Scorecard, P0/P1/P2 findings with file:line evidence, Cross-Reference Results, and Assessment. | Capture the agent output format, `state_format.md` §8 review schema, and YAML `step_dispatch` output contract together. | PASS if all required sections present and findings have file:line evidence; FAIL if sections missing or findings lack concrete evidence. | Start with the deep-review agent spec for output format, cross-check against `state_format.md` §8, then inspect `step_dispatch` if output contract is unclear. |

---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `sk-deep-research`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/agent/deep-review.md` | Deep-review agent definition; inspect iteration output format and findings requirements |
| `.opencode/skill/sk-deep-research/references/state_format.md` | State format reference; use §8 for review state schema |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review-auto.yaml` | Review workflow contract; inspect `step_dispatch` for iteration output handling |

---

## 5. SOURCE METADATA

- Group: REVIEW MODE
- Playbook ID: DR-034
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--review-mode/034-review-iteration-produces-findings-with-evidence.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
