---
iteration: 6
date: 2026-05-02T13:32:00+02:00
focus_rqs: [RQ-1, RQ-3, RQ-5, RQ-6, RQ-7]
new_findings_count: 5
rqs_now_answerable: [RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 6

## Focus

This iteration resolved the downstream packet-slicing question left open by iteration 5. The new value is a concrete recommendation: split 063 as a command-flow RED methodology packet unless the operator intentionally expands it into a larger implementation-plus-test packet; reserve 064 for executable wiring and GREEN proof.

## Method

I read iterations 1-5 first and treated their broad RQ answers as baseline. I then checked the packet 003 spec/tasks, the R1 report and original 001 handoff, the improve-agent auto YAML, benchmark/evaluator references, and the current journal/reducer consumers to decide which work must precede a fair green stress verdict.

## Findings

### RQ-5/RQ-7: 063 should be a RED command-flow methodology packet by default

The parent packet already scopes 060/003 as research-only and explicitly says hand-off notes should feed packet 063 for command-flow stress tests and packet 064 for further sk-improve-agent edits if research supports them [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/spec.md:93-105`]. Its frontmatter also names separate open questions for "Concrete diff sketches to land in 064" and whether 063 should reuse CP-040..CP-045 IDs or create new variants [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/spec.md:24-28`]. That is strong process evidence that 063 and 064 should not be casually collapsed.

R1 itself also argues for a separate packet before any rerun: changing the invocation mode is enough surface area for packet-local `improvement/` setup, charter/control/profile files, YAML invocation, helper evidence capture, journal inspection, and stop assertions [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:177-185`]. The important refinement after iterations 3-5 is that a command-faithful 063 can still fail for real executable gaps even after the entry point is fixed. Therefore the safest default is:

```text
063 = command-flow RED methodology packet
064 = executable wiring + GREEN command-flow proof packet
```

This makes 063 successful if it proves the new harness enters `/improve:agent`, reaches the right artifact roots, and classifies failures at known producer/consumer seams instead of calling them model failures.

### RQ-1/RQ-3: Four readiness gates must precede a GREEN command-flow verdict

Iterations 1-5 identified individual seams; the downstream packet decision needs them as ordered readiness gates. A GREEN 063/064 verdict should not be attempted until all four are true:

1. **Entrypoint/harness root readiness.** Call B uses `/improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=... --iterations=1`, and the cwd contains command files, skill scripts, target agent, mirrors, and fixture assets. R1 proved the old prepended-body runner reached the thin mutator, not the orchestrated command [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:144-172`].
2. **Benchmark producer readiness.** The YAML names `run-benchmark.cjs` as the benchmark script [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:87-93`], but `step_run_benchmark` is still prose `action` and only later emits `benchmark_completed` assuming a `{benchmark_output_path}` exists [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-179`].
3. **Benchmark asset readiness.** The runner requires `--profile`, `--outputs-dir`, and `--output` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:202-214`], loads profile fixtures from `profile.benchmark.fixtureDir`, then scores `{outputsDir}/{fixture.id}.md` for each fixture [SOURCE: `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:217-224`]. Dynamic profiles currently emit `benchmark.fixtureDir:null` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/generate-profile.cjs:223-237`], so a GREEN packet needs packet-local benchmark profiles/fixtures or a static asset set.
4. **Journal producer/consumer readiness.** YAML emits legal-stop gate fields flat in `details` [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:192-198`], while the reducer renders `latestLegalStop.gateResults` only from `details.gateResults` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`].

This converts the previous "implementation-plus-test unless RED" advice into a checklist: if any readiness gate is intentionally left open, the scenario verdict mode must be expected RED/PARTIAL, not GREEN.

### RQ-6: The command-orchestrator rubric needs a "verdict-mode honesty" gate

Iteration 2's rubric had entry-point fidelity, ordered artifact/journal truth, producer/consumer compatibility, governance/stop semantics, and sandbox containment. Iteration 5 added evaluator-asset completeness. This pass adds a seventh, cross-cutting P0: **verdict-mode honesty**.

