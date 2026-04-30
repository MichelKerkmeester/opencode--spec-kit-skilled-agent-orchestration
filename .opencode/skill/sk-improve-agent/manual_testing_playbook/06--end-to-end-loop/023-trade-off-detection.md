---
title: "E2E-023 -- Trade-Off Detection Across Dimensions"
description: "Manual validation scenario for E2E-023: Trade-Off Detection Across Dimensions."
feature_id: "E2E-023"
category: "End-to-End Loop"
---

# E2E-023 -- Trade-Off Detection Across Dimensions

This document captures the canonical manual-testing contract for `E2E-023`.

---

## 1. OVERVIEW

This scenario validates that the improvement loop detects when a mutation improves one dimension at the cost of another, reports the trade-off explicitly, and does not auto-promote candidates with unresolved trade-offs.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Trade-Off Detection Across Dimensions for the full improvement-loop and candidate-tracking scenarios.
- Real user request: `Validate that the improvement loop detects when a mutation improves one dimension at the cost of another, reports the trade-off explicitly, and does not auto-promote candidates with unresolved trade-offs.`
- RCAF Prompt: `As a manual-testing orchestrator, validate that the improvement loop detects when a mutation improves one dimension at the cost of another, reports the trade-off explicitly, and does not auto-promote candidates with unresolved trade-offs against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Dimension trajectory tracked per iteration (at least 3 data points before convergence claim). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`
- Expected execution process: Run the documented command sequence exactly as written; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: Dimension trajectory tracked per iteration (at least 3 data points before convergence claim); Trade-off detected when one dimension delta is positive and another is negative beyond threshold; Trade-off report includes: affected dimensions, magnitude of change, Pareto assessment; Journal emits `trade-off-detected` event with structured data; Candidate with unresolved trade-off is flagged for human review, not auto-promoted; Dashboard shows dimension trajectories with trade-off annotations
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: When a candidate improves ruleCoherence but regresses integration, the trade-off detector fires a `trade-off-detected` journal event identifying both dimensions and the direction of change -- the candidate is not auto-promoted and the operator sees a clear trade-off warning.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders in the command sequence, especially `{spec}`, to disposable test paths.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Run the verification block against the same artifacts from the same execution.
5. Compare observed output against the expected signals and pass/fail criteria.
6. Record the scenario verdict with the decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| E2E-023 | Trade-Off Detection Across Dimensions | Validate Trade-Off Detection Across Dimensions | `As a manual-testing orchestrator, validate that the improvement loop detects when a mutation improves one dimension at the cost of another, reports the trade-off explicitly, and does not auto-promote candidates with unresolved trade-offs against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Dimension trajectory tracked per iteration (at least 3 data points before convergence claim). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.` | /improve:improve-agent &quot;.opencode/agent/debug.md&quot; :confirm --spec-folder=specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/006-graph-testing-and-playbook-alignment --iterations=3 | Dimension trajectory tracked per iteration (at least 3 data points before convergence claim); Trade-off detected when one dimension delta is positive and another is negative beyond threshold; Trade-off report includes: affected dimensions, magnitude of change, Pareto assessment; Journal emits `trade-off-detected` event with structured data; Candidate with unresolved trade-off is flagged for human review, not auto-promoted; Dashboard shows dimension trajectories with trade-off annotations | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | When a candidate improves ruleCoherence but regresses integration, the trade-off detector fires a `trade-off-detected` journal event identifying both dimensions and the direction of change -- the candidate is not auto-promoted and the operator sees a clear trade-off warning. | If no trade-off is detected when expected: check threshold configuration in `tradeOff.thresholds` and verify the dimension deltas are computed correctly<br>If trade-off is detected but candidate is auto-promoted: check the promotion gate for the trade-off block condition<br>If trajectory has insufficient data points: verify minimum 3 data points enforcement before trade-off computation<br>If journal event is missing: check that `improvement-journal.cjs` emits `trade-off-detected` event type and the orchestrator calls the emitter |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output showing trade-off detection and dimension trajectories]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `06--end-to-end-loop/023-trade-off-detection.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `.opencode/agent/debug.md` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: End-to-End Loop
- Playbook ID: E2E-023
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--end-to-end-loop/023-trade-off-detection.md`
