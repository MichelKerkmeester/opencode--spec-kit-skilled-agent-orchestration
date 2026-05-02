---
iteration: 1
date: 2026-05-02T13:18:37+02:00
focus_rqs: [RQ-2, RQ-3, RQ-4]
new_findings_count: 8
rqs_now_answerable: [RQ-2, RQ-3, RQ-4]
convergence_signal: no
---

# Iteration 1

## Focus

This iteration targeted the layer-selection problem first: which agents put their discipline in the agent body, which delegate the full loop to a command/YAML workflow, and what that means for 063's Call B shape. I also pinned the grep contract to concrete journal events, artifact paths, and script invocations so the next packet can test the command flow rather than the thin mutator.

## Method

I read the R1 report and summary first, then sampled the stage4 log around failed/partial evidence lines instead of rereading the whole transcript. I then read the improve command, auto/confirm YAML, sk-improve-agent skill/script surfaces, the six CP-040..CP-045 playbook entries, and the candidate meta-agent bodies under `.opencode/agent/`. The strongest new evidence came from comparing producer/consumer shapes: the YAML now emits legal-stop events, but the reducer expects a different nested detail shape.

## Findings

### RQ-4: Body-level vs command-orchestrator agents

The command-orchestrator pattern is shared by **@improve-agent, @deep-research, and @deep-review**. `@improve-agent` is explicitly a leaf mutator that writes one packet-local candidate and stops before scoring, benchmarking, promotion, or mirror work; its body says journal emission is orchestrator-only and maps `candidate_generated`, `candidate_scored`, `benchmark_completed`, `legal_stop_evaluated`, and `blocked_stop` to the orchestrator lifecycle [SOURCE: `.opencode/agent/improve-agent.md:22-27`, `.opencode/agent/improve-agent.md:160-170`]. The `/improve:agent` command is the layer that verifies general-agent execution, parses `$ARGUMENTS`, loads the matching YAML, and produces `{spec_folder}/improvement/` outputs [SOURCE: `.opencode/command/improve/agent.md:7-17`, `.opencode/command/improve/agent.md:205-209`].

`@deep-research` and `@deep-review` are the closest analogs: both bodies say they execute **one iteration**, not the full loop, and name the command YAML workflow as loop owner [SOURCE: `.opencode/agent/deep-research.md:24-31`, `.opencode/agent/deep-review.md:23-31`]. Their bodies still contain rich per-iteration discipline, but the lifecycle loop, convergence, dispatch, and reducer synchronization are command-owned rather than body-only.

The other inspected agents are body-level or orchestrator-body disciplines:

| Agent | Classification | Evidence |
|---|---|---|
| `@write` | Body-level LEAF | Template-first creation, sk-doc loading, validation, and DQI gates live in the body; no command owner is named [SOURCE: `.opencode/agent/write.md:22-31`, `.opencode/agent/write.md:42-65`]. |
| `@improve-prompt` | Body-level LEAF | The body owns the 5-step prompt escalation and output package; write/edit/bash are denied [SOURCE: `.opencode/agent/improve-prompt.md:22-40`, `.opencode/agent/improve-prompt.md:86-107`]. |
| `@debug` | Body-level LEAF | The body owns fresh-context handoff plus 5-phase observe/analyze/hypothesize/fix workflow [SOURCE: `.opencode/agent/debug.md:22-30`, `.opencode/agent/debug.md:105-149`]. |
| `@context` | Body-level LEAF | The body owns canonical continuity retrieval and direct exploration; it never delegates or writes [SOURCE: `.opencode/agent/context.md:25-34`, `.opencode/agent/context.md:45-56`]. |
| `@orchestrate` | Orchestrator body | The body itself is the senior commander and dispatch protocol; it is not a leaf called by a command loop [SOURCE: `.opencode/agent/orchestrate.md:18-35`, `.opencode/agent/orchestrate.md:87-113`]. |
| `@review` | Body-level LEAF | The body owns read-only review workflow and rubric application [SOURCE: `.opencode/agent/review.md:22-31`, `.opencode/agent/review.md:43-57`]. |
| `@code` | Body-level LEAF with caller gate | The body owns the sk-code routing, Builder/Critic/Verifier discipline, and coder acceptance rubric; it has an orchestrator-only dispatch gate, but no command-level loop owner [SOURCE: `.opencode/agent/code.md:22-32`, `.opencode/agent/code.md:45-58`, `.opencode/agent/code.md:128-149`]. |

