---
title: "RT-029 -- Benchmark Stability Measurement"
description: "Manual validation scenario for RT-029: Benchmark Stability Measurement."
feature_id: "RT-029"
category: "Runtime Truth"
---

# RT-029 -- Benchmark Stability Measurement

This document captures the canonical manual-testing contract for `RT-029`.

---

## 1. OVERVIEW

This scenario validates that `benchmark-stability.cjs` correctly computes mean, standard deviation, and stability coefficient from repeated benchmark results, and that `isStable()` returns true only when variance is below threshold.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Benchmark Stability Measurement for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
- Real user request: `` Validate that `benchmark-stability.cjs` correctly computes mean, standard deviation, and stability coefficient from repeated benchmark results, and that `isStable()` returns true only when variance is below threshold. ``
- RCAF Prompt: `` As a manual-testing orchestrator, validate that benchmark-stability.cjs correctly computes mean, standard deviation, and stability coefficient from repeated benchmark results, and that isStable() returns true only when variance is below threshold against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `measureStability()` returns `{ dimensions, stable, warnings }` with per-dimension stats. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the benchmark-stability helper against the documented replay data; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: `measureStability()` returns `{ dimensions, stable, warnings }` with per-dimension stats; Each dimension entry contains: `coefficient` (0.0-1.0), `mean`, `stddev`, `samples`; Stability coefficient formula: `1 - (stddev / mean)`; perfect stability = 1.0; `stable: true` when all dimensions have coefficient >= `warningThreshold` (default 0.95); `stable: false` when any dimension has coefficient < threshold; `warnings` array contains a `stabilityWarning` entry for each unstable dimension; `isStable()` returns `true` only when variance (1 - coefficient) is below `maxVariance` (default 0.05)
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: Stable benchmark results produce `stable: true` and `isStable() === true` with no warnings. Unstable results (high variance in one or more dimensions) produce `stable: false`, `isStable() === false`, and at least one `stabilityWarning` entry naming the unstable dimension.

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
| RT-029 | Benchmark Stability Measurement | Validate Benchmark Stability Measurement | `` As a manual-testing orchestrator, validate that benchmark-stability.cjs correctly computes mean, standard deviation, and stability coefficient from repeated benchmark results, and that isStable() returns true only when variance is below threshold against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `measureStability()` returns `{ dimensions, stable, warnings }` with per-dimension stats. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | node -e &quot;<br>const bs = require(&#x27;./.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs&#x27;);<br><br><br>// Stable results: identical scores across 3 runs<br>const stableResults = [<br>  { scores: { structural: 90, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },<br>  { scores: { structural: 91, ruleCoherence: 87, integration: 92, outputQuality: 86, systemFitness: 90 } },<br>  { scores: { structural: 90, ruleCoherence: 88, integration: 91, outputQuality: 85, systemFitness: 91 } },<br>];<br>const stableResult = bs.measureStability(stableResults);<br>console.log(&#x27;Stable:&#x27;, JSON.stringify(stableResult, null, 2));<br>console.log(&#x27;isStable (stable):&#x27;, bs.isStable(stableResult));<br><br><br>// Unstable results: high variance in one dimension<br>const unstableResults = [<br>  { scores: { structural: 90, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },<br>  { scores: { structural: 60, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },<br>  { scores: { structural: 95, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },<br>];<br>const unstableResult = bs.measureStability(unstableResults);<br>console.log(&#x27;Unstable:&#x27;, JSON.stringify(unstableResult, null, 2));<br>console.log(&#x27;isStable (unstable):&#x27;, bs.isStable(unstableResult));<br>&quot;<br><br><br>Verification:<br><br><br>node -e &quot;<br>const bs = require(&#x27;./.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs&#x27;);<br>const stable = bs.measureStability([<br>  { scores: { structural: 90, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },<br>  { scores: { structural: 91, ruleCoherence: 87, integration: 92, outputQuality: 86, systemFitness: 90 } },<br>  { scores: { structural: 90, ruleCoherence: 88, integration: 91, outputQuality: 85, systemFitness: 91 } },<br>]);<br>const unstable = bs.measureStability([<br>  { scores: { structural: 90, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },<br>  { scores: { structural: 60, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },<br>  { scores: { structural: 95, ruleCoherence: 88, integration: 92, outputQuality: 85, systemFitness: 91 } },<br>]);<br>console.assert(bs.isStable(stable) === true, &#x27;Stable case should be stable&#x27;);<br>console.assert(bs.isStable(unstable) === false, &#x27;Unstable case should not be stable&#x27;);<br>console.assert(stable.stable === true, &#x27;Stable result should have stable: true&#x27;);<br>console.assert(unstable.warnings.length &gt; 0, &#x27;Unstable result should have warnings&#x27;);<br>console.log(&#x27;PASS&#x27;);<br>&quot; | `measureStability()` returns `{ dimensions, stable, warnings }` with per-dimension stats; Each dimension entry contains: `coefficient` (0.0-1.0), `mean`, `stddev`, `samples`; Stability coefficient formula: `1 - (stddev / mean)`; perfect stability = 1.0; `stable: true` when all dimensions have coefficient >= `warningThreshold` (default 0.95); `stable: false` when any dimension has coefficient < threshold; `warnings` array contains a `stabilityWarning` entry for each unstable dimension; `isStable()` returns `true` only when variance (1 - coefficient) is below `maxVariance` (default 0.05) | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | Stable benchmark results produce `stable: true` and `isStable() === true` with no warnings. Unstable results (high variance in one or more dimensions) produce `stable: false`, `isStable() === false`, and at least one `stabilityWarning` entry naming the unstable dimension. | If `stable` is always true: check that the `warningThreshold` comparison is `&lt;` not `&lt;=`, and verify stddev calculation uses sample variance (N-1 denominator)<br>If coefficient values are wrong: verify the formula `1 - (stddev / abs(mean))` and the `Math.max(0, ...)` guard<br>If `isStable()` disagrees with `stable`: note that `isStable()` uses `maxVariance` (default 0.05) which corresponds to coefficient &gt;= 0.95, same as `DEFAULT_WARNING_THRESHOLD`<br>If dimensions are missing: check that `DIMENSIONS` array matches the 5 expected dimension names |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste stability results for both stable and unstable cases]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `07--runtime-truth/029-benchmark-stability.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/benchmark-stability.cjs'` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Runtime Truth
- Playbook ID: RT-029
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-truth/029-benchmark-stability.md`
