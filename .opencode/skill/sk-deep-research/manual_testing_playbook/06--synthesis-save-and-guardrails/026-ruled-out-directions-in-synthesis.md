---
title: "DR-026 -- Ruled-out directions synthesized"
description: "Verify that iteration ruledOut data is consolidated into an Eliminated Alternatives section in research.md."
---

# DR-026 -- Ruled-out directions synthesized

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-026`.

---

## 1. OVERVIEW

This scenario validates that ruled-out directions are properly synthesized for `DR-026`. The objective is to verify that `ruledOut` data from iteration JSONL records and `## Dead Ends` sections from iteration files are consolidated into a mandatory "Eliminated Alternatives" section in `research.md`.

### WHY THIS MATTERS

Negative knowledge -- what was tried and why it failed -- is primary research output, not an afterthought. Without a consolidated record of eliminated alternatives, future consumers of the research may re-explore dead ends, wasting effort and repeating mistakes.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that iteration ruledOut data is consolidated into "Eliminated Alternatives" in research.md.
- Real user request: After research completes, where can I find what approaches were tried and failed?
- Orchestrator prompt: Validate the ruled-out directions synthesis contract for sk-deep-research. Confirm that the synthesis phase consolidates `ruledOut` entries from JSONL records and `## Dead Ends` sections from iteration files into a mandatory "Eliminated Alternatives" section in research.md. Verify that strategy.md also tracks ruled-out directions per iteration. Return a concise operator-facing verdict.
- Expected execution process: Inspect the loop protocol synthesis rules, then the state format for the ruledOut array and iteration file sections, then the strategy template for the Ruled Out Directions section, then SKILL.md ALWAYS rule 10.
- Desired user-facing outcome: The user can open research.md after synthesis and find a complete table of all approaches that were investigated and eliminated, with reasons and evidence.
- Expected signals: research.md has a mandatory "Eliminated Alternatives" section formatted as a table (`| Approach | Reason Eliminated | Evidence | Iteration(s) |`); iteration files have `## Ruled Out` and `## Dead Ends` sections when negative knowledge is captured; strategy.md has a `## 10. Ruled Out Directions` section updated per iteration; ALWAYS rule 10 mandates documenting ruled-out directions.
- Pass/fail posture: PASS if the synthesis phase produces an "Eliminated Alternatives" section in research.md consolidating all ruledOut and Dead Ends data, and the upstream sources (JSONL, iteration files, strategy.md) consistently feed this section; FAIL if the section is missing, data is not consolidated, or upstream sources lack the required fields.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-026 | Ruled-out directions synthesized | Verify that iteration ruledOut data is consolidated into Eliminated Alternatives in research.md. | Validate the ruled-out directions synthesis contract for sk-deep-research. Confirm that the synthesis phase consolidates `ruledOut` entries from JSONL records and `## Dead Ends` sections from iteration files into a mandatory "Eliminated Alternatives" section in research.md. Verify that strategy.md also tracks ruled-out directions per iteration. Return a concise operator-facing verdict. | 1. `bash: rg -n 'Eliminated Alternatives\|ruledOut\|Dead Ends\|negative knowledge' .opencode/skill/sk-deep-research/references/loop_protocol.md` -> 2. `bash: rg -n 'ruledOut\|Ruled Out\|Dead Ends' .opencode/skill/sk-deep-research/references/state_format.md` -> 3. `bash: sed -n '/ANCHOR:ruled-out-directions/,/\/ANCHOR:ruled-out-directions/p' .opencode/skill/sk-deep-research/assets/deep_research_strategy.md` -> 4. `bash: rg -n 'rule.*10\|ruled-out' .opencode/skill/sk-deep-research/SKILL.md` | research.md has mandatory "Eliminated Alternatives" section as a table; iteration files have `## Ruled Out` and `## Dead Ends` sections; strategy.md has `## 10. Ruled Out Directions` section; JSONL records include `ruledOut` array; ALWAYS rule 10 mandates per-iteration documentation of ruled-out directions. | Capture the loop protocol synthesis rules (Step 3 with Eliminated Alternatives), the state format ruledOut array schema and iteration file requirements, the strategy template Ruled Out Directions section, and SKILL.md ALWAYS rule 10. | PASS if the synthesis phase produces an "Eliminated Alternatives" section in research.md consolidating all ruledOut and Dead Ends data, and upstream sources consistently feed this section; FAIL if the section is missing, data is not consolidated, or upstream sources lack the required fields. | Privilege the loop protocol synthesis rules for the canonical consolidation contract; use state_format.md for the ruledOut schema and strategy template for the per-iteration tracking surface. |

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
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Loop protocol; inspect `ANCHOR:phase-synthesis` for the Eliminated Alternatives consolidation rules (synthesis Step 3) |
| `.opencode/skill/sk-deep-research/references/state_format.md` | State format; inspect `ruledOut` array under `ANCHOR:state-log` (Negative Knowledge subsection) and iteration file requirements under `ANCHOR:iteration-files` |
| `.opencode/skill/sk-deep-research/assets/deep_research_strategy.md` | Strategy template; inspect `ANCHOR:ruled-out-directions` for section 10 (Ruled Out Directions) |
| `.opencode/skill/sk-deep-research/SKILL.md` | Skill rules; inspect ALWAYS rule 10: "Document ruled-out directions per iteration" |

---

## 5. SOURCE METADATA

- Group: SYNTHESIS SAVE AND GUARDRAILS
- Playbook ID: DR-026
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--synthesis-save-and-guardrails/026-ruled-out-directions-in-synthesis.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