This means the reusable template should ask "is the discipline under test intrinsic to one agent invocation, or is the agent only a step in a command-owned workflow?" before choosing the 059 prepend-body pattern.

### RQ-2: Exact Call B dispatch shape for 063

063's Call B should be a **command invocation**, not a YAML-step-by-step prompt and not a prepended `.opencode/agent/improve-agent.md` body. The command frontmatter defines the syntax as `<agent_path> [:auto|:confirm] [--spec-folder=PATH] [--iterations=N]` [SOURCE: `.opencode/command/improve/agent.md:1-4`]. The setup phase explicitly detects a mode suffix, target path, `--spec-folder`, and `--iterations` from `$ARGUMENTS`; if all are present, it omits the user questions [SOURCE: `.opencode/command/improve/agent.md:74-90`].

Recommended Call B shape:

```text
/improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=/tmp/cp-063-spec --iterations=1
```

The runner should execute this with the sandbox as the effective project root, or otherwise make the target path and spec folder unambiguously point to the sandbox and temp spec. The old CP-040/041/043/045 runners used `--add-dir /tmp/cp-NNN-sandbox` while still constructing Call B by prepending the agent body plus `Depth: 1` [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/013-skill-load-not-protocol.md:70-78`, `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/014-proposal-only-boundary.md:72-83`, `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/016-legal-stop-gate-bundle.md:68-79`, `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/018-benchmark-completed-boundary.md:68-79`]. That runner shape reproduced the mutator's missing-input halt instead of invoking the command workflow [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:75-83`, `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:166-172`].

YAML-step-by-step should be treated as **internal evidence**, not the external Call B prompt. The command says to load the matching YAML after setup [SOURCE: `.opencode/command/improve/agent.md:14-17`], and the skill's workflow steps say autonomous mode maps to `assets/improve_improve-agent_auto.yaml`, interactive mode maps to `assets/improve_improve-agent_confirm.yaml`, then the workflow executes scan -> mutator dispatch -> score -> benchmark -> ledger -> reduce -> stop checks [SOURCE: `.opencode/skill/sk-improve-agent/SKILL.md:266-280`]. A scenario may grep for the YAML's script traces, but should not replace `/improve:agent` with a hand-written YAML prompt.

### RQ-3: Grep contract for 063 Call B verdict

