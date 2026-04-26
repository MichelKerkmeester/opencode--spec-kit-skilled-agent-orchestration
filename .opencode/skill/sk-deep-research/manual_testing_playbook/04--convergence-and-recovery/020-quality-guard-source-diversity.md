---
title: "DR-020 -- Quality Guard — Source Diversity"
description: "Verify that convergence STOP is blocked when an answered question cites <2 independent sources."
---

# DR-020 -- Quality Guard — Source Diversity

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-020`.

---

## 1. OVERVIEW

This scenario validates the source diversity quality guard for `DR-020`. The objective is to verify that convergence STOP is blocked when an answered question cites fewer than two independent sources.

### WHY THIS MATTERS

A convergence decision based on thinly sourced answers creates a false sense of completeness. The source diversity guard ensures that no question is considered answered unless at least two independent sources support it, preventing shallow research from being accepted as done.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that convergence STOP is blocked when an answered question cites <2 independent sources.
- Real user request: How does the loop prevent shallow answers that rely on a single source?
- Prompt: `As a manual-testing orchestrator, validate the source diversity quality guard for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify when composite convergence votes STOP, the guard checks each answered question for >= 2 independent sources, and that a violation emits a guard_violation event and overrides the decision to CONTINUE. Return a concise operator-facing PASS/FAIL verdict with the key evidence.`
- Expected execution process: Inspect the Quality Guard Protocol in the convergence reference first, then the YAML algorithm guard check, then the loop protocol Step 2c, then the state format guard_violation event schema.
- Desired user-facing outcome: The user gets an accurate explanation of how single-source answers are caught and why the loop continues past them.
- Expected signals: guard_violation event logged with guard="source_diversity", STOP decision overridden to CONTINUE, violated question targeted in next iteration focus.
- Pass/fail posture: PASS if the source_diversity guard rule (>= 2 independent sources), its violation logging, and its STOP-override behavior are consistent across convergence.md, loop_protocol.md, auto.yaml, and state_format.md; FAIL if any of those elements drift or contradict.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the source diversity quality guard for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify when composite convergence votes STOP, the guard checks each answered question for >= 2 independent sources, and that a violation emits a guard_violation event and overrides the decision to CONTINUE. Return a concise operator-facing PASS/FAIL verdict with the key evidence.
### Commands
1. `bash: sed -n '104,139p' .opencode/skill/sk-deep-research/references/convergence.md`
2. `bash: rg -n 'source_diversity\|guard_violation\|collectSources' .opencode/skill/sk-deep-research/references/convergence.md`
3. `bash: sed -n '97,107p' .opencode/skill/sk-deep-research/references/loop_protocol.md`
4. `bash: rg -n 'guard_violation\|source_diversity' .opencode/skill/sk-deep-research/references/state_format.md`
5. `bash: sed -n '236,243p' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml`
### Expected
guard_violation event logged with guard="source_diversity", STOP decision overridden to CONTINUE, violated question targeted in next iteration focus.
### Evidence
Capture the guard rule table row for Source Diversity, the pseudocode branch for len(sources) < 2, the YAML override logic, and the state_format event schema example.
### Pass/Fail
PASS if the source_diversity guard rule (>= 2 independent sources), its violation logging, and its STOP-override behavior are consistent across convergence.md, loop_protocol.md, auto.yaml, and state_format.md; FAIL if any of those elements drift or contradict.
### Failure Triage
Privilege convergence.md §2.4 for the canonical guard definition; use loop_protocol.md Step 2c and auto.yaml step_check_convergence as secondary confirmation of the override flow.
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
| `.opencode/skill/sk-deep-research/references/convergence.md` | Canonical quality guard definitions; use §2.4 Quality Guard Protocol |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Loop orchestration; use Step 2c: Quality Guard Check |
| `.opencode/skill/sk-deep-research/references/state_format.md` | JSONL event schema; use guard_violation event definition and sourceStrength field |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow algorithm; inspect `step_check_convergence` guard override logic |

---

## 5. SOURCE METADATA

- Group: CONVERGENCE AND RECOVERY
- Playbook ID: DR-020
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `04--convergence-and-recovery/020-quality-guard-source-diversity.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
