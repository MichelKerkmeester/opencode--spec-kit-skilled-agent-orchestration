---
title: "Research Synthesis: 060/003 — Followup Research on 002 R1 Results"
description: "Synthesis of 10 cli-copilot iterations on how to further improve sk-improve-agent + the testing methodology + downstream packets given 002 R1's 0/2/4 score and the test-layer-selection meta-finding."
date: 2026-05-02T13:41:52+02:00
iterations_run: 10
convergence_iteration: 9
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research"
    last_updated_at: "2026-05-02T13:41:52+02:00"
    last_updated_by: "codex-gpt-5"
    recent_action: "Synthesized 10 cli-copilot deep-research iterations into final research.md"
    next_safe_action: "Use handover.md to start packet 063 or 064"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/research.md
    completion_pct: 100
    open_questions:
      - "Whether 064 includes the GREEN rerun or leaves it to optional 065"
    answered_questions:
      - "RQ-1 through RQ-7 answered"
---

# Research Synthesis: 060/003 — Followup Research

<!-- ANCHOR:synthesis -->
## 1. EXECUTIVE SUMMARY

The main recommendation is to split the next work by proof layer. Packet 063 should prove the corrected command-flow harness and classify remaining failures honestly; packet 064 should wire the executable producers and consumers needed for a product GREEN. Iterations 6, 8, 9, and 10 converged on that split: 063 owns command-flow methodology and/or active CP contract correction, while 064 owns benchmark materialization, nested legal-stop shape, stop vocabulary, YAML parity, and native runtime-truth reconciliation [iteration-006.md:72-78; iteration-008.md:123-154; iteration-009.md:28-35; iteration-010.md:42-50].

R1 did not show that `sk-improve-agent` is hopeless. It showed that CP-040..CP-045 used the wrong authority source for several claims. The old Call B prepended the `@improve-agent` body and hit the proposal-only mutator, while the expected evidence lived in `/improve:agent`, YAML steps, helper scripts, journals, reducers, and benchmark artifacts [002/test-report.md:75-98; 002/test-report.md:144-185; 002/test-report.md:246-253]. The follow-on test must therefore invoke the command layer when asserting command-owned evidence.

Do not overcorrect. CP-041 and CP-042 test body-owned disciplines: proposal-only containment and active Critic checks. They can remain leaf/body tests if the five required runtime/control inputs are materialized. CP-040, CP-043, CP-044, and CP-045 need command-flow lanes because their evidence comes from helper execution, scoring, legal-stop state, reducer output, and benchmark reports [iteration-007.md:22-38; iteration-007.md:84-92].

The reusable lesson is sharper than "use the right prompt." Every CP authoring pass needs a layer-owned evidence matrix and an authority ladder before scenario text is written: natural entry point, evidence owner, consumer, producer readiness, harness-root completeness, evaluator assets, verdict mode, release surface, and stale-state override rules [iteration-004.md:73-88; iteration-005.md:78-113; iteration-009.md:45-57; iteration-010.md:30-36].

## 2. METHODOLOGY

This synthesis treats `research/iterations/iteration-001.md` through `iteration-010.md` as the canonical research record. The loop ran 10 cli-copilot iterations on gpt-5.5 with fresh-per-iteration prompts, and each iteration produced a markdown narrative with focused RQ coverage. Iteration 9 effectively reached synthesis-readiness by producing the convergence table and downstream packet split; iteration 10 continued to the cap and added the final source-authority guardrail [iteration-009.md:59-75; iteration-010.md:22-36; iteration-010.md:110-116].

The inputs were the 060/003 spec RQs, the 060/002 R1 test report, the prior 060/001 synthesis, the active CP-040..CP-045 playbook files, the `@improve-agent` body, the `/improve:agent` command/YAML surfaces, helper scripts, reducer consumers, benchmark assets, and the other meta-agent bodies. The spec itself required research-only synthesis and handoff notes, not source edits, CP reruns, 063 playbook-entry design, or constitutional changes [spec.md:93-107; spec.md:127-134; iteration-010.md:38-42].

