---
title: "BI-014 -- Benchmark Without Integration Report"
description: "Manual validation scenario for BI-014: Benchmark Without Integration Report."
feature_id: "BI-014"
category: "Benchmark Integration"
---

# BI-014 -- Benchmark Without Integration Report

This document captures the canonical manual-testing contract for `BI-014`.

---

## 1. OVERVIEW

This scenario validates that running a benchmark without the --integration-report flag produces output with no integration-specific fields.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Benchmark Without Integration Report for the benchmark report scenarios with and without integration fields.
- Real user request: `Validate that running a benchmark without the --integration-report flag produces output with no integration-specific fields.`
- RCAF Prompt: `As a manual-testing orchestrator, validate that running a benchmark without the --integration-report flag produces output with no integration-specific fields against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Benchmark completes successfully with exit code 0. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`
- Expected execution process: Run the benchmark script with the documented flags; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: Benchmark completes successfully with exit code 0; Output JSON at `/tmp/bench-no-integration.json` is valid and contains:; `status` field equals `"benchmark-complete"`; `aggregateScore` -- numeric aggregate score; `fixtures` -- array of fixture results; `failureModes` -- array (may be empty); NO `integrationScore` field in output; NO `integrationDetails` field in output; Standard benchmark fields are present and backward compatible
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Output has `status: "benchmark-complete"` with `aggregateScore` and `fixtures` but no `integrationScore` or `integrationDetails` fields -- confirming backward compatibility when `--integration-report` is not provided.

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
| BI-014 | Benchmark Without Integration Report | Validate Benchmark Without Integration Report | `As a manual-testing orchestrator, validate that running a benchmark without the --integration-report flag produces output with no integration-specific fields against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Benchmark completes successfully with exit code 0. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.` | mkdir -p /tmp/bench-test-empty &amp;&amp; \<br>node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs \<br>  --profile=debug \<br>  --outputs-dir=/tmp/bench-test-empty \<br>  --output=/tmp/bench-no-integration.json | Benchmark completes successfully with exit code 0; Output JSON at `/tmp/bench-no-integration.json` is valid and contains:; `status` field equals `"benchmark-complete"`; `aggregateScore` -- numeric aggregate score; `fixtures` -- array of fixture results; `failureModes` -- array (may be empty); NO `integrationScore` field in output; NO `integrationDetails` field in output; Standard benchmark fields are present and backward compatible | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | Output has `status: "benchmark-complete"` with `aggregateScore` and `fixtures` but no `integrationScore` or `integrationDetails` fields -- confirming backward compatibility when `--integration-report` is not provided. | If `integrationScore` or `integrationDetails` fields appear: check whether the benchmark unconditionally includes integration data regardless of the flag<br>If the benchmark fails to run: verify the `--outputs-dir` exists (the `mkdir -p` above should handle this) and the debug profile is available<br>If the output file is not created: check the `--output` path handling logic in `run-benchmark.cjs` |

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
| `04--benchmark-integration/014-without-integration.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/run-benchmark.cjs` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Benchmark Integration
- Playbook ID: BI-014
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--benchmark-integration/014-without-integration.md`
