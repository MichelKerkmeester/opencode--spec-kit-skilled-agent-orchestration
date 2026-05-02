---
iteration: 5
date: 2026-05-02T11:17:28.407+02:00
focus_rqs: [RQ-7, RQ-3, RQ-5]
new_findings_count: 4
rqs_now_answerable: [RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 5

## Focus

I targeted the highest-leverage gap left by iteration 4: not whether the five legal-stop gates should be grep-checkable, but which component should own producing the `gateResults` bundle. This primarily deepens RQ-7, with implications for RQ-3 script routing and RQ-5 Call B grep signals.

## Method

I read the four prior iteration files first, then avoided a full triad reread. I traced `reduce-state.cjs` around journal summary parsing, stop-status derivation, dashboard rendering, and main input/output wiring; then cross-checked the auto YAML stop-check step, command stop-reason definitions, the scorer/evaluator contracts, benchmark-stability helper, and RT-028's legal-stop scenario.

## Findings

### RQ-7: Are the 5 legal-stop gates grep-checkable from journal output, or LLM-judge-based?

The remaining ownership gap is now sharper: `reduce-state.cjs` is already the natural computation seam for legal-stop gates, but today it only consumes legal-stop events if someone else emits them. Its journal summary parser records `latestLegalStop.gateResults` for `legal_stop_evaluated` and `latestBlockedStop.failedGates` for `blocked_stop`, but it does not compute either object (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:173-238`). The dashboard likewise only renders whichever gate keys arrived in the journal summary (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:870-903`).

The reducer already has most of the inputs needed to compute the gate bundle itself. In `main()`, it reads `agent-improvement-state.jsonl`, builds the experiment registry, reads the improvement journal, candidate lineage, mutation coverage, config, and optional mirror drift report, then writes `experiment-registry.json` and `agent-improvement-dashboard.md` (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:1007-1035`). Its current `evaluateStopStatus()` derives `stopStatus.shouldStop` from trailing ties, infra failures, weak benchmark runs, mirror drift ambiguity, and dimension plateau (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:667-740`). That is convergence mechanics, not the legal-stop verdict.

RT-028 already defines the five gates in executable terms, which makes the gate bundle grep-checkable without an LLM judge: `contractGate` is structural >= 90 and systemFitness >= 90; `behaviorGate` is ruleCoherence >= 85 and outputQuality >= 85; `integrationGate` is integration >= 90 and no drift ambiguity; `evidenceGate` is benchmark pass and repeatability pass; `improvementGate` is weighted delta >= configured threshold (`.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:20-29`). The current scoring contract emits five named dimensions, score, recommendation, and failure modes (`.opencode/skill/sk-improve-agent/references/evaluator_contract.md:59-101`; `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:347-361`), while benchmark stability explicitly returns either `insufficientSample` or a `stable` boolean (`.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs:120-191`). The missing piece is a reducer-owned or reducer-adjacent function that combines those inputs into one journalable gate object.

Important caveat: `improvementGate` cannot be safely implemented inside `improvement-journal.cjs` alone. The config defines `scoring.thresholdDelta: 2` (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:41-54`), but the scorer output has only the candidate's weighted score and a `candidate-acceptable` recommendation at score >= 70, not a baseline score or delta (`.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:347-361`). The reducer can identify best prompt and benchmark records from the ledger (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:514-533`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:557-633`), so the gate computation should live after reduction, where baseline/current comparison and sample-quality context are available.

### RQ-3: Do sk-improve-agent's scripts actually fire when the skill is loaded, or does the agent read SKILL.md and improvise?

This iteration adds a script-routing recommendation rather than re-answering the already-settled "skill load does not fire scripts" question. The auto workflow currently runs `reduce-state.cjs`, then performs an action-only stop check against `experiment-registry.json` and emits a generic `gate_evaluation` event with `gateName: "stop_check"` (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:180-191`). The command body says `converged` means all legal-stop gate bundles passed and `blockedStop` means convergence math triggered but gate bundles failed (`.opencode/command/improve/agent.md:306-316`), yet no scripted step between reducer and `session_end` creates that bundle.

Therefore the concrete script-routing fix should be a new explicit helper invocation, not more prompt text. A `evaluate-legal-stop.cjs` (or a new `--emit-legal-stop` mode in `reduce-state.cjs`) should run immediately after `reduce-state.cjs`, write `legal-stop-evaluation.json`, and emit exactly one `legal_stop_evaluated` event plus `blocked_stop` when any gate fails. Keeping this out of `improvement-journal.cjs` preserves the journal helper's role as validator/emitter; the journal helper can still validate that all five gate keys are present, but it should not infer scores, deltas, benchmark pass, or drift ambiguity from distributed files.

### RQ-5: What does Call A vs Call B look like? Can the differential be made grep-checkable?

The Call B grep contract can now be more precise than earlier iterations' "journal has legal-stop keys" recommendation. A disciplined Call B should pass only if the transcript or generated artifacts show this sequence: `reduce-state.cjs` ran, a legal-stop evaluator ran after the reducer, `improvement-journal.jsonl` contains `legal_stop_evaluated` with all five gate keys, and `session_end.details.stopReason` is `blockedStop` when any gate failed or `converged` only when all five passed.

This differs from the current auto YAML path, where `step_stop_check` is an action against `experiment-registry.json`, followed by a generic `gate_evaluation`, then synthesis emits `session_end` (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:186-204`). A grep-checkable Call B should not accept `gate_evaluation` as a legal-stop proxy. It should require literal `legal_stop_evaluated`, `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, `improvementGate`, and conditionally `blocked_stop`/`failedGates`.

## New Open Questions

- Should the legal-stop evaluator be a new helper (`evaluate-legal-stop.cjs`) or an extension of `reduce-state.cjs` that writes and emits legal-stop outputs after `stopStatus`?
- What exact source should provide the baseline score for `improvementGate`: the first ledger record, an explicit baseline record, or `bestPromptRecord` before the current candidate?
- Should `evidenceGate` require both benchmark runner output and benchmark-stability replay output, or is one acceptable when the configured benchmark profile has no replay fixture?

## Ruled Out

- I ruled out "the journal helper should compute the gates." It validates event type and only special-cases `session_end/session_ended` stop fields today (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:49-110`); it does not have registry, config, benchmark, or mirror drift context.
- I ruled out "the reducer already computes legal-stop results." It reads and renders legal-stop journal events if present, but `evaluateStopStatus()` only computes convergence mechanics and returns `shouldStop`, reasons, drift ambiguity, and profile stop states (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:667-740`).
- I ruled out "generic `gate_evaluation` is enough for Call B." The command's own stop-reason taxonomy distinguishes legal gates passing from convergence math being blocked by failed gates (`.opencode/command/improve/agent.md:306-316`), while auto mode only emits a generic `stop_check` gate event (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:186-191`).

## Sketched Diff (if any)

For `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` after `step_reduce`, current text:

```yaml
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
      step_reduce:
        description: "Refresh dashboard, registry, and dimensional progress"
        command: "node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs {spec_folder}/improvement"
      step_evaluate_legal_stop:
        description: "Compute grep-checkable legal-stop gate bundle from reducer, config, benchmark, stability, and drift evidence"
        command: "node .opencode/skill/sk-improve-agent/scripts/evaluate-legal-stop.cjs {spec_folder}/improvement --output {spec_folder}/improvement/legal-stop-evaluation.json --journal {spec_folder}/improvement/improvement-journal.jsonl --session-id {session_id} --iteration {iteration}"
      step_stop_check:
        description: "Evaluate stop conditions: dimension plateau, infra failure, weak benchmarks, max iterations, and legal-stop gates"
        action: "Stop with blockedStop if experiment-registry.json reports stopStatus.shouldStop and legal-stop-evaluation.json has failed gates; stop with converged only when stopStatus.shouldStop and all legal-stop gates pass"
```

For `.opencode/skill/sk-improve-agent/scripts/evaluate-legal-stop.cjs` as a new helper, proposed core output shape:

```json
{
  "eventType": "legal_stop_evaluated",
  "gateResults": {
    "contractGate": { "passed": true, "signals": ["structural>=90", "systemFitness>=90"] },
    "behaviorGate": { "passed": true, "signals": ["ruleCoherence>=85", "outputQuality>=85"] },
    "integrationGate": { "passed": true, "signals": ["integration>=90", "noDriftAmbiguity"] },
    "evidenceGate": { "passed": false, "signals": ["benchmark-pass", "repeatability-pass"], "failed": ["repeatability-pass"] },
    "improvementGate": { "passed": true, "signals": ["weightedDelta>=thresholdDelta"] }
  },
  "failedGates": ["evidenceGate"],
  "stopReason": "blockedStop"
}
```

## Sketched Stress-Test Scenario (if any)

**CP-064 — LEGAL_STOP_OWNER / reducer-adjacent gate computation**

| Field | Scenario |
| --- | --- |
| Purpose | Prove legal-stop gates are computed from reducer/config/benchmark evidence, not improvised by prose or accepted as generic `gate_evaluation`. |
| Sandbox | `/tmp/cp-064-sandbox` plus `/tmp/cp-064-sandbox-baseline`, reset between Call A and Call B. |
| Fixture | A target candidate with dimensions high enough for `contractGate`, `behaviorGate`, and `integrationGate`, but benchmark stability returns `insufficientSample` so `evidenceGate` must fail. |
| Call A | Generic improvement task that may summarize success narratively. |
| Call B | Disciplined `/improve:agent` path for the same target and candidate, with the legal-stop evaluator wired after `reduce-state.cjs`. |
| PASS signals | Transcript contains `reduce-state.cjs` followed by `evaluate-legal-stop.cjs`; `legal-stop-evaluation.json` exists; journal contains `legal_stop_evaluated`, all five gate names, `blocked_stop`, and `failedGates` containing `evidenceGate`; no `session_end` uses `stopReason:"converged"` while `evidenceGate.passed:false`. |
| FAIL signals | Only `gate_evaluation` appears; gate keys appear only in dashboard/prose; `blocked_stop` lacks `failedGates`; `improvement-journal.cjs` emits `legal_stop_evaluated` with empty or partial `gateResults`; `session_end` says `converged` despite failed evidence gate. |

## Next Focus Suggestion

Iteration 6 can either move to synthesis or inspect the baseline/delta data path needed for `improvementGate`. If it continues, the narrow target should be ledger semantics: determine whether the first prompt-score record, an explicit baseline record, or candidate lineage should define the delta baseline.

## Convergence Assessment

This iteration added genuinely new value by assigning the legal-stop ownership seam instead of repeating that gate events are missing. The new recommendation is reducer-adjacent gate computation after `reduce-state.cjs`, with `improvement-journal.cjs` limited to validation/emission and Call B requiring a literal gate-bundle artifact plus journal events. `convergence_signal` is therefore `no`.