Where iterations disagreed, the later evidence wins only when it explained a narrower layer or governance constraint. Example: iterations 1-4 said Call B should invoke `/improve:agent`; iteration 7 refined that to "command-flow for command-owned evidence, leaf/body for CP-041/042." Iterations 6 and 7 also looked contradictory on CP IDs, but iteration 9 reconciled them: expected-RED methodology evidence should stay spec-local, while active playbook corrections should reuse stable CP-040..CP-045 IDs only when the resulting contracts can be graded under PASS/PARTIAL/FAIL/SKIP [iteration-007.md:47-65; iteration-009.md:22-35].

## 3. PER-RQ FINDINGS

### RQ-1: Of the 6 P0/P1 diffs in 002, which need further iteration?

**Status:** ANSWERED
**Answer:** Three areas are functionally complete enough to test as shipped: proposal-only mutator boundary, active Critic wording, and baseline/current scorer output. The low-risk mirror-path correction is also mostly complete. The further-iteration targets are benchmark execution/assets/materialization, legal-stop producer/consumer shape, event and stop-reason vocabulary, auto/confirm YAML parity, and native RT/playbook oracle alignment.
**Evidence:** Iteration 1 split body/scorer/mirror changes from open YAML/legal-stop/benchmark/methodology seams [iteration-001.md:89-101]. Iteration 2 reached the same split and added event vocabulary drift [iteration-002.md:59-72]. Iteration 5 found the benchmark-profile/fixture/output precondition [iteration-005.md:22-46]. Iteration 8 added auto/confirm parity, stop-reason conflict, and native RT drift [iteration-008.md:22-81].
**Recommended action:** Put no more wording-only effort into the `@improve-agent` proposal-only body before command-flow evidence exists. Assign 064 the executable joins: benchmark command invocation, benchmark assets, materializer, nested `details.gateResults`, stop enum truth, docs/tests parity, and RT-028/RT-032 reconciliation.

### RQ-2: Exact dispatch shape for 063 Call B?

**Status:** ANSWERED
**Answer:** The command-owned Call B is:

```text
/improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=/tmp/cp-063-spec --iterations=1
```

It must run from a command-capable temp project root containing `.opencode/command/improve`, `.opencode/skill/sk-improve-agent`, the fixture target under `.opencode/agent/`, mirrors, and any benchmark/profile assets. YAML-step-by-step prompts are internal evidence only, not the external Call B. A bare fixture cwd and repo-root plus `--add-dir` are both under-specified for the command's relative path assumptions.
**Evidence:** Iteration 1 rejected YAML-step-by-step as external Call B and sketched the command form [iteration-001.md:42-54; iteration-001.md:118-136]. Iteration 3 refined the cwd requirement and command-capable sandbox shape [iteration-003.md:22-34; iteration-003.md:97-117]. Iteration 7 narrowed the command-flow lane to CP-040/043/044/045, with CP-041/042 allowed as body-layer tests if inputs exist [iteration-007.md:26-38].
**Recommended action:** 063 should create a command-capable temp root, invoke the command form above for command-owned CPs, and reserve direct `@improve-agent` leaf dispatch only for CP-041/042-style body-owned checks with the full five-input bundle.

### RQ-3: Grep contract for 063 Call B verdict?

**Status:** ANSWERED
**Answer:** The contract needs three lanes:

1. Leaf/body GREEN for CP-041/042: required inputs exist, packet-local candidate path exists, canonical/mirror files stay clean, and Critic labels appear where relevant.
2. Command-flow RED/PARTIAL for 063 methodology: command entry and artifact roots are proven, and known producer/consumer gaps are causally classified.
3. Command-flow GREEN after 064: structured helper outputs, benchmark report/state rows, nested legal-stop gates, reducer-visible summaries, and session stop ordering all pass.