Verdict-mode honesty means the packet declares whether each scenario is expected GREEN, expected RED, or exploratory PARTIAL before execution, and then grades causality against that declaration. This is necessary because R1 produced 0 PASS / 2 PARTIAL / 4 FAIL [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-summary.md:7-25`], but the report correctly interpreted the thin-mutator halt as useful evidence about the wrong invocation layer rather than a random model failure [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:166-172`].

Add this P0 to the command-orchestrator stress rubric:

```text
Verdict-mode honesty:
- Scenario declares expected GREEN | expected RED | exploratory PARTIAL before the run.
- Expected RED is valid only when the failure maps to a named missing producer, missing consumer, wrong layer, or missing evaluator asset.
- Expected GREEN is allowed only after all readiness gates have concrete producers and structured consumers.
- A RED methodology PASS must not be counted as a product GREEN PASS.
```

This rubric prevents a repeat of 060/002's ambiguity, where the scenario text expected command-flow evidence but the runner actually tested a proposal-only leaf.

### RQ-1/RQ-5: 001's "expected outputs" encouraged too much in one packet

The 001 synthesis handoff recommended a single implementation packet that would author CP-040..CP-048, build the fixture, run R0, apply P0 diffs, implement/wire helper surfaces, run R1, patch failures, rerun R2/R3, and write the final report [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md:810-821`]. It also expected modified triad files, 6-10 new playbook entries, and a multi-round test report in one packet [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md:831-836`].

R1 showed why that bundle was too dense. The core ideas in 001 were correct: it warned that meta-agents need both candidate-quality and process-governance evidence, that legal-stop gates need producers, consumers, and validators, and that `action:` placeholders are unproven [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md:794-800`]. The miss was not conceptual; it was packet ergonomics. Too many layers were implemented at once, so the scenario runner drifted from the command shape 001 had sketched and hid that drift until R1.

The downstream correction should be:

| Packet | Purpose | Exit criterion |
|---|---|---|
| **063** | Command-flow harness and RED methodology proof | CP-040..CP-045 or successor IDs invoke `/improve:agent`; failures are classified against readiness gates and captured with grep/file/JSON assertions. |
| **064** | Minimal executable wiring | Patch benchmark command invocation, benchmark assets/output materialization, nested legal-stop producer shape, and stale event vocabulary. |
| **065** | GREEN rerun/report if 064 is large | Re-run the command-flow scenarios and require structured artifact/journal/reducer proof. |

063 can be expanded into implementation-plus-test only if it explicitly owns all 064 scope. Otherwise it should stop at honest RED proof.

### RQ-3/RQ-6: Event vocabulary drift should be a standalone 064 acceptance item

One remaining under-specified seam is vocabulary consistency. The skill's audit protocol includes `benchmark_completed`, `legal_stop_evaluated`, and `blocked_stop` [SOURCE: `.opencode/skill/sk-improve-agent/SKILL.md:271-292`], but the later boundary table still says iteration boundaries emit `candidate_generated`, `candidate_scored`, and `gate_evaluation` [SOURCE: `.opencode/skill/sk-improve-agent/SKILL.md:343-364`]. The command markdown has the same older Step 6B wording: after candidate generation and scoring, it still names `gate_evaluation` after stop-check or operator-gate evaluation [SOURCE: `.opencode/command/improve/agent.md:288-303`].

The journal helper accepts both old and new event names, including `gate_evaluation`, `legal_stop_evaluated`, `blocked_stop`, `session_ended`, and `session_end` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:44-69`]. That broad acceptance is useful for compatibility, but it makes grep-only test verdicts weaker. 064 should either document the accepted aliases as intentional compatibility or narrow the command/skill narrative so GREEN scenarios require the newer legal-stop-specific events. Until then, 063 should treat vocabulary drift as expected RED/PARTIAL evidence, not a product pass.

