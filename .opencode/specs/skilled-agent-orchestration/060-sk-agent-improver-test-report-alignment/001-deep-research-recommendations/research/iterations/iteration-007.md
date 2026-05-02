---
iteration: 7
date: 2026-05-02T11:22:21+02:00
focus_rqs: [RQ-3, RQ-5, RQ-7]
new_findings_count: 4
rqs_now_answerable: [RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 7

## Focus

I targeted the gap explicitly left by iteration 6: whether the `candidate-better`/`delta` mismatch between scoring and promotion is already protected by tests. The highest-leverage new angle is that the current fixtures and tests prove pieces of the failure path, but do not join them into a legal-stop or promotion contract.

## Method

I read iterations 1-6 first, then grepped only `sk-improve-agent/scripts/tests` for `score-candidate`, `promote-candidate`, `candidate-better`, `delta`, `baseline`, `thresholdDelta`, `keep-baseline`, `insufficientSample`, and `benchmarkPlateau`. I then read the narrow scorer and promoter line ranges, the low-sample benchmark fixture, benchmark-stability tests, improvement-journal stop-reason tests, and the adjacent mutation/trade-off tests that currently cover "delta-like" concepts.

## Findings

### RQ-7: Are the 5 legal-stop gates grep-checkable from journal output, or LLM-judge-based?

Iteration 6 showed `improvementGate` lacks a reliable baseline/current delta source. This iteration adds that the existing test and fixture layer already contains a perfect negative fixture for `evidenceGate`, but it currently normalizes that failure into a success-shaped session end.

The low-sample fixture states that `trade-off-trajectory.json` has only two points and `benchmark-results.json` has only one replay, so the expected states are `insufficientData` and `insufficientSample` (`.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/README.md:7-9`). The state ledger embeds those insufficient states for candidate iterations 1 and 2 (`.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/agent-improvement-state.jsonl:2-3`), and the journal records matching `gate_evaluation` rows with insufficient trade-off and benchmark evidence (`.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl:4`, `.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl:7`).

The problem is the terminal event: the same journal ends with `eventType:"session_end"`, `stopReason:"converged"`, and `sessionOutcome:"keptBaseline"` while carrying a note that says `benchmarkPlateau` was not accepted (`.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl:8`). That note is stale relative to the current journal helper: `STOP_REASONS` now includes both `benchmarkPlateau` and `blockedStop` (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:21-30`), and the Vitest suite explicitly accepts `session_end` with `stopReason:"benchmarkPlateau"` and returns it from `getSessionResult()` (`.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts:112-118`, `.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts:219-230`).

This is a new concrete hardening target: the fixture should stop demonstrating "validator-accepted converged despite insufficient evidence" and instead become a legal-stop regression fixture. Since benchmark-stability tests already assert that one or two replays produce `insufficientSample` and that insufficient samples are not stable (`.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:89-109`, `.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:205-209`), a grep-checkable legal-stop test can require `blocked_stop` or `stopReason:"benchmarkPlateau"` and reject `stopReason:"converged"` when `evidenceGate` is false.

### RQ-3: Do sk-improve-agent's scripts actually fire when the skill is loaded, or does the agent read SKILL.md and improvise?

Prior iterations answered the load-vs-command distinction. This iteration narrows the executable seam: even where helper scripts exist, the scorer/promotion contract is not currently protected by a dedicated scorer or promoter test path.

The scorer still ignores `--baseline`: `main()` reads `args.candidate`, `args.manifest`, `args.target`, and `args.output`, but no `args.baseline` (`.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:260-265`). Its result emits `score`, `dimensions`, and `recommendation: "candidate-acceptable" | "needs-improvement"`, but not `baselineScore`, `delta`, or `candidate-better` (`.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:347-361`). Promotion then requires exactly the missing shape: `score.recommendation === "candidate-better"` and `Number(score.delta || 0) >= threshold` (`.opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs:156-163`).

The adjacent tests cover related concepts but not this integration contract. `mutation-coverage.vitest.ts` asserts a default stability delta of 2, which matches the threshold concept but is coverage-trajectory logic, not baseline scoring (`.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts:47-53`). `trade-off-detector.vitest.ts` compares candidate and baseline dimension maps for Pareto dominance, but it only checks regression detection and "improves at least one dimension"; it does not produce a weighted score delta or promotion recommendation (`.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts:236-252`). My targeted grep found no dedicated `score-candidate.vitest.ts` or `promote-candidate.vitest.ts`, and no test assertion for `baselineScore`, `candidate-better`, or promotion-threshold delta.

The improvement recommendation is therefore more specific than "wire scripts": add a scorer/promoter contract test that fails today. It should run `score-candidate.cjs` with `--baseline` and require either `(baselineScore, delta, recommendation:"candidate-better")` or require a separate legal-stop evaluator artifact that computes those fields before `promote-candidate.cjs` can be invoked.

### RQ-5: What does Call A (baseline) vs Call B (sk-improve-agent-disciplined) look like? Can the differential be made grep-checkable?

Iteration 6 proposed a Call B contract requiring explicit baseline/current score evidence. This iteration makes the failing side grep-checkable with current fixtures: Call B must not allow a low-sample, keep-baseline, below-threshold session to end as `converged`.

The existing low-sample fixture already has the right ingredients for Call B failure: candidate 2 has `recommendation:"keep-baseline"` and insufficient benchmark evidence (`.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/agent-improvement-state.jsonl:3`), while the journal currently records `decision:"keep-baseline"` and then `session_end` with `stopReason:"converged"` (`.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl:7-8`). A disciplined Call B should make that differential literal: `grep '"recommendation":"keep-baseline"' agent-improvement-state.jsonl` plus `grep '"state":"insufficientSample"' agent-improvement-state.jsonl` must imply no `grep '"stopReason":"converged"' improvement-journal.jsonl`.

This also strengthens the Call A/B distinction. Call A may narratively say "kept the baseline, so the loop converged"; Call B must preserve the legal-stop taxonomy and leave machine-readable evidence that the session was blocked or benchmark-plateaued because `evidenceGate` and/or `improvementGate` failed.

## New Open Questions

- Should low-sample evidence terminate as `blockedStop` with `failedGates:["evidenceGate"]`, or as `benchmarkPlateau` with `sessionOutcome:"keptBaseline"`? Either is better than `converged`, but the legal-stop model points toward `blockedStop`.
- Should `score-candidate.cjs` compute baseline/current delta directly, or should a separate `evaluate-legal-stop.cjs` consume scorer output, benchmark stability, and ledger state to compute `improvementGate`?
- Should `promotion_rules.md` and current fixtures be updated in the same change as scorer/promoter tests so the reference, fixture, and executable contract stop disagreeing?

## Ruled Out

- I ruled out "tests already catch the scorer/promoter mismatch": the scorer does not emit `candidate-better` or `delta`, promotion requires both, and the tests I found cover only adjacent delta/Pareto concepts rather than that integration path (`.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:347-361`, `.opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs:156-163`, `.opencode/skill/sk-improve-agent/scripts/tests/mutation-coverage.vitest.ts:47-53`, `.opencode/skill/sk-improve-agent/scripts/tests/trade-off-detector.vitest.ts:236-252`).
- I ruled out "the low-sample fixture must use `converged` because the journal enum lacks a better stop reason": `benchmarkPlateau` and `blockedStop` are both valid stop reasons now (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:21-30`), and tests assert `benchmarkPlateau` is accepted for `session_end` (`.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts:112-118`).
- I ruled out "insufficient sample is merely a benchmark helper detail": benchmark-stability tests explicitly treat insufficient samples as not stable (`.opencode/skill/sk-improve-agent/scripts/tests/benchmark-stability.vitest.ts:205-209`), and the fixture embeds that state into both the ledger and journal (`.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/agent-improvement-state.jsonl:2-3`, `.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl:4-7`).

## Sketched Diff (if any)

For `.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl`, current terminal event:

```json
{"timestamp":"2026-04-11T12:01:30Z","eventType":"session_end","details":{"stopReason":"converged","sessionOutcome":"keptBaseline","note":"Plateau stop requested by fixture brief; validator-accepted stopReason uses converged because benchmarkPlateau is not allowed."}}
```

Proposed direction if legal-stop evaluator lands:

```json
{"timestamp":"2026-04-11T12:01:25Z","eventType":"legal_stop_evaluated","details":{"gateResults":{"contractGate":{"passed":true},"behaviorGate":{"passed":true},"integrationGate":{"passed":true},"evidenceGate":{"passed":false,"failed":["repeatability-pass"],"reason":"insufficientSample"},"improvementGate":{"passed":false,"reason":"keep-baseline/no-positive-delta"}}}}
{"timestamp":"2026-04-11T12:01:26Z","eventType":"blocked_stop","details":{"failedGates":["evidenceGate","improvementGate"],"reason":"legal-stop gates failed"}}
{"timestamp":"2026-04-11T12:01:30Z","eventType":"session_end","details":{"stopReason":"blockedStop","sessionOutcome":"keptBaseline"}}
```

For `.opencode/skill/sk-improve-agent/scripts/tests/score-candidate.vitest.ts` as a new test file, proposed contract:

```ts
it('emits baseline delta and candidate-better only when the threshold is met', async () => {
  const result = runScoreCandidate({
    candidate: candidatePath,
    baseline: baselinePath,
    thresholdDelta: 2,
  });

  expect(result).toMatchObject({
    baselineScore: expect.any(Number),
    delta: expect.any(Number),
  });
  expect(result.recommendation).toBe(result.delta >= 2 ? 'candidate-better' : 'candidate-acceptable');
});
```

For `.opencode/skill/sk-improve-agent/scripts/tests/promote-candidate.vitest.ts` as a new test file, proposed contract:

```ts
it('rejects acceptable candidates that do not beat the baseline delta threshold', () => {
  const score = { recommendation: 'candidate-acceptable', delta: 1 };
  const result = runPromoteCandidate({ score, threshold: 2 });
  expect(result.exitCode).toBe(1);
  expect(result.stderr).toContain('recommendation is candidate-acceptable');
});
```

## Sketched Stress-Test Scenario (if any)

**CP-066 — SCORE_PROMOTE_DELTA_CONTRACT / no success-shaped keep-baseline**

| Field | Scenario |
| --- | --- |
| Purpose | Prove `/improve:agent` cannot turn a keep-baseline or below-threshold candidate into `converged`, and cannot promote unless baseline delta evidence exists. |
| Sandbox | `/tmp/cp-066-sandbox` plus `/tmp/cp-066-sandbox-baseline`, reset between Call A and Call B. |
| Fixture | Baseline scores 88; candidate scores 89 or records `recommendation:"keep-baseline"` with `insufficientSample`. Threshold is 2. |
| Call A | Generic improvement task may narrate "candidate is acceptable" or "baseline kept, converged." |
| Call B | Disciplined `/improve:agent` path with scorer, benchmark-stability, legal-stop evaluator, and promotion check wired. |
| PASS signals | `grep '"baselineScore"' score JSON or legal-stop artifact`; `grep '"delta":1'`; `grep '"recommendation":"keep-baseline"' agent-improvement-state.jsonl` for the fixture branch; `grep '"eventType":"blocked_stop"' improvement-journal.jsonl`; `grep '"failedGates".*"evidenceGate"'` or `grep '"failedGates".*"improvementGate"'`; no `grep '"stopReason":"converged"' improvement-journal.jsonl`; promotion exits non-zero when `candidate-better` or `delta>=2` is absent. |
| FAIL signals | `score-candidate.cjs --baseline` emits no delta; `session_end` says `converged` with insufficient sample; promotion relies on `candidate-acceptable`; `blocked_stop` is absent despite failed evidence/improvement gates. |

## Next Focus Suggestion

The loop can move to synthesis after this unless one more iteration is desired to inspect `promotion_rules.md` and current manual playbook references for stale `candidate-acceptable` versus `candidate-better` language. The implementation path is now clear: add legal-stop evaluation, refresh the low-sample fixture to block instead of converge, and add scorer/promoter contract tests.

## Convergence Assessment

This iteration added genuinely new value by locating a checked-in fixture that already contains insufficient evidence but still records `converged`, and by tying that fixture to the scorer/promoter delta mismatch left open in iteration 6. The new insight is that the next hardening can be test-first: convert the low-sample fixture and add scorer/promoter tests so legal-stop gates become executable instead of aspirational. `convergence_signal` is therefore `no`.