The Call B verdict should combine transcript greps with filesystem artifact checks. The minimum artifact roots are already declared in the auto YAML: `{spec_folder}/improvement`, `{spec_folder}/improvement/candidates`, `agent-improvement-state.jsonl`, `agent-improvement-dashboard.md`, `experiment-registry.json`, `integration-report.json`, and `benchmark-runs/{target_profile}` [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:96-110`].

The specific script invocation traces to require are:

| Contract area | Required evidence | Sources |
|---|---|---|
| Integration scan | `node .opencode/skill/sk-improve-agent/scripts/scan-integration.cjs --agent={agent_name} --output={spec_folder}/improvement/integration-report.json` and a real `integration-report.json` | [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:125-131`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:150-152`] |
| Dynamic profile | `node .opencode/skill/sk-improve-agent/scripts/generate-profile.cjs --agent={target_path} --output={spec_folder}/improvement/dynamic-profile.json` | [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:131-135`] |
| Candidate path | `candidate_generated` event with `candidatePath` under `{spec_folder}/improvement/candidates` | [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:153-159`] |
| Scoring | `score-candidate.cjs --candidate={candidate_path} --baseline={target_path} ... --output={score_output_path}` plus `candidate_scored` event | [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:162-167`] |
| Baseline/delta | Score JSON fields `baselineScore`, `delta`, `thresholdDelta`, and `recommendation` | [SOURCE: `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:376-380`, `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:422-450`] |
| Benchmark boundary | `benchmark_completed` event after benchmark output path is written; sentinel/file output for fixture scenarios | [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-179`, `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/018-benchmark-completed-boundary.md:73-79`] |
| Reducer | `node .opencode/skill/sk-improve-agent/scripts/reduce-state.cjs {spec_folder}/improvement` | [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:183-188`] |
| Legal stop | `legal_stop_evaluated` with `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, `improvementGate`, then `blocked_stop` with `failedGates` when any gate fails | [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:192-198`, `.opencode/skill/sk-improve-agent/SKILL.md:279-292`] |
| Session end | `session_end` with valid `stopReason` and `sessionOutcome` | [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:209-211`, `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:93-103`] |

The most important new seam: **event-name greps are not enough.** The reducer's `buildJournalSummary()` counts event types, but its `latestLegalStop` reads only `details.gateResults` for `legal_stop_evaluated` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:173-218`]. The YAML currently emits `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, `improvementGate`, `baselineScore`, `score`, `delta`, and `thresholdDelta` as flat `details` fields, not under `details.gateResults` [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:192-198`]. Therefore 063 should add a producer/consumer compatibility grep or JSON assertion:

```text
improvement-journal.jsonl contains eventType:"legal_stop_evaluated"
AND details.gateResults.contractGate exists
AND details.gateResults.behaviorGate exists
AND details.gateResults.integrationGate exists
AND details.gateResults.evidenceGate exists
AND details.gateResults.improvementGate exists
```

or the reducer should be changed in a later implementation packet to consume the current flat YAML shape. Without that, a Call B can satisfy transcript greps while the reducer/dashboard silently sees an empty legal-stop bundle.

R1 confirms why this stronger contract is needed. CP-040's Call B halted with `missing-required-input` and only hit `candidate_scored` twice while the other helper labels and candidate path were zero [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-run-log.txt:404-433`]. CP-043 had zero legal-stop field counts after the same missing-input halt [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-run-log.txt:1158-1178`]. CP-045 had no sentinel, no benchmark labels, and failed as a tripwire-dirty benchmark boundary case [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-run-log.txt:1518-1531`].

### RQ-1/RQ-5 side finding: which 060/002 diffs are complete vs need iteration

Functionally complete as shipped:

1. **Proposal-only mutator boundary wording and active Critic pass** are complete at the agent-body layer. The body now requires `CRITIC PASS` checks for scorer overfit, helper bypass, mirror drift concealment, fixture narrowness, and promotion leakage [SOURCE: `.opencode/agent/improve-agent.md:131-150`]. Further iteration should test it through valid command-provided inputs; the text itself is not the next bottleneck.
2. **`.gemini/agents` mirror path correction** is complete for the static scanner default: `scan-integration.cjs` now names `.gemini/agents/{name}.md` rather than stale `.agents/agents` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:16-18`]. Further iteration is only needed if the next packet wants a manifest-driven mirror inventory.
3. **Score-candidate baseline/delta output** is materially improved: the script now computes `baselineScore`, `delta.total`, per-dimension deltas, `thresholdDelta`, and `candidate-better` vs `candidate-acceptable` recommendations when `--baseline` is present [SOURCE: `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:7-11`, `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:422-450`].

Needs further iteration:

1. **YAML legal-stop event shape** needs producer/consumer alignment because the reducer expects `details.gateResults` while YAML emits flat detail fields [SOURCE: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:192-198`].
2. **Benchmark execution remains action-shaped** in the YAML: it has an action to run profile fixtures and an event emission with `{benchmark_output_path}`, but this iteration did not find a concrete `run-benchmark.cjs` command in the auto YAML loop [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-179`]. CP-045's sentinel remained absent in R1 [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-run-log.txt:1523-1528`].
3. **Scenario methodology** needs a new runner, not more wording edits. The 001 synthesis had the correct Call B sketch as `/improve:agent ".opencode/agent/cp040.md" :auto --spec-folder=/tmp/cp-040-spec --iterations=1` [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/001-deep-research-recommendations/research/research.md:142-145`], but 060/002 scenario implementation changed Call B to prepended agent-body dispatch [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/013-skill-load-not-protocol.md:70-78`]. That is the 854-line synthesis gap R1 exposed: it warned about command-path Call B, but did not force the implementation to preserve that invocation layer.

