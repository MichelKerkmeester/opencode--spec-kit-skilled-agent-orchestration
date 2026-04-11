---
title: "Dimension Trajectory and Convergence Eligibility"
feature_id: "RT-030"
category: "Runtime Truth"
---

# Dimension Trajectory and Convergence Eligibility

Validates that `mutation-coverage.cjs` tracks per-dimension score history across iterations, and that convergence eligibility requires at least 3 stable data points with all dimension deltas within the configured stability delta.

## Prompt / Command

```bash
node -e "
const mc = require('./.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs');
const coveragePath = '/tmp/trajectory-test-coverage.json';

// Record 3 trajectory points with stable scores
mc.recordTrajectory(coveragePath, { iteration: 1, scores: { structural: 88, ruleCoherence: 85, integration: 90, outputQuality: 82, systemFitness: 89 } });
mc.recordTrajectory(coveragePath, { iteration: 2, scores: { structural: 89, ruleCoherence: 86, integration: 91, outputQuality: 83, systemFitness: 89 } });
mc.recordTrajectory(coveragePath, { iteration: 3, scores: { structural: 89, ruleCoherence: 86, integration: 90, outputQuality: 83, systemFitness: 90 } });

// Check convergence
const result = mc.checkConvergenceEligibility(coveragePath);
console.log('Convergence result:', JSON.stringify(result, null, 2));

// Verify trajectory retrieval
const traj = mc.getTrajectory(coveragePath);
console.log('Trajectory length:', traj.length);
console.log('First data point scores:', JSON.stringify(traj[0].scores));
"
```

### Verification (copy-paste)

```bash
node -e "
const mc = require('./.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs');
const cp = '/tmp/trajectory-verify.json';

// Too few points: should not converge
mc.recordTrajectory(cp, { iteration: 1, scores: { structural: 88, ruleCoherence: 85, integration: 90, outputQuality: 82, systemFitness: 89 } });
mc.recordTrajectory(cp, { iteration: 2, scores: { structural: 89, ruleCoherence: 86, integration: 91, outputQuality: 83, systemFitness: 89 } });
let r = mc.checkConvergenceEligibility(cp);
console.assert(r.canConverge === false, 'Should not converge with 2 points');
console.assert(r.reason.includes('Insufficient'), 'Reason should mention insufficient');

// Add 3rd stable point
mc.recordTrajectory(cp, { iteration: 3, scores: { structural: 89, ruleCoherence: 86, integration: 90, outputQuality: 83, systemFitness: 90 } });
r = mc.checkConvergenceEligibility(cp);
console.assert(r.canConverge === true, 'Should converge with 3 stable points');

// Add unstable point
const cp2 = '/tmp/trajectory-verify-unstable.json';
mc.recordTrajectory(cp2, { iteration: 1, scores: { structural: 70, ruleCoherence: 85, integration: 90, outputQuality: 82, systemFitness: 89 } });
mc.recordTrajectory(cp2, { iteration: 2, scores: { structural: 80, ruleCoherence: 86, integration: 91, outputQuality: 83, systemFitness: 89 } });
mc.recordTrajectory(cp2, { iteration: 3, scores: { structural: 90, ruleCoherence: 86, integration: 90, outputQuality: 83, systemFitness: 90 } });
r = mc.checkConvergenceEligibility(cp2);
console.assert(r.canConverge === false, 'Should not converge with unstable structural');
console.assert(r.reason.includes('structural'), 'Should identify structural as unstable');

console.log('PASS');
" && rm -f /tmp/trajectory-verify.json /tmp/trajectory-verify-unstable.json
```

## Expected Signals

- `recordTrajectory()` appends per-dimension scores with iteration number and timestamp
- `getTrajectory()` returns the full score history as an array of data points
- `checkConvergenceEligibility()` returns `{ canConverge, reason, dataPoints }`
- With fewer than `MIN_TRAJECTORY_POINTS` (3) data points: `canConverge: false`, reason mentions "Insufficient"
- With 3+ stable data points (all deltas within `DEFAULT_STABILITY_DELTA` of 2): `canConverge: true`
- With 3+ data points but unstable dimension(s): `canConverge: false`, reason names the unstable dimensions
- Trajectory data is persisted to the coverage graph JSON file (survives process restart)

## Pass Criteria

Convergence is rejected with fewer than 3 data points, accepted with 3 stable points (all dimension deltas within +/-2), and rejected when any dimension shows variance exceeding the stability delta -- with the unstable dimension named in the reason.

## Failure Triage

- If `canConverge` is always false: check that `MIN_TRAJECTORY_POINTS` is 3 (not higher), and verify the stability delta comparison uses `>` not `>=`
- If `canConverge` is always true: check that the last N points (not all points) are used for stability comparison
- If unstable dimensions are not named: verify the `unstableDimensions` array is populated from the delta comparison loop
- If trajectory points are lost between calls: verify `readJsonSafe()` correctly reads the file and `writeJson()` overwrites with the full graph including all trajectory entries

## Evidence Template

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste convergence eligibility results for stable and unstable cases]
```