**Evidence:** Iteration 1 listed minimum artifact roots and command-flow events, then warned that event-name greps are insufficient when the reducer consumes a different JSON shape [iteration-001.md:56-87]. Iteration 3 added benchmark report/state assertions [iteration-003.md:36-53; iteration-003.md:119-136]. Iteration 5 specified `--outputs-dir` and benchmark profile/fixture materialization [iteration-005.md:22-38; iteration-005.md:129-157]. Iteration 7 split grep contracts by owning layer [iteration-007.md:84-92]. Iteration 8 made structured consumer shape mandatory [iteration-008.md:94-107].
**Recommended action:** 063 should implement the RED/PARTIAL command-flow methodology lane by default and avoid claiming product GREEN. 064 should own the GREEN lane and the material producers that make it meaningful.

### RQ-4: Other meta-agents with command-orchestrator pattern?

**Status:** ANSWERED
**Answer:** `@improve-agent`, `@deep-research`, and `@deep-review` are command-loop leaves: their bodies run one leaf step while commands/YAML own loop state, lifecycle, convergence, reducers, and artifacts. `@write`, `@improve-prompt`, `@debug`, `@context`, and `@review` are body-level leaves. `@code` is body-level with an orchestrator caller gate. `@orchestrate` is a primary orchestrator body, not a command-loop leaf.
**Evidence:** Iteration 1 classified all listed agents and cited body/command evidence [iteration-001.md:22-40]. Iteration 4 refined the taxonomy into command-loop leaf, body-level leaf, body-level leaf with caller gate, and primary orchestrator body [iteration-004.md:44-59].
**Recommended action:** Only command-loop leaves need command-layer stress packets for command-owned evidence. Body-level agents can use body-loaded stress tests, while `@orchestrate` needs orchestration/delegation tests rather than leaf-agent Call B tests.

### RQ-5: Gaps 060/001 missed that R1 surfaced?

**Status:** ANSWERED
**Answer:** 060/001 had the correct conceptual direction but missed blocking readiness gates. It sketched `/improve:agent` Call B, warned that artifact presence is smoke-test-level, and noted action placeholders are unproven. It did not force those ideas into implementation gates, so 060/002 drifted into prepended-body Call B, expected benchmark proof from an action-only step, lacked harness-root completeness, missed per-scenario layer partition, and did not account for release-surface or native-oracle implications.
**Evidence:** Iteration 2 found the synthesis-to-implementation gap: command shape was known but not non-negotiable [iteration-002.md:73-79]. Iteration 3 added fixture/harness-root completeness [iteration-003.md:55-72]. Iteration 6 showed the original expected-output bundle was too dense for one packet [iteration-006.md:64-78]. Iteration 7 added per-scenario layer ownership and required-input completeness [iteration-007.md:39-45]. Iteration 9 added release-surface honesty and native RT alignment scope [iteration-009.md:22-43].
**Recommended action:** Future research syntheses should distinguish "scenario can be authored" from "scenario can honestly be expected GREEN." Add readiness gates before scenario writing, not only lessons after failure.

### RQ-6: Right rubric for meta-agent stress tests?

**Status:** ANSWERED
**Answer:** The 5-dim Coder Acceptance Rubric is a useful ancestor but must be adapted for meta-agent pipelines. The final rubric is command-orchestrator-specific: entry-point fidelity, ordered artifact/journal truth, producer/consumer compatibility, governance/stop semantics, sandbox containment, evaluator asset completeness, verdict-mode honesty, scenario layer partition, cross-playbook oracle check, release-surface honesty, and evidence source authority.
**Evidence:** Iteration 2 replaced implementation-output scoring with a five-dimension command-orchestrator rubric [iteration-002.md:22-38; iteration-002.md:95-118]. Iteration 5 added evaluator asset completeness [iteration-005.md:78-94]. Iteration 6 added verdict-mode honesty [iteration-006.md:46-62]. Iteration 7 added scenario layer partition [iteration-007.md:67-82]. Iteration 8 added cross-playbook oracle checks and structured shape assertions [iteration-008.md:77-107]. Iterations 9 and 10 added release-surface honesty and evidence source authority [iteration-009.md:45-57; iteration-010.md:30-36].
**Recommended action:** Use this rubric for 063/064 and turn the P0 items into scenario preflight questions, not after-the-fact report commentary.

