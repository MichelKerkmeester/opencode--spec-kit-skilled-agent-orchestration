---
iteration: 8
date: 2026-05-02T13:39:00+02:00
focus_rqs: [RQ-1, RQ-3, RQ-5, RQ-6, RQ-7]
new_findings_count: 5
rqs_now_answerable: [RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 8

## Focus

This iteration followed iteration 7's suggestion to stop broadening and instead produce the missing 064 handoff checklist. The new value is a lockstep diff map: which command/skill/helper/test seams must change together before any GREEN command-flow stress verdict is honest.

## Method

I treated iterations 1-7 as baseline and did not re-prove the layer-selection finding. I targeted only files that determine downstream implementation readiness: auto and confirm YAML, benchmark runner/profile generator, reducer/journal consumers, SKILL/command documentation, and sk-improve-agent's native runtime-truth playbook/tests.

## Findings

### RQ-1/RQ-3: 064 must patch auto and confirm YAML in lockstep, even if 063 Call B is auto-only

Prior iterations correctly focused 063's Call B on `/improve:agent ... :auto`, but the implementation handoff should not patch only the auto workflow. Both YAMLs declare the same helper script surface and state paths: auto lists scanner/profiler/scorer/benchmark/journal/reducer at `skill_reference.scripts` and writes runtime artifacts under `{spec_folder}/improvement` [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:87-110`]; confirm mirrors the same script keys and state paths [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:93-115`].

The two known executable defects are duplicated. Auto leaves `step_run_benchmark` as an `action` placeholder and emits `benchmark_completed` as if `{benchmark_output_path}` already exists [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-176`]. Confirm has the same placeholder/event pattern [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:202-207`]. Auto emits `legal_stop_evaluated` with flat gate fields [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:192-198`], and confirm does the same plus `gateDecision` [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:229-235`].

Therefore 064 should define one workflow contract and apply it to both mode files:

```text
1. Materialize candidate benchmark outputs.
2. Invoke run-benchmark.cjs with explicit --profile, --profiles-dir, --outputs-dir, --output, --state-log, --label, and --integration-report.
3. Emit benchmark_completed only after the report exists.
4. Emit legal_stop_evaluated.details.gateResults.{contractGate,behaviorGate,integrationGate,evidenceGate,improvementGate}.
5. Keep confirm's operator gate as an extra detail, not as a shape fork.
```

If 064 intentionally limits scope to auto, its spec should explicitly defer confirm parity; otherwise future confirm-mode tests will rediscover the same bug.

### RQ-3: Benchmark GREEN requires a materialization producer, not just wiring `run-benchmark.cjs`

Iteration 5 established that `--outputs-dir` must be a directory of fixture outputs. The missing implementation detail is that 064 needs a named producer for those files. `run-benchmark.cjs` returns `missing-output` when `{outputsDir}/{fixture.id}.md` is absent [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:63-75`]. Its main path loads profile fixtures and scores `path.join(outputsDir, `${fixture.id}.md`)` for every fixture [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:217-224`], then writes a `status: "benchmark-complete"` report and optionally appends a `type: "benchmark_run"` row to state [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:231-269`].

Dynamic profiles cannot be the benchmark producer by themselves: `generate-profile.cjs` emits `benchmark.fixtureDir: null` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/generate-profile.cjs:218-237`]. So 064 needs one of two explicit designs:

```text
Option A: packet-local benchmark assets
  - profile JSON with a real benchmark.fixtureDir
  - fixture JSON files
  - candidate materializer that copies/renders candidate markdown to {outputsDir}/{fixture.id}.md

Option B: static skill benchmark assets
  - checked-in profile/fixtures under the skill asset tree
  - workflow materializer step that maps the current candidate to each fixture output
```

Without that materializer, a command-flow run can truthfully invoke `run-benchmark.cjs` and still fail for `missing-output`; that should be expected RED/PARTIAL, not GREEN.

### RQ-6/RQ-3: Stop-reason enum truth is currently split between SKILL docs and helper/tests

Prior iterations noted event vocabulary drift; this pass found a sharper stop-reason drift that should be a standalone 064 acceptance item. The helper actually exports `benchmarkPlateau` and `plateau` in addition to `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, and `stuckRecovery` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:21-30`]. Its tests assert `plateau` and `benchmarkPlateau` are accepted on `session_ended` / `session_end` events [SOURCE: `.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts:104-118`].

The SKILL doc says the frozen helper enum excludes those labels and explicitly says labels such as `benchmarkPlateau` are not accepted by the current CLI validator [SOURCE: `.opencode/skill/sk-improve-agent/SKILL.md:351-358`]. That is not just documentation drift: a stress-test rubric that grades stop semantics from the SKILL doc alone will reject events that the helper and tests currently accept.

064 should choose one source of truth before GREEN verdicts:

```text
Strict option:
  remove benchmarkPlateau/plateau from helper and tests, then require SKILL enum exactly.

Compatibility option:
  document benchmarkPlateau/plateau as accepted compatibility stop reasons, then update SKILL/command docs and verdict greps accordingly.
```

Until that decision lands, 063 should not use stop-reason enum mismatch as a model failure; it is a system contract conflict.

### RQ-5/RQ-7: The native sk-improve-agent playbook is a useful cross-check that 060/001 did not require

R1 surfaced wrong-layer tests in the cli-copilot playbook, but there is also a cross-playbook consistency gap. The sk-improve-agent native runtime-truth playbook already has RT-028 expecting `legal_stop_evaluated` with `gateResults` containing all five gate bundles [SOURCE: `.opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md:500-508`]. That expectation matches the reducer consumer, which reads only `details.gateResults` for `legal_stop_evaluated` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`], but it conflicts with both YAML producers' current flat gate fields [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:192-198`, `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:229-235`].

