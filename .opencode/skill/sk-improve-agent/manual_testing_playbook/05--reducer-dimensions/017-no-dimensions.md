---
title: "RD-017 -- JSONL Without Dimensions Produces Normal Dashboard"
description: "Manual validation scenario for RD-017: JSONL Without Dimensions Produces Normal Dashboard."
feature_id: "RD-017"
category: "Reducer Dimensions"
---

# RD-017 -- JSONL Without Dimensions Produces Normal Dashboard

This document captures the canonical manual-testing contract for `RD-017`.

---

## 1. OVERVIEW

This scenario validates backward compatibility: JSONL records that lack dimension fields still produce a normal reducer dashboard.

---

## 2. SCENARIO CONTRACT

- Objective: Validate JSONL Without Dimensions Produces Normal Dashboard for the reducer dashboard and dimensional-progress scenarios.
- Real user request: `Validate that backward compatibility: JSONL records that lack dimension fields still produce a normal reducer dashboard.`
- RCAF Prompt: `As a manual-testing orchestrator, validate backward compatibility: JSONL records that lack dimension fields still produce a normal reducer dashboard against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Reducer completes without errors, exit code 0. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`
- Expected execution process: Run the reducer against the documented disposable runtime state; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: Reducer completes without errors, exit code 0; Dashboard generated at `/tmp/reducer-test-nodim/agent-improvement-dashboard.md`; Registry generated at `/tmp/reducer-test-nodim/experiment-registry.json`; Dashboard does NOT contain a "Dimensional Progress" table (no dimension data in records); Standard composite score and verdict sections are present
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Backward compatible -- dashboard renders without dimension table when records lack `dimensions` field. Both `agent-improvement-dashboard.md` and `experiment-registry.json` are produced without errors.

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
| RD-017 | JSONL Without Dimensions Produces Normal Dashboard | Validate JSONL Without Dimensions Produces Normal Dashboard | `As a manual-testing orchestrator, validate backward compatibility: JSONL records that lack dimension fields still produce a normal reducer dashboard against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Reducer completes without errors, exit code 0. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.` | # Setup: create a minimal test JSONL without dimensions<br>mkdir -p /tmp/reducer-test-nodim<br>echo &#x27;{&quot;type&quot;:&quot;scored&quot;,&quot;profileId&quot;:&quot;debug&quot;,&quot;score&quot;:85,&quot;recommendation&quot;:&quot;candidate-better&quot;}&#x27; &gt; /tmp/reducer-test-nodim/agent-improvement-state.jsonl<br>echo &#x27;{}&#x27; &gt; /tmp/reducer-test-nodim/agent-improvement-config.json<br><br><br># Run the reducer<br>node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs /tmp/reducer-test-nodim | Reducer completes without errors, exit code 0; Dashboard generated at `/tmp/reducer-test-nodim/agent-improvement-dashboard.md`; Registry generated at `/tmp/reducer-test-nodim/experiment-registry.json`; Dashboard does NOT contain a "Dimensional Progress" table (no dimension data in records); Standard composite score and verdict sections are present | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | Backward compatible -- dashboard renders without dimension table when records lack `dimensions` field. Both `agent-improvement-dashboard.md` and `experiment-registry.json` are produced without errors. | If the reducer crashes: check for undefined property access on missing `dimensions` field in scored records<br>If a &quot;Dimensional Progress&quot; section appears despite no dimension data: verify the conditional rendering logic that gates dimension output on the presence of `dimensions` arrays<br>If no output files are created: confirm `reduce-state.cjs` received the correct positional argument (runtime root path, not `--input`/`--output` flags) |

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
| `05--reducer-dimensions/017-no-dimensions.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/reduce-state.cjs` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Reducer Dimensions
- Playbook ID: RD-017
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--reducer-dimensions/017-no-dimensions.md`
