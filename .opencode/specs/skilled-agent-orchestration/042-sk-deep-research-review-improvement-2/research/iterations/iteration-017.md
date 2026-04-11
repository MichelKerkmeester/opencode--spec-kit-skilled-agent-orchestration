# Iteration 17: D3 Small-Sample Trade-Off and Stability Gating

## Focus
This iteration stayed on D3 and targeted the last open question around false positives and small-sample evidence. I inspected the trade-off detector, benchmark-stability helper, their unit tests, and the reducer/dashboard consumers together to determine whether low-sample runs can trigger warnings before enough evidence exists and whether the current operator surfaces distinguish real trade-offs from insufficient sample size.

## Findings
- `trade-off-detector.cjs` treats two trajectory points as sufficient evidence: `length < 2` is the only guard, and the detector immediately diffs each consecutive pair without consulting the shipped `trajectory.minDataPoints: 3` setting. That means one sharp delta between iteration 1 and 2 can already emit a trade-off even though the README and playbook describe a minimum 3-data-point requirement. (`.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:64-67`, `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:85-127`, `.opencode/skill/sk-improve-agent/assets/improvement_config.json:96-99`, `.opencode/skill/sk-improve-agent/README.md:67`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md:19-24`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md:32-35`)
- `benchmark-stability.cjs` does not compensate for that low-sample risk because it enforces no minimum replay count at all. Any non-empty result array is eligible, `stddev()` returns `0` for a single sample, `stabilityCoefficient()` converts that to `1.0`, and `measureStability()` therefore marks one-sample dimensions as fully stable; the configured `benchmarkStability.replayCount: 3` is descriptive only in the inspected helper path. (`.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:20-27`, `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:69-92`, `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:103-171`, `.opencode/skill/sk-improve-agent/assets/improvement_config.json:120-123`)
- The shipped tests lock in that under-constrained behavior instead of guarding against it. Trade-off tests only rule out `0` or `1` trajectory point and then accept a 2-point trade-off as valid, while benchmark-stability tests explicitly accept a 2-replay sample as stable and only check instability once there are 3 replay results with visible variance. (`.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts:58-79`, `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:80-121`, `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:124-139`)
- Reducer stop-gating collapses every non-`benchmark-pass` benchmark record into `benchmarkFailCount` and `weakBenchmarkRuns`, then stops after the configured maximum of 2 weak runs, but it never reads replay counts, per-dimension coefficients, or `stabilityWarning` payloads. In practice the operator-facing stop reason cannot distinguish “unstable because sample size is too small” from “genuine benchmark regression.” (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:173-186`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:259-289`, `.opencode/skill/sk-improve-agent/assets/improvement_config.json:72-79`, `.opencode/skill/sk-improve-agent/assets/improvement_config_reference.md:57-60`)
- The published dashboard contract promises reducer-populated trade-off visibility, but the shipped renderer does not surface it. `improvement_strategy.md` reserves a reducer-owned “Trade-Off Detection” table, yet `reduce-state.cjs` only renders counts, repeated failure modes, dimensional progress, and a generic benchmark-failure recommendation, so neither real Pareto trade-offs nor insufficient-sample instability are clearly labeled in the visible dashboard path. (`.opencode/skill/sk-improve-agent/assets/improvement_strategy.md:123-136`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:371-438`)

## Ruled Out
- This is not primarily a threshold-value bug: the shipped trade-off thresholds and weak-benchmark stop thresholds are internally consistent with config, so the problem is missing sample-size enforcement and signal loss across consumers, not a simple off-by-one constant mismatch. (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:72-79`, `.opencode/skill/sk-improve-agent/assets/improvement_config.json:100-123`, `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:40-49`)
- Benchmark stability is not over-blocking small samples in the inspected helper path; it under-blocks them by allowing 1-2 replay samples to look stable enough unless visible variance already appears. (`.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:69-92`, `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:103-171`, `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:124-139`)

## Dead Ends
- I did not find a visible orchestrator implementation file that wires `trade-off-detector.cjs` and `benchmark-stability.cjs` together end-to-end, so the compensation question had to be answered from the shipped helpers, tests, reducer inputs, and dashboard renderer rather than a single runtime driver.

## Sources Consulted
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:42-43`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-012.md:7-11`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-016.md:7-11`
- `.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs:64-127`
- `.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:20-191`
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:173-186`
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:259-289`
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:371-438`
- `.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts:58-79`
- `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:80-139`
- `.opencode/skill/sk-improve-agent/assets/improvement_config.json:72-123`
- `.opencode/skill/sk-improve-agent/assets/improvement_strategy.md:123-136`
- `.opencode/skill/sk-improve-agent/README.md:67`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/023-trade-off-detection.md:19-35`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/029-benchmark-stability.md:64-80`

## Reflection
- What worked and why: Reading the two D3 helpers beside their tests and the reducer made it possible to separate helper-level sample-size behavior from downstream operator surfacing.
- What did not work and why: I could not anchor the helper interaction to a single visible orchestrator runtime file, so some of the “does gating compensate?” answer had to come from omission across shipped consumer surfaces.
- What I would do differently: I would next pair this static audit with a packet-local fixture run so the 2-point trade-off and 1-2 replay stability edge cases can be demonstrated with concrete output rather than code inference alone.

## Recommended Next Focus
Rotate to D4 and audit self-compliance drift in `sk-improve-agent`'s published runtime contracts. The most productive next pass is to compare the README, SKILL, `assets/improvement_strategy.md`, and the visible reducer/dashboard path to verify which promised operator-visible artifacts actually survive end-to-end, especially around trade-off annotations, benchmark stability labeling, and stop-reason/session-outcome wording. That would convert this D3 evidence into a broader contract-compliance answer without reopening already-closed research/review findings.