### RQ-7: Reusable test-layer-selection template?

**Status:** ANSWERED
**Answer:** The reusable template should start with an evidence authority ladder, then a layer-owned evidence matrix, evaluator asset preflight, scenario layer partition, cross-playbook oracle check, release-surface declaration, and stale-state guard. Its most important rule is that every expected signal names its authoritative producer and structured consumer before the CP body is written.
**Evidence:** Iteration 2 produced the initial preflight with unit under test, natural entry point, evidence owner, consumer check, dependency order, negative control, containment, and P0 failures [iteration-002.md:40-57; iteration-002.md:120-138]. Iteration 4 converted that into a layer-owned evidence matrix [iteration-004.md:73-88; iteration-004.md:144-157]. Iteration 5 added evaluator asset preflight [iteration-005.md:96-113]. Iteration 10 added the authority ladder and stale-state guard [iteration-010.md:52-74].
**Recommended action:** Constitutionalize a lightweight version of the test-layer-selection rule as feedback memory or an authoring checklist. Keep the full matrix in packet templates/manual playbooks rather than hard-coding all packet-specific details into global instructions.

## 4. PACKET 063 SKETCH (Command-Flow Stress Tests)

- **Packet name suggestion:** `063-improve-agent-command-flow-stress-tests` for the follow-on named in 002. If the packet is methodology-only, use a subtitle such as "spec-local RED/PARTIAL command-flow proof" to avoid implying product GREEN [002/test-report.md:373-383; iteration-009.md:28-35].
- **Spec scope:** In scope: command-capable temp root, `/improve:agent` Call B, artifact-root checks, layer-specific CP lanes, RED/PARTIAL classification for known executable seams, and handoff to 064. Out of scope unless explicitly expanded: benchmark materializer, YAML auto/confirm parity patches, stop enum reconciliation, native RT repair, and GREEN rerun [iteration-006.md:72-78; iteration-009.md:134-148].
- **Call B dispatch shape:** `/improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=/tmp/cp-063-spec --iterations=1`, run from a temp project root containing command files, skill scripts, target agent, mirrors, fixture data, and allowed external spec/log paths [iteration-003.md:22-34; iteration-003.md:97-117].
- **CP IDs:** Reuse CP-040..CP-045 for active playbook corrections. Use CP-046..CP-051 only for a spec-local experimental suite or if CP-040..CP-045 are explicitly archived/deprecated from the active root index [iteration-007.md:47-65; iteration-007.md:100-115; iteration-009.md:22-35].
- **Verdict grep contract:** Require command entry, `improvement/` roots, `integration-report.json`, `dynamic-profile.json`, candidate path under `improvement/candidates`, `candidate_generated`, `score-candidate.cjs`, `candidate_scored`, score JSON with `baselineScore`, `delta`, `thresholdDelta`, `recommendation`, `legal_stop_evaluated`, `blocked_stop`, reducer output, and for GREEN only `details.gateResults.*`, benchmark report `status:"benchmark-complete"`, `benchmark_run` state row, and ordered `session_end` [iteration-001.md:56-87; iteration-003.md:36-53; iteration-004.md:33-42; iteration-008.md:94-107].
- **RED/GREEN methodology:** 063 may PASS as a methodology packet if it proves the corrected harness reaches the owning layer and classifies failures against known producer/consumer gaps. It must not count expected RED as product GREEN. GREEN product proof belongs after 064 wiring [iteration-004.md:22-31; iteration-006.md:46-62; iteration-008.md:147-154].
- **Pre-flight requirements:** Build a command-capable sandbox root; materialize the fixture target under `.opencode/agent/`; keep spec artifacts under `/tmp/cp-063-spec/improvement`; include Layer-Owned Evidence Matrix and Evaluator Asset Preflight; define expected GREEN/RED/PARTIAL before execution [iteration-003.md:61-72; iteration-005.md:96-113; iteration-006.md:100-115].
- **Score-progression target:** For active release scenarios, do not install expected-RED contracts that make the release surface fail unless the packet explicitly accepts release-not-ready. The progression target is 063 methodology PASS with RED/PARTIAL product findings, then 064 GREEN product PASS, with optional 065 rerun if 064 is too large [iteration-008.md:147-154; iteration-009.md:45-57; iteration-010.md:44-48].

