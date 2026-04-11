---
title: "Plateau Detection on Identical Dimension Scores"
feature_id: "RD-019"
category: "Reducer Dimensions"
---

# Plateau Detection on Identical Dimension Scores

Validates that three or more consecutive identical dimension scores trigger the plateau stop condition.

## Prompt / Command

```bash
# Setup: create a test JSONL with 3 identical dimension score entries
mkdir -p /tmp/reducer-test-plateau
RECORD='{"type":"scored","profileId":"debug","score":85,"recommendation":"tie","dimensions":[{"name":"structural","score":90},{"name":"ruleCoherence","score":80},{"name":"integration","score":95},{"name":"outputQuality","score":75},{"name":"systemFitness","score":85}]}'
echo "$RECORD" > /tmp/reducer-test-plateau/agent-improvement-state.jsonl
echo "$RECORD" >> /tmp/reducer-test-plateau/agent-improvement-state.jsonl
echo "$RECORD" >> /tmp/reducer-test-plateau/agent-improvement-state.jsonl
echo '{"stopRules":{"stopOnDimensionPlateau":true,"maxConsecutiveTies":5}}' > /tmp/reducer-test-plateau/agent-improvement-config.json

# Run the reducer
node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs /tmp/reducer-test-plateau

# Verification
cat /tmp/reducer-test-plateau/experiment-registry.json | python3 -c "import sys,json; d=json.load(sys.stdin); print('PASS' if any('plateau' in str(v).lower() for v in [d]) else 'CHECK MANUALLY')"
```

## Expected Signals

- Reducer completes without errors, exit code 0
- Dashboard generated at `/tmp/reducer-test-plateau/agent-improvement-dashboard.md`
- Registry generated at `/tmp/reducer-test-plateau/experiment-registry.json`
- Registry shows `stopStatus.shouldStop: true` with reason mentioning "dimensions plateaued" or similar
- Dimensional Progress table shows the flat score trend across all 3 records

## Pass Criteria

Stop triggered by dimension plateau detection -- `experiment-registry.json` contains `shouldStop: true` with a plateau-related reason after processing 3 identical dimension score entries.

## Failure Triage

- If plateau is not detected: verify the comparison logic checks all five dimensions (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) across the lookback window
- If plateau triggers incorrectly: check that `stopOnDimensionPlateau` is read from `agent-improvement-config.json` and the threshold logic matches the number of identical records
- If no output files are created: confirm `reduce-state.cjs` received the correct positional argument (runtime root path, not `--input`/`--output` flags)

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