## New Open Questions

1. Should 063 fix the YAML producer shape to write `details.gateResults`, or should it first write tests that prove the reducer currently loses flat legal-stop details?
2. Should Call B run Copilot from inside `/tmp/cp-063-sandbox` as cwd, or can the CLI command reliably resolve a sandbox target through `--add-dir` without touching repo-root `.opencode/agent/*.md`?
3. Should benchmark completion be implemented as a real `run-benchmark.cjs` command in YAML before the next stress run, or should 063 only define the failing grep contract and leave wiring to a later packet?
4. Does `improvement-journal.cjs` intentionally still accepts `benchmarkPlateau` and `plateau` as stop reasons even though the skill says the frozen helper enum is narrower? The helper constants include both labels [SOURCE: `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:21-30`], while the skill's "Frozen Helper Enums" says only `converged`, `maxIterationsReached`, `blockedStop`, `manualStop`, `error`, and `stuckRecovery` are accepted [SOURCE: `.opencode/skill/sk-improve-agent/SKILL.md:351-358`].

## Ruled Out

- **Ruled out: "prepend body harder" as a useful R2 path.** The R1 report already explains that rerunning the same prepend-agent-body pattern would reproduce the mutator's required-input halt rather than exercise command-owned work [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:177-184`].
- **Ruled out: YAML-step-by-step as external Call B.** The command is the user-facing invocation and YAML is the internal workflow loaded after setup; replacing the command with a hand-written YAML execution prompt would test a manual wrapper, not `/improve:agent` [SOURCE: `.opencode/command/improve/agent.md:7-17`, `.opencode/skill/sk-improve-agent/SKILL.md:266-280`].
- **Ruled out: event-name-only PASS.** `legal_stop_evaluated` can be present while the reducer sees no gate bundle if details are flat instead of nested under `gateResults` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:192-198`].

## Sketches (if any)

### 063 Call B runner sketch

```bash
rm -rf /tmp/cp-063-sandbox /tmp/cp-063-sandbox-baseline /tmp/cp-063-spec
mkdir -p /tmp/cp-063-sandbox
cp -a .opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/. /tmp/cp-063-sandbox/
cp -a /tmp/cp-063-sandbox /tmp/cp-063-sandbox-baseline

cat > /tmp/cp-063-prompt-B.txt <<'EOF'
/improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=/tmp/cp-063-spec --iterations=1

Task ID: CP-063-CALL-B.
Use the fixture target in the sandbox. Run one disciplined improvement iteration and leave canonical/mirror files unchanged unless a guarded promotion step is explicitly reached.
EOF

