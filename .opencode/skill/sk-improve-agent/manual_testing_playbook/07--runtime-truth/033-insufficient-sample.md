---
title: "RT-033 -- Insufficient Sample Propagation"
description: "Manual validation scenario for RT-033: Insufficient Sample Propagation."
feature_id: "RT-033"
category: "Runtime Truth"
---

# RT-033 -- Insufficient Sample Propagation

This document captures the canonical manual-testing contract for `RT-033`.

---

## 1. OVERVIEW

This scenario validates that low-sample guards propagate `insufficientData` and `insufficientSample` states from the helpers into the reducer registry and the dashboard's Sample Quality reporting. Given: a session fixture with only 2 trade-off trajectory points and 1 benchmark replay at `.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/` once T050 lands. When: the operator runs `trade-off-detector.cjs`, `benchmark-stability.cjs`, and `reduce-state.cjs` against that low-sample runtime. Then: the helper states remain distinct, the reducer records `insufficientDataIterations` and `insufficientSampleIterations`, and the dashboard surfaces low-sample messaging instead of collapsing both cases into a generic failure.

---

## 2. SCENARIO CONTRACT

- Objective: Validate Insufficient Sample Propagation for the journal, continuation, stop-gate, stability, and replay-consumer scenarios.
- Real user request: `` Validate that low-sample guards propagate `insufficientData` and `insufficientSample` states from the helpers into the reducer registry and the dashboard's Sample Quality reporting. Given: a session fixture with only 2 trade-off trajectory points and 1 benchmark replay at `.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/` once T050 lands. When: the operator runs `trade-off-detector.cjs`, `benchmark-stability.cjs`, and `reduce-state.cjs` against that low-sample runtime. Then: the helper states remain distinct, the reducer records `insufficientDataIterations` and `insufficientSampleIterations`, and the dashboard surfaces low-sample messaging instead of collapsing both cases into a generic failure. ``
- RCAF Prompt: `` As a manual-testing orchestrator, validate that low-sample guards propagate insufficientData and insufficientSample states from the helpers into the reducer registry and the dashboard's Sample Quality reporting against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `trade-off-detector.cjs` returns `{ state: "insufficientData", dataPoints: 2, minRequired: 3 }` for the low-sample trajectory. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. ``
- Expected execution process: Run the reducer against the documented disposable runtime state; capture stdout, stderr, exit code, and any generated files; then execute the verification block against the same run artifacts.
- Expected signals: `trade-off-detector.cjs` returns `{ state: "insufficientData", dataPoints: 2, minRequired: 3 }` for the low-sample trajectory; `benchmark-stability.cjs` returns `{ state: "insufficientSample", replayCount: 1, minRequired: 3 }` for the low-sample benchmark replays; `reduce-state.cjs` preserves both states distinctly instead of folding them into one generic low-confidence outcome; `experiment-registry.json` contains both `insufficientDataIterations` and `insufficientSampleIterations`; `agent-improvement-dashboard.md` contains a `## Sample Quality` section that renders low-data / low-replay messaging distinctly enough for an operator to diagnose which gate failed; No helper throws; the low-sample state is treated as advisory runtime truth rather than an exception path
- Desired user-visible outcome: A concise operator-facing PASS/FAIL verdict with the decisive evidence from the command output and verification checks.
- Pass/fail: The low-sample fixture produces `insufficientData` from `trade-off-detector.cjs`, `insufficientSample` from `benchmark-stability.cjs`, the reducer registry records both `insufficientDataIterations` and `insufficientSampleIterations`, and the dashboard's Sample Quality section exposes those states clearly enough that the operator can distinguish low trajectory coverage from low replay coverage.

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
| RT-033 | Insufficient Sample Propagation | Validate Insufficient Sample Propagation | `` As a manual-testing orchestrator, validate that low-sample guards propagate insufficientData and insufficientSample states from the helpers into the reducer registry and the dashboard's Sample Quality reporting against the current sk-improve-agent command, runtime artifacts, and validation scripts. Verify `trade-off-detector.cjs` returns `{ state: "insufficientData", dataPoints: 2, minRequired: 3 }` for the low-sample trajectory. Return a concise operator-facing PASS/FAIL verdict with the decisive evidence. `` | Run the low-sample fixture through trade-off detection, benchmark stability, and the reducer once T050 lands.<br><br><br>Verification:<br><br><br>FIXTURE=.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark<br>TRAJECTORY_JSON=&quot;$(rg --files &quot;$FIXTURE&quot; &#124; rg &#x27;trajectory&#x27; &#124; head -n 1)&quot;<br>REPLAYS_JSON=&quot;$(rg --files &quot;$FIXTURE&quot; &#124; rg &#x27;replay&#124;benchmark&#x27; &#124; head -n 1)&quot;<br><br><br>test -n &quot;$TRAJECTORY_JSON&quot;<br>test -n &quot;$REPLAYS_JSON&quot;<br><br><br>TRAJECTORY_JSON=&quot;$TRAJECTORY_JSON&quot; node -e &quot;<br>const fs = require(&#x27;node:fs&#x27;);<br>const td = require(&#x27;./.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs&#x27;);<br>const trajectory = JSON.parse(fs.readFileSync(process.env.TRAJECTORY_JSON, &#x27;utf8&#x27;));<br>const result = td.detectTradeOffs(trajectory);<br>console.assert(result.state === &#x27;insufficientData&#x27;, &#x27;Expected insufficientData state&#x27;);<br>console.assert(result.dataPoints === 2, &#x27;Expected 2 trajectory points&#x27;);<br>console.assert(result.minRequired === 3, &#x27;Expected minRequired=3&#x27;);<br>console.log(&#x27;PASS — trade-off-detector insufficientData:&#x27;, JSON.stringify(result));<br>&quot;<br><br><br>REPLAYS_JSON=&quot;$REPLAYS_JSON&quot; node -e &quot;<br>const fs = require(&#x27;node:fs&#x27;);<br>const bs = require(&#x27;./.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs&#x27;);<br>const replays = JSON.parse(fs.readFileSync(process.env.REPLAYS_JSON, &#x27;utf8&#x27;));<br>const result = bs.measureStability(replays);<br>console.assert(result.state === &#x27;insufficientSample&#x27;, &#x27;Expected insufficientSample state&#x27;);<br>console.assert(result.replayCount === 1, &#x27;Expected replayCount=1&#x27;);<br>console.assert(result.minRequired === 3, &#x27;Expected minRequired=3&#x27;);<br>console.log(&#x27;PASS — benchmark-stability insufficientSample:&#x27;, JSON.stringify(result));<br>&quot;<br><br><br>node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs &quot;$FIXTURE&quot;<br><br><br>grep -n &quot;insufficientDataIterations\&#124;insufficientSampleIterations&quot; &quot;$FIXTURE/experiment-registry.json&quot;<br>grep -n &quot;## Sample Quality\&#124;insufficientSampleIterations\&#124;insufficientDataIterations\&#124;insufficient&quot; &quot;$FIXTURE/agent-improvement-dashboard.md&quot;<br><br><br>cat &quot;$FIXTURE/experiment-registry.json&quot; &#124; jq &#x27;.insufficientDataIterations, .insufficientSampleIterations&#x27; | `trade-off-detector.cjs` returns `{ state: "insufficientData", dataPoints: 2, minRequired: 3 }` for the low-sample trajectory; `benchmark-stability.cjs` returns `{ state: "insufficientSample", replayCount: 1, minRequired: 3 }` for the low-sample benchmark replays; `reduce-state.cjs` preserves both states distinctly instead of folding them into one generic low-confidence outcome; `experiment-registry.json` contains both `insufficientDataIterations` and `insufficientSampleIterations`; `agent-improvement-dashboard.md` contains a `## Sample Quality` section that renders low-data / low-replay messaging distinctly enough for an operator to diagnose which gate failed; No helper throws; the low-sample state is treated as advisory runtime truth rather than an exception path | `terminal transcript, command output, generated files, and PASS/FAIL verdict` | The low-sample fixture produces `insufficientData` from `trade-off-detector.cjs`, `insufficientSample` from `benchmark-stability.cjs`, the reducer registry records both `insufficientDataIterations` and `insufficientSampleIterations`, and the dashboard's Sample Quality section exposes those states clearly enough that the operator can distinguish low trajectory coverage from low replay coverage. | If the fixture path is missing: confirm T050 landed and the low-sample runtime exists under `.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/`<br>If `trade-off-detector.cjs` returns an array instead of `insufficientData`: check `MIN_DATA_POINTS_DEFAULT` / `minDataPoints` wiring and verify the fixture only has 2 trajectory entries<br>If `benchmark-stability.cjs` returns a generic instability result: verify `minReplayCount` is set to `3` and the fixture exposes only 1 replay<br>If reducer fields are absent: inspect `reduce-state.cjs` for `extractInsufficientDataIteration()` and `extractInsufficientSampleIteration()` wiring<br>If the dashboard hides which gate failed: update Sample Quality rendering so insufficient data points and insufficient replay count surface as separate operator-facing signals |

### Optional Supplemental Checks

Use the verification block above as the primary supplemental check. Preserve any additional evidence in this template when reporting the verdict:

```text
Verdict: [PASS/FAIL]
Date: [YYYY-MM-DD]
Tester: [name]
Output excerpt:
[paste insufficientData / insufficientSample helper output plus registry/dashboard excerpts]
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root playbook, category summary, and review protocol |
| `07--runtime-truth/033-insufficient-sample.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Skill entry point and operator contract for sk-improve-agent |
| `../../scripts/benchmark-stability.cjs'` | Implementation or verification anchor referenced by this scenario |
| `../../scripts/reduce-state.cjs` | Implementation or verification anchor referenced by this scenario |
| `../../scripts/tests/fixtures/low-sample-benchmark` | Implementation or verification anchor referenced by this scenario |
| `../../scripts/tests/fixtures/low-sample-benchmark/` | Implementation or verification anchor referenced by this scenario |
| `../../scripts/trade-off-detector.cjs'` | Implementation or verification anchor referenced by this scenario |

---

## 5. SOURCE METADATA

- Group: Runtime Truth
- Playbook ID: RT-033
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--runtime-truth/033-insufficient-sample.md`
