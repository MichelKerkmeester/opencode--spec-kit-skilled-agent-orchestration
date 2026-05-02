---
iteration: 6
date: 2026-05-02T11:19:19.385+02:00
focus_rqs: [RQ-7, RQ-3, RQ-5]
new_findings_count: 4
rqs_now_answerable: [RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 6

## Focus

I targeted the gap left by iteration 5: the baseline/delta data path needed for the `improvementGate`. All RQs are broadly answerable from cumulative evidence, so this pass focused on whether the strongest recommended fix can actually compute "weighted delta >= thresholdDelta" from current artifacts.

## Method

I read iterations 1-5 first, then traced only the reducer, scorer, lineage, promotion, config, and YAML baseline surfaces. I grepped for `baseline`, `thresholdDelta`, `delta`, `candidate-better`, `keep-baseline`, and `tie`, then inspected the exact lines where baseline recording, scoring, ledger append, promotion checks, and reducer best-record selection happen.

## Findings

### RQ-7: Are the 5 legal-stop gates grep-checkable from journal output, or LLM-judge-based?

Iterations 1-5 already established that legal-stop should be grep-checkable JSON, not LLM judging. The new finding is that one of the five gates, `improvementGate`, currently has no reliable executable data source: the config requires `baselineRequired: true` and sets `scoring.thresholdDelta` to `2` (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:8-11`, `.opencode/skill/sk-improve-agent/assets/improvement_config.json:41-54`), but the runtime path records baseline as an action placeholder, not a concrete command or typed schema (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:138-140`, `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:161-163`).

The scorer is not currently the delta source. Both YAML workflows call `score-candidate.cjs` with `--baseline={target_path}` (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:162-167`, `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:193-198`), but the scorer's main path reads `args.candidate`, `args.manifest`, `args.target`, and `args.output`; it does not read `args.baseline` (`.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:260-265`). Its emitted result includes `score`, `dimensions`, `recommendation: "candidate-acceptable" | "needs-improvement"`, and `failureModes`, but no `baselineScore`, `delta`, or `candidate-better` recommendation (`.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:347-361`).

That creates a concrete contract break with promotion and legal-stop semantics. `promote-candidate.cjs` refuses promotion unless `score.recommendation === "candidate-better"` and `Number(score.delta || 0) >= threshold` (`.opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs:156-163`), then reports the same `delta` and `threshold` in its result (`.opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs:180-185`). Since the scorer does not emit either `candidate-better` or `delta`, the promotion gate and any future `improvementGate` computation cannot be satisfied by the current scorer output alone.

### RQ-3: Do sk-improve-agent's scripts actually fire when the skill is loaded, or does the agent read SKILL.md and improvise?

The iteration-6 addition is that even command-owned script execution leaves the baseline/delta step under-specified. The loop protocol says init records the baseline candidate in `agent-improvement-state.jsonl`, score/benchmark records baseline/candidate/benchmark/rejected/accepted/infra-failure events, and reduce/decide continues only if the score delta is meaningful (`.opencode/skill/sk-improve-agent/references/loop_protocol.md:31-40`, `.opencode/skill/sk-improve-agent/references/loop_protocol.md:53-71`). The YAML, however, uses action placeholders for both baseline record and ledger append (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:138-140`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:180-185`; `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:161-163`, `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:211-216`).

The reducer can rank best prompt records, but it does not preserve a canonical baseline-vs-current relation. It chooses `bestPromptRecord` by the highest `record.score` or `record.totals.candidate` and stores candidate records into accepted/rejected buckets by `recommendation` (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:514-522`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:616-633`). That is useful for dashboards, but it cannot answer "did the current candidate beat the baseline by thresholdDelta?" unless a separate typed baseline record and current-candidate record schema already exist.

Candidate lineage also cannot fill the gap as currently wired. The helper can record arbitrary candidate metadata and its doc comment allows `scores?` (`.opencode/skill/sk-improve-agent/scripts/candidate-lineage.cjs:47-52`), but the YAML invocation records only `candidateId`, `sessionId`, `waveIndex`, `mutationType`, `parentCandidateId`, and `iteration` (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:159-161`, `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:190-192`). Therefore lineage is derivation evidence, not score-delta evidence.

### RQ-5: What does Call A (baseline) vs Call B (sk-improve-agent-disciplined) look like? Can the differential be made grep-checkable?

Earlier iterations proposed Call B greps for `legal_stop_evaluated` plus five gate names. This iteration tightens the Call B contract: it must also prove the `improvementGate` was computed from explicit baseline/current score evidence, not inferred from a single candidate score.

A disciplined Call B should be considered grep-checkable only if it leaves these artifacts/signals:

| Signal | Why it matters |
| --- | --- |
| `agent-improvement-state.jsonl` contains a typed `baseline` record with `score` and five dimensions | Baseline cannot remain a YAML action placeholder. |
| Candidate score JSON contains `baselineScore`, `delta`, and `recommendation:"candidate-better"` or an evaluator artifact computes those fields | `promote-candidate.cjs` already requires `candidate-better` and `delta` (`.opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs:156-163`). |
| `legal-stop-evaluation.json` or journal `legal_stop_evaluated` contains `improvementGate` with `weightedDelta>=thresholdDelta` evidence | Ties the stop gate to config `thresholdDelta` (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:41-54`). |
| `session_end.details.stopReason:"converged"` appears only when `improvementGate.passed:true`; otherwise `blockedStop` | Matches the command taxonomy (`.opencode/command/improve/agent.md:306-316`). |

One existing fixture illustrates why this matters. The low-sample benchmark fixture records candidate iteration 2 as `recommendation:"keep-baseline"` (`.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/agent-improvement-state.jsonl:3`) and a gate decision of `keep-baseline` (`.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl:7`), yet its session end uses `stopReason:"converged"` with `sessionOutcome:"keptBaseline"` (`.opencode/skill/sk-improve-agent/scripts/tests/fixtures/low-sample-benchmark/improvement-journal.jsonl:8`). The journal enum now supports `blockedStop` (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:21-29`), so a future Call B should reject this shape as a legal-stop pass when `improvementGate` or `evidenceGate` fails.

## New Open Questions

- Should `score-candidate.cjs` own baseline comparison by reading `--baseline`, or should `evaluate-legal-stop.cjs` compute `baselineScore`, `candidateScore`, and `delta` from ledger records?
- What exact ledger schema should a baseline record use: `type:"baseline"` with 5D dimensions, or `type:"candidate_iteration"` with `candidateId:"baseline"`?
- Should `candidate-acceptable` remain a scoring recommendation while `candidate-better` is only a promotion/legal-stop recommendation, or should the scorer emit both?

## Ruled Out

- I ruled out "the scorer already computes delta from `--baseline`." The YAML passes `--baseline`, but the scorer main path does not read `args.baseline` and emits no `delta` (`.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:260-265`, `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:347-361`).
- I ruled out "the reducer's bestPromptRecord is enough for improvementGate." It identifies the highest score, not a typed baseline/current delta comparison (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:514-522`).
- I ruled out "promotion_rules.md accurately reflects the executable promotion script." The reference says promotion enforces `candidate-acceptable` scoring above `thresholdDelta` (`.opencode/skill/sk-improve-agent/references/promotion_rules.md:35-39`), while the script requires `candidate-better` and `score.delta` above threshold (`.opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs:156-163`).

## Sketched Diff (if any)

For `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs` around `main()`, current text:

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
```

For the dynamic result output, current text:

```js
  const result = {
    status: 'scored',
    profileId: resolvedProfileId,
    family: family || profile.family,
    evaluationMode: 'dynamic-5d',
    target: targetPath,
    candidate: candidatePath,
    score: dynamicResult.weightedScore,
    dimensions: dynamicResult.dimensions,
    legacyScore: null,
    recommendation: dynamicResult.weightedScore >= 70 ? 'candidate-acceptable' : 'needs-improvement',
    failureModes: dynamicResult.dimensions
      .filter((d) => d.score < 60)
      .map((d) => `weak-${d.name}`),
  };
```

Proposed direction:

```js
  const baselineResult = baselinePath
    ? scoreDynamic(safeRead(baselinePath), agentName, profile, weightsOverride)
    : null;
  const delta = baselineResult ? dynamicResult.weightedScore - baselineResult.weightedScore : null;
  const threshold = Number(args.thresholdDelta || 2);
  const recommendation =
    delta !== null && delta >= threshold
      ? 'candidate-better'
      : dynamicResult.weightedScore >= 70
        ? 'candidate-acceptable'
        : 'needs-improvement';

  const result = {
    status: 'scored',
    profileId: resolvedProfileId,
    family: family || profile.family,
    evaluationMode: 'dynamic-5d',
    target: targetPath,
    baseline: baselinePath || null,
    candidate: candidatePath,
    baselineScore: baselineResult?.weightedScore ?? null,
    score: dynamicResult.weightedScore,
    delta,
    dimensions: dynamicResult.dimensions,
    legacyScore: null,
    recommendation,
    failureModes: dynamicResult.dimensions
      .filter((d) => d.score < 60)
      .map((d) => `weak-${d.name}`),
  };
```

For `.opencode/command/improve/assets/improve_improve-agent_auto.yaml`, current text:

```yaml
      step_record_baseline:
        description: "Record baseline candidate state in append-only ledger"
        action: "Append a baseline record for {target_path} into agent-improvement-state.jsonl"
```

Proposed text:

```yaml
      step_record_baseline:
        description: "Score and record the canonical target baseline in the append-only ledger"
        command: "node .opencode/skill/sk-improve-agent/scripts/score-candidate.cjs --candidate={target_path} --target={target_path} --manifest={spec_folder}/improvement/target-manifest.jsonc --profile={target_profile} --output={spec_folder}/improvement/baseline-score.json && node -e \"const fs=require('node:fs'); const score=JSON.parse(fs.readFileSync('{spec_folder}/improvement/baseline-score.json','utf8')); fs.appendFileSync('{spec_folder}/improvement/agent-improvement-state.jsonl',JSON.stringify({type:'baseline',sessionId:'{session_id}',target:'{target_path}',score:score.score,dimensions:score.dimensions,recommendation:'baseline'})+'\\n');\""
```

## Sketched Stress-Test Scenario (if any)

**CP-065 — IMPROVEMENT_GATE_DELTA / baseline-vs-current grep proof**

| Field | Scenario |
| --- | --- |
| Purpose | Prove `improvementGate` is based on an explicit score delta, not a single candidate score or narrative "better" claim. |
| Sandbox | `/tmp/cp-065-sandbox` plus `/tmp/cp-065-sandbox-baseline`, reset between Call A and Call B. |
| Fixture | Canonical target scores 88; candidate scores 89 with acceptable structure but delta 1 below `thresholdDelta:2`. |
| Call A | Generic improvement task may call the candidate "better" because it is cleaner. |
| Call B | Disciplined `/improve:agent` path with baseline scoring and legal-stop evaluator wired. |
| PASS signals | `grep '"type":"baseline"' agent-improvement-state.jsonl`; `grep '"baselineScore":88' score JSON or legal-stop artifact`; `grep '"delta":1'`; `grep '"improvementGate".*"passed":false'`; `grep '"eventType":"blocked_stop"' improvement-journal.jsonl`; no `session_end` with `stopReason:"converged"`. |
| FAIL signals | Candidate score >= 70 is treated as `candidate-better`; `score.delta` is absent; `improvementGate` passes without baseline evidence; `converged` is emitted while delta is below threshold. |

## Next Focus Suggestion

Iteration 7 can move toward synthesis unless it wants one more executable seam check: inspect tests for `promote-candidate.cjs` and `score-candidate.cjs` to see whether the `candidate-better`/`delta` mismatch is already covered, skipped, or silently absent.

## Convergence Assessment

This iteration added genuinely new value by moving from "legal-stop gates need an owner" to "one legal-stop gate cannot be computed correctly until baseline/delta semantics are made executable." The specific new recommendation is to turn baseline recording from an action placeholder into a typed score artifact and make `candidate-better`/`delta` available before promotion or `improvementGate` evaluation. `convergence_signal` is therefore `no`.
