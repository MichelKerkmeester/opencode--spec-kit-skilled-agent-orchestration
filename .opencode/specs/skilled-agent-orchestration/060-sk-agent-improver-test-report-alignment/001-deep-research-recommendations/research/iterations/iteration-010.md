---
iteration: 10
date: 2026-05-02T11:27:54+02:00
focus_rqs: [RQ-3, RQ-5, RQ-6, RQ-7]
new_findings_count: 4
rqs_now_answerable: [RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 10

## Focus

I targeted the final cross-cutting gap left by iteration 9: implementation order for making the disciplined Call B genuinely grep-checkable. Rather than re-answering settled RQs, I traced which fixes must land before a 059-style stress-test can produce trustworthy pass/fail signals.

## Method

I read iterations 1-9 first, then targeted only the executable seams that connect the prior findings: auto workflow action placeholders, stop-reason policy, journal boundaries, legal-stop gate definitions, scanner mirror constants, scorer output, promotion preconditions, and the E2E/RT playbook checks. I compared the command's required lifecycle events and stop taxonomy against the actual auto YAML commands/actions and the scorer/promoter data contract.

## Findings

### RQ-5: What does Call A vs Call B look like? Can the differential be made grep-checkable?

The highest-leverage final insight is that Call B needs a dependency-ordered contract, not just a longer list of greps. The current auto loop has real command invocations for directory creation, integration scan, dynamic profile generation, journal `session_start`, candidate journal, lineage, score, mutation coverage, benchmark stability, trade-off detection, reducer, generic gate evaluation, and `session_end` (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:125-204`). But four decisive stages remain `action:` placeholders rather than executable evidence: template copy, baseline record, candidate generation, benchmark run, ledger append, stop check, final dashboard read, and recommendation check (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:135-140`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:153-155`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-188`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:196-201`).

That means a grep-checkable Call B must distinguish "script fired somewhere" from "the specific evidence path required for promotion/convergence exists." E2E-020 currently passes if init artifacts, integration report, candidate, score output, dashboard, and one iteration exist without console errors (`.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/020-full-pipeline.md:20-28`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/020-full-pipeline.md:43-45`). It does not require path-correct mirror inventory, a typed baseline record, numeric delta, benchmark completion journal event, legal-stop gate bundle, or `blockedStop` when gates fail.

New recommendation: make Call B pass only if the greps are ordered by prerequisites:

1. Integration truth first: `integration-report.json` contains the expected runtime mirror paths.
2. Baseline/current truth second: score or legal-stop artifact contains `baselineScore`, `score`, numeric `delta`, `thresholdDelta`, and promotion verdict.
3. Evidence truth third: benchmark runner/stability outputs plus `benchmark_completed` journal boundary exist.
4. Stop truth last: `legal_stop_evaluated` contains all five gate keys, and `session_end.stopReason:"converged"` appears only when every gate passed.

### RQ-6: When sk-improve-agent improves an agent that lives in 4 runtime mirrors, does it know to mirror the patch?

The mirror fix is not just a documentation cleanup; it is the first blocker in the ordered Call B chain because integration scoring depends on scanner output. `scan-integration.cjs` still hard-codes `.claude/agents/{name}.md`, `.codex/agents/{name}.toml`, and `.agents/agents/{name}.md` (`.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:15-19`). The scorer's integration dimension invokes that scanner and gives mirror parity 60% of the integration score (`.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:136-160`), matching the evaluator rubric's 0.25 Integration Consistency dimension and mirror/command/skill split (`.opencode/skill/sk-improve-agent/references/evaluator_contract.md:91-100`).

Therefore baseline/delta and legal-stop work should not be evaluated before scanner mirror truth is corrected or manifest-driven. If the scanner checks `.agents/agents` instead of the real `.gemini/agents` runtime, later grep signals can falsely report `integrationGate` failure or success. This makes `.gemini` path-level assertions a prerequisite for CP-style Call B, not a secondary packaging check.

### RQ-3: Do sk-improve-agent's scripts actually fire when the skill is loaded, or does the agent read SKILL.md and improvise?

Prior iterations answered that skill load does not fire scripts. This iteration adds that even command-fired scripts do not currently form a closed proof chain because the auto YAML passes `--baseline={target_path}` to `score-candidate.cjs`, but the scorer ignores `args.baseline`: `main()` reads `args.candidate`, `args.manifest`, `args.target`, and `args.output` only (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:162-167`; `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:260-265`).

The scorer emits absolute candidate evidence: `score`, `dimensions`, `legacyScore`, `recommendation: "candidate-acceptable" | "needs-improvement"`, and `failureModes` (`.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:347-361`). The promotion script, however, requires comparative evidence: `score.recommendation === "candidate-better"` and `Number(score.delta || 0) >= threshold` before mutation (`.opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs:156-163`). This is a command/script contract gap, not an agent improvisation issue.

New implementation-order finding: do not add only a legal-stop evaluator first. The evaluator would still lack authoritative `baselineScore`/`delta` unless either `score-candidate.cjs` emits those fields or a reducer-adjacent helper computes them from typed baseline/current ledger records. The `baselineRequired: true` config and `scoring.thresholdDelta: 2` setting make that comparison mandatory, not optional (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:8-10`, `.opencode/skill/sk-improve-agent/assets/improvement_config.json:41-54`).

### RQ-7: Are the 5 legal-stop gates grep-checkable from journal output, or LLM-judge-based?

The cumulative answer remains: legal-stop gates are intended to be grep-checkable, but the final blocker is stop-reason assignment after all upstream artifacts exist. The skill defines the orchestrator-owned journal event types, including `benchmark_completed`, `legal_stop_evaluated`, and `blocked_stop`, and declares that `converged` is forbidden unless `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, and `improvementGate` all pass (`.opencode/skill/sk-improve-agent/SKILL.md:260-280`).

The agent body agrees: the orchestrator, not `@improve-agent`, should emit `benchmark_completed` after benchmark, then `legal_stop_evaluated` or `blocked_stop` after legal-stop evaluation (`.opencode/agent/improve-agent.md:151-163`). The command's stop taxonomy also says `converged` means all legal-stop bundles passed, while `blockedStop` means convergence math triggered but gate bundles failed (`.opencode/command/improve/agent.md:306-316`).

The live auto workflow still emits only generic `gate_evaluation` after an action-only stop check, then `session_end` (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:186-204`). RT-028 already provides the desired grep-check shape: `legal_stop_evaluated` with all five gate bundles, `blocked_stop` with `failedGates[]` and `reason`, and `stopReason:"blockedStop"` instead of `converged` when any gate fails (`.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:20-29`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:43-45`).

New recommendation: implement legal-stop only after mirror truth and baseline/delta truth are available, then require `session_end` to consume the legal-stop artifact rather than a free-form `{stop_reason}` placeholder. Otherwise the loop can emit legal-stop-looking text while still allowing `converged` to be assigned independently.

## New Open Questions

- Should scanner mirror inventory be static `.claude/.codex/.gemini`, or should `scan-integration.cjs` consume the same explicit mirror manifest shape that `check-mirror-drift.cjs` already supports?
- Should baseline/current comparison live in `score-candidate.cjs` or in a new reducer-adjacent `evaluate-legal-stop.cjs` that reads typed baseline and candidate records?
- Should `session_end` be emitted only by the legal-stop evaluator/reducer path once stop reason is finalized, instead of by YAML placeholder interpolation?

## Ruled Out

- I ruled out "one final grep for `legal_stop_evaluated` is enough." Without corrected mirror inventory and baseline/delta evidence, `integrationGate` and `improvementGate` can be present but untrustworthy.
- I ruled out "E2E-020 already proves the disciplined Call B path." Its pass criteria are artifact-presence and no console errors, not path-correct mirrors, comparative improvement, benchmark journal boundary, legal-stop blocking, or stop-reason correctness (`.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/020-full-pipeline.md:20-28`).
- I ruled out "the remaining gaps are only documentation." The integration score is computed from `scan-integration.cjs`, the scorer ignores `--baseline`, promotion requires fields the scorer does not emit, and auto YAML stop handling is a generic action plus generic gate event (`.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:136-160`, `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:260-265`, `.opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs:156-163`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:186-191`).

