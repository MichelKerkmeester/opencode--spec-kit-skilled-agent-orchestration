---
title: "DRV-012 -- Adversarial self-check runs on P0 findings"
description: "Verify that the Hunter/Skeptic/Referee adversarial self-check runs on P0 candidates before recording them as confirmed findings."
---

# DRV-012 -- Adversarial self-check runs on P0 findings

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-012`.

---

## 1. OVERVIEW

This scenario validates adversarial self-check runs on P0 findings for `DRV-012`. The objective is to verify that the Hunter/Skeptic/Referee adversarial self-check runs on P0 candidates before recording them as confirmed findings.

### WHY THIS MATTERS

P0 findings block convergence and trigger FAIL verdicts. A false-positive P0 wastes remediation effort and erodes trust. The adversarial self-check is the quality gate that prevents phantom P0 findings from reaching the final report.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that the Hunter/Skeptic/Referee adversarial self-check runs on P0 candidates before recording them as confirmed findings.
- Real user request: How does the review make sure a P0 finding is real and not a false positive?
- Orchestrator prompt: Validate the adversarial self-check contract for sk-deep-review. Confirm that Rule 10 (adversarial self-check on P0 findings) is documented in the SKILL.md rules, enforced in the quick reference iteration checklist, and checked in the YAML post-iteration claim adjudication, then return a concise user-facing pass/fail verdict.
- Expected execution process: Inspect the SKILL.md rules for Rule 10, then the quick reference iteration checklist for the self-check step, then the YAML post-iteration claim adjudication step, then the agent definitions for the self-check protocol.
- Desired user-facing outcome: The user is told that every P0 finding is re-read and challenged before being confirmed, using a Hunter/Skeptic/Referee three-role protocol.
- Expected signals: Rule 10 in SKILL.md mandates adversarial self-check for P0; the iteration checklist includes it as step 5; the YAML has a claim adjudication step that checks for P0/P1 self-check evidence; the agent definitions describe the Hunter/Skeptic/Referee roles.
- Pass/fail posture: PASS if the adversarial self-check is documented, enforced in the iteration checklist, and checked in the YAML; FAIL if P0 findings can be recorded without a self-check.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DRV-012 | Adversarial self-check runs on P0 findings | Verify that the Hunter/Skeptic/Referee adversarial self-check runs on P0 candidates before recording them. | Validate the adversarial self-check contract for sk-deep-review. Confirm that Rule 10 mandates adversarial self-check for P0 findings, the iteration checklist enforces it, and the YAML claim adjudication checks for it, then return a concise user-facing pass/fail verdict. | 1. `bash: rg -n 'adversarial\|self.check\|Hunter\|Skeptic\|Referee\|Rule 10\|re-read.*P0' .opencode/skill/sk-deep-review/SKILL.md` -> 2. `bash: rg -n 'adversarial\|self.check\|P0.*check\|claim_adjudication' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` -> 3. `bash: rg -n 'adversarial\|self.check\|P0\|Hunter\|Skeptic\|Referee' .opencode/skill/sk-deep-review/references/quick_reference.md .codex/agents/deep-review.toml .claude/agents/deep-review.md` | Rule 10 in SKILL.md mandates adversarial self-check; iteration checklist includes it as step 5; YAML has claim adjudication; agent definitions describe the protocol. | Capture Rule 10, the checklist step, the claim adjudication YAML step, and the agent self-check instructions. | PASS if the adversarial self-check is documented, enforced in the iteration checklist, and checked in the YAML; FAIL if P0 findings can be recorded without a self-check. | If the agent definition lacks explicit Hunter/Skeptic/Referee roles, check whether the SKILL.md Rule 10 wording is sufficient to trigger the behavior implicitly. |

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
| `.opencode/skill/sk-deep-review/SKILL.md` | Rule 10: adversarial self-check mandate; use `ANCHOR:rules` |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Iteration checklist; use `ANCHOR:agent-iteration-checklist` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Post-iteration claim adjudication; inspect `step_post_iteration_claim_adjudication` |
| `.codex/agents/deep-review.toml` | Codex runtime agent; inspect adversarial self-check protocol |
| `.claude/agents/deep-review.md` | Claude runtime agent; inspect adversarial self-check protocol |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DRV-012
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
