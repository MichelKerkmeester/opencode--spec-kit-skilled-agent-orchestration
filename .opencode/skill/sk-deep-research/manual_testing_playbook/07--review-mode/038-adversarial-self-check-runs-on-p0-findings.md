---
title: "DR-038 -- Adversarial self-check runs on P0 findings"
description: "Verify that the Hunter/Skeptic/Referee adversarial self-check runs in-iteration for P0 candidates before writing to JSONL."
---

# DR-038 -- Adversarial self-check runs on P0 findings

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-038`.

---

## 1. OVERVIEW

This scenario validates the adversarial self-check for P0 findings in `DR-038`. The objective is to verify that the Hunter/Skeptic/Referee adversarial self-check runs in-iteration for P0 candidates before writing to JSONL.

### WHY THIS MATTERS

P0 findings drive the review verdict — a false P0 triggers unnecessary remediation and erodes operator trust, while a missed real P0 lets critical issues ship. The adversarial self-check (Hunter finds, Skeptic challenges, Referee decides) exists to reduce both false positives and false negatives at the highest severity level.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the Hunter/Skeptic/Referee adversarial self-check runs in-iteration for P0 candidates before writing to JSONL.
- Real user request: When the review finds something critical, does it double-check before flagging it — or could it be a false alarm?
- Orchestrator prompt: Validate the adversarial self-check for sk-deep-research review mode. Confirm that P0 candidate findings go through Hunter/Skeptic/Referee roles within the iteration, and only confirmed P0s are written to the JSONL state, per the deep-review agent §5 and `convergence.md` §10.
- Expected execution process: Inspect the deep-review agent section 5 for adversarial self-check protocol, then `convergence.md` section 10 for how P0 confirmation affects convergence, then verify the self-check runs before JSONL write.
- Desired user-facing outcome: The user understands that P0 findings are adversarially verified before being recorded, reducing false positives without missing real critical issues.
- Expected signals: Hunter/Skeptic/Referee roles are defined, self-check runs before JSONL write, only confirmed P0s are persisted, and the check is in-iteration (not post-loop).
- Pass/fail posture: PASS if the adversarial self-check is defined, runs in-iteration for P0 candidates, and gates JSONL persistence; FAIL if self-check is missing, runs post-loop, or does not gate persistence.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-038 | Adversarial self-check runs on P0 findings | Verify that Hunter/Skeptic/Referee runs in-iteration for P0 candidates before writing to JSONL. | Validate adversarial self-check for P0 findings. Confirm the deep-review agent §5 defines Hunter/Skeptic/Referee roles and `convergence.md` §10 confirms self-check runs before JSONL write. | 1. `bash: rg -n 'Hunter|Skeptic|Referee|adversarial|self.check|P0' .opencode/agent/deep-review.md` -> 2. `bash: rg -n 'adversarial|Hunter|Skeptic|Referee|P0|self.check|JSONL' .opencode/skill/sk-deep-research/references/convergence.md` | Hunter/Skeptic/Referee defined, self-check runs before JSONL write, only confirmed P0s persisted, check is in-iteration. | Capture the adversarial protocol from agent §5 and the P0 confirmation gate from `convergence.md` §10. | PASS if self-check is defined, runs in-iteration, and gates JSONL persistence; FAIL if missing, post-loop, or does not gate persistence. | Start with deep-review agent §5 for the protocol, then check `convergence.md` §10 for P0 confirmation impact on convergence. |

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
| `.opencode/agent/deep-review.md` | Deep-review agent definition; use §5 for adversarial self-check (Hunter/Skeptic/Referee) protocol |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Convergence reference; use §10 for P0 confirmation impact on convergence and JSONL gate |

---

## 5. SOURCE METADATA

- Group: REVIEW MODE
- Playbook ID: DR-038
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--review-mode/038-adversarial-self-check-runs-on-p0-findings.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