## New Open Questions

1. Should 063 reuse CP-040..CP-045 as expected-RED command-flow regression IDs, or preserve those files and add new CP-046..CP-051 command-flow variants?
2. If 064 owns benchmark assets, should the benchmark profile/fixture set be packet-local under `{spec_folder}/improvement/benchmark-profiles`, or promoted into `.opencode/skill/sk-improve-agent/assets/target-profiles`?
3. Should 065 exist as a separate GREEN rerun packet, or can 064 include the rerun if the implementation diff stays small?

## Ruled Out

- **Ruled out: making 063 green by only changing Call B syntax.** Correct command entry is necessary but insufficient because benchmark execution is still action-only, dynamic benchmark profiles lack fixture directories, and legal-stop producer/consumer shape is incompatible [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-198`, `.opencode/skill/sk-improve-agent/scripts/generate-profile.cjs:223-237`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`].
- **Ruled out: collapsing 063 and 064 by default.** The 003 spec already separates command-flow stress-test handoff from further code-edit handoff, and R1 says command-owned setup alone is enough surface area for a separate packet [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/spec.md:93-105`, `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:177-185`].
- **Ruled out: treating journal event acceptance as proof of semantic alignment.** The helper validates broad event enums and session-end fields, but the reducer still consumes legal-stop gates from one specific nested shape [SOURCE: `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:80-107`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`].

## Sketches (if any)

### 063 expected-RED packet sketch

```text
Goal:
  Prove the corrected test harness reaches /improve:agent and produces command-flow evidence, while honestly classifying remaining executable seams as RED/PARTIAL.

Tasks:
  1. Build command-capable temp project root with .opencode/command/improve, .opencode/skill/sk-improve-agent, fixture target, and mirrors.
  2. Convert CP-040..CP-045 or new CP-046..CP-051 to Call B:
     /improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=/tmp/cp-063-spec --iterations=1
  3. Add Layer-Owned Evidence Matrix + Evaluator Asset Preflight to each scenario.
  4. Run R1 and grade with verdict-mode honesty:
     - PASS for harness truth if command entry/artifact roots are proven.
     - RED/PARTIAL for benchmark action-only, missing benchmark assets, flat legal-stop shape, or vocabulary drift.
  5. Emit test report with a 064 handoff checklist.
```

### 064 GREEN wiring checklist

```text
Required before GREEN stress verdict:
  - YAML step_run_benchmark invokes run-benchmark.cjs with --profile, --profiles-dir, --outputs-dir, --output, --state-log, --integration-report.
  - Packet or skill assets provide benchmark profile JSON with real fixtureDir.
  - Workflow materializes {outputsDir}/{fixture.id}.md before benchmark execution.
  - legal_stop_evaluated emits details.gateResults.{contractGate,behaviorGate,integrationGate,evidenceGate,improvementGate}.
  - reduce-state output proves latestLegalStop.gateResults has all five keys.
  - Command/SKILL docs align on legal_stop_evaluated/blocked_stop/session_end vocabulary.
```

### Rubric addition

```markdown
## Verdict-Mode Honesty

- Expected verdict before run: GREEN | RED | PARTIAL
- If RED/PARTIAL, named causal seam:
- Owning layer for seam:
- Evidence proving seam:
- Why this is not a model-behavior failure:
- What downstream packet turns it GREEN:
```

## Next Focus Suggestion

Iteration 7 should now stop broadening the core RQs and either (a) draft the final synthesis outline from iterations 1-6, or (b) inspect only the CP-040..CP-045 scenario files to decide whether 063 should rewrite those IDs in place or add successor CP IDs.

## Convergence Assessment

This added real new value, so `convergence_signal: no`. The broad research questions are now answerable, but this iteration contributed the missing packet-slicing decision and a verdict-mode honesty gate that should prevent the next packet from mixing RED methodology evidence with GREEN product claims.