The same playbook has RT-032 for journal wiring boundary coverage, but the root entry is currently weak/truncated: it says to verify `improvement-journal.cjs` emission steps for boundaries, then leaves the expected-signal list effectively unfinished after the colon [SOURCE: `.opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md:551-560`]. That means 064 should not only repair cli-copilot CP-040..CP-045; it should also reconcile sk-improve-agent's native RT scenarios so the system has one consistent internal oracle.

Add this to the reusable layer-selection template:

```text
Cross-playbook oracle check:
  - Does the agent/skill under test already have native RT/manual scenarios for this behavior?
  - Do cli-copilot CP expectations match those native RT expectations?
  - If they disagree, fix or mark one oracle expected-RED before running external A/B tests.
```

This is the piece 060/001 missed: it identified command-flow evidence needs, but did not require comparing the external cli-copilot stress contract against sk-improve-agent's own runtime-truth contract.

### RQ-1/RQ-6: Event-name acceptance is too broad to be a GREEN proof without structured shape assertions

The journal helper accepts both legacy and newer event names: `gate_evaluation`, `legal_stop_evaluated`, `blocked_stop`, `session_ended`, and `session_end` are all valid event types [SOURCE: `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:49-69`]. The command doc's Step 6B still says iteration boundaries use `gate_evaluation` after stop-check or operator-gate evaluation [SOURCE: `.opencode/command/improve/agent.md:288-303`]. The SKILL doc simultaneously requires legal-stop-specific events and all five gates before `session_end` [SOURCE: `.opencode/skill/sk-improve-agent/SKILL.md:279-292`], but its boundary table still describes `gate_evaluation` as the per-iteration event and says auto/confirm emit `gate_evaluation` inside each loop [SOURCE: `.opencode/skill/sk-improve-agent/SKILL.md:343-364`].

That means 063's grep contract should treat event-name presence as necessary but insufficient. GREEN proof must assert the structured consumer shape:

```text
legal_stop_evaluated exists
AND details.gateResults has all five gate keys
AND reduce-state output preserves latestLegalStop.gateResults
AND session_end.stopReason/sessionOutcome use the chosen helper enum truth
```

This is a rubric refinement: "ordered artifact/journal truth" must include structured consumer shape, not only ordered labels.

## New Open Questions

1. Should 064 patch confirm parity immediately, or explicitly defer confirm-mode workflow parity because 063's Call B is auto-only?
2. Should stop-reason enum truth favor the narrower SKILL contract or the broader helper/tests compatibility contract?
3. Should benchmark output materialization live in YAML as a workflow step, in a new helper script, or in a test harness only for CP scenarios?

## Ruled Out

- **Ruled out: auto-only YAML inspection as sufficient for implementation handoff.** Confirm duplicates the benchmark action placeholder and flat legal-stop fields, so a real workflow contract must account for both mode files or explicitly defer one [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-198`, `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:202-235`].
- **Ruled out: `run-benchmark.cjs` invocation alone as a GREEN benchmark proof.** The runner can be invoked correctly and still score every fixture as `missing-output` unless `{outputsDir}/{fixture.id}.md` exists [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:63-75`, `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:217-224`].
- **Ruled out: using SKILL frozen-enum prose as the sole stop-reason oracle.** The checked-in helper and its tests currently accept `plateau` and `benchmarkPlateau`, contrary to the SKILL prose [SOURCE: `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:21-30`, `.opencode/skill/sk-improve-agent/SKILL.md:351-358`, `.opencode/skill/sk-improve-agent/scripts/tests/improvement-journal.vitest.ts:104-118`].

## Sketches (if any)

### Minimal 064 diff checklist

```text
YAML parity:
  - auto + confirm: replace step_run_benchmark action prose with a concrete command or helper call.
  - auto + confirm: emit benchmark_completed only after report path exists.
  - auto + confirm: emit legal_stop_evaluated.details.gateResults.* instead of flat gate fields.
  - confirm: preserve gateDecision as supplemental details, not a separate schema.

Benchmark assets/materialization:
  - add benchmark profile/fixture assets or create packet-local ones.
  - add a materializer for {outputsDir}/{fixture.id}.md before run-benchmark.cjs.
  - assert benchmark report status, fixtures, recommendation, and state-log benchmark_run row.

Journal/reducer contract:
  - decide stop-reason enum truth: strict SKILL subset vs helper compatibility superset.
  - update SKILL.md, command docs, improvement-journal tests, and verdict greps to match.
  - keep event aliases as compatibility if desired, but GREEN requires legal_stop_evaluated structured gateResults.

Native playbook oracle:
  - update RT-028 to point at the same structured legal-stop contract used by 063.
  - complete RT-032 expected signals so journal-boundary checks are not grep-only/truncated.
```

### 063/064 verdict wording

```text
063 RED/PARTIAL methodology PASS:
  The corrected harness reaches the owning layer and accurately attributes failures to known missing producers/consumers.

064 GREEN product PASS:
  The owning layer has concrete producers, structured consumers parse the emitted JSON, native RT scenarios and cli-copilot CP scenarios agree, and no GREEN verdict depends on label-only greps.
```

## Next Focus Suggestion

Iteration 9 should draft the final synthesis outline and convergence table rather than inspect more implementation files. If one last targeted pass is needed, it should only verify whether packet 063 should include native sk-improve-agent RT alignment in scope or leave that entirely to 064.

## Convergence Assessment

This added real new value, so `convergence_signal: no`. The broad RQs are answerable; this iteration contributed the missing lockstep 064 implementation checklist, found the stop-reason helper/test vs SKILL conflict, and added cross-playbook oracle checking to the reusable methodology.
