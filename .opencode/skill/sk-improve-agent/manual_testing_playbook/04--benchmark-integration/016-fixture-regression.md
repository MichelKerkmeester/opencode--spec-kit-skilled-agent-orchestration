---
title: "Fixture Regression Test for Handover Scores"
feature_id: "BI-016"
category: "Benchmark Integration"
---

# Fixture Regression Test for Handover Scores

Validates that existing handover benchmark fixtures produce the same scores as before the refactor, confirming no regression.

## Prompt / Command

```bash
mkdir -p /tmp/bench-test-empty && \
node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs \
  --profile=handover \
  --outputs-dir=/tmp/bench-test-empty \
  --output=/tmp/fixture-regression.json
```

> Same command as test 014 but focused on verifying fixture-level score stability.

## Expected Signals

- Benchmark completes with `status: "benchmark-complete"`
- If fixtures exist in `--outputs-dir`, each fixture result in the `fixtures` array has:
  - `score` -- numeric score for that fixture
  - `maxScore` -- equals `100`
  - `failureModes` -- array (may be empty)
- Fixture scores match the existing benchmark baseline (deterministic scoring, no drift)
- No new fields or structural changes compared to the pre-refactor output format

## Pass Criteria

No fixture scores changed from pre-refactor behavior. Each fixture result has `score`, `maxScore: 100`, and `failureModes` array. Output structure matches the baseline format.

## Failure Triage

- If fixture scores differ from baseline: compare the current scoring logic against the last tagged release and identify which check changed
- If fixtures are missing or corrupted: restore from version control and re-run
- If structural format changed (new fields, renamed fields): verify backward-compatible output serialization in `run-benchmark.cjs`
- If `maxScore` is not 100: check the fixture score normalization logic

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