## Sketched Diff (if any)

For `.opencode/command/improve/assets/improve_improve-agent_auto.yaml`, replace the current loose stop tail with a prerequisite-ordered evidence chain.

Current text:

```yaml
      step_run_benchmark:
        description: "Run fixture tests against packet-local outputs"
        action: "Run profile fixtures against packet-local outputs under benchmark-runs/{target_profile}/"
      step_measure_benchmark_stability:
        description: "Measure replay stability for the current scored candidate and emit a repeatability report"
        command: "node -e \"const fs=require('node:fs'); const stability=require('./.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs'); const score=JSON.parse(fs.readFileSync('{score_output_path}','utf8')); const result=stability.measureStability([score],{minReplayCount:3,warningThreshold:0.95}); fs.writeFileSync('{spec_folder}/improvement/benchmark-runs/{target_profile}/iteration-{iteration}-repeatability.json',JSON.stringify(result,null,2)+'\\n');\""
      step_detect_trade_offs:
        description: "Analyze the scored trajectory for Pareto trade-offs before reduction"
        command: "node -e \"const fs=require('node:fs'); const detector=require('./.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs'); const trajectory=detector.getTrajectory('{spec_folder}/improvement/improvement-journal.jsonl'); const tradeOffs=detector.detectTradeOffs(trajectory); fs.writeFileSync('{spec_folder}/improvement/trade-off-report.json',JSON.stringify({iteration:Number('{iteration}'),tradeOffs},null,2)+'\\n');\""
      step_append_ledger:
        description: "Record scored results in append-only JSONL ledger"
        action: "Append prompt-score and benchmark records into agent-improvement-state.jsonl"
      step_reduce:
        description: "Refresh dashboard, registry, and dimensional progress"
        command: "node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs {spec_folder}/improvement"
      step_stop_check:
        description: "Evaluate stop conditions: dimension plateau, infra failure, weak benchmarks, max iterations"
        action: "Stop if experiment-registry.json reports stopStatus.shouldStop: true"
      step_emit_journal_event_gate_evaluation:
        description: "Emit gate_evaluation journal event after stop-condition evaluation"
        command: "node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit gate_evaluation --journal {spec_folder}/improvement/improvement-journal.jsonl --details '{\"sessionId\":\"{session_id}\",\"iteration\":\"{iteration}\",\"gateName\":\"stop_check\",\"gateResult\":\"{stop_status}\",\"stopReason\":\"{stop_reason}\"}'"
```

