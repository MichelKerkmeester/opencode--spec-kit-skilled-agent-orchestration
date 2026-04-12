---
title: "DR-027 -- Research charter validated at init"
description: "Verify strategy.md contains Non-Goals and Stop Conditions sections after initialization."
---

# DR-027 -- Research charter validated at init

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-027`.

---

## 1. OVERVIEW

This scenario validates research charter validation at initialization for `DR-027`. The objective is to verify that `strategy.md` contains "Non-Goals" and "Stop Conditions" sections after initialization, establishing clear boundaries for what the research should not investigate.

### WHY THIS MATTERS

Without explicit non-goals and stop conditions, research sessions risk unbounded scope creep or premature termination. The charter validation step at initialization ensures that boundaries are defined upfront, even if initially empty, providing a surface for user review in confirm mode and a structural guarantee in auto mode.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify strategy.md contains Non-Goals and Stop Conditions sections after initialization.
- Real user request: How do I set boundaries for what the research should NOT investigate?
- Prompt: `As a manual-testing orchestrator, validate the research charter validation contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify initialization Step 5a verifies the presence of "Non-Goals" and "Stop Conditions" sections in strategy.md, appends empty placeholders if missing, and presents the charter for user review in confirm mode. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the loop protocol Step 5a (Validate Research Charter), then the strategy template for sections 4 and 5, then confirm mode behavior.
- Desired user-facing outcome: The user can rely on strategy.md always having Non-Goals and Stop Conditions sections after initialization, providing a clear place to define research boundaries.
- Expected signals: strategy.md has a "## 4. Non-Goals" section (may be empty but must exist); strategy.md has a "## 5. Stop Conditions" section (may be empty but must exist); if either section is missing, it is appended as an empty placeholder; in confirm mode, the charter (topic, key questions, non-goals, stop conditions) is presented for user review before proceeding.
- Pass/fail posture: PASS if initialization consistently produces strategy.md with both sections present and confirm mode surfaces the charter for review; FAIL if either section is absent after initialization, or confirm mode skips the charter review gate.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-027 | Research charter validated at init | Verify strategy.md contains Non-Goals and Stop Conditions sections after initialization. | As a manual-testing orchestrator, validate the research charter validation contract for sk-deep-research against the current sk-deep-research docs, command entrypoint, YAML workflow, and runtime anchors. Verify initialization Step 5a verifies the presence of "Non-Goals" and "Stop Conditions" sections in strategy.md, appends empty placeholders if missing, and presents the charter for user review in confirm mode. Return a concise operator-facing verdict. | 1. `bash: rg -n 'Step 5a\|Validate Research Charter\|Non-Goals\|Stop Conditions\|charter' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: sed -n '/ANCHOR:non-goals/,/\/ANCHOR:stop-conditions/p' .opencode/skill/sk-deep-research/assets/deep_research_strategy.md` -> 3. `bash: rg -n 'Non-Goals\|Stop Conditions\|charter' .opencode/skill/sk-deep-research/README.md` | strategy.md has "## 4. Non-Goals" section (may be empty but must exist); strategy.md has "## 5. Stop Conditions" section (may be empty but must exist); missing sections are appended as empty placeholders; confirm mode presents the charter for user review before proceeding; auto mode accepts the charter automatically. | Capture the loop protocol Step 5a excerpt, the strategy template sections 4 and 5 with their ANCHOR tags, and any README feature summary referencing charter validation. | PASS if initialization consistently produces strategy.md with both sections present and confirm mode surfaces the charter for review; FAIL if either section is absent after initialization, or confirm mode skips the charter review gate. | Privilege the loop protocol Step 5a for the canonical charter validation contract; use the strategy template as the structural reference for section numbering and anchor names. |

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
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Loop protocol; inspect Step 5a (Validate Research Charter) under `ANCHOR:phase-initialization` |
| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Strategy template; inspect `ANCHOR:non-goals` (section 4) and `ANCHOR:stop-conditions` (section 5) |

---

## 5. SOURCE METADATA

- Group: INITIALIZATION AND STATE SETUP
- Playbook ID: DR-027
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `02--initialization-and-state-setup/027-research-charter-validation.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
