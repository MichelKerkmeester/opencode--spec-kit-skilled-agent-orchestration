---
title: "Benchmark Stability Measurement"
feature_id: "RT-029"
category: "Runtime Truth"
---

# Benchmark Stability Measurement

Validates that `benchmark-stability.cjs` correctly computes mean, standard deviation, and stability coefficient from repeated benchmark results, and that `isStable()` returns true only when variance is below threshold.

## Prompt / Command

```bash
node -e "
const bs = require('./.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs');

// Stable results: identical scores across 3 runs
const stableResults = [
  { scores: { structural: 90, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },
  { scores: { structural: 91, ruleCoherence: 87, integration: 92, outputQuality: 86, systemFitness: 90 } },
  { scores: { structural: 90, ruleCoherence: 88, integration: 91, outputQuality: 85, systemFitness: 91 } },
];
const stableResult = bs.measureStability(stableResults);
console.log('Stable:', JSON.stringify(stableResult, null, 2));
console.log('isStable (stable):', bs.isStable(stableResult));

// Unstable results: high variance in one dimension
const unstableResults = [
  { scores: { structural: 90, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },
  { scores: { structural: 60, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },
  { scores: { structural: 95, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },
];
const unstableResult = bs.measureStability(unstableResults);
console.log('Unstable:', JSON.stringify(unstableResult, null, 2));
console.log('isStable (unstable):', bs.isStable(unstableResult));
"
```

### Verification (copy-paste)

```bash
node -e "
const bs = require('./.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs');
const stable = bs.measureStability([
  { scores: { structural: 90, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },
  { scores: { structural: 91, ruleCoherence: 87, integration: 92, outputQuality: 86, systemFitness: 90 } },
  { scores: { structural: 90, ruleCoherence: 88, integration: 91, outputQuality: 85, systemFitness: 91 } },
]);
const unstable = bs.measureStability([
  { scores: { structural: 90, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },
  { scores: { structural: 60, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },
  { scores: { structural: 95, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },
]);
console.assert(bs.isStable(stable) === true, 'Stable case should be stable');
console.assert(bs.isStable(unstable) === false, 'Unstable case should not be stable');
console.assert(stable.stable === true, 'Stable result should have stable: true');
console.assert(unstable.warnings.length > 0, 'Unstable result should have warnings');
console.log('PASS');
"
```

## Expected Signals

- `measureStability()` returns `{ dimensions, stable, warnings }` with per-dimension stats
- Each dimension entry contains: `coefficient` (0.0-1.0), `mean`, `stddev`, `samples`
- Stability coefficient formula: `1 - (stddev / mean)`; perfect stability = 1.0
- `stable: true` when all dimensions have coefficient >= `warningThreshold` (default 0.95)
- `stable: false` when any dimension has coefficient < threshold
- `warnings` array contains a `stabilityWarning` entry for each unstable dimension
- `isStable()` returns `true` only when variance (1 - coefficient) is below `maxVariance` (default 0.05)

## Pass Criteria

Stable benchmark results produce `stable: true` and `isStable() === true` with no warnings. Unstable results (high variance in one or more dimensions) produce `stable: false`, `isStable() === false`, and at least one `stabilityWarning` entry naming the unstable dimension.

## Failure Triage

- If `stable` is always true: check that the `warningThreshold` comparison is `<` not `<=`, and verify stddev calculation uses sample variance (N-1 denominator)
- If coefficient values are wrong: verify the formula `1 - (stddev / abs(mean))` and the `Math.max(0, ...)` guard
- If `isStable()` disagrees with `stable`: note that `isStable()` uses `maxVariance` (default 0.05) which corresponds to coefficient >= 0.95, same as `DEFAULT_WARNING_THRESHOLD`
- If dimensions are missing: check that `DIMENSIONS` array matches the 5 expected dimension names

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste stability results for both stable and unstable cases]
```