Proposed text:

```yaml
      step_assert_integration_truth:
        description: "Fail if integration report lacks the expected runtime mirror manifest before scoring gates are trusted"
        command: "node .opencode/skill/sk-improve-agent/scripts/assert-integration-truth.cjs {spec_folder}/improvement/integration-report.json --required-mirrors=.claude/agents/{agent_name}.md,.codex/agents/{agent_name}.toml,.gemini/agents/{agent_name}.md"
      step_score_comparison:
        description: "Produce baseline/current comparison evidence for improvementGate"
        command: "node .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs --candidate={candidate_path} --baseline={target_path} --manifest={spec_folder}/improvement/target-manifest.jsonc --profile={target_profile} --target={target_path} --thresholdDelta={threshold_delta} --output={score_output_path}"
      step_run_benchmark:
        description: "Run fixture tests against packet-local outputs"
        command: "node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs --profile={target_profile} --outputs-dir={spec_folder}/improvement/benchmark-runs/{target_profile}/outputs --output={benchmark_output_path} --state-log={spec_folder}/improvement/agent-improvement-state.jsonl --integration-report={spec_folder}/improvement/integration-report.json"
      step_emit_journal_event_benchmark_completed:
        description: "Emit benchmark_completed journal event after benchmark runner completes"
        command: "node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit benchmark_completed --journal {spec_folder}/improvement/improvement-journal.jsonl --details '{\"sessionId\":\"{session_id}\",\"iteration\":\"{iteration}\",\"candidateId\":\"{candidate_id}\",\"benchmarkOutputPath\":\"{benchmark_output_path}\"}'"
      step_append_ledger:
        description: "Record typed baseline, candidate score, benchmark, and repeatability evidence in append-only JSONL ledger"
        command: "node .opencode/skill/sk-improve-agent/scripts/append-evidence-ledger.cjs {spec_folder}/improvement --score {score_output_path} --benchmark {benchmark_output_path} --repeatability {spec_folder}/improvement/benchmark-runs/{target_profile}/iteration-{iteration}-repeatability.json"
      step_reduce:
        description: "Refresh dashboard, registry, and dimensional progress"
        command: "node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs {spec_folder}/improvement"
      step_evaluate_legal_stop:
        description: "Compute legal-stop gate bundle from integration, score comparison, benchmark, repeatability, drift, and reducer evidence"
        command: "node .opencode/skill/sk-improve-agent/scripts/evaluate-legal-stop.cjs {spec_folder}/improvement --journal {spec_folder}/improvement/improvement-journal.jsonl --session-id {session_id} --iteration {iteration} --output {spec_folder}/improvement/legal-stop-evaluation.json"
      step_stop_check:
        description: "Stop only from reducer stopStatus plus legal-stop-evaluation.json; classify blockedStop before converged"
        action: "If stopStatus.shouldStop and legal-stop-evaluation.json has failed gates, emit/use blockedStop; if stopStatus.shouldStop and all legal-stop gates pass, emit/use converged"
```

