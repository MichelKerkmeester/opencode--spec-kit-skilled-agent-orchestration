---
title: "DRV-025 -- Review report synthesis has all 9 sections"
description: "Verify that review-report.md contains all 9 required sections: Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, Audit Appendix."
---

# DRV-025 -- Review report synthesis has all 9 sections

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DRV-025`.

---

## 1. OVERVIEW

This scenario validates review report synthesis has all 9 sections for `DRV-025`. The objective is to verify that the final `review-report.md` produced during synthesis contains all 9 required sections with their expected content.

### WHY THIS MATTERS

The review report is the primary deliverable of the entire deep review loop. If any section is missing, the report cannot serve its purpose as a complete audit record, remediation guide, and planning input. The 9-section structure ensures that findings, evidence, verdicts, and next steps are all captured in a single canonical document.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify review-report.md has all 9 sections: Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, Audit Appendix.
- Real user request: When the review finishes, what exactly does it produce and what sections does the report contain?
- Prompt: `As a manual-testing orchestrator, validate the review report synthesis contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify review/review-report.md contains all 9 sections: (1) Executive Summary with verdict and severity counts, (2) Planning Trigger with routing rationale, (3) Active Finding Registry with deduped findings, (4) Remediation Workstreams with grouped action lanes, (5) Spec Seed with minimal spec delta, (6) Plan Seed with action-ready starter, (7) Traceability Status with protocol coverage, (8) Deferred Items with P2 advisories, (9) Audit Appendix with convergence evidence. Return a concise operator-facing verdict.`
- Expected execution process: Inspect the quick reference review-report sections table, then the YAML synthesis step, then the SKILL.md and README for report section documentation.
- Desired user-facing outcome: The user is told exactly what the review report contains and can verify completeness by checking for all 9 section headers.
- Expected signals: All 9 section headers present, Executive Summary contains verdict and P0/P1/P2 counts, Active Finding Registry has deduplicated findings with evidence, and Audit Appendix includes convergence data.
- Pass/fail posture: PASS if all 9 sections are documented and enforced by the synthesis step; FAIL if any section is missing from the template or synthesis contract.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
As a manual-testing orchestrator, validate the review report synthesis contract for sk-deep-review against the current sk-deep-review docs, command entrypoint, YAML workflow, and runtime anchors. Verify review/review-report.md contains all 9 sections: (1) Executive Summary with verdict and severity counts, (2) Planning Trigger with routing rationale, (3) Active Finding Registry with deduped findings, (4) Remediation Workstreams with grouped action lanes, (5) Spec Seed with minimal spec delta, (6) Plan Seed with action-ready starter, (7) Traceability Status with protocol coverage, (8) Deferred Items with P2 advisories, (9) Audit Appendix with convergence evidence. Return a concise operator-facing verdict.
### Commands
1. `bash: rg -n 'Executive Summary|Planning Trigger|Active Finding Registry|Remediation Workstreams|Spec Seed|Plan Seed|Traceability Status|Deferred Items|Audit Appendix|review-report' .opencode/skill/sk-deep-review/references/quick_reference.md`
2. `bash: rg -n 'review-report|synthesis|9.*section|Executive Summary|Planning Trigger|Active Finding|Remediation|Spec Seed|Plan Seed|Traceability|Deferred|Audit Appendix' .opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml .opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml`
3. `bash: rg -n 'review-report|synthesis|9.*section|report.*section|Executive Summary|verdict|hasAdvisories' .opencode/skill/sk-deep-review/SKILL.md .opencode/skill/sk-deep-review/README.md .opencode/command/spec_kit/deep-review.md`
### Expected
All 9 section headers present, Executive Summary contains verdict and P0/P1/P2 counts, Active Finding Registry has deduplicated findings, Audit Appendix includes convergence data.
### Evidence
Capture the 9-section table from quick reference, the YAML synthesis step, and the report structure documentation from SKILL.md.
### Pass/Fail
PASS if all 9 sections are documented and enforced by the synthesis step; FAIL if any section is missing from the template or synthesis contract.
### Failure Triage
Privilege the quick reference section table as the canonical list and verify the YAML synthesis step produces all 9 sections.
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
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Canonical 9-section table; use `ANCHOR:review-report-sections` |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Synthesis step producing review-report.md |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Synthesis step producing review-report.md |
| `.opencode/command/spec_kit/deep-review.md` | Command entrypoint; output format documentation |
| `.opencode/skill/sk-deep-review/SKILL.md` | Review report structure and verdict rules; use `ANCHOR:how-it-works` |
| `.opencode/skill/sk-deep-review/README.md` | Feature summary for review report synthesis |

---

## 5. SOURCE METADATA

- Group: SYNTHESIS, SAVE, AND GUARDRAILS
- Playbook ID: DRV-025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--synthesis-save-and-guardrails/025-review-report-synthesis-has-all-9-sections.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-review/` as of 2026-03-28.