## 5. PACKET 064 SKETCH (If Applicable)

064 is applicable. The iterations consistently found executable gaps that a command-faithful 063 will expose but cannot honestly turn GREEN without code/doc/test changes.

- **Scope:** Patch both auto and confirm YAML unless one mode is explicitly deferred. Replace benchmark `action` prose with a concrete command/helper call; emit `benchmark_completed` only after the report exists; emit `legal_stop_evaluated.details.gateResults.*`; preserve confirm `gateDecision` as supplemental detail, not a schema fork [iteration-008.md:22-38; iteration-008.md:123-145].
- **Benchmark assets/materialization:** Choose packet-local assets or static skill assets. Provide benchmark profile JSON with real `benchmark.fixtureDir`, fixture JSON files, and a materializer that writes `{outputsDir}/{fixture.id}.md` before `run-benchmark.cjs` runs [iteration-005.md:22-38; iteration-005.md:129-157; iteration-008.md:40-57].
- **Journal/reducer contract:** Standardize GREEN proof on nested `details.gateResults` and reducer-visible `latestLegalStop.gateResults`; optionally keep flat-field reducer tolerance only for migration compatibility [iteration-005.md:58-76; iteration-008.md:94-107].
- **Stop vocabulary:** Resolve the SKILL/helper/test conflict around `plateau` and `benchmarkPlateau`. Either remove them from helper/tests to match the narrow SKILL enum, or document them as compatibility stop reasons and update docs/verdict greps [iteration-008.md:59-75].
- **Native oracle repair:** Reconcile RT-028/RT-032 command names, target agent, event vocabulary, and expected signal lists before using them as hard GREEN gates [iteration-008.md:77-92; iteration-009.md:37-43].
- **Lockstep checklist:** Update YAML, command docs, SKILL docs, journal tests, reducer assertions, native RT scenarios, and cli-copilot CP contracts together so no single surface becomes the stale oracle [iteration-008.md:123-145].
- **Conflicts to resolve:** Stop-reason helper/test vs SKILL conflict; auto-only vs confirm parity; packet-local vs static benchmark assets; materializer location; RT `/improve:improve-agent` naming drift; whether 064 includes GREEN rerun or leaves it to optional 065 [iteration-008.md:109-119; iteration-009.md:77-87; iteration-010.md:76-78].

## 6. OTHER META-AGENT AUDIT (RQ-4 Detail)

