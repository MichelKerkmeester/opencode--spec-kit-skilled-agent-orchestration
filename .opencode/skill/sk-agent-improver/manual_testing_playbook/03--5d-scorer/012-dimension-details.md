---
title: "Dimension Details Array with Individual Check Results"
feature_id: "5D-012"
category: "5D Scorer"
---

# Dimension Details Array with Individual Check Results

Validates that each dimension in the 5D scorer output includes a details array showing individual check results.

## Prompt / Command

```bash
node .opencode/skill/sk-agent-improver/scripts/score-candidate.cjs \
  --candidate=.opencode/agent/handover.md --dynamic
```

## Expected Signals

- `dimensions` array contains 5 objects with names: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`
- Each dimension object has a `details` array of individual check objects
- Each check object in `details` has at minimum:
  - `id` -- string identifying the specific check
  - `pass` -- boolean indicating whether the check passed
- The `details` array provides granularity to diagnose which specific checks passed or failed per dimension

## Pass Criteria

Every dimension (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) has a non-empty `details` array with at least 1 check entry containing `id` and `pass` fields.

## Failure Triage

- If `details` arrays are empty: check that individual check functions are returning results to the aggregator
- If `details` entries lack `id` or `pass` fields: verify the check result schema in the dimension scorer modules
- If some dimensions have details but others do not: verify all five dimension scorers implement the details interface

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
