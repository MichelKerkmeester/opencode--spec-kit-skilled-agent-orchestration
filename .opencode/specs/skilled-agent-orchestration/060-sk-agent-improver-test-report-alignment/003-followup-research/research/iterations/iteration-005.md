---
iteration: 5
date: 2026-05-02T13:27:48+02:00
focus_rqs: [RQ-1, RQ-3, RQ-5, RQ-6, RQ-7]
new_findings_count: 6
rqs_now_answerable: [RQ-1, RQ-3, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 5

## Focus

This iteration followed iteration 4's suggested gap: resolve the exact benchmark contract for 063 and decide whether legal-stop should be fixed at the producer or made tolerant at the reducer. The new value is that 063 needs an evaluator-asset/materialized-output precondition, not only a command-faithful Call B and a `run-benchmark.cjs` invocation.

## Method

I treated iterations 1-4 as baseline and did not re-prove the broad command-vs-body finding. I read the auto YAML, benchmark runner, dynamic profile generator, benchmark references/manual tests, fixture README, reducer legal-stop consumer, journal helper, and 001 synthesis transfer lessons, focusing only on seams that can make a command-flow 063 fail even after the entry point is corrected.

## Findings

### RQ-3: `run-benchmark.cjs --outputs-dir` must point to materialized fixture outputs, not the candidate file

The benchmark runner's concrete input contract is stricter than prior iterations stated. It loads a target profile from `{profilesDir}/{profileId}.json`, lists every JSON fixture in `profile.benchmark.fixtureDir`, and scores `path.join(outputsDir, `${fixture.id}.md`)` for each fixture [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:202-221`]. Therefore `--outputs-dir` is not `{candidate_path}`, not `{spec_folder}/improvement/candidates`, and not the benchmark report directory by itself. It must be a directory containing one markdown output file per fixture ID.

The existing operator guide implies that layout but does not connect it to fixture IDs: it uses `--outputs-dir={spec_folder}/improvement/benchmark-runs/{agent-name}/baseline` and defines sibling output sets such as `baseline/`, `candidate-weak/`, and `candidate-strong/` under `benchmark-runs/{agent-name}/` [SOURCE: `.opencode/skill/sk-improve-agent/references/benchmark_operator_guide.md:33-42`, `.opencode/skill/sk-improve-agent/references/benchmark_operator_guide.md:60-68`]. The exact 063 GREEN contract should make that explicit:

```text
node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs \
  --profile={target_profile} \
  --profiles-dir={spec_folder}/improvement/benchmark-profiles \
  --outputs-dir={spec_folder}/improvement/benchmark-runs/{target_profile}/candidate-{iteration}-outputs \
  --output={spec_folder}/improvement/benchmark-runs/{target_profile}/iteration-{iteration}.json \
  --state-log={spec_folder}/improvement/agent-improvement-state.jsonl \
  --integration-report={spec_folder}/improvement/integration-report.json
```

Before this command, the workflow or test harness must materialize files such as `{outputsDir}/{fixture.id}.md`. If the candidate is a single agent markdown file, 063 must either copy/render it into the fixture-ID output names expected by the benchmark profile or define a one-fixture profile whose fixture ID maps to that rendered candidate output. Otherwise the benchmark runner will return fixture-level `missing-output` failures even though the command was invoked correctly [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:63-76`, `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:217-221`].

### RQ-3/RQ-5: Dynamic profiles are scoring profiles, not benchmark profiles

Iteration 3 already found that `run-benchmark.cjs` exists but is not wired into the YAML. This pass adds a second executable blocker: the generated dynamic profile cannot be passed directly to the benchmark runner as currently emitted, because `generate-profile.cjs` writes `benchmark: { fixtureDir: null, requiredAggregateScore: 75, minimumFixtureScore: 60, repeatabilityTolerance: 0 }` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/generate-profile.cjs:218-237`]. The runner then calls `listJsonFiles(profile.benchmark.fixtureDir)` without a null guard [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:217-220`].

The default benchmark runner also looks for profiles under `.opencode/skill/sk-improve-agent/assets/target-profiles` unless `--profiles-dir` is supplied [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:202-214`]. The checked-in benchmark manual tests still invoke `--profile=debug` with the default profile directory [SOURCE: `.opencode/skill/sk-improve-agent/manual_testing_playbook/04--benchmark-integration/014-without-integration.md:43-45`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/04--benchmark-integration/015-with-integration.md:43-45`], while the evaluator contract says the runner expects `--profile`, `--outputs-dir`, and `--output` but no longer documents a shipped static profile set [SOURCE: `.opencode/skill/sk-improve-agent/references/evaluator_contract.md:31-36`, `.opencode/skill/sk-improve-agent/references/evaluator_contract.md:50-56`].

That is the R1-surfaced gap 001 did not make concrete enough. 001 warned that legal-stop gates need producers/consumers/validators and that `action:` placeholders are unproven [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md:794-800`], but it did not specify the evaluator asset chain needed for benchmark truth: benchmark profile JSON, fixture JSON directory, materialized fixture outputs, benchmark report path, state-log append, and journal boundary.

### RQ-1: Further iteration value by diff area changes after benchmark asset discovery

Functionally complete as shipped remains unchanged for three areas: proposal-only mutator discipline, active Critic wording, and baseline-vs-current scorer output. The R1 report says Call B reached the thin mutator, which checked inputs, refused to invent missing paths, and avoided canonical mutation; that is consistent with ADR-001 rather than a mutator failure [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:144-172`]. The total Stage 3 diff table also shows the scorer and mirror-path changes landed as scoped code edits [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:211-225`].

The further-iteration priority is now more precise:

1. **Benchmark path is the least complete diff area.** Auto YAML declares `run-benchmark.cjs` as the benchmark script but `step_run_benchmark` is still prose `action`, followed by `benchmark_completed` assuming `{benchmark_output_path}` exists [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:87-93`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-179`]. Even replacing the action with a command is insufficient unless 063 also supplies `--profiles-dir` and materializes fixture-ID markdown outputs.
2. **Legal-stop event shape is incomplete but narrowly fixable.** YAML emits flat `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, and `improvementGate` fields [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:192-198`], while the reducer only reads `details.gateResults` for `legal_stop_evaluated` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`].
3. **Journal vocabulary remains partially inconsistent.** The skill lists `legal_stop_evaluated` and `blocked_stop` as event types and says all five legal-stop gates must precede any `session_end` [SOURCE: `.opencode/skill/sk-improve-agent/SKILL.md:271-291`], but the later boundary table still says auto mode emits `candidate_generated`, `candidate_scored`, and `gate_evaluation` inside each loop [SOURCE: `.opencode/skill/sk-improve-agent/SKILL.md:343-364`].

### RQ-3: Prefer nested producer shape over reducer tolerance for 063 GREEN

063 should standardize the producer on `details.gateResults`, not merely make `reduce-state.cjs` tolerant of flat fields. The reducer already defines the consumer contract by populating `latestLegalStop.gateResults` from `details.gateResults` only [SOURCE: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`]. The skill's legal-stop rule is semantic rather than shape-specific: all five gate keys must be emitted before `session_end`, and failing gates require `blocked_stop` plus `stopReason:"blockedStop"` [SOURCE: `.opencode/skill/sk-improve-agent/SKILL.md:279-292`]. The journal helper validates event type and session-end enums, but it does not validate `legal_stop_evaluated` detail shape [SOURCE: `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:80-107`].