| Agent | Body-level | Command-level | Hybrid | Recommendation |
|---|---|---|---|---|
| @code | yes | — | caller gate | Already proven by 059; body-prepend testing is valid because implementation discipline and rubric live in the body. Cite body evidence before asserting caller-gated behavior [`.opencode/agent/code.md:22-58`, `.opencode/agent/code.md:128-157`; iteration-004.md:52-59]. |
| @improve-agent | — | yes | command-loop leaf | Use command-flow testing for helper/scoring/benchmark/journal/stop evidence; direct body tests only for proposal-only candidate generation and Critic self-validation [`.opencode/agent/improve-agent.md:22-42`, `.opencode/agent/improve-agent.md:160-180`; iteration-007.md:22-38]. |
| @write | yes | — | — | Body-level stress packet is sufficient if needed. Test template loading, skeleton copying, validation, DQI, and delivery gates through the body, not invented command artifacts [`.opencode/agent/write.md:22-65`; iteration-004.md:57]. |
| @improve-prompt | yes | — | — | Body-level prompt-package tests are appropriate. No command-orchestrator packet indicated by the iterations [`.opencode/agent/improve-prompt.md:22-40`, `.opencode/agent/improve-prompt.md:86-101`; iteration-004.md:57]. |
| @debug | yes | — | — | Body-level debugging workflow tests are appropriate. Do not classify as command-orchestrator merely because another workflow may dispatch it [`.opencode/agent/debug.md:22-30`, `.opencode/agent/debug.md:105-180`; iteration-004.md:57; iteration-004.md:96-100]. |
| @deep-research | partial leaf | yes | command-loop leaf | Needs command-owned loop tests for lifecycle/convergence/state; direct body tests only prove one iteration [`.opencode/agent/deep-research.md:24-34`; iteration-004.md:50-55]. |
| @deep-review | partial leaf | yes | command-loop leaf | Same as deep-research: command-owned loop testing for lifecycle/convergence/reducer state, leaf-body testing only for one review iteration [`.opencode/agent/deep-review.md:23-33`; iteration-004.md:50-55]. |
| @context | yes | — | — | Body-level retrieval-package tests are appropriate; the body owns canonical continuity retrieval and forbids nested delegation/writes [`.opencode/agent/context.md:25-55`; iteration-004.md:57]. |
| @orchestrate | yes | — | primary orchestrator body | Needs orchestration/delegation/synthesis tests, not leaf-agent Call B or command-loop tests [`.opencode/agent/orchestrate.md:18-35`, `.opencode/agent/orchestrate.md:87-113`; iteration-004.md:53-59]. |
| @review | yes | — | — | Body-level read-only review/rubric tests are appropriate. No command-layer stress packet indicated [`.opencode/agent/review.md:22-57`, `.opencode/agent/review.md:114-141`; iteration-004.md:57]. |

## 7. REUSABLE RUBRIC + AUTHORING PREFLIGHT (RQ-6 + RQ-7)

The rubric for grading meta-agent stress tests:

- **Dimension 1:** Entry-point fidelity. Wrong natural entry point is a P0.
- **Dimension 2:** Ordered artifact/journal truth. Events and files must appear in causal order, not as unordered label counts.
- **Dimension 3:** Producer/consumer compatibility. Emitted JSON must match reducer/dashboard/test consumer shape.
- **Dimension 4:** Governance/stop semantics. Proposal-only boundary, no promotion leakage, baseline delta, legal-stop gates, and stop reason must align.
- **Dimension 5:** Sandbox differential and containment. Same-task reset, temp-root isolation, and canonical/mirror tripwires must be explicit.
- **Dimension 6:** Evaluator asset completeness. Profiles, fixtures, materialized outputs, reports, state rows, and journal boundaries must exist before GREEN claims.
- **Dimension 7:** Verdict-mode honesty. Expected GREEN/RED/PARTIAL must be declared before execution.
- **Dimension 8:** Scenario layer partition. Mixed suites must classify each CP separately.
- **Dimension 9:** Cross-playbook oracle check. Native RT/manual tests cannot be used as hard gates until their own contracts are aligned.
- **Dimension 10:** Release-surface honesty. Expected-RED evidence belongs in spec-local artifacts unless the active playbook supports that state.
- **Dimension 11:** Evidence source authority. Every verdict label names its authoritative source and marks corroborating-only sources.

The authoring preflight every CP-XXX scenario author must answer BEFORE writing scenarios for a new agent:

- [ ] Where does this agent's discipline live: body, command markdown, YAML workflow, skill router, helper script, reducer, primary orchestrator, or cross-layer contract?
- [ ] What is the natural entry point that exercises that discipline?
- [ ] What layer must Call B invoke?
- [ ] What evidence does the chosen layer actually produce?
- [ ] Which source is authoritative for each signal: transcript, command log, helper invocation, filesystem artifact, journal JSONL, reducer/dashboard output, or release verdict?
- [ ] Which consumer must parse each structured artifact?
- [ ] Are all producers concrete commands/scripts, or are any still action prose?
- [ ] Does the harness cwd contain command files, skill scripts, target agent, mirrors, fixtures, benchmark profiles, and allowed external spec/log paths?
- [ ] Does any evaluator claim need profile JSON, fixture JSON, materialized fixture markdown, benchmark report JSON, state-log row, or reducer output?
- [ ] Which assertions are forbidden because they belong to an adjacent layer?
- [ ] Is the scenario expected GREEN, expected RED, or exploratory PARTIAL?
- [ ] If expected RED, is it spec-local methodology evidence or an active release scenario?
- [ ] Which stale state summaries can be overridden by primary iteration/test artifacts?