(cd /tmp/cp-063-sandbox && copilot -p "$(cat /tmp/cp-063-prompt-B.txt)" --model gpt-5.5 --allow-all-tools --no-ask-user 2>&1) | tee /tmp/cp-063-B-command.txt
```

If Copilot command resolution requires repo-root command files, run from repo root but make the prompt explicitly state that target and writes are under `/tmp/cp-063-sandbox` and `/tmp/cp-063-spec`; then add a negative grep/diff to prove repo-root `.opencode/agent/improve-agent.md` was not the target.

### 063 verdict grep sketch

```bash
find /tmp/cp-063-spec/improvement -type f -maxdepth 4 -print | sort > /tmp/cp-063-artifacts.txt
cat /tmp/cp-063-B-command.txt /tmp/cp-063-spec/improvement/improvement-journal.jsonl \
  /tmp/cp-063-spec/improvement/agent-improvement-state.jsonl \
  /tmp/cp-063-spec/improvement/experiment-registry.json \
  /tmp/cp-063-spec/improvement/integration-report.json \
  /tmp/cp-063-spec/improvement/agent-improvement-dashboard.md \
  > /tmp/cp-063-B-combined.txt

for label in \
  "scan-integration.cjs" \
  "generate-profile.cjs" \
  "candidate_generated" \
  "candidate_scored" \
  "score-candidate.cjs" \
  "baselineScore" \
  "delta" \
  "thresholdDelta" \
  "benchmark_completed" \
  "legal_stop_evaluated" \
  "contractGate" \
  "behaviorGate" \
  "integrationGate" \
  "evidenceGate" \
  "improvementGate" \
  "blocked_stop" \
  "failedGates"; do
  grep -c "$label" /tmp/cp-063-B-combined.txt
done > /tmp/cp-063-B-field-counts.txt

node -e '
const fs = require("node:fs");
const lines = fs.readFileSync("/tmp/cp-063-spec/improvement/improvement-journal.jsonl", "utf8").trim().split(/\n+/).filter(Boolean).map(JSON.parse);
const legal = lines.find((event) => event.eventType === "legal_stop_evaluated");
if (!legal) process.exit(10);
const gates = legal.details && legal.details.gateResults;
for (const gate of ["contractGate","behaviorGate","integrationGate","evidenceGate","improvementGate"]) {
  if (!gates || !(gate in gates)) process.exit(11);
}
'
```

### Reusable test-layer-selection template

Before authoring CP-XXX scenarios for a new agent, packet authors should answer:

1. **Unit under test:** Is the discipline intrinsic to the agent body, command markdown, YAML workflow, skill router, helper script, or reducer?
2. **Entry point:** What is the user-facing entry point that normally exercises that discipline?
3. **Leaf vs loop:** Is the agent a one-shot leaf inside a broader loop, or does one agent invocation own the whole behavior?
4. **Evidence owner:** Which layer writes the artifact/journal/return field that will be grepped?
5. **Producer/consumer compatibility:** Does the producer shape match the reducer/dashboard/test consumer shape?
6. **Negative control:** What should Call A be allowed to do that Call B must not do?
7. **Sandbox root:** From which cwd are paths resolved, and how is repo-root mutation prevented?
8. **Pass shape:** Are greps ordered by dependency, or just a bag of labels?

For body-level agents like `@code`, prepending the agent body plus `Depth: 1` can be a valid Call B because the discipline is in the body. For command-orchestrator agents like `@improve-agent`, `@deep-research`, and `@deep-review`, Call B must invoke the command-owned entry point or a command-faithful harness.

## Next Focus Suggestion

Iteration 2 should focus on RQ-6 and the grading rubric: adapt the 5-dim Coder Acceptance Rubric into a command-orchestrator stress-test rubric with separate dimensions for entry-point fidelity, artifact/journal truth, producer/consumer compatibility, sandbox containment, and negative-control differential. It should also decide whether 063 is a test-only packet that exposes the YAML/reducer shape mismatch, or an implementation packet that fixes the mismatch before running Call B.

## Convergence Assessment

This iteration added real new value, so `convergence_signal: no`. The main novel contribution is the producer/consumer mismatch for `legal_stop_evaluated`: R1 and 060/001 focused on wrong invocation layer and missing command evidence, but 063 also needs to verify that command-produced journal details are consumable by the reducer rather than merely grep-visible.
