---
title: "5D-010 -- Dynamic 5D Scoring on Non-Hardcoded Agent (Orchestrate)"
description: "Manual validation scenario for 5D-010: Dynamic 5D Scoring on Non-Hardcoded Agent (Orchestrate)."
feature_id: "5D-010"
category: "5D Scorer"
---

# 5D-010 -- Dynamic 5D Scoring on Non-Hardcoded Agent (Orchestrate)

This document captures the canonical manual-testing contract for `5D-010`.

---

## 1. OVERVIEW

This scenario validates that dynamic 5D scoring works on an agent without a pre-built profile, proving the dynamic profile generation path.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Dynamic 5D Scoring on Non-Hardcoded Agent (Orchestrate) for the five-dimension score output and failure-mode scenarios.
- Real user request: `Validate that dynamic 5D scoring works on an agent without a pre-built profile, proving the dynamic profile generation path.`
- RCAF Prompt: `` As a manual-testing orchestrator, validate that dynamic 5D scoring works on an agent without a pre-built profile, proving the dynamic profile generation path against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `evaluationMode` field equals `"dynamic-5d"`. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the candidate scorer against the documented candidate and profile inputs; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: `evaluationMode` field equals `"dynamic-5d"`; `profileId` is derived from the agent name (e.g., `"orchestrate"`); `dimensions` array contains exactly 5 objects with names: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`; Each dimension has `score` (0-100), `weight`, and `details` array; NO `legacyScore` field (orchestrate has no static profile); No error about missing or unknown profile
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Produces a valid 5D score for a non-hardcoded agent: all five dimensions (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) scored, no `legacyScore` field, no fallback errors.

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
| 5D-010 | Dynamic 5D Scoring on Non-Hardcoded Agent (Orchestrate) | Validate Dynamic 5D Scoring on Non-Hardcoded Agent (Orchestrate) | `` As a manual-testing orchestrator, validate that dynamic 5D scoring works on an agent without a pre-built profile, proving the dynamic profile generation path against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `evaluationMode` field equals `"dynamic-5d"`. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | node .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs \<br>  --candidate=.opencode/agent/orchestrate.md --dynamic | `evaluationMode` field equals `"dynamic-5d"`; `profileId` is derived from the agent name (e.g., `"orchestrate"`); `dimensions` array contains exactly 5 objects with names: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`; Each dimension has `score` (0-100), `weight`, and `details` array; NO `legacyScore` field (orchestrate has no static profile); No error about missing or unknown profile | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | Produces a valid 5D score for a non-hardcoded agent: all five dimensions (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) scored, no `legacyScore` field, no fallback errors. | If a &quot;profile not found&quot; error appears: verify the `--dynamic` flag triggers dynamic generation rather than static profile lookup<br>If `legacyScore` is present: the scorer is incorrectly falling back to a static profile for an agent that has none<br>If dimensions are missing: check that the dynamic profile includes all five required dimension definitions<br>If scores seem identical to another agent: ensure the candidate file content is actually being parsed, not a cached profile |

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
| `03--5d-scorer/010-dynamic-arbitrary.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/score-candidate.cjs` | Implementation or verification anchor referenced by this scenario |
| `.opencode/agent/orchestrate.md` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: 5D Scorer
- Playbook ID: 5D-010
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--5d-scorer/010-dynamic-arbitrary.md`
