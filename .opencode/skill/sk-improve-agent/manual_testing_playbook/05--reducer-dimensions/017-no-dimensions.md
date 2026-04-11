---
title: "JSONL Without Dimensions Produces Normal Dashboard"
feature_id: "RD-017"
category: "Reducer Dimensions"
---

# JSONL Without Dimensions Produces Normal Dashboard

Validates backward compatibility: JSONL records that lack dimension fields still produce a normal reducer dashboard.

## Prompt / Command

```bash
# Setup: create a minimal test JSONL without dimensions
mkdir -p /tmp/reducer-test-nodim
echo '{"type":"scored","profileId":"handover","score":85,"recommendation":"candidate-better"}' > /tmp/reducer-test-nodim/agent-improvement-state.jsonl
echo '{}' > /tmp/reducer-test-nodim/agent-improvement-config.json

# Run the reducer
node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs /tmp/reducer-test-nodim
```

## Expected Signals

- Reducer completes without errors, exit code 0
- Dashboard generated at `/tmp/reducer-test-nodim/agent-improvement-dashboard.md`
- Registry generated at `/tmp/reducer-test-nodim/experiment-registry.json`
- Dashboard does NOT contain a "Dimensional Progress" table (no dimension data in records)
- Standard composite score and verdict sections are present

## Pass Criteria

Backward compatible -- dashboard renders without dimension table when records lack `dimensions` field. Both `agent-improvement-dashboard.md` and `experiment-registry.json` are produced without errors.

## Failure Triage

- If the reducer crashes: check for undefined property access on missing `dimensions` field in scored records
- If a "Dimensional Progress" section appears despite no dimension data: verify the conditional rendering logic that gates dimension output on the presence of `dimensions` arrays
- If no output files are created: confirm `reduce-state.cjs` received the correct positional argument (runtime root path, not `--input`/`--output` flags)

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste relevant output]
```
