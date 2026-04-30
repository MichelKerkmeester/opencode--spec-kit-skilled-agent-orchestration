---
title: "RT-030 -- Dimension Trajectory and Convergence Eligibility"
description: "Manual validation scenario for RT-030: Dimension Trajectory and Convergence Eligibility."
feature_id: "RT-030"
category: "Runtime Truth"
---

# RT-030 -- Dimension Trajectory and Convergence Eligibility

This document captures the canonical manual-testing contract for `RT-030`.

---

## 1. OVERVIEW

This scenario validates that `mutation-coverage.cjs` tracks per-dimension score history across iterations, and that convergence eligibility requires at least 3 stable data points with all dimension deltas within the configured stability delta.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Dimension Trajectory and Convergence Eligibility for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
- Real user request: `` Validate that `mutation-coverage.cjs` tracks per-dimension score history across iterations, and that convergence eligibility requires at least 3 stable data points with all dimension deltas within the configured stability delta. ``
- RCAF Prompt: `` As a manual-testing orchestrator, validate that mutation-coverage.cjs tracks per-dimension score history across iterations, and that convergence eligibility requires at least 3 stable data points with all dimension deltas within the configured stability delta against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `recordTrajectory()` appends per-dimension scores with iteration number and timestamp. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the mutation-coverage helper against the documented disposable runtime state; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: `recordTrajectory()` appends per-dimension scores with iteration number and timestamp; `getTrajectory()` returns the full score history as an array of data points; `checkConvergenceEligibility()` returns `{ canConverge, reason, dataPoints }`; With fewer than `MIN_TRAJECTORY_POINTS` (3) data points: `canConverge: false`, reason mentions "Insufficient"; With 3+ stable data points (all deltas within `DEFAULT_STABILITY_DELTA` of 2): `canConverge: true`; With 3+ data points but unstable dimension(s): `canConverge: false`, reason names the unstable dimensions; Trajectory data is persisted to the coverage graph JSON file (survives process restart)
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Convergence is rejected with fewer than 3 data points, accepted with 3 stable points (all dimension deltas within +/-2), and rejected when any dimension shows variance exceeding the stability delta -- with the unstable dimension named in the reason.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the working directory is the repository root.
2. Resolve any placeholders in the command sequence, especially `{spec}`, to disposable test paths.
3. Run the exact command sequence and capture stdout, stderr, exit code, and generated artifacts.
4. Run the verification block against the same artifacts from the same execution.
5. Compare observed output against the expected signals and pass/fail criteria.
6. Record the scenario verdict with the decisive evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RT-030 | Dimension Trajectory and Convergence Eligibility | Validate Dimension Trajectory and Convergence Eligibility | `` As a manual-testing orchestrator, validate that mutation-coverage.cjs tracks per-dimension score history across iterations, and that convergence eligibility requires at least 3 stable data points with all dimension deltas within the configured stability delta against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `recordTrajectory()` appends per-dimension scores with iteration number and timestamp. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | node -e &quot;<br>const mc = require(&#x27;./.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs&#x27;);<br>const coveragePath = &#x27;/tmp/trajectory-test-coverage.json&#x27;;<br><br><br>// Record 3 trajectory points with stable scores<br>mc.recordTrajectory(coveragePath, { iteration: 1, scores: { structural: 88, ruleCoherence: 85, integration: 90, outputQuality: 82, systemFitness: 89 } });<br>mc.recordTrajectory(coveragePath, { iteration: 2, scores: { structural: 89, ruleCoherence: 86, integration: 91, outputQuality: 83, systemFitness: 89 } });<br>mc.recordTrajectory(coveragePath, { iteration: 3, scores: { structural: 89, ruleCoherence: 86, integration: 90, outputQuality: 83, systemFitness: 90 } });<br><br><br>// Check convergence<br>const result = mc.checkConvergenceEligibility(coveragePath);<br>console.log(&#x27;Convergence result:&#x27;, JSON.stringify(result, null, 2));<br><br><br>// Verify trajectory retrieval<br>const traj = mc.getTrajectory(coveragePath);<br>console.log(&#x27;Trajectory length:&#x27;, traj.length);<br>console.log(&#x27;First data point scores:&#x27;, JSON.stringify(traj[0].scores));<br>&quot;<br><br><br>Verification:<br><br><br>node -e &quot;<br>const mc = require(&#x27;./.opencode/skill/sk-improve-agent/scripts/mutation-coverage.cjs&#x27;);<br>const cp = &#x27;/tmp/trajectory-verify.json&#x27;;<br><br><br>// Too few points: should not converge<br>mc.recordTrajectory(cp, { iteration: 1, scores: { structural: 88, ruleCoherence: 85, integration: 90, outputQuality: 82, systemFitness: 89 } });<br>mc.recordTrajectory(cp, { iteration: 2, scores: { structural: 89, ruleCoherence: 86, integration: 91, outputQuality: 83, systemFitness: 89 } });<br>let r = mc.checkConvergenceEligibility(cp);<br>console.assert(r.canConverge === false, &#x27;Should not converge with 2 points&#x27;);<br>console.assert(r.reason.includes(&#x27;Insufficient&#x27;), &#x27;Reason should mention insufficient&#x27;);<br><br><br>// Add 3rd stable point<br>mc.recordTrajectory(cp, { iteration: 3, scores: { structural: 89, ruleCoherence: 86, integration: 90, outputQuality: 83, systemFitness: 90 } });<br>r = mc.checkConvergenceEligibility(cp);<br>console.assert(r.canConverge === true, &#x27;Should converge with 3 stable points&#x27;);<br><br><br>// Add unstable point<br>const cp2 = &#x27;/tmp/trajectory-verify-unstable.json&#x27;;<br>mc.recordTrajectory(cp2, { iteration: 1, scores: { structural: 70, ruleCoherence: 85, integration: 90, outputQuality: 82, systemFitness: 89 } });<br>mc.recordTrajectory(cp2, { iteration: 2, scores: { structural: 80, ruleCoherence: 86, integration: 91, outputQuality: 83, systemFitness: 89 } });<br>mc.recordTrajectory(cp2, { iteration: 3, scores: { structural: 90, ruleCoherence: 86, integration: 90, outputQuality: 83, systemFitness: 90 } });<br>r = mc.checkConvergenceEligibility(cp2);<br>console.assert(r.canConverge === false, &#x27;Should not converge with unstable structural&#x27;);<br>console.assert(r.reason.includes(&#x27;structural&#x27;), &#x27;Should identify structural as unstable&#x27;);<br><br><br>console.log(&#x27;PASS&#x27;);<br>&quot; &amp;&amp; rm -f /tmp/trajectory-verify.json /tmp/trajectory-verify-unstable.json | `recordTrajectory()` appends per-dimension scores with iteration number and timestamp; `getTrajectory()` returns the full score history as an array of data points; `checkConvergenceEligibility()` returns `{ canConverge, reason, dataPoints }`; With fewer than `MIN_TRAJECTORY_POINTS` (3) data points: `canConverge: false`, reason mentions "Insufficient"; With 3+ stable data points (all deltas within `DEFAULT_STABILITY_DELTA` of 2): `canConverge: true`; With 3+ data points but unstable dimension(s): `canConverge: false`, reason names the unstable dimensions; Trajectory data is persisted to the coverage graph JSON file (survives process restart) | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | Convergence is rejected with fewer than 3 data points, accepted with 3 stable points (all dimension deltas within +/-2), and rejected when any dimension shows variance exceeding the stability delta -- with the unstable dimension named in the reason. | If `canConverge` is always false: check that `MIN_TRAJECTORY_POINTS` is 3 (not higher), and verify the stability delta comparison uses `&gt;` not `&gt;=`<br>If `canConverge` is always true: check that the last N points (not all points) are used for stability comparison<br>If unstable dimensions are not named: verify the `unstableDimensions` array is populated from the delta comparison loop<br>If trajectory points are lost between calls: verify `readJsonSafe()` correctly reads the file and `writeJson()` overwrites with the full graph including all trajectory entries |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste convergence eligibility results for stable and unstable cases]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `07--runtime-truth/030-dimension-trajectory.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/mutation-coverage.cjs'` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Runtime Truth
- Playbook ID: RT-030
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-truth/030-dimension-trajectory.md`
