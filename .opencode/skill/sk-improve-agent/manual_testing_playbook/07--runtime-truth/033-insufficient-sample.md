---
title: "Insufficient Sample Propagation"
feature_id: "RT-033"
category: "Runtime Truth"
---

# Insufficient Sample Propagation

Validates that low-sample guards propagate `insufficientData` and `insufficientSample` states from the helpers into the reducer registry and the dashboard's Sample Quality reporting.

Given: a session fixture with only 2 trade-off trajectory points and 1 benchmark replay at `.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/` once T050 lands.
When: the operator runs `trade-off-detector.cjs`, `benchmark-stability.cjs`, and `reduce-state.cjs` against that low-sample runtime.
Then: the helper states remain distinct, the reducer records `insufficientDataIterations` and `insufficientSampleIterations`, and the dashboard surfaces low-sample messaging instead of collapsing both cases into a generic failure.

## Prompt

- Prompt: `As a manual-testing orchestrator, validate that low-sample guards propagate insufficientData and insufficientSample states from the helpers into the reducer registry and the dashboard's Sample Quality reporting against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `trade-off-detector.cjs` returns `{ state: "insufficientData", dataPoints: 2, minRequired: 3 }` for the low-sample trajectory. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence.`

## Commands

```text
Run the low-sample fixture through trade-off detection, benchmark stability, and the reducer once T050 lands.
```

### Verification (copy-paste)

```bash
FIXTURE=.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark
TRAJECTORY_JSON="$(rg --files "$FIXTURE" | rg 'trajectory' | head -n 1)"
REPLAYS_JSON="$(rg --files "$FIXTURE" | rg 'replay|benchmark' | head -n 1)"

test -n "$TRAJECTORY_JSON"
test -n "$REPLAYS_JSON"

TRAJECTORY_JSON="$TRAJECTORY_JSON" node -e "
const fs = require('node:fs');
const td = require('./.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs');
const trajectory = JSON.parse(fs.readFileSync(process.env.TRAJECTORY_JSON, 'utf8'));
const result = td.detectTradeOffs(trajectory);
console.assert(result.state === 'insufficientData', 'Expected insufficientData state');
console.assert(result.dataPoints === 2, 'Expected 2 trajectory points');
console.assert(result.minRequired === 3, 'Expected minRequired=3');
console.log('PASS — trade-off-detector insufficientData:', JSON.stringify(result));
"

REPLAYS_JSON="$REPLAYS_JSON" node -e "
const fs = require('node:fs');
const bs = require('./.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs');
const replays = JSON.parse(fs.readFileSync(process.env.REPLAYS_JSON, 'utf8'));
const result = bs.measureStability(replays);
console.assert(result.state === 'insufficientSample', 'Expected insufficientSample state');
console.assert(result.replayCount === 1, 'Expected replayCount=1');
console.assert(result.minRequired === 3, 'Expected minRequired=3');
console.log('PASS — benchmark-stability insufficientSample:', JSON.stringify(result));
"

node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs "$FIXTURE"

grep -n "insufficientDataIterations\|insufficientSampleIterations" "$FIXTURE/experiment-registry.json"
grep -n "## Sample Quality\|insufficientSampleIterations\|insufficientDataIterations\|insufficient" "$FIXTURE/agent-improvement-dashboard.md"

cat "$FIXTURE/experiment-registry.json" | jq '.insufficientDataIterations, .insufficientSampleIterations'
```

## Expected

- `trade-off-detector.cjs` returns `{ state: "insufficientData", dataPoints: 2, minRequired: 3 }` for the low-sample trajectory
- `benchmark-stability.cjs` returns `{ state: "insufficientSample", replayCount: 1, minRequired: 3 }` for the low-sample benchmark replays
- `reduce-state.cjs` preserves both states distinctly instead of folding them into one generic low-confidence outcome
- `experiment-registry.json` contains both `insufficientDataIterations` and `insufficientSampleIterations`
- `agent-improvement-dashboard.md` contains a `## Sample Quality` section that renders low-data / low-replay messaging distinctly enough for an operator to diagnose which gate failed
- No helper throws; the low-sample state is treated as advisory runtime truth rather than an exception path

## Pass Criteria

The low-sample fixture produces `insufficientData` from `trade-off-detector.cjs`, `insufficientSample` from `benchmark-stability.cjs`, the reducer registry records both `insufficientDataIterations` and `insufficientSampleIterations`, and the dashboard's Sample Quality section exposes those states clearly enough that the operator can distinguish low trajectory coverage from low replay coverage.

## Failure Triage

- If the fixture path is missing: confirm T050 landed and the low-sample runtime exists under `.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/`
- If `trade-off-detector.cjs` returns an array instead of `insufficientData`: check `MIN_DATA_POINTS_DEFAULT` / `minDataPoints` wiring and verify the fixture only has 2 trajectory entries
- If `benchmark-stability.cjs` returns a generic instability result: verify `minReplayCount` is set to `3` and the fixture exposes only 1 replay
- If reducer fields are absent: inspect `reduce-state.cjs` for `extractInsufficientDataIteration()` and `extractInsufficientSampleIteration()` wiring
- If the dashboard hides which gate failed: update Sample Quality rendering so insufficient data points and insufficient replay count surface as separate operator-facing signals

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste insufficientData / insufficientSample helper output plus registry/dashboard excerpts]
```
