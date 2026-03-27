---
title: "DR-039 -- Review-report.md synthesis has all 9 sections"
description: "Verify that {spec_folder}/review/review-report.md includes Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, and Audit Appendix."
---

# DR-039 -- Review-report.md synthesis has all 9 sections

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DR-039`.

---

## 1. OVERVIEW

This scenario validates review report synthesis for `DR-039`. The objective is to verify that `{spec_folder}/review/review-report.md` includes Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, and Audit Appendix.

### WHY THIS MATTERS

The review report is the primary deliverable operators use to make ship/no-ship decisions. If any section is missing, the operator cannot fully assess quality — a missing Traceability Status hides unresolved protocol gaps, a missing Plan Seed delays follow-on remediation, and a missing Audit Appendix removes the supporting coverage and replay evidence behind the verdict.

---

## 2. CURRENT REALITY

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that `{spec_folder}/review/review-report.md` includes Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, and Audit Appendix.
- Real user request: After the review finishes, what does the final report look like — does it give me everything I need to decide if this is ready to ship?
- Orchestrator prompt: Validate review report synthesis for sk-deep-research. Confirm that `phase_synthesis` in the review YAML produces a `{spec_folder}/review/review-report.md` with all required sections per `state_format.md` and `loop_protocol.md` §6.3: Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, and Audit Appendix.
- Expected execution process: Inspect the review YAML `phase_synthesis` for the report generation step, then `state_format.md` section 8 for the review report schema, then `loop_protocol.md` section 6.3 for synthesis output requirements.
- Desired user-facing outcome: The user understands that the final report contains all 9 sections needed for a ship/no-ship decision, including findings, remediation seeds, traceability status, and audit detail.
- Expected signals: All required sections are listed in the synthesis spec, `phase_synthesis` generates all of them, and the section ordering matches the documented schema.
- Pass/fail posture: PASS if all required sections are defined and generated; FAIL if any section is missing from the synthesis spec or output.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so higher-level docs are checked before lower-level workflow contracts.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DR-039 | Review-report.md synthesis has all 9 sections | Verify `{spec_folder}/review/review-report.md` includes Executive Summary, Planning Trigger, Active Finding Registry, Remediation Workstreams, Spec Seed, Plan Seed, Traceability Status, Deferred Items, and Audit Appendix. | Validate review report synthesis. Confirm `phase_synthesis` generates `{spec_folder}/review/review-report.md` with all required sections per `state_format.md` and `loop_protocol.md` §6.3. | 1. `bash: rg -n 'phase_synthesis|review.report|synthesis|Executive Summary|Planning Trigger|Audit Appendix' .opencode/command/spec_kit/assets/spec_kit_deep-research_review_auto.yaml` -> 2. `bash: rg -n 'Executive Summary|Planning Trigger|Active Finding Registry|Remediation Workstreams|Spec Seed|Plan Seed|Traceability Status|Deferred Items|Audit Appendix' .opencode/skill/sk-deep-research/references/state_format.md` -> 3. `bash: rg -n 'synthesis|report|section|Planning Trigger|Deferred Items|Audit Appendix' .opencode/skill/sk-deep-research/references/loop_protocol.md` | All 9 required sections are listed in the synthesis spec, `phase_synthesis` generates all of them, and the section ordering matches the documented schema. | Capture the 9-section list from `state_format.md`, the synthesis step from YAML, and output requirements from `loop_protocol.md` §6.3. | PASS if all 9 required sections are defined and generated; FAIL if any section is missing from the synthesis spec or output. | Start with `state_format.md` for the canonical section list, then verify `phase_synthesis` generates each, then check `loop_protocol.md` §6.3 for ordering. |

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
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_review-auto.yaml` | Review workflow contract; inspect `phase_synthesis` for report generation step |
| `.opencode/skill/sk-deep-research/references/state_format.md` | State format reference; use §8 for review report schema and section list |
| `.opencode/skill/sk-deep-research/references/loop_protocol.md` | Loop protocol; use §6.3 for synthesis output requirements and section ordering |

---

## 5. SOURCE METADATA

- Group: REVIEW MODE
- Playbook ID: DR-039
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `07--review-mode/039-review-report-synthesis-has-all-sections.md`
- Feature catalog status: No `feature_catalog/` package exists under `.opencode/skill/sk-deep-research/` as of 2026-03-24.