## 8. EVIDENCE MATRIX (RQ-3 + RQ-5)

| Signal | Owner Layer | Where Verified |
|---|---|---|
| `/improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=... --iterations=1` | Command entry point | command transcript; command-capable temp cwd [iteration-003.md:22-34] |
| `integration-report.json` | Command/YAML via `scan-integration.cjs` | `{spec_folder}/improvement/integration-report.json` [iteration-001.md:58-66] |
| `dynamic-profile.json` | Command/YAML via `generate-profile.cjs` | `{spec_folder}/improvement/dynamic-profile.json` [iteration-001.md:64-65] |
| `candidate_generated` event | Command/YAML after mutator dispatch | journal JSONL plus candidate path under `improvement/candidates` [iteration-001.md:66-67] |
| Critic challenge text in candidate metadata | Agent body | candidate JSON/markdown output; direct leaf/body transcript for CP-042 [iteration-007.md:31-33] |
| Packet-local candidate path | Agent body for leaf; command artifact for command flow | `improvement/candidates/*`; canonical/mirror diff checks [iteration-007.md:30-32] |
| `candidate_scored` event | Command/YAML after `score-candidate.cjs` | journal JSONL and score output JSON [iteration-001.md:67-68] |
| `baselineScore`, `delta`, `thresholdDelta`, `recommendation` | `score-candidate.cjs` | score JSON; CP-044 command-flow lane [iteration-001.md:67-68; iteration-007.md:34-35] |
| Mirror inventory check | `scan-integration.cjs` | `integration-report.json` scan report [iteration-001.md:93-95] |
| `run-benchmark.cjs` invocation | Command/YAML or future helper | command transcript plus exact CLI args [iteration-003.md:40-51; iteration-005.md:146-157] |
| Benchmark profile/fixtures | Evaluator assets | `{spec_folder}/improvement/benchmark-profiles`, fixture JSON directory [iteration-005.md:129-144] |
| `{outputsDir}/{fixture.id}.md` | Benchmark materializer | benchmark output staging directory before runner executes [iteration-005.md:22-38; iteration-008.md:40-57] |
| `benchmark_completed` event | Command after report exists | journal JSONL; only GREEN if report exists first [iteration-008.md:28-35] |
| `benchmark_run` state row | `run-benchmark.cjs` | `agent-improvement-state.jsonl` [iteration-003.md:51-53; iteration-008.md:40-42] |
| `legal_stop_evaluated` event | Command/YAML legal-stop step | journal JSONL [iteration-001.md:70-85] |
| `legal_stop_evaluated.details.gateResults` 5-gate bundle | Command/YAML producer; reducer consumer | journal JSONL and reducer/dashboard `latestLegalStop.gateResults` [iteration-005.md:58-76; iteration-008.md:98-107] |
| `blocked_stop.failedGates` | Command legal-stop gate | journal JSONL when any gate fails [iteration-001.md:71-72] |
| `session_end.stopReason` / `sessionOutcome` | Journal helper plus command stop logic | journal JSONL after legal-stop evidence; stop enum truth must be resolved in 064 [iteration-008.md:59-75] |
| Native RT-028/RT-032 oracle | Native sk-improve-agent playbook | use as 064 repair target, not hard 063 gate [iteration-009.md:37-43] |
| Release readiness verdict | cli-copilot root playbook | active playbook only; expected RED belongs spec-local unless release-not-ready is intended [iteration-009.md:22-35; iteration-009.md:45-57] |

## 9. HAND-OFF NOTES

### To packet 063 (command-flow stress tests)

Recommended starting prompt:

