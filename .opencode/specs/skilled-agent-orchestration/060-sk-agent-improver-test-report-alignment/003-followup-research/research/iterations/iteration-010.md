---
iteration: 10
date: 2026-05-02T13:45:00+02:00
focus_rqs: [RQ-3, RQ-5, RQ-6, RQ-7]
new_findings_count: 4
rqs_now_answerable: [RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6, RQ-7]
convergence_signal: yes
---

# Iteration 10

## Focus

This final iteration did not broaden the implementation investigation. It checked whether the loop's own packet state and downstream synthesis contract introduce any last handoff risk after iterations 1-9 made all seven RQs answerable.

## Method

I read the prior iteration files first, treating iterations 7-9 as the refined baseline because they already resolved layer partition, 063/064 packaging, and release-surface honesty. I then inspected packet 003's spec/tasks/decision record, deep-research state files, and the command/YAML/reducer authority chain to decide whether the final synthesis can safely proceed without more source reads.

## Findings

### RQ-5/RQ-7: Final synthesis must use iteration files as source-of-truth, not the stale registry

The highest-leverage uncovered gap is not another sk-improve-agent code seam; it is a packet-state seam. The research registry still marks every RQ open, has no resolved questions, and reports zero completed iterations / zero key findings [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/findings-registry.json:2-20`]. The JSONL state log likewise records only config/init plus iteration exit codes through iteration 9, not per-RQ resolution or novelty data [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/deep-research-state.jsonl:1-11`].

That conflicts with the iteration files themselves. Iteration 7 already marked all RQs answerable [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/iterations/iteration-007.md:1-7`], and iteration 9 provided a convergence table naming final answer status and must-carry-forward guidance for RQ-1 through RQ-7 [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/iterations/iteration-009.md:59-75`]. Therefore the final `research/research.md` synthesis should cite and reconcile the iteration markdown files directly, and should not infer "unresolved" from the stale reducer registry.

This is a reusable methodology lesson: for deep-research packets, reducer-owned registries are useful when maintained, but the final synthesis authority ladder should be (1) iteration files with citations, (2) primary evidence files, (3) registry/dashboard summaries only if they agree with the iteration files. Otherwise a stale state artifact can erase valid convergence.

### RQ-3/RQ-6: Add "evidence source authority" to the meta-agent rubric

Prior iterations added entry-point fidelity, ordered artifact truth, producer/consumer compatibility, evaluator assets, verdict-mode honesty, scenario layer partition, cross-playbook oracle checking, and release-surface honesty. The missing final rubric line is **evidence source authority**: every grep/verdict contract should name which source is authoritative for the claim and which sources are only corroborating.

For `/improve:agent`, the command markdown is the user-facing lifecycle authority: each loop scans integration, dispatches `@improve-agent`, scores, benchmarks, appends the ledger, reduces state, and checks stop conditions [SOURCE: `.opencode/command/improve/agent.md:266-280`]. The YAML is the executable producer for runtime paths, helper invocations, candidate/scoring/journal events, and reducer calls under `{spec_folder}/improvement` [SOURCE: `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:96-110`, `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:150-198`]. The reducer is the structured consumer authority for legal-stop visibility because it only populates `latestLegalStop.gateResults` from `details.gateResults` [SOURCE: `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:173-218`].

R1 failed because the test trusted the wrong authority source: a prepended agent-body transcript was treated as if it could prove command-owned helper, benchmark, journal, and stop evidence. The report's lesson is explicit: `@code` discipline is body-level, `@improve-agent` discipline is command/orchestrator-level, and the scenario implementation conflated the layer that proposes a candidate with the layer that evaluates it [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:246-252`]. Future CP-XXX specs should therefore include an "authority source" column for every expected signal: transcript, command log, filesystem artifact, journal JSONL, reducer output, dashboard, or release playbook verdict.

### RQ-5/RQ-7: 003's final deliverable should be a synthesis/handoff artifact, not another investigation pass

Packet 003 is explicitly research-only: it may read primary evidence, inspect modified source and other meta-agents, then synthesize recommendations and hand-off notes, but source edits, CP reruns, 063 playbook-entry design, and constitutional rule additions are out of scope [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/spec.md:93-107`]. The success criteria now point to the real remaining work: produce `research/research.md` with Executive Summary, Methodology, Per-RQ Findings, 063 Packet Sketch, Other Meta-Agent Audit, Reusable Rubric Template, and Hand-off Notes, then update implementation summary [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/spec.md:127-134`].

