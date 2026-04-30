---
title: "RD-018 -- JSONL With Dimensions Produces Dimensional Progress Table"
description: "Manual validation scenario for RD-018: JSONL With Dimensions Produces Dimensional Progress Table."
feature_id: "RD-018"
category: "Reducer Dimensions"
---

# RD-018 -- JSONL With Dimensions Produces Dimensional Progress Table

This document captures the canonical manual-testing contract for `RD-018`.

---

## 1. OVERVIEW

This scenario validates that JSONL records containing dimension data produce a Dimensional Progress table in the reducer output.

---

## 2. SCENARIO CONTRACT

- Objective: Validate JSONL With Dimensions Produces Dimensional Progress Table for the reducer dashboard and dimensional-progress scenarios.
- Real user request: `Validate that JSONL records containing dimension data produce a Dimensional Progress table in the reducer output.`
- RCAF Prompt: `As a manual-testing orchestrator, validate that JSONL records containing dimension data produce a Dimensional Progress table in the reducer output against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Reducer completes without errors, exit code 0. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`
- Expected execution process: Run the reducer against the documented disposable runtime state; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: Reducer completes without errors, exit code 0; Dashboard generated at `/tmp/reducer-test-dim/agent-improvement-dashboard.md`; Dashboard includes a "Dimensional Progress" section with a table showing columns: Dimension, Latest, Best, Trend; All 5 dimensions appear in the table: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`; Standard composite score and verdict sections are also present alongside the dimensional table
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Dashboard contains a "Dimensional Progress" section with all 5 dimension names (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) and their scores displayed in the table.

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
| RD-018 | JSONL With Dimensions Produces Dimensional Progress Table | Validate JSONL With Dimensions Produces Dimensional Progress Table | `As a manual-testing orchestrator, validate that JSONL records containing dimension data produce a Dimensional Progress table in the reducer output against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Reducer completes without errors, exit code 0. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.` | # Setup: create a test JSONL WITH dimensions<br>mkdir -p /tmp/reducer-test-dim<br>echo &#x27;{&quot;type&quot;:&quot;scored&quot;,&quot;profileId&quot;:&quot;debug&quot;,&quot;score&quot;:85,&quot;recommendation&quot;:&quot;candidate-better&quot;,&quot;dimensions&quot;:[{&quot;name&quot;:&quot;structural&quot;,&quot;score&quot;:90},{&quot;name&quot;:&quot;ruleCoherence&quot;,&quot;score&quot;:80},{&quot;name&quot;:&quot;integration&quot;,&quot;score&quot;:95},{&quot;name&quot;:&quot;outputQuality&quot;,&quot;score&quot;:75},{&quot;name&quot;:&quot;systemFitness&quot;,&quot;score&quot;:85}]}&#x27; &gt; /tmp/reducer-test-dim/agent-improvement-state.jsonl<br>echo &#x27;{}&#x27; &gt; /tmp/reducer-test-dim/agent-improvement-config.json<br><br><br># Run the reducer<br>node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs /tmp/reducer-test-dim<br><br><br># Verification<br>grep &quot;Dimensional Progress&quot; /tmp/reducer-test-dim/agent-improvement-dashboard.md &amp;&amp; grep &quot;structural&quot; /tmp/reducer-test-dim/agent-improvement-dashboard.md &amp;&amp; echo &quot;PASS&quot; | Reducer completes without errors, exit code 0; Dashboard generated at `/tmp/reducer-test-dim/agent-improvement-dashboard.md`; Dashboard includes a "Dimensional Progress" section with a table showing columns: Dimension, Latest, Best, Trend; All 5 dimensions appear in the table: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`; Standard composite score and verdict sections are also present alongside the dimensional table | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | Dashboard contains a "Dimensional Progress" section with all 5 dimension names (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) and their scores displayed in the table. | If no &quot;Dimensional Progress&quot; section appears: check whether the renderer detects the presence of `dimensions` arrays in scored JSONL records<br>If some dimensions are missing from the table: verify all five dimension names (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) are recognized by the reducer<br>If no output files are created: confirm `reduce-state.cjs` received the correct positional argument (runtime root path, not `--input`/`--output` flags) |

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
| `05--reducer-dimensions/018-with-dimensions.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/reduce-state.cjs` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Reducer Dimensions
- Playbook ID: RD-018
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--reducer-dimensions/018-with-dimensions.md`