Reducer tolerance can be useful as a migration compatibility patch, but it should not be the GREEN acceptance source. If a flat event gets accepted as equivalent, the test stops enforcing the producer/consumer compatibility lesson from R1. For 063 GREEN, require both:

```text
improvement-journal.jsonl eventType == "legal_stop_evaluated"
details.gateResults.contractGate
details.gateResults.behaviorGate
details.gateResults.integrationGate
details.gateResults.evidenceGate
details.gateResults.improvementGate

experiment-registry/dashboard after reduce-state:
latestLegalStop.gateResults has the same five keys
```

If 063 is a RED methodology packet instead, the expected failure should be "producer emitted flat fields and reducer-visible `latestLegalStop.gateResults` is empty," not just "legal_stop_evaluated is present."

### RQ-6: Add an evaluator-asset-completeness P0 to the command-orchestrator rubric

Iteration 2's command-orchestrator rubric is directionally right, but benchmark inspection shows it needs one more P0 gate: **evaluator asset completeness**. A command-flow stress test can have the correct entry point, journal event names, and helper script references while still being non-executable because the evaluator lacks profile JSON, fixture JSON, fixture-ID output materialization, or a known consumer path.

Add this P0 gate to the 063 grading card:

```text
Evaluator asset completeness:
- Every benchmark/scoring assertion names the helper script that produces it.
- Every helper script has all required inputs in the command-capable sandbox.
- Benchmark profile JSON exists in the selected --profiles-dir.
- profile.benchmark.fixtureDir points to real fixture JSON files.
- --outputs-dir contains one {fixture.id}.md output per fixture before the runner executes.
- Benchmark report, state-log row, and journal event are causally ordered.
```

This is distinct from "ordered artifact/journal truth." The latter checks event sequence after execution. Evaluator asset completeness checks whether the scenario was capable of producing the evidence at all. It would have blocked CP-045's green expectation because the R1 report says CP-045 expected `run-benchmark.cjs`, `benchmark_completed`, and a sentinel [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:88-98`], while the YAML had only action prose for benchmark execution [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-176`].

