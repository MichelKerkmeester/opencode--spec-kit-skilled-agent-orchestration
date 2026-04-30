---
title: "5D-012 -- Dimension Details Array with Individual Check Results"
description: "Manual validation scenario for 5D-012: Dimension Details Array with Individual Check Results."
feature_id: "5D-012"
category: "5D Scorer"
---

# 5D-012 -- Dimension Details Array with Individual Check Results

This document captures the canonical manual-testing contract for `5D-012`.

---

## 1. OVERVIEW

This scenario validates that each dimension in the 5D scorer output includes a details array showing individual check results.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Dimension Details Array with Individual Check Results for the five-dimension score output and failure-mode scenarios.
- Real user request: `Validate that each dimension in the 5D scorer output includes a details array showing individual check results.`
- RCAF Prompt: `` As a manual-testing orchestrator, validate that each dimension in the 5D scorer output includes a details array showing individual check results against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `dimensions` array contains 5 objects with names: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the candidate scorer against the documented candidate and profile inputs; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: `dimensions` array contains 5 objects with names: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`; Each dimension object has a `details` array of individual check objects; Each check object in `details` has at minimum:; `id` -- string identifying the specific check; `pass` -- boolean indicating whether the check passed; The `details` array provides granularity to diagnose which specific checks passed or failed per dimension
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Every dimension (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) has a non-empty `details` array with at least 1 check entry containing `id` and `pass` fields.

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
| 5D-012 | Dimension Details Array with Individual Check Results | Validate Dimension Details Array with Individual Check Results | `` As a manual-testing orchestrator, validate that each dimension in the 5D scorer output includes a details array showing individual check results against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `dimensions` array contains 5 objects with names: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | node .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs \<br>  --candidate=.opencode/agent/debug.md | `dimensions` array contains 5 objects with names: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`; Each dimension object has a `details` array of individual check objects; Each check object in `details` has at minimum:; `id` -- string identifying the specific check; `pass` -- boolean indicating whether the check passed; The `details` array provides granularity to diagnose which specific checks passed or failed per dimension | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | Every dimension (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) has a non-empty `details` array with at least 1 check entry containing `id` and `pass` fields. | If `details` arrays are empty: check that individual check functions are returning results to the aggregator<br>If `details` entries lack `id` or `pass` fields: verify the check result schema in the dimension scorer modules<br>If some dimensions have details but others do not: verify all five dimension scorers implement the details interface |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `03--5d-scorer/012-dimension-details.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/score-candidate.cjs` | Implementation or verification anchor referenced by this scenario |
| `.opencode/agent/debug.md` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: 5D Scorer
- Playbook ID: 5D-012
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--5d-scorer/012-dimension-details.md`
