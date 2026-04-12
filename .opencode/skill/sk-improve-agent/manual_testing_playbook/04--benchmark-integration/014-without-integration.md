---
title: "Benchmark Without Integration Report"
feature_id: "BI-014"
category: "Benchmark Integration"
---

# Benchmark Without Integration Report

Validates that running a benchmark without the --integration-report flag produces output with no integration-specific fields.

## Prompt

- Prompt: `As a manual-testing orchestrator, validate that running a benchmark without the --integration-report flag produces output with no integration-specific fields against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Benchmark completes successfully with exit code 0. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`

## Commands

```bash
mkdir -p /tmp/bench-test-empty && \
node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs \
  --profile=debug \
  --outputs-dir=/tmp/bench-test-empty \
  --output=/tmp/bench-no-integration.json
```

## Expected

- Benchmark completes successfully with exit code 0
- Output JSON at `/tmp/bench-no-integration.json` is valid and contains:
  - `status` field equals `"benchmark-complete"`
  - `aggregateScore` -- numeric aggregate score
  - `fixtures` -- array of fixture results
  - `failureModes` -- array (may be empty)
- NO `integrationScore` field in output
- NO `integrationDetails` field in output
- Standard benchmark fields are present and backward compatible

## Pass Criteria

Output has `status: "benchmark-complete"` with `aggregateScore` and `fixtures` but no `integrationScore` or `integrationDetails` fields -- confirming backward compatibility when `--integration-report` is not provided.

## Failure Triage

- If `integrationScore` or `integrationDetails` fields appear: check whether the benchmark unconditionally includes integration data regardless of the flag
- If the benchmark fails to run: verify the `--outputs-dir` exists (the `mkdir -p` above should handle this) and the debug profile is available
- If the output file is not created: check the `--output` path handling logic in `run-benchmark.cjs`

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