### RQ-7: Generalize test-layer selection with an evaluator preflight subsection

The reusable layer-owned evidence matrix from iteration 4 should gain an evaluator-specific subsection for any agent whose stress evidence includes scoring, benchmarks, reducers, dashboards, or journals:

```markdown
## Evaluator Asset Preflight

- Helper under test:
- Required CLI invocation:
- Required profile/config inputs:
- Required fixture source directory:
- Required materialized output set:
- State/journal/reducer consumers:
- Expected RED if any producer is action-only or asset-missing:
- GREEN-only assertions that require structured JSON, not grep-only counts:
```

The key question for future packet authors is no longer only "which layer owns the discipline?" It is also "does the owning layer have concrete evaluator assets that can produce the evidence I plan to grep?" The R1 report already generalized that same-task A/B is invocation-mode-sensitive and scenarios must name the layer under test [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:246-253`, `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:270-272`]. This iteration extends that into a producer-readiness rule for evaluator-backed meta-agents.

## New Open Questions

1. Should 063 create a packet-local benchmark profile for `cp-improve-target`, or should the sk-improve-agent asset tree grow canonical target-profile fixtures first?
2. What should materialize `{fixture.id}.md` outputs: the `/improve:agent` YAML workflow, the `@improve-agent` candidate generator, or the CP runner harness?
3. Should the stale manual benchmark tests that use `--profile=debug` be updated in the same downstream packet as command-flow 063, or split into a separate benchmark-assets cleanup packet?

## Ruled Out

- **Ruled out: `--outputs-dir={candidate_path}`.** The runner appends `${fixture.id}.md` to the supplied output directory, so a file path cannot satisfy the contract [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:217-221`].
- **Ruled out: using generated `dynamic-profile.json` directly as a benchmark profile.** The generator emits `benchmark.fixtureDir:null`, and the runner expects `profile.benchmark.fixtureDir` to be listable JSON fixtures [SOURCE: `.opencode/skill/sk-improve-agent/scripts/generate-profile.cjs:218-237`, `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:217-220`].
- **Ruled out: reducer-tolerant flat legal-stop fields as the primary GREEN proof.** Tolerance may preserve old logs, but the reducer's current consumer shape is nested `details.gateResults`; GREEN should prove the producer emits that shape [SOURCE: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:192-198`].

## Sketches (if any)

### 063 benchmark asset patch sketch

```text
{spec_folder}/improvement/benchmark-profiles/cp-improve-target.json
  id: "cp-improve-target"
  benchmark.fixtureDir: "{spec_folder}/improvement/benchmark-fixtures/cp-improve-target"

{spec_folder}/improvement/benchmark-fixtures/cp-improve-target/candidate-contract.json
  id: "candidate-contract"
  requiredHeadings: [...]
  requiredPatterns: [...]
  forbiddenPatterns: [...]

{spec_folder}/improvement/benchmark-runs/cp-improve-target/candidate-1-outputs/candidate-contract.md
  rendered or copied candidate output to score
```

### 063 GREEN benchmark command sketch

```bash
node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs \
  --profile=cp-improve-target \
  --profiles-dir="$spec/improvement/benchmark-profiles" \
  --outputs-dir="$spec/improvement/benchmark-runs/cp-improve-target/candidate-1-outputs" \
  --output="$spec/improvement/benchmark-runs/cp-improve-target/iteration-1.json" \
  --state-log="$spec/improvement/agent-improvement-state.jsonl" \
  --label="cp-improve-target-candidate-1" \
  --integration-report="$spec/improvement/integration-report.json"
```

### Legal-stop producer shape sketch

```json
{
  "eventType": "legal_stop_evaluated",
  "details": {
    "sessionId": "...",
    "iteration": 1,
    "gateResults": {
      "contractGate": { "passed": true },
      "behaviorGate": { "passed": true },
      "integrationGate": { "passed": true },
      "evidenceGate": { "passed": false },
      "improvementGate": { "passed": false }
    },
    "baselineScore": 88,
    "score": 89,
    "delta": 1,
    "thresholdDelta": 5
  }
}
```

## Next Focus Suggestion

Iteration 6 should decide downstream packet slicing: one 063 implementation-plus-test packet that adds benchmark assets, output materialization, benchmark YAML wiring, and nested legal-stop events; or two packets where the first records RED tests for missing evaluator assets and the second turns them GREEN.

## Convergence Assessment

This added real new value, so `convergence_signal: no`. The broad RQs were already mostly answerable, but this iteration uncovered a concrete benchmark-profile/fixture/output precondition that prior iterations had not made explicit and that would otherwise cause a command-faithful 063 to fail for a second, different reason.
