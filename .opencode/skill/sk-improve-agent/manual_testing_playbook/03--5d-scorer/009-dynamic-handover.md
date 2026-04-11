---
title: "Dynamic 5D Scoring on Handover Agent"
feature_id: "5D-009"
category: "5D Scorer"
---

# Dynamic 5D Scoring on Handover Agent

Validates that dynamic 5D scoring produces scores for all five dimensions plus a legacy composite score for the handover agent.

## Prompt / Command

```bash
node .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs \
  --candidate=.opencode/agent/handover.md --dynamic
```

### Verification one-liner

```bash
node .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs \
  --candidate=.opencode/agent/handover.md --dynamic \
  | python3 -c "import sys,json; d=json.load(sys.stdin); assert d['evaluationMode']=='dynamic-5d'; assert len(d['dimensions'])==5; assert d['legacyScore'] is not None; print(f'PASS: score={d[\"score\"]}')"
```

## Expected Signals

- `evaluationMode` field equals `"dynamic-5d"`
- `dimensions` array contains exactly 5 objects, each with:
  - `name` -- one of: `structural` (weight 0.20), `ruleCoherence` (weight 0.25), `integration` (weight 0.25), `outputQuality` (weight 0.15), `systemFitness` (weight 0.15)
  - `score` -- number between 0 and 100
  - `weight` -- the dimension weight listed above
  - `details` -- array of individual check results
- `legacyScore` object is present (handover has a static profile, so backward-compatible score is included)
- Top-level `score` field is the weighted aggregate across all 5 dimensions

## Pass Criteria

All five dimensions (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) are present, weighted `score` >= 70, and `legacyScore` is included.

## Failure Triage

- If `evaluationMode` is not `"dynamic-5d"`: the `--dynamic` flag is not being parsed; check CLI argument handling in `score-candidate.cjs`
- If fewer than 5 dimensions: check the dynamic profile generation pipeline to ensure all five scorers are invoked
- If dimension names are wrong (e.g., "Behavioral Fidelity"): the dimension registry is stale; verify `dimensions` constant in the scorer module
- If `legacyScore` is absent: check the backward-compatibility wrapper that computes the composite from the static handover profile
- If scores are out of range: verify normalization logic in each dimension scorer

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
