---
iteration: 9
date: 2026-05-02T13:43:00+02:00
focus_rqs: [RQ-3, RQ-5, RQ-6, RQ-7]
new_findings_count: 4
rqs_now_answerable: [RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 9

## Focus

This iteration stopped broadening the technical investigation and focused on synthesis packaging: how to hand off 063/064 without turning an expected-RED methodology proof into an active release-blocking playbook state. The main new value is a scope split for native RT alignment and active CP contract edits.

## Method

I treated iterations 1-8 as baseline and only inspected packet 003 governance docs plus the two relevant playbook roots and native RT feature files. I compared packet 003's research-only success criteria, cli-copilot's release-readiness rules, and sk-improve-agent's native RT-028/RT-032 contracts to decide what belongs in 063 versus 064 and what the final synthesis should explicitly warn against.

## Findings

### RQ-5/RQ-7: 063 expected-RED evidence should be spec-local unless active CPs can honestly pass

Iterations 6-8 converged on a useful idea: 063 can be a command-flow RED/PARTIAL methodology packet while 064 wires the GREEN product path. The new packaging constraint is that this should not be installed directly as active cli-copilot release-surface failure unless 063 intentionally accepts making the active playbook not release-ready.

The cli-copilot root playbook has no `EXPECTED_RED` verdict category. Scenario verdicts are `PASS`, `PARTIAL`, `FAIL`, or `SKIP`, and any critical-path `FAIL` forces the feature verdict to `FAIL` [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md:123-148`]. Release is `READY` only when there are no feature FAILs, all critical scenarios pass, coverage is 100%, and no blocking triage remains [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md:150-158`]. CP-040..CP-045 are already active root-index scenarios with stable feature-file links [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md:582-682`], and the playbook states that each feature keeps its stable `CP-NNN` ID with a dedicated full execution contract [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md:52-55`].

Therefore the final synthesis should distinguish two different 063 shapes:

| 063 shape | Where evidence lives | Exit criterion |
|---|---|---|
| **Spec-local RED methodology proof** | Packet-local report/artifacts under 063, not active cli-copilot release scenarios | Proves `/improve:agent` command entry, command-capable sandbox, artifact roots, and causally named producer/consumer gaps. |
| **Active CP-040..CP-045 correction** | Edits the canonical cli-copilot playbook files | Uses stable CP IDs but only lands contracts that can be graded under the existing PASS/PARTIAL/FAIL/SKIP release model. |

This reconciles iteration 6's "063 as RED methodology packet" with iteration 7's "reuse CP-040..CP-045 in place" recommendation. Reuse the IDs when correcting the active playbook, but do not leave expected-RED command-flow failures as active release criteria unless the packet explicitly marks the release surface as intentionally not ready.

### RQ-3/RQ-7: Native RT alignment is a 064 oracle/repair task, not a 063 gate

Iteration 8 correctly found that sk-improve-agent's native RT playbook should be cross-checked, but the deeper read shows RT-028 and RT-032 are not clean enough to serve as 063 verdict gates yet. RT-028 expects `legal_stop_evaluated` with `gateResults` containing all five gate bundles, and its feature file verifies `details.gateResults` in the journal [SOURCE: `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:20-29`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:43-45`]. That aligns with the desired structured legal-stop consumer shape.

However, both native RT entries also carry drift that would confuse a 063 command-flow verdict. RT-028's exact command uses `/improve:improve-agent ".opencode/agent/debug.md" :confirm --spec-folder={spec} --iterations=5`, while 063's tested entry point should be the `/improve:agent` command surface with a fixture target and explicit `:auto` mode [SOURCE: `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:43-45`, `.opencode/command/improve/agent.md:1-17`]. RT-032 likewise describes `/improve:improve-agent` and uses `.opencode/agent/debug.md`, while its expected signals still require `gate_evaluation` inside each iteration [SOURCE: `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md:14-28`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md:43-45`].

That means 063 should cite native RT as an **oracle mismatch to preserve**, not as a hard verdict input. The 064 implementation handoff should repair or explicitly reconcile RT-028/RT-032 alongside YAML, command docs, SKILL docs, helper tests, and cli-copilot CP contracts. Otherwise 063 would be comparing the new command-flow suite against a native oracle that is itself partly stale.

### RQ-6: Add "release-surface honesty" to the meta-agent stress rubric

Prior iterations added entry-point fidelity, ordered artifact truth, producer/consumer compatibility, governance stops, sandbox containment, evaluator asset completeness, verdict-mode honesty, and scenario layer partition. The missing final P0 is **release-surface honesty**:

```text
Release-surface honesty:
- If a scenario is expected RED, say whether it is spec-local methodology evidence or an active release scenario.
- Do not commit expected-RED behavior into an active playbook that only supports PASS/PARTIAL/FAIL/SKIP unless the packet intentionally leaves release readiness false.
- Stable CP IDs should be reused for canonical corrections, but historical failed runners should stay in packet artifacts, not active release contracts.
- Cross-playbook native RT checks may block GREEN only after their own command names, targets, event vocabulary, and expected signals are reconciled.
```

This is distinct from verdict-mode honesty. Verdict-mode honesty says "declare GREEN/RED/PARTIAL before execution." Release-surface honesty says "do not put RED evidence into a surface whose governance treats RED as FAIL." The rule is grounded in cli-copilot's acceptance and release-readiness semantics [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md:123-158`] and packet 003's own research-only scope: 003 sketches the 063 approach but leaves playbook-entry design and source edits out of scope [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/spec.md:93-107`].

### RQ-5/RQ-7: Final synthesis should include a convergence table, not only prose findings

Packet 003's success criteria already define the final `research/research.md` shape: Executive Summary, Methodology, Per-RQ Findings, 063 Packet Sketch, Other Meta-Agent Audit, Reusable Rubric Template, and Hand-off Notes [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/spec.md:127-134`]. The iteration history is now dense enough that the final synthesis needs a convergence table up front to prevent downstream packets from cherry-picking one iteration's partial recommendation.

Recommended table:

| RQ | Final answer status | First answerable by | Must carry forward |
|---|---|---|---|
| RQ-1 | Answerable | Iteration 1/2, refined 5/8 | Body/scorer/mirror diffs mostly complete; benchmark, legal-stop shape, event/stop enums, and docs need 064. |
| RQ-2 | Answerable | Iteration 1, refined 3 | Call B is command-facing: `/improve:agent ".opencode/agent/cp-improve-target.md" :auto --spec-folder=... --iterations=1`, from a command-capable temp project root. |
| RQ-3 | Answerable | Iteration 1, refined 3/5/7/8/9 | Use layer-specific lanes: leaf GREEN for CP-041/042, command RED/PARTIAL for 063, command GREEN only after 064 wiring and structured consumers. |
| RQ-4 | Answerable | Iteration 1, refined 4 | Command-loop leaves are @improve-agent, @deep-research, @deep-review; @code is a body-level leaf with caller gate; @orchestrate is a primary orchestrator body. |
| RQ-5 | Answerable | Iteration 2, refined 3/6/7/9 | 001 had correct concepts but missed blocking readiness gates, fixture/root completeness, per-scenario layer partition, and release-surface implications. |
| RQ-6 | Answerable | Iteration 2, refined 5/6/7/8/9 | Rubric is command-orchestrator-specific and now includes release-surface honesty. |
| RQ-7 | Answerable | Iteration 2, refined through 9 | Reusable template must include layer ownership, evidence owner, consumer, producer readiness, harness root, evaluator assets, scenario partition, cross-playbook oracle, and release surface. |

The synthesis should also make the packet governance explicit. Packet 003 is research-only, no source edits; implementation lives in 063 and 064 [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/decision-record.md:32-36`]. Its scope asks for hand-off notes to 063 and 064, while playbook entry design itself is 063's job [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/spec.md:95-107`].

## New Open Questions

1. Should the final synthesis name a separate 065 GREEN rerun packet, or keep 065 optional and say 064 may include the rerun only if the diff stays small?
2. If 063 chooses active CP edits, should it add a temporary "expected RED is methodology-only" notation to per-feature files, or should it keep expected-RED evidence entirely outside the active playbook?
3. Should `/improve:improve-agent` in native RT files be treated as an alias that exists elsewhere, or as stale command naming that must be repaired in 064?

## Ruled Out

- **Ruled out: making RT-028/RT-032 hard 063 verdict gates as-is.** They contain useful structured legal-stop expectations, but their command spelling/target and event vocabulary are not aligned enough to be the external cli-copilot oracle [SOURCE: `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:43-45`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/032-journal-wiring.md:43-45`].
- **Ruled out: expected-RED active playbook entries without release-surface acknowledgement.** The cli-copilot playbook grades FAIL as release-blocking and has no expected-RED verdict class [SOURCE: `.opencode/skill/cli-copilot/manual_testing_playbook/manual_testing_playbook.md:133-158`].
- **Ruled out: final synthesis as only narrative prose.** The packet success criteria require specific sections, and the iteration sequence now has enough refined/overridden recommendations that a convergence table is needed for safe downstream handoff [SOURCE: `.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/003-followup-research/spec.md:127-134`].

## Sketches (if any)

### Final synthesis outline

```markdown
# Research Synthesis: 060/003

## 1. Executive Summary
- R1 taught wrong-layer stress design, not "sk-improve-agent is hopeless."
- 063 should prove command-flow methodology; 064 should wire executable GREEN producers/consumers.

## 2. Methodology
- Sources read.
- Iteration convergence table.
- Why no reruns occurred in 003.

## 3. Per-RQ Findings
- RQ-1 through RQ-7 with final answer, confidence, and downstream owner.

## 4. 063 Packet Sketch
- Spec-local RED/PARTIAL command-flow harness by default.
- Active CP edits only when release-surface honesty is satisfied.
- Layer-specific lanes for CP-040..CP-045.

## 5. Other Meta-Agent Audit
- Command-loop leaves vs body leaves vs @code caller-gated body vs @orchestrate.

## 6. Reusable Rubric Template
- Entry-point fidelity.
- Ordered artifact/journal truth.
- Producer/consumer compatibility.
- Governance/stop semantics.
- Sandbox containment.
- Evaluator asset completeness.
- Verdict-mode honesty.
- Scenario layer partition.
- Cross-playbook oracle check.
- Release-surface honesty.

## 7. Hand-off Notes
- 063: command-capable sandbox and spec-local RED methodology proof.
- 064: YAML parity, benchmark materializer/assets, nested gateResults, stop enum truth, RT-028/RT-032 reconciliation.
- 065 optional: GREEN rerun if 064 is too large.
```

### 063/064 scope split

```text
063 SHOULD:
  - Build command-capable sandbox.
  - Invoke /improve:agent ... :auto --spec-folder=... --iterations=1.
  - Keep expected-RED methodology artifacts packet-local unless active CPs can pass under current playbook rules.
  - Use RT-028/RT-032 as "oracle alignment to fix", not as hard PASS gates.

064 SHOULD:
  - Reconcile auto+confirm YAML benchmark and legal-stop shapes.
  - Decide stop-reason enum truth.
  - Repair native RT-028/RT-032 command/event contracts.
  - Promote corrected CP-040..CP-045 active playbook entries when release-surface honesty is satisfied.
```

## Next Focus Suggestion

Iteration 10 should not inspect more implementation files unless a contradiction appears. It should synthesize iterations 1-9 into the final `research/research.md` answer, use the convergence table above, and set convergence to yes unless it discovers a new packet-scope conflict.

## Convergence Assessment

This added real new value, so `convergence_signal: no`. The broad RQs were already answerable, but this iteration resolved a handoff-packaging gap: expected-RED methodology proof must not be confused with active release-playbook readiness, and native RT alignment is best treated as 064 repair/oracle work rather than a 063 verdict gate.
