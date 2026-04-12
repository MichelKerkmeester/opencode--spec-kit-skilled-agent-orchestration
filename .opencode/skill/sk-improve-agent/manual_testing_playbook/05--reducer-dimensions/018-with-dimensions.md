---
title: "JSONL With Dimensions Produces Dimensional Progress Table"
feature_id: "RD-018"
category: "Reducer Dimensions"
---

# JSONL With Dimensions Produces Dimensional Progress Table

Validates that JSONL records containing dimension data produce a Dimensional Progress table in the reducer output.

## Prompt

- Prompt: `As a manual-testing orchestrator, validate that JSONL records containing dimension data produce a Dimensional Progress table in the reducer output against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify Reducer completes without errors, exit code 0. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`

## Commands

```bash
# Setup: create a test JSONL WITH dimensions
mkdir -p /tmp/reducer-test-dim
echo '{"type":"scored","profileId":"debug","score":85,"recommendation":"candidate-better","dimensions":[{"name":"structural","score":90},{"name":"ruleCoherence","score":80},{"name":"integration","score":95},{"name":"outputQuality","score":75},{"name":"systemFitness","score":85}]}' > /tmp/reducer-test-dim/agent-improvement-state.jsonl
echo '{}' > /tmp/reducer-test-dim/agent-improvement-config.json

# Run the reducer
node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs /tmp/reducer-test-dim

# Verification
grep "Dimensional Progress" /tmp/reducer-test-dim/agent-improvement-dashboard.md && grep "structural" /tmp/reducer-test-dim/agent-improvement-dashboard.md && echo "PASS"
```

## Expected

- Reducer completes without errors, exit code 0
- Dashboard generated at `/tmp/reducer-test-dim/agent-improvement-dashboard.md`
- Dashboard includes a "Dimensional Progress" section with a table showing columns: Dimension, Latest, Best, Trend
- All 5 dimensions appear in the table: `structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`
- Standard composite score and verdict sections are also present alongside the dimensional table

## Pass Criteria

Dashboard contains a "Dimensional Progress" section with all 5 dimension names (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) and their scores displayed in the table.

## Failure Triage

- If no "Dimensional Progress" section appears: check whether the renderer detects the presence of `dimensions` arrays in scored JSONL records
- If some dimensions are missing from the table: verify all five dimension names (`structural`, `ruleCoherence`, `integration`, `outputQuality`, `systemFitness`) are recognized by the reducer
- If no output files are created: confirm `reduce-state.cjs` received the correct positional argument (runtime root path, not `--input`/`--output` flags)

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