```text
Create 063-improve-agent-command-flow-stress-tests. Build a command-capable temp project root containing .opencode/command/improve, .opencode/skill/sk-improve-agent, and the cp-improve-target fixture. For command-owned scenarios, invoke:

/improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=/tmp/cp-063-spec --iterations=1

Use a layer-owned evidence matrix per CP. Keep expected-RED/PARTIAL methodology evidence spec-local unless active CP-040..CP-045 contracts can honestly pass under the cli-copilot PASS/PARTIAL/FAIL/SKIP release model. Reuse CP-040..CP-045 for active corrections; use successor IDs only for spec-local experiments or explicit archival.
```

5-stage plan adaptation from 002:

1. Rebuild the harness root, not only the prompt.
2. Partition CP-040..CP-045 by owning layer.
3. Run command-flow lane for CP-040/043/044/045 and leaf/body lane for CP-041/042 where appropriate.
4. Grade RED/PARTIAL failures against known producer/consumer gaps.
5. Emit a 064 handoff checklist instead of claiming product GREEN.

Score-progression target: 063 methodology PASS with honest RED/PARTIAL product findings; 064 GREEN product PASS after wiring; optional 065 GREEN rerun if the 064 diff is large [iteration-006.md:72-78; iteration-008.md:147-154; iteration-010.md:44-48].

### To packet 064 (further sk-improve-agent edits, if recommended)

Recommended starting prompt:

```text
Implement 064 executable wiring for sk-improve-agent command-flow GREEN proof. Patch auto and confirm YAML in lockstep or explicitly defer confirm parity. Add benchmark profile/fixture/materializer support, wire run-benchmark.cjs with required CLI args, emit benchmark_completed only after report creation, standardize legal_stop_evaluated.details.gateResults, resolve stop-reason enum truth, update SKILL/command/docs/tests, reconcile native RT-028/RT-032, then rerun command-flow scenarios or hand off optional 065 if too large.
```

Diff order:

1. Decide benchmark assets location and materializer ownership.
2. Patch auto/confirm benchmark invocation and report-before-event ordering.
3. Patch legal-stop producer shape to nested `details.gateResults`.
4. Resolve stop-reason enum truth across helper/tests/SKILL/docs.
5. Update reducer/dashboard assertions and native RT oracle files.
6. Update cli-copilot CP contracts and rerun GREEN lane if scope allows.

### To memory (constitutional rules to consider)

- Add a test-layer-selection rule as feedback memory: before authoring CP scenarios, identify the discipline layer, natural entry point, evidence owner, structured consumer, producer readiness, harness root, evaluator assets, verdict mode, and release surface.
- Keep the full matrix as a reusable authoring template, not a global hard rule with packet-specific `sk-improve-agent` details.
- Add a stale-state guard for synthesis packets: iteration markdown with citations overrides stale registry/dashboard summaries when the two conflict [iteration-010.md:22-29; iteration-010.md:88-107].

## 10. GENERAL LESSONS (Transferable Beyond This Packet)

1. Body-prepend A/B is valid only when the discipline under test lives in the body. It fails for command-loop leaves if the expected evidence belongs to the command, YAML, helper scripts, reducers, or dashboards.
2. A GREEN expectation requires concrete producers and structured consumers. Grep-visible labels are not enough when reducers or dashboards read a specific JSON shape.
3. Mixed suites need per-scenario layer partition. One generic Call B can be wrong in both directions: too shallow for command evidence and too broad for leaf-body evidence.
4. Expected-RED evidence is useful, but it belongs in a surface that can represent expected RED. Do not turn methodology diagnostics into active release failures by accident.
5. Final syntheses should name their authority ladder. Stale registries and dashboards are useful summaries only when they agree with primary iteration/test artifacts.

## 11. ARTIFACTS

### Iteration files (all under research/iterations/)

- `iteration-001.md` through `iteration-010.md` (10 files; 1,582 total lines expected by packet prompt)

### State files

- `deep-research-config.json`
- `deep-research-state.jsonl`
- `run-log.txt`
- `findings-registry.json` (auxiliary only; stale for RQ resolution in this run)

### Source-of-truth references

- `002/test-report.md`
- `001/research/research.md`
- `002/stress-runs/stage4-summary.md`
<!-- /ANCHOR:synthesis -->
