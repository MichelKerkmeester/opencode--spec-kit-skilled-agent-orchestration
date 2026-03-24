---
title: "DR-031 -- Review mode kickoff via :review suffix"
description: "Verify that the :review suffix triggers review-specific setup questions (target, dimensions) and routes to the review YAML workflow."
---

# DR-031 -- Review mode kickoff via :review suffix

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-031`.

---

## 1. OVERVIEW

This scenario validates review mode kickoff via the `:review` suffix for `DR-031`. The objective is to verify that the `:review` suffix triggers review-specific setup questions (target, dimensions) and routes to the review YAML workflow.

### WHY THIS MATTERS

Operators need a clear, consistent entry point for code-quality reviews so they can launch a structured audit with the right target scope and dimension ordering without manually configuring the review pipeline.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the `:review` suffix triggers review-specific setup questions (target, dimensions) and routes to the review YAML workflow.
- Real user request: I want to run a code-quality review on a spec folder — how do I start and what will it ask me?
- Orchestrator prompt: Validate the review entrypoint for sk-deep-research. Confirm that `/spec_kit:deep-research:review` is documented consistently across the deep-research command, review auto YAML, and README quick start, then return a concise user-facing pass/fail verdict with the expected setup flow.
- Expected execution process: Inspect the command entrypoint for `:review` mode routing, then the review YAML for `phase_init` setup questions, then the README quick-start section for user-facing documentation.
- Desired user-facing outcome: The user is told exactly how to invoke review mode, that it will ask for a review target and optional dimension selection, and that it routes to the review-specific YAML workflow.
- Expected signals: The `:review` suffix maps to the review YAML, `phase_init` prompts for target and dimensions, and the README documents the review command shape.
- Pass/fail posture: PASS if the command routes to the review YAML, setup questions include target and dimensions, and documentation matches; FAIL if any source materially contradicts the others or setup questions are missing.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-031 | Review mode kickoff via :review suffix | Verify that the `:review` suffix triggers review-specific setup questions (target, dimensions) and routes to the review YAML workflow. | Validate the review entrypoint for sk-deep-research. Confirm that `/spec_kit:deep-research:review` routes to the review YAML, triggers target and dimension setup questions, and is documented in the README quick start. | 1. `bash: rg -n ':review|review mode' .opencode/command/spec_kit/deep-research.md` -> 2. `bash: sed -n '1,100p' .opencode/command/spec_kit/assets/spec_kit_deep-research_review-auto.yaml` -> 3. `bash: rg -n 'review|:review' .opencode/skill/sk-deep-research/README.md` | The `:review` suffix maps to the review YAML, `phase_init` prompts for review target and dimension selection, and the README documents the review command. | Capture the mode-routing block, `phase_init` setup questions, and README review section together. | PASS if command routes to review YAML, setup questions include target and dimensions, and README matches; FAIL if routing is broken or setup questions are missing. | Start with the command entrypoint mode-routing, confirm `:review` maps to the review YAML, then inspect `phase_init` if setup questions are unclear. |

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
| `.opencode/command/spec_kit/deep-research.md` | Markdown setup and mode routing; use `:review` suffix routing block |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review-auto.yaml` | Review workflow contract; inspect `phase_init` for setup questions |
| `.opencode/skill/sk-deep-research/README.md` | User-facing examples; use `ANCHOR:quick-start` for review command documentation |

---

## 5. SOURCE METADATA

- Group: REVIEW MODE
- Playbook ID: DR-031
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--review-mode/031-review-mode-kickoff-via-review-suffix.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