That makes further source inspection lower value than synthesis packaging. The task list also makes synthesis the next workflow stage: T-008 dispatches synthesis to `research/research.md`, followed by implementation summary, handover, and commit [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/tasks.md:34-40`]. The final synthesis should be decisive about packet ownership:

| Downstream packet | Authority |
|---|---|
| 063 | Command-flow methodology proof and/or active CP contract correction, respecting release-surface honesty. |
| 064 | Executable wiring for benchmark materialization, nested legal-stop producer shape, stop vocabulary, YAML parity, and native RT reconciliation. |
| 065 | Optional GREEN rerun if 064 is too large to combine implementation and proof. |

This also resolves the stale-registry concern above: the synthesis should explicitly state that iteration files, not registry metrics, are the convergence source for this run.

### RQ-6/RQ-7: The reusable template should include a pre-authoring authority ladder

The reusable test-layer-selection template should now start with a short authority ladder before any CP scenario body is written:

```markdown
## Evidence Authority Ladder

1. Discipline under test:
2. Natural entry point:
3. Authoritative source for each expected signal:
   - agent-body transcript:
   - command transcript:
   - helper invocation:
   - filesystem artifact:
   - journal event:
   - reducer/dashboard consumer:
   - release-playbook verdict:
4. Corroborating-only sources:
5. Sources that must NOT be used for this claim:
6. Stale-state guard: which packet state files are summaries only, and what primary artifact overrides them if they drift?
```

This extends the prior layer-owned evidence matrix rather than replacing it. It would have caught R1's wrong-layer Call B because the `@improve-agent` body says it proposes one packet-local candidate and stops before scoring, promotion, benchmarking, or packaging [SOURCE: `.opencode/agent/improve-agent.md:22-42`], while the same body assigns journal events such as `candidate_scored`, `benchmark_completed`, `legal_stop_evaluated`, `blocked_stop`, and `session_end` to the orchestrator [SOURCE: `.opencode/agent/improve-agent.md:160-180`]. It would also catch this iteration's stale-registry issue by requiring final synthesis to name which state summaries can be overridden by iteration markdown.

## New Open Questions

No new blocking RQs remain. The remaining choices are packet-scoping decisions for downstream work: whether 064 includes the GREEN rerun or leaves it to 065, and whether active CP-040..CP-045 corrections land only after command-flow expected-RED evidence is kept spec-local.

## Ruled Out

- **Ruled out: more source-file spelunking before synthesis.** Packet 003's scope is research synthesis and handoff, and iterations 1-9 already make every RQ answerable [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/spec.md:93-107`, `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/iterations/iteration-009.md:65-73`].
- **Ruled out: using `findings-registry.json` as the final convergence oracle.** It still reports all RQs open and zero iterations/key findings despite nine successful iteration files [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/findings-registry.json:2-20`, `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/research/deep-research-state.jsonl:3-11`].
- **Ruled out: a grep contract without source authority labels.** R1's body-transcript greps failed to prove command-owned evidence, and the command/YAML/reducer chain shows that transcript labels, journal labels, and reducer-visible JSON are different authority layers [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md:75-98`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-218`].

## Sketches (if any)

### Final synthesis guardrail

```markdown
## Convergence and Source Authority

This synthesis treats `research/iterations/iteration-001.md` through `iteration-010.md`
as the canonical research record. `findings-registry.json` and JSONL loop state are
auxiliary summaries only; in this run they are stale and must not be used to infer
that RQ-1..RQ-7 are unresolved.
```

### Rubric addition

```text
Evidence source authority (P0):
- Every PASS/PARTIAL/FAIL label names its authoritative source.
- A leaf-body transcript cannot prove command-owned artifacts.
- Journal event names cannot prove reducer-visible semantics unless the reducer consumes the emitted JSON shape.
- Release-playbook verdicts cannot host expected-RED methodology evidence unless the release surface explicitly supports that status.
- Stale summaries cannot override cited primary artifacts.
```

## Next Focus Suggestion

No iteration 11 is recommended. The next step is synthesis: write `research/research.md` using the iteration-9 convergence table plus this iteration's source-authority guardrail, then update implementation summary and handoff per packet tasks.

## Convergence Assessment

This added a small but real final value by catching a packet-state source-of-truth hazard and turning it into a reusable evidence-authority rubric item. Set `convergence_signal: yes`: all seven RQs are answerable, further code reads are unlikely to change the recommendations, and the remaining work is synthesis/handoff rather than investigation.
