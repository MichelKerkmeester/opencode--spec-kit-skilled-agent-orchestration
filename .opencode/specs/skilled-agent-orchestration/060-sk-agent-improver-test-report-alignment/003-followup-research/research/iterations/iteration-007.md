---
iteration: 7
date: 2026-05-02T13:31:37+02:00
focus_rqs: [RQ-1, RQ-3, RQ-5, RQ-6, RQ-7]
new_findings_count: 5
rqs_now_answerable: [RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 7

## Focus

This iteration focused on the remaining downstream authoring question from iteration 6: whether 063 should rewrite CP-040..CP-045 in place or add successor CP IDs. The new value is a sharper split: do not overcorrect by forcing all six scenarios through command-flow; only the command-owned evidence scenarios require `/improve:agent`, while proposal-only and active-Critic checks can remain leaf/body tests if the five required inputs are supplied.

## Method

I treated iterations 1-6 as baseline and did not re-prove the command-vs-body meta-finding. I read the active CP-040..CP-045 playbook files, the root cli-copilot playbook index/release rules, the packet 003 open questions, the R1 report, and the current `@improve-agent` body to decide ID policy and per-scenario layer ownership.

## Findings

### RQ-7/RQ-1: Avoid the opposite layer-selection error in 063

The earlier conclusion "Call B must invoke `/improve:agent`" is correct for command-owned evidence, but it should not be applied blindly to all six CPs. `@improve-agent` itself owns two important body-level disciplines: proposal-only candidate generation and active Critic self-validation. Its body says it writes one packet-local candidate, stops before scoring/promotion/packaging, never scores/promotes/benchmarks/edits canonical targets or mirrors, and returns structured metadata [SOURCE: `.opencode/agent/improve-agent.md:22-42`]. It also owns the Critic pass checks for scorer overfit, helper bypass, mirror drift concealment, fixture narrowness, and promotion leakage [SOURCE: `.opencode/agent/improve-agent.md:131-150`].

That maps the six scenarios into two groups:

| Scenario | Correct layer | Why |
|---|---|---|
| CP-040 SKILL_LOAD_NOT_PROTOCOL | Command-flow | It requires `scan-integration.cjs`, `generate-profile.cjs`, `score-candidate.cjs`, `reduce-state.cjs`, `candidate_generated`, and `candidate_scored`, all beyond the proposal-only leaf [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/013-skill-load-not-protocol.md:28-42`]. |
| CP-041 PROPOSAL_ONLY_BOUNDARY | Leaf/body or command containment | Its core assertion is no canonical/mirror mutation plus packet-local candidate path, which the body explicitly owns [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/014-proposal-only-boundary.md:28-43`, `.opencode/agent/improve-agent.md:104-110`]. |
| CP-042 ACTIVE_CRITIC_OVERFIT | Leaf/body | Its required labels exactly match the body-owned `CRITIC PASS` list [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/015-active-critic-overfit.md:28-42`, `.opencode/agent/improve-agent.md:141-146`]. |
| CP-043 LEGAL_STOP_GATE_BUNDLE | Command-flow | It asks for `legal_stop_evaluated`, all five gates, `blocked_stop`, `failedGates`, and no converged stop; R1 established those are command/orchestrator responsibilities, not mutator work [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/016-legal-stop-gate-bundle.md:28-42`, `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:166-172`]. |
| CP-044 IMPROVEMENT_GATE_DELTA | Command-flow | It requires score/delta and improvement-gate stop semantics, which depend on scorer output and legal-stop evaluation rather than leaf candidate generation [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/017-improvement-gate-delta.md:28-42`, `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:256-259`]. |
| CP-045 BENCHMARK_COMPLETED_BOUNDARY | Command-flow | It requires `run-benchmark.cjs`, `benchmark_completed`, benchmark output, and sentinel/file proof, all outside the proposal-only leaf [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/018-benchmark-completed-boundary.md:28-42`, `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:170-172`]. |

This changes the 063 guidance: the successor test design should be **layer-specific**, not "same command wrapper for every scenario." CP-041 and CP-042 should either remain direct leaf-body tests with the five required runtime inputs supplied, or become command-containment scenarios that assert only containment/critic evidence visible through the command. They should not require benchmark/legal-stop/scorer artifacts merely because adjacent CPs do.

### RQ-5/RQ-7: The old CP files failed because they mixed valid objectives with invalid invocation setup

The active CP files already contain the right high-level objective in several titles/descriptions, but their runnable Call B setup prepends `.opencode/agent/improve-agent.md` plus `Depth: 1` for every scenario. CP-040 says the disciplined path should prove helper execution, but its runnable command builds a prompt by concatenating the agent body and dispatch task, then invokes Copilot with only `--add-dir /tmp/cp-040-sandbox` [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/013-skill-load-not-protocol.md:37-42`, `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/013-skill-load-not-protocol.md:70-79`]. CP-043, CP-044, and CP-045 repeat the same pattern while asserting command-owned journal/score/benchmark evidence [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/016-legal-stop-gate-bundle.md:68-79`, `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/017-improvement-gate-delta.md:68-78`, `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/018-benchmark-completed-boundary.md:68-79`].

For CP-041 and CP-042, the wrongness is different. The leaf body is an acceptable layer, but the prompt did not satisfy the leaf's declared input contract. The body requires a runtime root, copied charter, copied control file, canonical target, and candidate output path; if any is missing, it must return `missing-required-input` and take no action [SOURCE: `.opencode/agent/improve-agent.md:72-93`]. R1's transcript behavior was therefore expected: it reached the thin mutator, saw unresolved runtime/control inputs, and halted rather than fabricating evidence [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:144-164`].

The 001 synthesis gap is now more precise: it did not just miss "command vs body." It missed that a mixed suite needs **per-scenario layer ownership plus required-input completeness**. Some CPs need the command natural entry point; some can directly test the leaf, but only with the leaf's required control bundle present.

### RQ-5/RQ-3: Reuse CP-040..CP-045 in place for the active playbook; preserve R1 history in packet artifacts

If 063 edits the active cli-copilot manual playbook, it should correct CP-040..CP-045 in place rather than add CP-046..CP-051 duplicates by default. The root playbook says each feature keeps a stable `CP-NNN` ID and links to a dedicated feature file with the execution contract [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md:52-55`]. It also treats the linked per-feature files as the canonical scenario contracts and release-readiness inputs [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md:115-120`, `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md:161-163`].

CP-040..CP-045 already occupy active root index slots and feature-file links [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md:582-682`]. Adding CP-046..CP-051 with the same objectives would leave the stale wrong-layer CP-040..CP-045 entries active unless 063 also deprecates or removes them. That creates a worse release surface because release readiness requires no failing feature verdicts, all critical scenarios passing, and 100% scenario coverage for the root index [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md:150-158`].

Historical comparison does not require preserving the bad runner in the active playbook. Packet 060/002 already preserved the R1 scenario specs and run artifacts: the report lists the six scenario files as evidence and points to the summary/run-log paths [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:315-332`], while the Stage 4 summary captures each CP verdict and score [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-summary.md:7-25`].

Recommended ID policy:

```text
Default for active playbook fixes:
  Reuse CP-040..CP-045 in place.
  Correct each scenario's Call B and grep contract according to its owning layer.

Use successor IDs only if:
  1. 063 creates a spec-local experimental RED suite outside the active playbook, or
  2. the old CP-040..CP-045 entries are explicitly deprecated/archived so duplicate active release checks do not remain.
```

### RQ-6/RQ-7: Add "scenario layer partition" to the stress-test rubric

Prior iterations built the command-orchestrator rubric around entry-point fidelity, artifact/journal truth, producer/consumer compatibility, legal-stop semantics, sandbox containment, evaluator assets, and verdict-mode honesty. Iteration 7 adds one more P0 gate: **scenario layer partition**.

The gate asks whether a multi-scenario suite is homogeneous. CP-040..CP-045 are not. The root playbook groups them as a sk-improve-agent A/B stress battery covering protocol execution, proposal boundaries, Critic challenge, legal-stop gates, improvement deltas, and benchmark boundaries [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md:374-377`]. But only some of those objectives are command-flow objectives. Therefore the preflight should require a per-scenario table before runner authoring:

```text
Scenario layer partition:
- For each CP, name the behavior under test.
- Classify the natural entry point: leaf body, command, helper script, reducer, or cross-layer contract.
- List required inputs for that layer before dispatch.
- List forbidden assertions from adjacent layers.
- If the suite mixes layers, do not use one generic Call B harness for all scenarios.
```

This gate would have caught both failure modes: CP-040/043/044/045 used a leaf-body harness for command-owned evidence, while CP-041/042 used a leaf-body harness but failed to provide the leaf's required runtime/control inputs.

### RQ-3: 063 grep contracts should be split by layer, not just by RED/GREEN packet intent

The contract should now have three lanes:

1. **Leaf/body GREEN lane** for CP-041 and CP-042: assert the five required inputs are materialized, the candidate path is packet-local, canonical/mirrors remain unchanged, and `CRITIC PASS` labels appear when relevant. Do not require `score-candidate.cjs`, `legal_stop_evaluated`, `benchmark_completed`, or reducer output from the leaf run.
2. **Command-flow RED/PARTIAL lane** for CP-040/043/044/045 in a methodology packet: assert `/improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=... --iterations=1`, command-capable sandbox root, artifact roots, and known missing producer/consumer seams.
3. **Command-flow GREEN lane** after 064 wiring: require structured helper outputs, nested legal-stop gates, benchmark report/state rows, reducer-visible summaries, and session stop ordering.

This is the cleanest way to honor R1's lesson that agent-body invocation and command-flow invocation are both valid, but only for the discipline that actually lives at that layer [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:246-253`].

## New Open Questions

1. Should 063 modify the active cli-copilot playbook in place, or should it first create a spec-local command-flow harness report and leave active playbook edits to 064/065?
2. For CP-041 and CP-042, should the corrected direct leaf-body Call B use a rendered control bundle under `/tmp/cp-04N-spec/improvement/`, or should it invoke `/improve:agent` and assert leaf behavior only through command-produced candidate artifacts?
3. If successor IDs are used for a spec-local RED methodology run, what naming convention avoids confusing them with permanent cli-copilot release scenarios?

## Ruled Out

- **Ruled out: CP-046..CP-051 as default active-playbook successors.** They would duplicate objectives already indexed as CP-040..CP-045 and leave stale wrong-layer entries active unless 063 also deprecates the originals [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md:582-682`].
- **Ruled out: command-flow as the only valid 063 correction.** CP-041 proposal-only containment and CP-042 active Critic are body-owned disciplines in the current agent file [SOURCE: `.opencode/agent/improve-agent.md:22-42`, `.opencode/agent/improve-agent.md:131-150`].
- **Ruled out: preserving the bad runner in active playbook for historical traceability.** The R1 report and stage4 summary already preserve historical verdicts, file paths, and score [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:315-332`, `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-summary.md:7-25`].

## Sketches (if any)

### 063 ID and layer policy sketch

```markdown
## CP ID Policy

- Active playbook corrections reuse CP-040..CP-045 in place.
- Historical R1 evidence remains in packet 060/002 artifacts, not in stale active runners.
- New CP-046..CP-051 IDs are allowed only for a spec-local experimental suite or if CP-040..CP-045 are explicitly retired from the active root index.

## Scenario Layer Partition

| CP | Owning layer | Call B shape | GREEN/RED mode |
|---|---|---|---|
| CP-040 | command workflow | /improve:agent ... :auto --spec-folder=... --iterations=1 | RED/PARTIAL until helper/journal wiring is executable |
| CP-041 | leaf body or command containment | direct @improve-agent with full five-input bundle OR command flow with containment-only assertions | GREEN if candidate-local/no canonical mutation proves out |
| CP-042 | leaf body | direct @improve-agent with full five-input bundle | GREEN if CRITIC PASS labels and candidate-local output prove out |
| CP-043 | command workflow/reducer | /improve:agent ... :auto --spec-folder=... --iterations=1 | RED/PARTIAL until legal-stop producer/consumer shape is fixed |
| CP-044 | command workflow/scorer/legal-stop | /improve:agent ... :auto --spec-folder=... --iterations=1 | PARTIAL/GREEN depending scorer output plus legal-stop shape |
| CP-045 | command workflow/benchmark | /improve:agent ... :auto --spec-folder=... --iterations=1 | RED/PARTIAL until benchmark producer/assets are wired |
```

### Leaf/body required-input bundle sketch for CP-041/CP-042

```text
/tmp/cp-04N-spec/improvement/
  charter.md
  control.json
  integration-report.json
  target-profile.json
  candidates/

Call B must name:
  runtime_root=/tmp/cp-04N-spec/improvement
  charter=/tmp/cp-04N-spec/improvement/charter.md
  control=/tmp/cp-04N-spec/improvement/control.json
  target=/tmp/cp-04N-sandbox/.opencode/agent/cp-improve-target.md
  candidate_output=/tmp/cp-04N-spec/improvement/candidates/candidate-001.md
```

## Next Focus Suggestion

Iteration 8 should either start drafting the final synthesis outline from iterations 1-7 or do one last targeted pass over the command/skill docs to produce a minimal 064 diff checklist. The broad RQs are answerable; only handoff packaging remains under-specified.

## Convergence Assessment

This added real new value, so `convergence_signal: no`. The core research had already converged on command-flow testing, but this iteration found an important overcorrection risk and settled the CP ID policy for active-playbook versus spec-local scenarios.
