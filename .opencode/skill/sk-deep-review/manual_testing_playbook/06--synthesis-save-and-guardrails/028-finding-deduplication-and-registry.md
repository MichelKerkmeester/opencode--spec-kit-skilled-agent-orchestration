---
title: "DRV-028 -- Finding deduplication and registry"
description: "Verify that finding deduplication uses adjudicated finalSeverity and produces a clean Active Finding Registry in the review report."
---

# DRV-028 -- Finding deduplication and registry

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-028`.

---

## 1. OVERVIEW

This scenario validates finding deduplication and registry for `DRV-028`. The objective is to verify that the synthesis phase deduplicates findings across iterations using adjudicated `finalSeverity` and produces a clean Active Finding Registry in the review report.

### WHY THIS MATTERS

Multiple review iterations covering overlapping code areas will inevitably find the same issue more than once. Without deduplication, the report inflates finding counts, confuses remediation planning, and undermines operator trust. The `finalSeverity` adjudication ensures that when the same finding appears at different severities across iterations, the authoritative severity is used in the registry.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify finding deduplication uses adjudicated finalSeverity and produces clean registry.
- Real user request: If the review finds the same issue twice at different severities, which one shows up in the final report?
- Prompt: `As a manual-testing orchestrator, validate the finding deduplication contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify during synthesis, findings from all review/iterations/iteration-NNN.md files are compared for duplicates, that duplicate resolution uses adjudicated finalSeverity (taking the highest severity when the same finding appears at different levels), that the Active Finding Registry in review-report.md contains only unique findings with their final severity and evidence, and that deduplication does not discard P0 findings. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the SKILL.md synthesis and deduplication rules, then the YAML synthesis step, then the quick reference report sections for the Active Finding Registry definition.
- Desired user-facing outcome: The user is told that duplicate findings are merged with the highest severity preserved, and the final report contains a clean, deduplicated registry.
- Expected signals: Findings are compared across iterations by location and description, `finalSeverity` is the highest severity encountered, the Active Finding Registry contains unique entries only, P0 findings are never downgraded or discarded, and the registry includes file:line evidence for each finding.
- Pass/fail posture: PASS if deduplication produces a clean registry with adjudicated severities; FAIL if duplicates appear in the registry or P0 findings are lost during deduplication.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the finding deduplication contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify during synthesis, findings from all review/iterations/iteration-NNN.md files are compared for duplicates, that duplicate resolution uses adjudicated finalSeverity (taking the highest severity when the same finding appears at different levels), that the Active Finding Registry in review-report.md contains only unique findings with their final severity and evidence, and that deduplication does not discard P0 findings. Return a concise operator-facing verdict.
### Commands
1. `bash: rg -n 'dedup|deduplic|finalSeverity|adjudic|Active Finding Registry|unique.*finding|merge.*finding|duplicate' .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md`
2. `bash: rg -n 'dedup|deduplic|finalSeverity|adjudic|active_finding|merge|duplicate|unique' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
3. `bash: rg -n 'Active Finding Registry|Dedup|finalSeverity|finding.*registry|finding.*evidence|unique.*finding' .opencode/skill/sk-deep-review/references/quick_reference.md .opencode/command/spec_kit/deep-review.md .opencode/skill/sk-deep-review/assets/deep_review_strategy.md`
### Expected
Findings compared across iterations, `finalSeverity` is highest severity encountered, Active Finding Registry has unique entries, P0 never downgraded, evidence included.
### Evidence
Capture the deduplication rules from SKILL.md, the YAML synthesis deduplication logic, and the Active Finding Registry section definition from quick reference.
### Pass/Fail
PASS if deduplication produces a clean registry with adjudicated severities; FAIL if duplicates appear in the registry or P0 findings are lost during deduplication.
### Failure Triage
Privilege the SKILL.md rules for deduplication logic and the quick reference for the Active Finding Registry section definition.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page, integrated review protocol, and scenario summary |
| `feature_catalog/` | No dedicated feature catalog exists yet for `sk-deep-review`; use the live docs below as the implementation contract |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skill/sk-deep-review/SKILL.md` | Deduplication rules, severity classification, and synthesis contract; use `ANCHOR:how-it-works` and `ANCHOR:rules` |
| `.opencode/skill/sk-deep-review/README.md` | Feature summary for finding deduplication and registry |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Synthesis step with deduplication logic |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Synthesis step with deduplication logic |
| `.opencode/command/spec_kit/deep-review.md` | Command entrypoint; output format and synthesis documentation |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Active Finding Registry section definition; use `ANCHOR:review-report-sections` |
| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Strategy template with findings tracking |

---

## 5. SOURCE METADATA

- Group: SYNTHESIS, SAVE, AND GUARDRAILS
- Playbook ID: DRV-028
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
