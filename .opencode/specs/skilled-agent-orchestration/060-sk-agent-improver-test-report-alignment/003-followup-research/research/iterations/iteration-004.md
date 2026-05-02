---
iteration: 4
date: 2026-05-02T13:25:14+02:00
focus_rqs: [RQ-1, RQ-3, RQ-4, RQ-5, RQ-7]
new_findings_count: 6
rqs_now_answerable: [RQ-1, RQ-3, RQ-4, RQ-5, RQ-7]
convergence_signal: no
---

# Iteration 4

## Focus

This iteration focused on the remaining cross-cutting decision: how packet 063 should avoid repeating 060's layer mistake while still producing meaningful command-flow evidence. The new value is a sharper 063 scope decision, a two-phase RED/GREEN grep contract, and a refined taxonomy for future CP-XXX authoring across meta-agents.

## Method

I read iterations 1-3 first and treated their Call B, rubric, and harness-root conclusions as baseline rather than re-proving them. Then I inspected the command/agent boundary, the legal-stop and benchmark producer/consumer seams, the R1 report lessons, the original 001 synthesis transfer lessons, and the candidate agent bodies under `.opencode/agent/`.

## Findings

### RQ-1/RQ-3: 063 should be implementation-plus-test unless it intentionally records RED tests

The strongest packet-level conclusion is that 063 should not be framed as "rerun the six scenarios after changing the prompt" if the expected outcome is green. R1 already showed zero PASS outcomes across CP-040..CP-045, with only two PARTIAL variants and four FAIL variants [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-summary.md:11-24`]. The R1 report explicitly says a meaningful R2 is not a small wording rerun: it needs command-owned setup, packet-local `improvement/` directories, charter/control/profile files, YAML workflow invocation, helper-script evidence capture, journal inspection, and stop-condition assertions [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:177-184`].

That means 063 has two honest shapes:

1. **RED test-design packet:** Run command-faithful Call B and expect failures at the known executable seams. Verdict evidence should prove the failure is real: `step_run_benchmark` is still action-only, and `legal_stop_evaluated` writes flat gate fields the reducer does not consume [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-198`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`].
2. **Implementation-plus-test packet:** First wire those two seams, then run command-flow Call B as a green stress test. This is the only scope that can fairly demand `benchmark_completed`, reducer-visible legal gates, and session stop assertions.

