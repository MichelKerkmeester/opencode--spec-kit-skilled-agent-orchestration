---
title: "Benchmark With Integration Report"
feature_id: "BI-015"
category: "Benchmark Integration"
---

# Benchmark With Integration Report

Validates that running a benchmark with --integration-report adds integrationScore and related fields to the output.

## Prompt / Command

```bash
# Step 1: Generate the integration report
node .opencode/skill/sk-agent-improver/scripts/scan-integration.cjs \
  --agent=handover \
  --output=/tmp/integration-for-bench.json

# Step 2: Run benchmark with the integration report
mkdir -p /tmp/bench-test-int && \
node .opencode/skill/sk-agent-improver/scripts/run-benchmark.cjs \
  --profile=handover \
  --outputs-dir=/tmp/bench-test-int \
  --output=/tmp/bench-with-integration.json \
  --integration-report=/tmp/integration-for-bench.json
```

## Expected Signals

- Benchmark output at `/tmp/bench-with-integration.json` includes all standard benchmark fields PLUS:
  - `integrationScore` -- number between 0 and 100, computed as weighted average: 60% mirror + 20% command + 20% skill
  - `integrationDetails` object containing:
    - `mirrorScore` -- mirror alignment score
    - `commandScore` -- command coverage score
    - `skillScore` -- skill coverage score
    - `mirrorStatus` -- mirror alignment status
    - `commandCount` -- number of commands found
    - `skillCount` -- number of skills found
- Standard benchmark fields (`status`, `aggregateScore`, `fixtures`, `failureModes`) remain present alongside integration fields

## Pass Criteria

`integrationScore` is present and computed as weighted average (60% mirror + 20% command + 20% skill). `integrationDetails` contains `mirrorScore`, `commandScore`, `skillScore`, `mirrorStatus`, `commandCount`, `skillCount`. All standard benchmark fields are also present.

## Failure Triage

- If `integrationScore` is missing: verify the `--integration-report` flag is parsed and the report file is loaded in `run-benchmark.cjs`
- If `integrationDetails` is missing or has wrong sub-fields: check the integration score calculation module for the expected field names
- If the integration report (Step 1) is invalid: re-run `scan-integration.cjs` and confirm the JSON output is well-formed
- If the weighted average is wrong: verify the weight formula (60% mirror + 20% command + 20% skill) in the integration scorer

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