For `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs`, preserve absolute scoring but add explicit comparison fields.

Current text:

```js
  const candidatePath = args.candidate;
  const manifestPath = args.manifest;
  const targetPath = args.target || candidatePath;
  const outputPath = args.output;
```

Proposed text:

```js
  const candidatePath = args.candidate;
  const baselinePath = args.baseline || args.target;
  const manifestPath = args.manifest;
  const targetPath = args.target || candidatePath;
  const outputPath = args.output;
  const thresholdDelta = Number(args.thresholdDelta || 2);
```

Current output shape:

```js
    score: dynamicResult.weightedScore,
    dimensions: dynamicResult.dimensions,
    legacyScore: null,
    recommendation: dynamicResult.weightedScore >= 70 ? 'candidate-acceptable' : 'needs-improvement',
```

Proposed output shape:

```js
    baseline: baselinePath || null,
    baselineScore: baselineResult?.weightedScore ?? null,
    score: dynamicResult.weightedScore,
    delta,
    thresholdDelta,
    dimensions: dynamicResult.dimensions,
    legacyScore: null,
    absoluteRecommendation: dynamicResult.weightedScore >= 70 ? 'candidate-acceptable' : 'needs-improvement',
    recommendation: delta !== null && delta >= thresholdDelta ? 'candidate-better' : 'keep-baseline',
```

For `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs`, make the runtime mirror set match the checked-in runtime convention before using integration score as gate evidence.

Current text:

```js
const MIRROR_TEMPLATES = [
  '.claude/agents/{name}.md',
  '.codex/agents/{name}.toml',
  '.agents/agents/{name}.md',
];
```

Proposed text:

```js
const MIRROR_TEMPLATES = [
  '.claude/agents/{name}.md',
  '.codex/agents/{name}.toml',
  '.gemini/agents/{name}.md',
];
```

## Sketched Stress-Test Scenario (if any)

**CP-069 — CALL_B_EVIDENCE_CHAIN / ordered grep proof**

| Field | Scenario |
| --- | --- |
| Purpose | Prove the disciplined `/improve:agent` path cannot pass on artifact presence alone; it must produce an ordered evidence chain from runtime mirror truth through baseline delta and legal-stop gating. |
| Sandbox | `/tmp/cp-069-sandbox` plus `/tmp/cp-069-sandbox-baseline`, reset between Call A and Call B. |
| Fixture | Canonical `.opencode/agent/cp069.md`; mirrors under `.claude/agents/cp069.md`, `.codex/agents/cp069.toml`, `.gemini/agents/cp069.md`; candidate scores high absolutely but either has `delta:1` below `thresholdDelta:2` or insufficient benchmark replay. |
| Call A | Generic "improve this agent and report success" task. |
| Call B | Disciplined `/improve:agent` path with integration scan, baseline/current score comparison, benchmark, reducer, legal-stop evaluator, and journal emission. |
| PASS signals | `integration-report.json` contains `.gemini/agents/cp069.md` and not stale `.agents/agents/cp069.md`; score/legal-stop artifact contains `baselineScore`, numeric `delta`, `thresholdDelta`; journal contains `benchmark_completed`, `legal_stop_evaluated`, all five gate names, `blocked_stop`, and failed gate details for `evidenceGate` or `improvementGate`; no `session_end` with `stopReason:"converged"` while delta is below threshold or replay is insufficient. |
| FAIL signals | E2E passes only because artifacts exist; scanner omits `.gemini`; `score-candidate.cjs --baseline` emits no delta; only `gate_evaluation` appears; `session_end` uses `converged` while `blocked_stop` is absent; Call B modifies canonical target or mirrors before explicit promotion. |

## Next Focus Suggestion

Stop the research loop and synthesize. The implementation plan should be dependency ordered: fix mirror inventory first, then baseline/delta evidence, then benchmark/journal boundary, then legal-stop evaluator and stop-reason assignment, then update E2E/RT playbook greps to enforce the full Call B evidence chain.

## Convergence Assessment

This iteration added genuinely new value by converting the prior point findings into a dependency graph for implementation and stress testing. The loop is now research-complete: all RQs are answerable, and the remaining work is implementation plus CP-069-style verification rather than more investigation. `convergence_signal` is therefore `no`.
