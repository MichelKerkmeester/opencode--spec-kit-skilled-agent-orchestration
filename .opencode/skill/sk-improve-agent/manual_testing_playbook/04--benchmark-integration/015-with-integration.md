---
title: "BI-015 -- Benchmark With Integration Report"
description: "Manual validation scenario for BI-015: Benchmark With Integration Report."
feature_id: "BI-015"
category: "Benchmark Integration"
---

# BI-015 -- Benchmark With Integration Report

This document captures the canonical manual-testing contract for `BI-015`.

---

## 1. OVERVIEW

This scenario validates that running a benchmark with --integration-report adds integrationScore and related fields to the output.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Benchmark With Integration Report for the benchmark report scenarios with and without integration fields.
- Real user request: `Validate that running a benchmark with --integration-report adds integrationScore and related fields to the output.`
- RCAF Prompt: `` As a manual-testing orchestrator, validate that running a benchmark with --integration-report adds integrationScore and related fields to the output against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Benchmark output at `/tmp/bench-with-integration.json` includes all standard benchmark fields PLUS:. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the integration scanner against the documented agent target; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: Benchmark output at `/tmp/bench-with-integration.json` includes all standard benchmark fields PLUS:; `integrationScore` -- number between 0 and 100, computed as weighted average: 60% mirror + 20% command + 20% skill; `integrationDetails` object containing:; `mirrorScore` -- mirror alignment score; `commandScore` -- command coverage score; `skillScore` -- skill coverage score; `mirrorStatus` -- mirror alignment status; `commandCount` -- number of commands found; `skillCount` -- number of skills found; Standard benchmark fields (`status`, `aggregateScore`, `fixtures`, `failureModes`) remain present alongside integration fields
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: `integrationScore` is present and computed as weighted average (60% mirror + 20% command + 20% skill). `integrationDetails` contains `mirrorScore`, `commandScore`, `skillScore`, `mirrorStatus`, `commandCount`, `skillCount`. All standard benchmark fields are also present.

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
| BI-015 | Benchmark With Integration Report | Validate Benchmark With Integration Report | `` As a manual-testing orchestrator, validate that running a benchmark with --integration-report adds integrationScore and related fields to the output against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Benchmark output at `/tmp/bench-with-integration.json` includes all standard benchmark fields PLUS:. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | # Step 1: Generate the integration report<br>node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs \<br>  --agent=debug \<br>  --output=/tmp/integration-for-bench.json<br><br><br># Step 2: Run benchmark with the integration report<br>mkdir -p /tmp/bench-test-int &amp;&amp; \<br>node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs \<br>  --profile=debug \<br>  --outputs-dir=/tmp/bench-test-int \<br>  --output=/tmp/bench-with-integration.json \<br>  --integration-report=/tmp/integration-for-bench.json | Benchmark output at `/tmp/bench-with-integration.json` includes all standard benchmark fields PLUS:; `integrationScore` -- number between 0 and 100, computed as weighted average: 60% mirror + 20% command + 20% skill; `integrationDetails` object containing:; `mirrorScore` -- mirror alignment score; `commandScore` -- command coverage score; `skillScore` -- skill coverage score; `mirrorStatus` -- mirror alignment status; `commandCount` -- number of commands found; `skillCount` -- number of skills found; Standard benchmark fields (`status`, `aggregateScore`, `fixtures`, `failureModes`) remain present alongside integration fields | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | `integrationScore` is present and computed as weighted average (60% mirror + 20% command + 20% skill). `integrationDetails` contains `mirrorScore`, `commandScore`, `skillScore`, `mirrorStatus`, `commandCount`, `skillCount`. All standard benchmark fields are also present. | If `integrationScore` is missing: verify the `--integration-report` flag is parsed and the report file is loaded in `run-benchmark.cjs`<br>If `integrationDetails` is missing or has wrong sub-fields: check the integration score calculation module for the expected field names<br>If the integration report (Step 1) is invalid: re-run `scan-integration.cjs` and confirm the JSON output is well-formed<br>If the weighted average is wrong: verify the weight formula (60% mirror + 20% command + 20% skill) in the integration scorer |

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
| `04--benchmark-integration/015-with-integration.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/run-benchmark.cjs` | Implementation or verification anchor referenced by this scenario |
| `../../scripts/scan-integration.cjs` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Benchmark Integration
- Playbook ID: BI-015
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--benchmark-integration/015-with-integration.md`
