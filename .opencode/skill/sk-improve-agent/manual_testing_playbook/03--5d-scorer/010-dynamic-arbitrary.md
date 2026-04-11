---
title: "Dynamic 5D Scoring on Non-Hardcoded Agent (Orchestrate)"
feature_id: "5D-010"
category: "5D Scorer"
---

# Dynamic 5D Scoring on Non-Hardcoded Agent (Orchestrate)

Validates that dynamic 5D scoring works on an agent without a pre-built profile, proving the dynamic profile generation path.

## Prompt / Command

```bash
node .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs \
  --candidate=.opencode/agent/orchestrate.md --dynamic
```

## Expected Signals

- `evaluationMode` field equals `"dynamic-5d"`
- `profileId` is derived from the agent name (e.g., `"orchestrate"`)
- `dimensions` array contains exactly 5 objects with names: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`
- Each dimension has `score` (0-100), `weight`, and `details` array
- NO `legacyScore` field (orchestrate has no static profile)
- No error about missing or unknown profile

## Pass Criteria

Produces a valid 5D score for a non-hardcoded agent: all five dimensions (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) scored, no `legacyScore` field, no fallback errors.

## Failure Triage

- If a "profile not found" error appears: verify the `--dynamic` flag triggers dynamic generation rather than static profile lookup
- If `legacyScore` is present: the scorer is incorrectly falling back to a static profile for an agent that has none
- If dimensions are missing: check that the dynamic profile includes all five required dimension definitions
- If scores seem identical to another agent: ensure the candidate file content is actually being parsed, not a cached profile

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