The shipped diff areas that are still worth further iteration are therefore not the proposal-only body or mirror path wording; they are the executable joins. `@improve-agent` correctly says it writes one packet-local candidate and stops before scoring, promotion, or packaging, and its journal section explicitly assigns `candidate_scored`, `benchmark_completed`, `legal_stop_evaluated`, `blocked_stop`, and session-end events to the orchestrator [SOURCE: `.opencode/agent/improve-agent.md:22-42`, `.opencode/agent/improve-agent.md:160-180`]. By contrast, the YAML still has benchmark execution as prose `action`, followed by a journal event that assumes `{benchmark_output_path}` exists [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-176`]. It also emits `legal_stop_evaluated` with flat `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, and `improvementGate` fields [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:192-198`], while the reducer only populates `latestLegalStop.gateResults` from `details.gateResults` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`].

### RQ-3: Use a two-phase grep contract, not a single static checklist

Iteration 3 correctly sketched the command-flow grep contract, but the contract should be versioned by packet intent:

| Packet intent | Verdict contract |
|---|---|
| **RED test-design** | Require `/improve:agent ... :auto --spec-folder=... --iterations=1`; assert helper setup traces; assert `legal_stop_evaluated` exists but reducer-visible `details.gateResults` is absent or empty; assert `step_run_benchmark` has no concrete `run-benchmark.cjs` command in YAML; classify as expected RED. |
| **Implementation-plus-test** | Require the same command entry point; require `run-benchmark.cjs` invocation, `benchmark_completed`, a benchmark report with `status: "benchmark-complete"`, `type: "benchmark_run"` in state JSONL, `legal_stop_evaluated.details.gateResults.*`, `blocked_stop.failedGates` when gates fail, and `session_end` after legal-stop evidence. |

The benchmark GREEN contract is supportable because the script already exposes the needed CLI and report shape. `run-benchmark.cjs` requires `--profile`, `--outputs-dir`, and `--output`, optionally accepts `--state-log` and `--integration-report`, writes a report with `status: "benchmark-complete"`, aggregate score, recommendation, thresholds, fixture results, and optional integration details, and appends a `type: "benchmark_run"` JSONL row when `--state-log` is provided [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:202-270`]. The old CP-045 contract asked for `run-benchmark.cjs`, `benchmark_completed`, and a sentinel, but it still invoked Call B by prepending `.opencode/agent/improve-agent.md` rather than calling `/improve:agent` [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/018-benchmark-completed-boundary.md:61-79`]. In 063, sentinel evidence can stay as a fixture tripwire, but the primary benchmark proof should be the benchmark JSON report plus state/journal rows.

### RQ-4: The useful classification is four layers, not just body-level vs command-level

Iteration 1's body-vs-command table is correct, but future CP authors need a slightly richer taxonomy because several agents are neither command-loop leaves nor ordinary body-only workers.

| Class | Agents | Natural test entry point | What CP scenarios may assert |
|---|---|---|---|
| **Command-loop leaf** | `@improve-agent`, `@deep-research`, `@deep-review` | The owning command, unless the scenario intentionally tests the leaf body only | Command-owned artifacts, reducer state, convergence/stop semantics, and lifecycle events only when invoked through the command flow. |
| **Body-level leaf** | `@write`, `@improve-prompt`, `@debug`, `@context`, `@review` | A direct agent dispatch with the body loaded | Intrinsic body rules: template gates, prompt package format, debug phases, retrieval protocol, or review rubric. Do not invent command artifacts unless a command exists. |
| **Body-level leaf with caller gate** | `@code` | Orchestrator dispatch including the caller marker | Body-level implementation discipline and RETURN rubric; the caller gate is part of prompt shape, not a command loop. |
| **Primary orchestrator body** | `@orchestrate` | Top-level orchestrator task, not a leaf dispatch | Delegation shape, child-task prompts, quality evaluation, and synthesis behavior. |

The command-loop leaf class is the one that caused the R1 failure. `@improve-agent` is explicitly proposal-only and must not write the improvement journal [SOURCE: `.opencode/agent/improve-agent.md:22-27`, `.opencode/agent/improve-agent.md:160-170`]. `@deep-research` and `@deep-review` use similar wording: each executes one iteration, while the full loop is managed by `/spec_kit:deep-research` or `/spec_kit:deep-review` command YAML [SOURCE: `.opencode/agent/deep-research.md:24-34`, `.opencode/agent/deep-review.md:23-33`].

The body-level class has enforcement in the agent body itself. `@write` owns template loading, skeleton copying, validation, DQI scoring, and delivery gates in its body [SOURCE: `.opencode/agent/write.md:22-65`]. `@improve-prompt` owns its five-step prompt escalation and structured output contract while denying write/edit/bash [SOURCE: `.opencode/agent/improve-prompt.md:22-40`, `.opencode/agent/improve-prompt.md:86-101`]. `@debug` owns the fresh-context debugging method and 5-phase observe/analyze/hypothesize/fix/report flow [SOURCE: `.opencode/agent/debug.md:22-30`, `.opencode/agent/debug.md:105-180`]. `@context` owns canonical continuity retrieval, codebase scan, and structured Context Package delivery without nested delegation [SOURCE: `.opencode/agent/context.md:25-55`]. `@review` owns read-only review, standards loading, scoring, and issue classification [SOURCE: `.opencode/agent/review.md:22-57`, `.opencode/agent/review.md:114-141`].

`@code` is the important near-miss: it is body-level for discipline, but it requires an orchestrator caller marker. Its body owns stack-aware implementation, sk-code routing, verification, and the coder acceptance rubric [SOURCE: `.opencode/agent/code.md:22-58`, `.opencode/agent/code.md:128-157`]. That is why the 059 prepend-body pattern can work for `@code`: the enforcement machinery is in the body, while the caller gate is a dispatch constraint. `@orchestrate` is different again: it is the primary commander and explicitly performs decomposition, delegation, evaluation, conflict resolution, and synthesis [SOURCE: `.opencode/agent/orchestrate.md:18-35`, `.opencode/agent/orchestrate.md:87-113`].

### RQ-5: 060/001 missed a readiness gate, not the core concept

The 001 synthesis did identify the right transfer lessons. It warned that meta-agents need both candidate-quality evidence and process-governance evidence, that legal-stop gates need producers, consumers, and validators, and that `action:` placeholders should be assumed unproven [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md:794-800`]. The gap R1 surfaced is that those warnings were advisory, not a readiness gate before CP authoring.

The actual R1 lesson says discipline lives at different layers, agent-body invocation is only a subset of command-flow invocation, and the scenario implementation conflated the layer that proposes a candidate with the layer that evaluates it [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:246-253`]. It also states the command now has better hooks, but R1 did not exercise them because Call B bypassed the command [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:254-259`]. So the missing readiness gate is:

```text
Do not author a green CP expectation for an artifact/event until the owning layer has a concrete producer and the named consumer can parse it.
```

This would have blocked CP-045 from treating a benchmark sentinel as sufficient proof while the YAML still had an action-only benchmark step, and it would have blocked CP-040 from asking a leaf mutator body to prove command-owned helper and journal boundaries [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/013-skill-load-not-protocol.md:65-84`, `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/018-benchmark-completed-boundary.md:61-84`].

### RQ-7: Generalize test-layer selection as a "layer-owned evidence matrix"

The reusable preflight should not just ask "what layer am I testing?" It should force a small evidence matrix before any CP-XXX scenario is written:

| Question | Required answer before scenario authoring |
|---|---|
| Unit under test | Agent body, command markdown, YAML workflow, skill router, helper script, reducer, primary orchestrator, or cross-layer contract. |
| Natural entry point | The user-facing invocation that normally exercises that unit. If this is a command, Call B must call the command or a command-faithful harness. |
| Evidence owner | Which layer writes each expected signal: transcript, filesystem artifact, journal event, score JSON, reducer summary, dashboard, or child-agent return. |
| Consumer | Which script/dashboard/test must parse the evidence. Grep-only PASS is disallowed for structured JSON that has a known consumer. |
| Producer readiness | Is the producer a concrete command/script, or only `action:` prose / narrative guidance? If prose-only, mark the CP as expected RED or split an implementation packet first. |
| Invocation subset check | If testing a leaf body, list command-owned behaviors that must not be asserted. If testing a command, list leaf-only behaviors that are only intermediate evidence. |
| Harness root completeness | Which cwd contains the command, target, skill scripts, fixtures, benchmark profiles, mirrors, and allowed external spec/log paths. |
| Verdict mode | Is this CP expected GREEN, expected RED, or exploratory PARTIAL? Expected RED is valid only if the failure teaches a named producer/consumer gap. |

This matrix turns the R1 meta-finding into a reusable template. The R1 report's final lesson says the same-task A/B pattern is invocation-mode-sensitive and must name the layer before writing the runner [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:270-272`]. The matrix adds two safeguards not yet made explicit enough in prior iterations: producer readiness and verdict mode.

## New Open Questions

1. Should 063 standardize `legal_stop_evaluated` on nested `details.gateResults`, or make `reduce-state.cjs` tolerant of both flat and nested gate fields for backward compatibility?
2. What exact `--outputs-dir` should `run-benchmark.cjs` receive in the command flow: the candidate directory, a per-candidate rendered-output directory, or a benchmark-specific output staging directory?
3. Should 063 keep the current CP-040..CP-045 IDs as RED regression tests and add new GREEN command-flow IDs, or rewrite the existing scenario files in place?

## Ruled Out

- **Ruled out: treating 063 as a prompt-only rerun with green expectations.** R1 says rerunning the prepended-body pattern would reproduce the same mutator halt, and the executable command-flow seams still need producer/consumer wiring [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:177-184`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-198`].
- **Ruled out: classifying `@debug` as command-orchestrator just because another workflow may surface it.** Its body says it is user-invoked or explicitly dispatched and owns the five-phase debug methodology itself [SOURCE: `.opencode/agent/debug.md:22-30`, `.opencode/agent/debug.md:105-180`].
- **Ruled out: sentinel-only benchmark acceptance.** `run-benchmark.cjs` already has a structured report and JSONL state contract, so 063 should grade benchmark completion through report/state/journal evidence; a sentinel can only be a fixture tripwire [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:202-270`].

## Sketches (if any)

### 063 scope decision sketch

```text
If 063 goal is RED methodology proof:
  - Preserve known YAML/reducer seams.
  - Run command-faithful Call B.
  - PASS the packet if failures are causally attributed to command-flow producer/consumer gaps.

If 063 goal is GREEN command-flow proof:
  - Patch legal_stop_evaluated details shape or reducer tolerance.
  - Replace step_run_benchmark action prose with run-benchmark.cjs command.
  - Run command-faithful Call B and require report/state/journal/reducer evidence.
```

### Legal-stop GREEN shape sketch

```text
improvement-journal.jsonl:
  eventType == "legal_stop_evaluated"
  details.gateResults.contractGate
  details.gateResults.behaviorGate
  details.gateResults.integrationGate
  details.gateResults.evidenceGate
  details.gateResults.improvementGate

reducer output:
  latestLegalStop.gateResults has all five keys
```

### Benchmark GREEN invocation sketch

```bash
node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs \
  --profile="{target_profile}" \
  --outputs-dir="{candidate_outputs_dir}" \
  --output="{spec_folder}/improvement/benchmark-runs/{target_profile}/iteration-{iteration}.json" \
  --state-log="{spec_folder}/improvement/agent-improvement-state.jsonl" \
  --integration-report="{spec_folder}/improvement/integration-report.json"
```

### Layer-owned evidence matrix stub

```markdown
## Layer-Owned Evidence Matrix

- Unit under test:
- Natural entry point:
- Evidence owner per expected signal:
- Structured consumer per artifact/event:
- Producer readiness: concrete command/script OR expected RED
- Invocation subset check:
- Harness root completeness:
- Verdict mode: GREEN | RED | exploratory PARTIAL
```

## Next Focus Suggestion

Iteration 5 should resolve the remaining implementation ambiguity for 063: inspect the target-profile/benchmark fixture assets and decide the exact `run-benchmark.cjs --outputs-dir` contract, then choose nested-only versus tolerant reducer handling for `legal_stop_evaluated`.

## Convergence Assessment

This added real new value, so `convergence_signal: no`. The broad RQs are largely answerable, but this iteration converted prior lessons into a concrete 063 packet fork, a RED/GREEN grep strategy, and a reusable evidence matrix that prevents future CP scenarios from asserting artifacts owned by the wrong layer.
