---
title: "DR-033 -- Review dimension ordering follows risk priority"
description: "Verify that the inventory pass runs first, then dimensions follow risk priority: Correctness, Security, Traceability, Maintainability."
---

# DR-033 -- Review dimension ordering follows risk priority

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-033`.

---

## 1. OVERVIEW

This scenario validates review dimension ordering for `DR-033`. The objective is to verify that the inventory pass runs first, then dimensions follow risk priority: Correctness, Security, Traceability, Maintainability.

### WHY THIS MATTERS

Risk-ordered dimensions ensure that the most critical findings (correctness bugs, security issues) surface early rather than being buried after cosmetic observations. Operators need confidence that the review pipeline will not waste iterations on low-risk dimensions while high-risk ones remain unexamined.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the inventory pass runs first, then dimensions follow risk priority: Correctness, Security, Traceability, Maintainability.
- Real user request: When I run a review, what order does it check things in — and does it prioritize serious issues first?
- Orchestrator prompt: Validate review dimension ordering for sk-deep-research. Confirm that `phase_init` schedules an inventory pass first, followed by dimensions in risk priority order (Correctness → Security → Traceability → Maintainability), and that this order is consistent across the review YAML, strategy doc, and loop protocol.
- Expected execution process: Inspect the review YAML `phase_init` for dimension scheduling, then `deep_review_strategy.md` for the canonical risk-priority ordering, then `loop_protocol.md` section 6 for iteration dimension dispatch rules.
- Desired user-facing outcome: The user understands that the review starts with an inventory pass and then checks the 4 simplified dimensions in descending risk order, with correctness and security always first.
- Expected signals: Inventory pass is scheduled before any dimension, dimensions follow the canonical risk-priority ordering, and all three sources agree.
- Pass/fail posture: PASS if inventory runs first and dimensions follow the documented risk-priority order across all sources; FAIL if ordering is inconsistent or inventory is not first.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-033 | Review dimension ordering follows risk priority | Verify that inventory pass runs first, then Correctness → Security → Traceability → Maintainability. | Validate review dimension ordering. Confirm inventory pass is first, then dimensions follow risk priority across the review YAML `phase_init`, `deep_review_strategy.md`, and `loop_protocol.md` §6. | 1. `bash: rg -n 'inventory|dimension|order|priority|Correctness|Security|Traceability|Maintainability' .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml` -> 2. `bash: rg -n 'dimension|order|priority|Correctness|Security|Traceability|Maintainability' .opencode/skill/sk-deep-research/references/deep_review_strategy.md` -> 3. `bash: rg -n 'dimension|order|dispatch|inventory|Correctness|Security|Traceability|Maintainability' .opencode/skill/sk-deep-research/references/loop_protocol.md` | Inventory pass is first, dimensions follow Correctness → Security → Traceability → Maintainability, and all sources agree. | Capture the dimension ordering from all three sources and compare for consistency. | PASS if inventory runs first and the 4-dimension risk-priority ordering is consistent across all sources; FAIL if ordering is inconsistent or inventory is not first. | Start with `phase_init` dimension schedule, compare against `deep_review_strategy.md` canonical ordering, then check `loop_protocol.md` §6 dispatch rules. |

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
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review-auto.yaml` | Review workflow contract; inspect `phase_init` for dimension scheduling |
| `.opencode/skill/sk-deep-research/references/deep_review_strategy.md` | Review strategy reference; use canonical risk-priority dimension ordering |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Loop protocol; use §6 for iteration dimension dispatch rules |

---

## 5. SOURCE METADATA

- Group: REVIEW MODE
- Playbook ID: DR-033
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--review-mode/033-review-dimension-ordering-follows-risk-priority.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
