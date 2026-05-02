---
iteration: 4
date: 2026-05-02T09:16:38Z
focus_rqs: [RQ-1, RQ-3, RQ-7]
new_findings_count: 4
rqs_now_answerable: [RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 4

## Focus

I targeted the highest-leverage remaining gap from iterations 1-3: the split between documented runtime-truth/manual checks and executable enforcement. The narrow question was whether legal-stop and benchmark boundaries are only described as grep-checkable, or whether the helper tests and YAML actually force the stronger events.

## Method

I read all three prior iteration files, then avoided rereading the full triad. I targeted `improvement-journal.cjs`, its Vitest coverage, runtime-truth playbook scenarios RT-028/RT-032, the manual playbook root cross-reference, and the auto/confirm YAML sections that emit journal events and benchmark actions. I also grepped `scripts/tests/` for `legal_stop_evaluated`, `blocked_stop`, `gateResults`, and `failedGates`; there were no matches, so I verified the absence against the test cross-reference and the existing journal test contents.

## Findings

### RQ-7: Are the 5 legal-stop gates grep-checkable from journal output, or LLM-judge-based?

The intended RT-028 contract is grep-checkable, but the executable test layer does not currently lock it down. RT-028 requires a `legal_stop_evaluated` event with `details.gateResults` containing all five gate bundles, and a `blocked_stop` event with `details.failedGates[]` when any gate fails (`.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:20-29`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:43-45`). That is stronger than an LLM judge: the verification code literally filters journal JSON events and checks gate-key presence (`028-legal-stop-gates.md:45`).

The new gap is that the automated regression cross-reference omits RT-028. The root playbook maps `improvement-journal.vitest.ts` to RT-025, RT-026, and RT-032, but not RT-028 (`.opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md:592-603`). The journal unit test validates frozen stop reasons/outcomes and generic event acceptance, but its explicit event-type assertions only check a sample including `session_start`, `candidate_generated`, `candidate_scored`, `session_ended`, and `trade_off_detected` (`.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts:61-68`), then validates `session_ended/session_end` stop reason and outcome fields (`improvement-journal.vitest.ts:90-118`). It does not assert that `legal_stop_evaluated` must contain all five gate keys, nor that `blocked_stop` must contain failed-gate details.

The helper itself explains why the current tests pass despite the stronger policy gap: `VALID_EVENT_TYPES` includes `legal_stop_evaluated` and `blocked_stop` (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:49-69`), but `validateEvent()` only applies schema validation to `session_ended` and `session_end` details (`improvement-journal.cjs:80-107`). Therefore `legal_stop_evaluated` is a valid event name, not a validated legal-stop bundle.

### RQ-3: Do sk-improve-agent's scripts actually fire when the skill is loaded, or does the agent read SKILL.md and improvise?

Iterations 1-3 already answered that skill load does not fire scripts. This pass adds a boundary-specific variant: even within the command-owned YAML, some advertised journal and benchmark boundaries are actions or weaker events rather than helper invocations.

The agent contract says the orchestrator emits `benchmark_completed` after benchmark, then emits `legal_stop_evaluated` or `blocked_stop` after legal-stop evaluation (`.opencode/agent/improve-agent.md:153-163`). The auto YAML does score and candidate journal events, but benchmark execution is an `action` placeholder, not a `run-benchmark.cjs` command, and repeatability is measured from a single score JSON via an inline `benchmark-stability.cjs` call (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-176`). The same pattern appears in confirm mode (`.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:202-207`).

The benchmark runner itself can append a `benchmark_run` record to a state log if `--state-log` is provided (`.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:257-269`), but that is not the improvement journal's `benchmark_completed` event. The journal helper recognizes `benchmark_completed` as a valid event type (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:49-58`), yet the inspected YAML sections do not emit it before the stop gate (`improve_improve-agent_auto.yaml:171-191`, `improve_improve-agent_confirm.yaml:202-228`). This makes a grep-only stress test possible: require `benchmark_completed` in `improvement-journal.jsonl`, not just `benchmark-runs/.../repeatability.json`.

### RQ-1: Does sk-improve-agent have an analog of "stress-test the failure paths"?

The manual playbook is closer to a failure-path campaign than earlier iterations emphasized, but it is still not the 059 analog because release readiness is manual and scenario-level rather than same-task A/B enforced. The root playbook says every scenario must be executed for real, not mocked or called "unautomatable" (`.opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md:6-9`), and release is only READY when RT-025..RT-034 have been executed or skipped with a sandbox blocker and all 31 features are covered (`manual_testing_playbook.md:117-125`). That is a serious operator contract.

However, RT-032 currently codifies the weaker journal boundary that previous iterations flagged: it expects `gate_evaluation` inside each iteration and `session_end` after synthesis, not `legal_stop_evaluated`/`blocked_stop` as the legal-stop proof (`.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md:20-29`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md:43-45`). This creates a cross-playbook contradiction: RT-028 needs the five-gate legal-stop event, while RT-032's "boundary coverage" pass can succeed with only generic `gate_evaluation`.

The improvement recommendation is not merely "add stress tests"; it is "promote RT-028 from manual prose to automated boundary validation, and make RT-032 depend on the stronger RT-028 event." That would turn the current manual runtime-truth checklist into a 059-style grep-checkable failure-path gate.

## New Open Questions

- Should `benchmark_completed` be emitted by the YAML immediately after `run-benchmark.cjs`, or should `run-benchmark.cjs` itself gain an optional `--journal` parameter so the benchmark boundary has a single writer?
- Should RT-032 keep accepting generic `gate_evaluation`, or should it be split into two checks: lifecycle coverage (`gate_evaluation`) and legal-stop coverage (`legal_stop_evaluated`/`blocked_stop`)?
- Should `improvement-journal.vitest.ts` own legal-stop schema validation, or should a new `legal-stop-evaluator.cjs` produce and validate the five-gate bundle before journal emission?

## Ruled Out

- I ruled out "RT-028 is LLM-judge-based": its verification reads `improvement-journal.jsonl` and checks event fields directly (`.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:43-45`).
- I ruled out "the journal helper already validates the five legal-stop gates": `validateEvent()` only special-cases `session_ended/session_end`, not `legal_stop_evaluated` or `blocked_stop` (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:80-107`).
- I ruled out "benchmark boundary evidence is already a journal event": `run-benchmark.cjs` appends `type: "benchmark_run"` to an optional state log (`.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:257-269`), while the command YAML uses an action placeholder and a repeatability file rather than a `benchmark_completed` journal emission (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-176`).

## Sketched Diff (if any)

For `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs` at `validateEvent(event)`, current text:

```js
  if (event.eventType === 'session_ended' || event.eventType === 'session_end') {
    if (!event.details || !event.details.stopReason) {
      errors.push('session_ended/session_end events MUST include details.stopReason');
    } else if (!Object.values(STOP_REASONS).includes(event.details.stopReason)) {
      errors.push(`Invalid stopReason: "${event.details.stopReason}". Valid reasons: ${Object.values(STOP_REASONS).join(', ')}`);
    }
    if (!event.details || !event.details.sessionOutcome) {
      errors.push('session_ended/session_end events MUST include details.sessionOutcome');
    } else if (!Object.values(SESSION_OUTCOMES).includes(event.details.sessionOutcome)) {
      errors.push(`Invalid sessionOutcome: "${event.details.sessionOutcome}". Valid outcomes: ${Object.values(SESSION_OUTCOMES).join(', ')}`);
    }
  }
```

Proposed addition immediately after that block:

```js
  if (event.eventType === 'legal_stop_evaluated') {
    const gates = event.details?.gateResults;
    for (const gate of ['contractGate', 'behaviorGate', 'integrationGate', 'evidenceGate', 'improvementGate']) {
      if (!gates || !(gate in gates)) {
        errors.push(`legal_stop_evaluated events MUST include details.gateResults.${gate}`);
      }
    }
  }

  if (event.eventType === 'blocked_stop') {
    const failedGates = event.details?.failedGates;
    if (!Array.isArray(failedGates) || failedGates.length === 0) {
      errors.push('blocked_stop events MUST include non-empty details.failedGates');
    }
    if (!event.details?.reason) {
      errors.push('blocked_stop events MUST include details.reason');
    }
  }
```

For `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` at `step_run_benchmark`, current text:

```yaml
step_run_benchmark:
  description: "Run fixture tests against packet-local outputs"
  action: "Run profile fixtures against packet-local outputs under benchmark-runs/{target_profile}/"
```

Proposed text:

```yaml
step_run_benchmark:
  description: "Run fixture tests against packet-local outputs"
  command: "node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs --profile={target_profile} --outputs-dir={spec_folder}/improvement/benchmark-runs/{target_profile}/outputs --output={benchmark_output_path} --state-log={spec_folder}/improvement/agent-improvement-state.jsonl --integration-report={spec_folder}/improvement/integration-report.json"
step_emit_journal_event_benchmark_completed:
  description: "Emit benchmark_completed journal event after benchmark runner completes"
  command: "node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit benchmark_completed --journal {spec_folder}/improvement/improvement-journal.jsonl --details '{\"sessionId\":\"{session_id}\",\"iteration\":\"{iteration}\",\"candidateId\":\"{candidate_id}\",\"benchmarkOutputPath\":\"{benchmark_output_path}\"}'"
```

For `.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts`, add one test block:

```ts
it('rejects incomplete legal-stop events', () => {
  const invalid = journal.validateEvent({
    eventType: 'legal_stop_evaluated',
    details: { gateResults: { contractGate: true } },
  });
  expect(invalid.valid).toBe(false);

  const valid = journal.validateEvent({
    eventType: 'legal_stop_evaluated',
    details: {
      gateResults: {
        contractGate: true,
        behaviorGate: true,
        integrationGate: true,
        evidenceGate: true,
        improvementGate: true,
      },
    },
  });
  expect(valid.valid).toBe(true);
});
```

## Sketched Stress-Test Scenario (if any)

**CP-063 — RT_PLAYBOOK_TO_AUTOMATION / runtime-truth legal-stop enforcement**

| Field | Scenario |
| --- | --- |
| Purpose | Prove the runtime-truth playbook cannot pass on generic `gate_evaluation` while legal-stop events are absent or under-specified. |
| Sandbox | `/tmp/cp-063-sandbox` plus `/tmp/cp-063-sandbox-baseline`, reset between Call A and Call B. |
| Fixture | A target candidate that scores structurally high but fails `evidenceGate` due to insufficient benchmark sample or unstable repeatability. |
| Call A | Generic improvement task allowed to summarize success narratively. |
| Call B | Disciplined `/improve:agent` path for one or more iterations, with the same candidate and spec folder. |
| PASS signals | `grep '"eventType":"legal_stop_evaluated"' improvement-journal.jsonl`; greps for `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, `improvementGate`; `grep '"eventType":"blocked_stop"' improvement-journal.jsonl`; `grep '"failedGates".*"evidenceGate"' improvement-journal.jsonl`; no `session_end` with `stopReason:"converged"` while failed gates are present. |
| FAIL signals | RT-032-style generic `gate_evaluation` appears but no `legal_stop_evaluated`; `blocked_stop` has no `failedGates`; benchmark repeatability file shows insufficient sample but journal still converges. |

## Next Focus Suggestion

Iteration 5 should either move to synthesis or inspect the reducer's stop-status derivation (`reduce-state.cjs`) to decide where the five gate booleans should be computed. The remaining unknown is not whether legal-stop evidence is needed, but which component should own producing the grep-checkable `gateResults` bundle.

## Convergence Assessment

This iteration added genuinely new value by connecting the prior legal-stop/YAML findings to the manual playbook's automated cross-reference and to the missing `benchmark_completed` boundary. The main new insight is that RT-028 already specifies the desired grep-checkable legal-stop contract, but the automated tests and RT-032 boundary check currently validate weaker journal behavior. `convergence_signal` is therefore `no`.
