---
iteration: 2
date: 2026-05-02T13:20:00+02:00
focus_rqs: [RQ-1, RQ-5, RQ-6, RQ-7]
new_findings_count: 7
rqs_now_answerable: [RQ-1, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 2

## Focus

This iteration focused on the weakest remaining area from iteration 1: how to grade command-orchestrator meta-agent stress tests without reusing the 059 coder rubric unchanged. The new value is a rubric and preflight template that would have caught the 060/002 Call B layer drift before the failed R1 run.

## Method

I read iteration 1's Findings and template sketch, then compared the 059 `@code` rubric/method against 060's R1 report, 001 synthesis, current improve-agent command/YAML/helper seams, and the authored CP-040/CP-045 runner shapes. I prioritized places where 001 had the right concept but failed to make it a blocking test-design invariant.

## Findings

### RQ-6: Meta-agent stress-test rubric should grade orchestration evidence, not implementation output

The 059 Coder Acceptance Rubric is a useful ancestor but not the right direct rubric for `/improve:agent`. Its five dimensions are **Correctness**, **Scope-Adherence**, **Verification-Evidence**, **Stack-Pattern-Compliance**, and **Integration**; they grade whether an implementation task can return `DONE`, with P0/P1 blockers overriding score averages [SOURCE: `.opencode/agent/code.md:128-140`, `.opencode/agent/code.md:142-157`]. That matches `@code` because the 059 Call B literally prepended `.opencode/agent/code.md`; the stress harness was testing an agent-body envelope whose discipline lived in that body [SOURCE: `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md:81-98`].

`/improve:agent` needs a different rubric because the unit under test is a command-owned pipeline. The command says its loop scans integration surfaces, dispatches `@improve-agent`, scores the candidate, runs benchmark fixtures, appends ledger data, reduces state, and checks stop conditions [SOURCE: `.opencode/command/improve/agent.md:266-280`]. The skill says the legal-stop contract requires five gate bundles and may not claim `converged` unless all pass [SOURCE: `.opencode/skill/sk-improve-agent/SKILL.md:279-292`]. The auto YAML is the executable evidence producer for helper calls and journal events [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:125-143`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:150-198`].

Recommended 063 rubric:

| Dimension | Points | Command-orchestrator definition |
|---|---:|---|
| **Entry-point fidelity** | 20 | Call B invokes the user-facing command or a command-faithful harness, not a leaf-agent body substitute. Wrong entry point is a P0 regardless of other signals. |
| **Ordered artifact/journal truth** | 25 | Required files and events appear in dependency order: scan/profile before candidate, score before delta gate, benchmark output before evidence gate, legal-stop before session end. |
| **Producer/consumer compatibility** | 20 | The JSON shape emitted by YAML/helper scripts is actually consumable by reducers/dashboards/tests, not merely grep-visible. |
| **Governance/stop semantics** | 20 | Proposal-only boundary, no promotion leakage, baseline-vs-candidate delta, all five legal-stop gates, and stopReason/sessionOutcome are coherent. |
| **Sandbox differential and containment** | 15 | Same-task A/B reset is faithful, canonical/mirror files remain unchanged before promotion, and tripwire dirtiness is causally triaged. |

This rubric keeps 059's "P0 blocks completion" rule but swaps implementation-quality dimensions for pipeline-fidelity dimensions. It also explains why the R1 score should not be read as "the triad failed completely": the leaf mutator behaved according to its proposal-only body, but the stress harness failed entry-point fidelity [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:144-172`].

### RQ-7: Generalize test-layer selection into a preflight template with blocking gates

The reusable template should be a **preflight gate before CP-XXX authoring**, not just a lesson in the final test report. 060/002 itself states the lesson: same-task A/B needs an explicit framing of "what discipline am I verifying" before naming body, command, skill router, helper script, or orchestrator as the layer under test [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:270-273`].

Template for future packet authors:

| Preflight question | Blocking output |
|---|---|
| **1. Unit under test** | Identify the discipline layer: agent body, command markdown, YAML workflow, skill router, helper script, reducer, or cross-layer contract. |
| **2. Natural entry point** | Name the user-facing invocation that normally exercises that layer. If the natural entry point is a command, Call B must use that command or a command-faithful harness. |
| **3. Evidence owner** | For each PASS label, name which layer writes it: transcript, filesystem artifact, journal event, score JSON, reducer summary, or dashboard. |
| **4. Consumer check** | Name the consumer that must parse the artifact; add a JSON assertion when producer and consumer shape can drift. |
| **5. Dependency order** | Order greps by causality instead of counting an unordered bag of labels. |
| **6. Negative control** | State what Call A may do and what Call B must not do. |
| **7. Containment** | State cwd, sandbox root, allowed temp spec folder, and canonical/mirror mutation tripwires. |
| **8. P0 failure conditions** | Define wrong entry point, missing artifact owner, unconsumable artifact shape, and out-of-sandbox writes as automatic FAILs. |

This preflight is stronger than iteration 1's list because it makes "natural entry point" and "consumer check" blocking. Those two gates directly target the R1 failure and the newly observed legal-stop producer/consumer seam: YAML emits `legal_stop_evaluated` with flat gate fields, while the reducer's latest legal-stop summary only reads `details.gateResults` [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:192-198`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`].

### RQ-1: Further-iteration value by 060/002 diff area

Functionally complete or close enough as shipped:

1. **Proposal-only mutator boundary and active Critic pass** are complete at the body layer. The agent says it writes one packet-local candidate and stops before scoring, promotion, or packaging [SOURCE: `.opencode/agent/improve-agent.md:22-42`]. Its self-validation now includes concrete Critic checks for scorer overfit, helper bypass, mirror drift concealment, fixture narrowness, and promotion leakage [SOURCE: `.opencode/agent/improve-agent.md:131-150`].
2. **Baseline/current scoring output** is complete enough to test. The scorer now computes baseline score, total/per-dimension delta, `thresholdDelta`, and a split between `candidate-better`, `candidate-acceptable`, and `keep-baseline` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:376-450`].
3. **Runtime mirror path fix** is a low-iteration area. 060/002 records the `.agents/agents` to `.gemini/agents/{name}.md` scanner fix as a scoped 1-line script change [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:211-223`].

Still worth further iteration:

1. **Command/SKILL/YAML event vocabulary is internally inconsistent.** The skill's audit protocol lists the new events, including `legal_stop_evaluated`, `blocked_stop`, and `benchmark_completed` [SOURCE: `.opencode/skill/sk-improve-agent/SKILL.md:271-278`], but the later journal-boundary table still names `gate_evaluation` as the iteration boundary and says auto mode emits `candidate_generated`, `candidate_scored`, and `gate_evaluation` [SOURCE: `.opencode/skill/sk-improve-agent/SKILL.md:344-364`]. The command body also still documents `gate_evaluation` in Step 6B [SOURCE: `.opencode/command/improve/agent.md:288-303`]. That means the Stage 3 diffs created better hooks but did not fully reconcile source-of-truth docs.
2. **Legal-stop producer/consumer shape is not complete.** YAML emits flat gate fields, while reducer consumes `details.gateResults`; a follow-on packet should either change the producer shape or make the reducer tolerant before accepting greps as PASS evidence [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:192-198`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`].
3. **Benchmark completion remains under-wired.** The auto YAML has an `action:` placeholder for running fixtures and emits `benchmark_completed` after `{benchmark_output_path}`, but the step is not a concrete `run-benchmark.cjs` command [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-179`]. CP-045 expects `run-benchmark.cjs`, `benchmark_completed`, and a sentinel [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/018-benchmark-completed-boundary.md:60-79`], so the next packet should treat action-only benchmark execution as unproven.

### RQ-5: R1 surfaced gaps in 060/001's synthesis-to-implementation handoff

060/001 did not misunderstand the desired command shape. It explicitly sketched CP-040 Call B as `/improve:agent ".opencode/agent/cp040.md" :auto --spec-folder=/tmp/cp-040-spec --iterations=1` [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md:142-145`]. It also predicted that artifact presence is only a smoke test, ordered greps matter more than more greps, and same-task A/B can still apply to meta-agent work [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md:776-780`].

The gap was that 001 did not turn those lessons into **non-negotiable implementation checks**. The actual CP-040 runner replaced the command invocation with "You are operating as @improve-agent" plus a prepended `.opencode/agent/improve-agent.md` body and `Depth: 1` [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/013-skill-load-not-protocol.md:70-79`]. The final report correctly concludes that the scenario implementation conflated the layer that proposes a candidate with the layer that evaluates it [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:246-253`].

R1 also exposed a second 001 gap: "action placeholder is unproven" was known, but not elevated into a precondition for benchmark scenarios. 001 warned that action-only workflow steps should be treated as unproven [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md:794-800`]. CP-045 nevertheless expected a benchmark sentinel while the YAML still documents benchmark execution as an `action`, not a concrete command [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-179`, `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/018-benchmark-completed-boundary.md:73-79`]. Future syntheses should distinguish "scenario can be authored now" from "scenario is expected to FAIL until a concrete producer exists."

## New Open Questions

1. Should 063 be split into a test-design packet and an implementation packet, or should it both fix the command/SKILL/YAML/reducer seams and run the command-flow stress suite?
2. Should `legal_stop_evaluated` standardize on `details.gateResults` everywhere, or should the reducer accept both flat and nested gate shapes for backward compatibility?
3. Should CP-045 be delayed until a real benchmark runner command exists, or intentionally kept as a failing regression that proves action placeholders are not accepted?

## Ruled Out

- **Ruled out: reusing the 059 Coder Acceptance Rubric unchanged.** Its dimensions grade code implementation output; 063 needs to grade command entrypoint fidelity, artifact/journal truth, producer/consumer compatibility, governance stops, and sandbox containment [SOURCE: `.opencode/agent/code.md:128-140`, `.opencode/command/improve/agent.md:266-280`].
- **Ruled out: event-name-only PASS.** A journal can contain `legal_stop_evaluated` while reducer-visible gate results remain empty if the event details are not nested under `gateResults` [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:192-198`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`].
- **Ruled out: treating all 060/002 diffs as equally incomplete because R1 failed.** The R1 failure was mostly entry-point fidelity; body-layer and scorer-layer changes are independently testable and materially improved [SOURCE: `.opencode/agent/improve-agent.md:131-150`, `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:422-450`].

## Sketches (if any)

### Command-orchestrator stress-test grading card

```text
Verdict: PASS | PARTIAL | FAIL

P0 gates:
- Call B used the natural command entry point or command-faithful harness.
- No canonical target or mirror mutation occurred before promotion.
- Required artifact owners exist: integration report, candidate path, score JSON, journal JSONL, reducer output.
- Producer JSON shape is consumable by the named reducer/dashboard/test.
- No session_end/converged appears before required legal-stop evidence.

Score dimensions:
- Entry-point fidelity: 0-20
- Ordered artifact/journal truth: 0-25
- Producer/consumer compatibility: 0-20
- Governance/stop semantics: 0-20
- Sandbox differential and containment: 0-15

Interpretation:
- PASS: all P0 gates pass and score >= 85.
- PARTIAL: entry point is correct, no containment breach, but one non-terminal artifact/gate is missing or under-specified.
- FAIL: wrong entry point, unowned/unconsumable core artifact, canonical mutation, false converged, or score < 70.
```

### CP-XXX preflight stub

```markdown
## Layer-Selection Preflight

- Unit under test:
- Natural entry point:
- Why Call B exercises that entry point:
- Evidence owners:
  - transcript:
  - filesystem:
  - journal:
  - score/reducer/dashboard:
- Consumer assertions:
- Dependency order:
- Negative control:
- Sandbox root and tripwires:
- P0 fail conditions:
```

## Next Focus Suggestion

Iteration 3 should decide packet 063's scope boundary: test-only verdict specification versus implementation-plus-test. The most useful next evidence would be a minimal compatibility plan for `legal_stop_evaluated` (`details.gateResults` vs flat fields), then a command-runner skeleton that resolves whether Copilot can execute `/improve:agent` from the sandbox cwd or must run from repo root with explicit temp target/spec paths.

## Convergence Assessment

This iteration added real new value, so `convergence_signal: no`. RQ-6 and RQ-7 are now answerable with a concrete rubric and authoring preflight, while RQ-1/RQ-5 have sharper distinctions between complete body/scorer diffs and still-open command/YAML/reducer methodology seams.
