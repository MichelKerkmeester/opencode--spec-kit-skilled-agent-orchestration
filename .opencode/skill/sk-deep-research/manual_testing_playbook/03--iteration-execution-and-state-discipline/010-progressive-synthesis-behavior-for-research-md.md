---
title: "DR-010 -- Progressive synthesis behavior for research.md"
description: "Verify that `research.md` remains workflow-owned while progressive updates are allowed when `progressiveSynthesis` is enabled."
---

# DR-010 -- Progressive synthesis behavior for research.md

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-010`.

---

## 1. OVERVIEW

This scenario validates progressive synthesis behavior for research.md for `DR-010`. The objective is to verify that `research.md` remains workflow-owned while progressive updates are allowed when `progressiveSynthesis` is enabled.

### WHY THIS MATTERS

Operators need to understand that interim synthesis updates are allowed, but the orchestrator still owns the canonical final consolidation pass.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that `research.md` remains workflow-owned while progressive updates are allowed when `progressiveSynthesis` is enabled.
- Real user request: Tell me whether the agent updates research.md` during the loop or if that only happens at the end.`
- Orchestrator prompt: Validate the progressive-synthesis contract for sk-deep-research. Confirm that research.md is workflow-owned canonical output, that incremental updates are allowed when progressiveSynthesis is true, and that synthesis still finalizes the document, then return a concise verdict.
- Expected execution process: Inspect the README and state-format wording, then the runtime agent progressive-update rules, then the YAML synthesis/save phases.
- Desired user-facing outcome: The user is told that `research.md` may be updated during the loop but is still finalized by the workflow.
- Expected signals: The docs describe `research.md` as workflow-owned, `progressiveSynthesis` defaults to true, and the final synthesis phase still runs.
- Pass/fail posture: PASS if all sources agree that progressive updates may occur but final synthesis still owns canonical completion; FAIL if ownership of `research.md` is contradictory.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-010 | Progressive synthesis behavior for research.md | Verify that `research.md` remains workflow-owned while progressive updates are allowed when `progressiveSynthesis` is enabled. | Validate the progressive-synthesis contract for sk-deep-research. Confirm that `research.md` is workflow-owned canonical output, that incremental updates are allowed when `progressiveSynthesis` is true, and that synthesis still finalizes the document, then return a concise verdict. | 1. `bash: rg -n 'progressiveSynthesis|workflow-owned|research.md' .opencode/skill/sk-deep-research/README.md .opencode/skill/sk-deep-research/references/state_format.md .opencode/skill/sk-deep-research/SKILL.md` -> 2. `bash: rg -n 'progressiveSynthesis|Update Research|research.md' .codex/agents/deep-research.toml` -> 3. `bash: rg -n 'phase_synthesis|research_output|synthesis_complete' .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | The docs describe `research.md` as workflow-owned, `progressiveSynthesis` defaults to true, and the final synthesis phase still runs. | Capture the ownership wording, the progressive update rule, and the synthesis-phase contract together. | PASS if all sources agree that progressive updates may occur but final synthesis still owns canonical completion; FAIL if ownership of `research.md` is contradictory. | Use the runtime agent’s Step 7 and the README configuration table to resolve terse wording. |

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
| `.opencode/skill/sk-deep-research/README.md` | Progressive synthesis defaults and state-file table; use `ANCHOR:overview` and `ANCHOR:configuration` |
| `.opencode/skill/sk-deep-research/references/state_format.md` | Canonical ownership wording; use `ANCHOR:overview` and `ANCHOR:config-file` |
| `.opencode/skill/sk-deep-research/SKILL.md` | Rule-level ownership statement; use `ANCHOR:rules` |
| `.codex/agents/deep-research.toml` | Runtime progressive update rules; inspect `Step 7: Update Research` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Synthesis and save workflow |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Synthesis and save workflow |

---

## 5. SOURCE METADATA

- Group: ITERATION EXECUTION AND STATE DISCIPLINE
- Playbook ID: DR-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--iteration-execution-and-state-discipline/010-progressive-synthesis-behavior-for-research-md.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-19.
