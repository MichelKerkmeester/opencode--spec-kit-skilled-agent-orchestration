---
title: "E2E-021 -- Full Pipeline Loop with Non-Standard Agent (Debug)"
description: "Manual validation scenario for E2E-021: Full Pipeline Loop with Non-Standard Agent (Debug)."
feature_id: "E2E-021"
category: "End-to-End Loop"
---

# E2E-021 -- Full Pipeline Loop with Non-Standard Agent (Debug)

This document captures the canonical manual-testing contract for `E2E-021`.

---

## 1. OVERVIEW

This scenario validates the complete `/improve:improve-agent` loop targeting a non-standard agent (debug.md) to confirm the pipeline is not hardcoded to specific agents.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Full Pipeline Loop with Non-Standard Agent (Debug) for the full improvement-loop and candidate-tracking scenarios.
- Real user request: `` Validate that the complete `/improve:improve-agent` loop targeting a non-standard agent (debug.md) to confirm the pipeline is not hardcoded to specific agents. ``
- RCAF Prompt: `As a manual-testing orchestrator, validate the complete /improve:improve-agent loop targeting a non-standard agent (debug.md) to confirm the pipeline is not hardcoded to specific agents against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Dynamic profile generated on-the-fly (debug.md has no static profile). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`
- Expected execution process: Run the documented command sequence exactly as written; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: Dynamic profile generated on-the-fly (debug.md has no static profile); Integration scan discovers debug agent surfaces; 5-dimension scoring produces scores for all dimensions: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`; No errors about missing profile or unsupported target; Dashboard reflects debug-specific scoring, not recycled data from a different agent
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Non-hardcoded agent evaluates successfully with dynamic profiling -- the full pipeline completes for `debug.md`, producing a dashboard with all 5 dimension scores (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) that reflect the debug agent's actual content.

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
| E2E-021 | Full Pipeline Loop with Non-Standard Agent (Debug) | Validate Full Pipeline Loop with Non-Standard Agent (Debug) | `As a manual-testing orchestrator, validate the complete /improve:improve-agent loop targeting a non-standard agent (debug.md) to confirm the pipeline is not hardcoded to specific agents against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Dynamic profile generated on-the-fly (debug.md has no static profile). Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.` | /improve:improve-agent &quot;.opencode/agent/debug.md&quot; :confirm --spec-folder=specs/skilled-agent-orchestration/041-sk-improve-agent-loop/008-sk-improve-agent-holistic-evaluation --iterations=1 | Dynamic profile generated on-the-fly (debug.md has no static profile); Integration scan discovers debug agent surfaces; 5-dimension scoring produces scores for all dimensions: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`; No errors about missing profile or unsupported target; Dashboard reflects debug-specific scoring, not recycled data from a different agent | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | Non-hardcoded agent evaluates successfully with dynamic profiling -- the full pipeline completes for `debug.md`, producing a dashboard with all 5 dimension scores (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) that reflect the debug agent's actual content. | If the pipeline fails at profile generation: verify that dynamic mode is triggered when no pre-built profile exists for `debug.md`<br>If scores look identical across unrelated agents: check that the candidate file path is correctly resolved to `debug.md` and passed through each stage<br>If integration scan returns few surfaces: this may be valid for debug (compare against manual count), but verify the scanner is not filtering too aggressively<br>If the command rejects the agent: check agent resolution logic for supported path formats (should accept any `.md` agent path) |

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
| `06--end-to-end-loop/021-any-agent.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `.opencode/agent/debug.md` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: End-to-End Loop
- Playbook ID: E2E-021
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--end-to-end-loop/021-any-agent.md`
