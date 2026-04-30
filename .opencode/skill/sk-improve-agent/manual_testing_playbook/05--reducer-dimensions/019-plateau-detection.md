---
title: "RD-019 -- Plateau Detection on Identical Dimension Scores"
description: "Manual validation scenario for RD-019: Plateau Detection on Identical Dimension Scores."
feature_id: "RD-019"
category: "Reducer Dimensions"
---

# RD-019 -- Plateau Detection on Identical Dimension Scores

This document captures the canonical manual-testing contract for `RD-019`.

---

## 1. OVERVIEW

This scenario validates that three or more consecutive identical dimension scores trigger the plateau stop condition.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Plateau Detection on Identical Dimension Scores for the reducer dashboard and dimensional-progress scenarios.
- Real user request: `Validate that three or more consecutive identical dimension scores trigger the plateau stop condition.`
- RCAF Prompt: `As a manual-testing orchestrator, validate that three or more consecutive identical dimension scores trigger the plateau stop condition against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Reducer completes without errors, exit code 0. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`
- Expected execution process: Run the reducer against the documented disposable runtime state; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: Reducer completes without errors, exit code 0; Dashboard generated at `/tmp/reducer-test-plateau/agent-improvement-dashboard.md`; Registry generated at `/tmp/reducer-test-plateau/experiment-registry.json`; Registry shows `stopStatus.shouldStop: true` with reason mentioning "dimensions plateaued" or similar; Dimensional Progress table shows the flat score trend across all 3 records
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Stop triggered by dimension plateau detection -- `experiment-registry.json` contains `shouldStop: true` with a plateau-related reason after processing 3 identical dimension score entries.

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
| RD-019 | Plateau Detection on Identical Dimension Scores | Validate Plateau Detection on Identical Dimension Scores | `As a manual-testing orchestrator, validate that three or more consecutive identical dimension scores trigger the plateau stop condition against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Reducer completes without errors, exit code 0. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.` | # Setup: create a test JSONL with 3 identical dimension score entries<br>mkdir -p /tmp/reducer-test-plateau<br>RECORD=&#x27;{&quot;type&quot;:&quot;scored&quot;,&quot;profileId&quot;:&quot;debug&quot;,&quot;score&quot;:85,&quot;recommendation&quot;:&quot;tie&quot;,&quot;dimensions&quot;:[{&quot;name&quot;:&quot;structural&quot;,&quot;score&quot;:90},{&quot;name&quot;:&quot;ruleCoherence&quot;,&quot;score&quot;:80},{&quot;name&quot;:&quot;integration&quot;,&quot;score&quot;:95},{&quot;name&quot;:&quot;outputQuality&quot;,&quot;score&quot;:75},{&quot;name&quot;:&quot;systemFitness&quot;,&quot;score&quot;:85}]}&#x27;<br>echo &quot;$RECORD&quot; &gt; /tmp/reducer-test-plateau/agent-improvement-state.jsonl<br>echo &quot;$RECORD&quot; &gt;&gt; /tmp/reducer-test-plateau/agent-improvement-state.jsonl<br>echo &quot;$RECORD&quot; &gt;&gt; /tmp/reducer-test-plateau/agent-improvement-state.jsonl<br>echo &#x27;{&quot;stopRules&quot;:{&quot;stopOnDimensionPlateau&quot;:true,&quot;maxConsecutiveTies&quot;:5}}&#x27; &gt; /tmp/reducer-test-plateau/agent-improvement-config.json<br><br><br># Run the reducer<br>node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs /tmp/reducer-test-plateau<br><br><br># Verification<br>cat /tmp/reducer-test-plateau/experiment-registry.json &#124; python3 -c &quot;import sys,json; d=json.load(sys.stdin); print(&#x27;PASS&#x27; if any(&#x27;plateau&#x27; in str(v).lower() for v in [d]) else &#x27;CHECK MANUALLY&#x27;)&quot; | Reducer completes without errors, exit code 0; Dashboard generated at `/tmp/reducer-test-plateau/agent-improvement-dashboard.md`; Registry generated at `/tmp/reducer-test-plateau/experiment-registry.json`; Registry shows `stopStatus.shouldStop: true` with reason mentioning "dimensions plateaued" or similar; Dimensional Progress table shows the flat score trend across all 3 records | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | Stop triggered by dimension plateau detection -- `experiment-registry.json` contains `shouldStop: true` with a plateau-related reason after processing 3 identical dimension score entries. | If plateau is not detected: verify the comparison logic checks all five dimensions (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) across the lookback window<br>If plateau triggers incorrectly: check that `stopOnDimensionPlateau` is read from `agent-improvement-config.json` and the threshold logic matches the number of identical records<br>If no output files are created: confirm `reduce-state.cjs` received the correct positional argument (runtime root path, not `--input`/`--output` flags) |

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
| `05--reducer-dimensions/019-plateau-detection.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/reduce-state.cjs` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Reducer Dimensions
- Playbook ID: RD-019
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--reducer-dimensions/019-plateau-detection.md`
