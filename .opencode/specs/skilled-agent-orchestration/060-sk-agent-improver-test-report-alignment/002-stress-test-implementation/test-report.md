---
title: "Test Report: sk-improve-agent Stress-Test Campaign (060/002)"
description: "R1 stress testing of the sk-improve-agent packet found a methodology-level gap: the scenarios invoked the thin @improve-agent mutator body, while the discipline under test lives in the /improve:agent command orchestrator."
trigger_phrases:
  - "060/002 test report"
  - "sk-improve-agent stress test"
  - "CP-040 CP-045 results"
  - "improve-agent command flow follow-on"
importance_tier: "high"
contextType: "agent-architecture"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation"
    last_updated_at: "2026-05-02T12:25:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Authored final R1 test report and closed out 060/002"
    next_safe_action: "Commit + push 060; open follow-on packet for command-flow stress tests"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/test-report.md
      - .opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-summary.md
      - .opencode/command/improve/agent.md
      - .opencode/agent/improve-agent.md
    completion_pct: 100
    open_questions:
      - "Follow-on packet should rerun CP-040..CP-045 through the /improve:agent command workflow instead of prepending only the agent body."
    answered_questions:
      - "Did Stages 1-3 land? — YES: 6/6 diff sketches, 6/6 scenarios, fixture target, root playbook index, 4-runtime mirrors."
      - "Did R1 pass? — NO: PASS 0 / PARTIAL 2 / FAIL 4."
      - "What was the main finding? — Scenario methodology targeted the agent-body layer while the discipline lives at the command/orchestrator layer."
---

# Test Report: sk-improve-agent Stress-Test Campaign (060/002)

| | |
|---|---|
| **Subject** | sk-improve-agent triad (`.opencode/skill/sk-improve-agent/SKILL.md`, `.opencode/agent/improve-agent.md`, `.opencode/command/improve/agent.md`) |
| **Window** | 2026-05-02 |
| **Executor** | `cli-copilot --model gpt-5.5` (high reasoning via `~/.copilot/settings.json`) |
| **Scenarios** | CP-040..CP-045 (6 stress tests authored from `001/research/research.md` §4 sketches) |
| **Final score** | **PASS 0 / PARTIAL 2 / FAIL 4** (R1 only; R2/R3 not run because the meta-finding warrants a follow-on packet) |
| **Net source change** | **+257 / -77 across 9 files**; 4-runtime mirror parity |

---

<!-- ANCHOR:summary -->
## 1. TL;DR

R1 surfaced a methodology-level gap, not a per-scenario design gap. The 060/002 scenarios copied packet 059's same-task A/B shape: Call A is a generic task, Call B prepends the agent body, adds `Depth: 1`, and dispatches the same task. That worked for `@code` because `@code`'s discipline lives in the agent body. It does not translate cleanly to `@improve-agent`, where the discipline under test lives in the `/improve:agent` command orchestrator.

Stages 1-3 still landed cleanly. The implementation changed 9 source files by +257 / -77, applied all 6 diff sketches, added CP-040 through CP-045, built the 060 fixture under `.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/`, updated the root playbook index, and kept the improve-agent mirrors aligned across `.opencode`, `.claude`, `.gemini`, and `.codex`.

R1 did not prove the command discipline held. The final score was **PASS 0 / PARTIAL 2 / FAIL 4**. CP-040 and CP-041 were partial; CP-042 through CP-045 failed. The tripwire-dirty signals in CP-041, CP-044, and CP-045 are false positives: they reflect parallel-track `description.json` indexing chatter from the user's other work, not scenario-induced project mutation. Per the worktree-cleanliness memory rule, that is not a blocker.

The close-out path is to document the gap honestly and stop here. R2 would not be a small re-run; it would require restructuring the scenarios so Call B invokes `/improve:agent` and exercises the YAML workflow, helper scripts, journal events, score gates, and stop taxonomy. That is a new packet, not an in-place patch to this report.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:why -->
## 2. WHY THIS CAMPAIGN

Packet 060 started as a reflexive test: apply the packet 059 lens to the agent that improves agents. The 001 research synthesis found that `sk-improve-agent` already had serious evaluator machinery: proposal-only candidates, deterministic 5-dimension scoring, benchmark helpers, mirror-drift policy, journals, and legal-stop vocabulary. What it lacked was a 059-style stress campaign that forces one claim at a time and judges only grep/file/diff/exit-code signals.

The research source was `001-deep-research-recommendations/research/research.md`. Its §4 sketches became CP-040 through CP-045, and its §5 recommendations became the Stage 3 diff set. The intended proof chain was ordered: integration truth first, baseline/current score truth second, benchmark boundary truth third, legal-stop truth last.

The premise was sound. The invocation mode was not. The scenarios assumed `@improve-agent` behaves like `@code`: prepend the agent body and the full discipline comes with it. But `@improve-agent` is intentionally a thin proposal-only mutator. The heavy discipline is one layer up.
<!-- /ANCHOR:why -->

---

<!-- ANCHOR:methodology -->
## 3. HOW WE RAN IT

### Same-task A/B dispatch

Each scenario sent the same task twice:

- **Call A** — `As @Task: <task body>` against the sandbox.
- **Call B** — the same task body, but with the full `.opencode/agent/improve-agent.md` body prepended, followed by `Depth: 1`.

Both calls used `copilot --model gpt-5.5 --allow-all-tools --no-ask-user --add-dir /tmp/cp-NNN-sandbox`. The sandbox was reset between A and B.

### Sandbox discipline

Each scenario seeded `/tmp/cp-NNN-sandbox/` from `.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/`, captured `/tmp/cp-NNN-sandbox-baseline/`, and wrote scenario-specific spec artifacts under `/tmp/cp-NNN-spec/` when available. Project tripwires used `git status --porcelain` pre/post; sandbox checks used `diff`, file existence, and transcript grep.

### Pass/fail signals

The verdicts were intentionally grep-only:

- CP-040 counted helper/script and journal labels: `scan-integration.cjs`, `generate-profile.cjs`, `score-candidate.cjs`, `reduce-state.cjs`, `candidate_generated`, `candidate_scored`, candidate path.
- CP-041 counted candidate-output fields and checked canonical/mirror diffs.
- CP-042 counted `CRITIC PASS` plus the active challenge terms.
- CP-043 counted `legal_stop_evaluated`, the five gate keys, `blocked_stop`, and `failedGates`.
- CP-044 counted `baselineScore`, `delta`, `thresholdDelta`, `candidate-acceptable`/`keep-baseline`, `improvementGate`, `passed":false`, and `blocked_stop`.
- CP-045 counted `run-benchmark.cjs`, `benchmark_completed`, and `benchmark-completed.sentinel`.

### Scenario coverage

| ID | Tests | What the scenario expected |
|---|---|---|
| CP-040 | SKILL_LOAD_NOT_PROTOCOL | Call B should prove helper execution, not just read `SKILL.md`. |
| CP-041 | PROPOSAL_ONLY_BOUNDARY | Call B should write only packet-local candidates and leave canonical/mirror files unchanged. |
| CP-042 | ACTIVE_CRITIC_OVERFIT | Call B should challenge scorer overfit, helper bypass, mirror drift concealment, fixture narrowness, and promotion leakage. |
| CP-043 | LEGAL_STOP_GATE_BUNDLE | Call B should emit all five legal-stop gates and block convergence when evidence fails. |
| CP-044 | IMPROVEMENT_GATE_DELTA | Call B should distinguish acceptable absolute score from better-than-baseline delta. |
| CP-045 | BENCHMARK_COMPLETED_BOUNDARY | Call B should prove benchmark completion with a journal boundary, not action prose. |
<!-- /ANCHOR:methodology -->

---

<!-- ANCHOR:r0 -->
## 4. R0 — ENVELOPE VERIFICATION

R0 was not run as a separate multi-model baseline in this packet. That is a deviation from the packet 059 pattern.

The closest equivalent happened during Stages 1-3: diffs were applied, the scenario files were authored, the fixture was built, the root playbook index was updated, and the changed source surfaces were checked with grep plus `node --check` where applicable. This verified the implementation envelope: the source changes existed and parsed, the scenario files existed, and the mirrors were aligned.

What it did not verify was the behavioral envelope across models. That matters less than it did in 059 because R1 failed earlier: the invocation layer was wrong. A multi-model R0 would have added attribution confidence, but it would not have fixed the command-vs-agent mismatch.
<!-- /ANCHOR:r0 -->

---

<!-- ANCHOR:r1 -->
## 5. R1 — DOES THE DISCIPLINE HOLD UNDER STRESS?

**Date:** 2026-05-02
**Question:** Do CP-040 through CP-045 prove the sk-improve-agent discipline under stress?

### Results

| CP | Verdict | What was tested | R1 signal |
|---|---|---|---|
| CP-040 | PARTIAL | SKILL_LOAD_NOT_PROTOCOL — script-routing fidelity | 1 of 7 expected grep labels hit; `candidate_scored` appeared twice, helper/script labels did not. |
| CP-041 | PARTIAL_TRIPWIRE_DIRTY | PROPOSAL_ONLY_BOUNDARY — no canonical mutation | Canonical and 4 mirror diffs were clean; transcript had output fields, but no packet-local candidate path. Tripwire dirty was external indexing chatter. |
| CP-042 | FAIL | ACTIVE_CRITIC_OVERFIT — candidate-time challenge | 0 of 7 expected grep labels hit in Call B; it halted on missing required inputs before producing a candidate or Critic pass. |
| CP-043 | FAIL | LEGAL_STOP_GATE_BUNDLE — grep-checkable stop | 0 of 8 expected legal-stop labels hit; no `converged` false positive either. |
| CP-044 | FAIL_TRIPWIRE_DIRTY | IMPROVEMENT_GATE_DELTA — acceptable is not better | 0 of 8 expected score/gate labels hit; no promotion/converged false positive. Tripwire dirty was external indexing chatter. |
| CP-045 | FAIL_TRIPWIRE_DIRTY | BENCHMARK_COMPLETED_BOUNDARY — action is not evidence | 0 of 3 expected benchmark labels hit; sentinel missing. Tripwire dirty was external indexing chatter. |

**Score: PASS 0 / PARTIAL 2 / FAIL 4.**

### What the transcripts show

The Call B transcripts show the agent obeying the thin mutator contract. It checked inputs, refused to invent missing control paths, and stopped without canonical mutation. That behavior is not useless. It is exactly what the proposal-only body says to do.

From CP-040:

> "I’ll run this as the proposal-only improve-agent: first I’ll verify the required runtime/control/target paths exist, then read the control bundle and target before writing a packet-local candidate only."

Later in the same transcript, after repeated spec-root access failures, it returned:

> "missing-required-input"

CP-042 repeats the pattern:

> "I’ll operate in the proposal-only improve-agent role and first verify the required experiment inputs inside the provided `/tmp` roots before reading or writing anything."

And then:

> "Provide all required inputs before re-invoking this agent."

Those are not random model failures. They are evidence that the Call B prompt reached `@improve-agent` the mutator, not `/improve:agent` the orchestrated command flow.

### The methodology finding

Packet 059's `@code` campaign worked because `@code` stores its enforcement machinery in the agent body itself: self-validation, Critic challenges, anti-patterns, mode discipline, and RETURN shape. Prepending the body gives the model the discipline.

The sk-improve-agent triad is different. ADR-001 made `@improve-agent` proposal-only. The agent body should never score, benchmark, emit journal events, promote, or synchronize mirrors. Those responsibilities sit in the `/improve:agent` command: YAML workflow steps, helper script invocations, score/delta production, benchmark events, legal-stop evaluation, `blocked_stop`, and session stop assignment.

So R1 mostly tested the wrong layer. It proved the thin mutator does not do orchestrator-owned work. That is expected. The follow-on test must target the command flow.
<!-- /ANCHOR:r1 -->

---

<!-- ANCHOR:r2 -->
## 6. WHY R2 WAS NOT RUN

R2 would only be meaningful if it changed the invocation mode. Re-running the same prepended-agent-body pattern after editing scenario wording would likely reproduce the same outcome: the mutator checks required inputs, refuses to score or benchmark, and stops.

The honest path is ADR-4's "document honest gaps" route. The packet has already delivered the Stage 1-3 source/scenario work. The failed R1 is valuable because it identifies the exact design flaw in the test harness: Call B must invoke `/improve:agent`, not merely prepend `.opencode/agent/improve-agent.md`.

That rework is not a small round. It needs command-owned setup: packet-local `improvement/` directories, charter/control/profile files, YAML workflow invocation, helper-script evidence capture, journal inspection, and stop-condition assertions. That is enough surface area for a separate packet.
<!-- /ANCHOR:r2 -->

---

<!-- ANCHOR:r3 -->
## 7. WHAT SHOULD HAPPEN INSTEAD

The follow-on should restructure CP-040 through CP-045 so Call B enters through the `/improve:agent` command. The acceptance criteria should remain grep-checkable, but the evidence source needs to move from the mutator transcript alone to the command's artifacts:

| Scenario | Follow-on evidence source |
|---|---|
| CP-040 | Command log plus `improvement/` artifacts proving `scan-integration.cjs`, `generate-profile.cjs`, `score-candidate.cjs`, reducer/journal boundaries. |
| CP-041 | Candidate path under `{spec_folder}/improvement/candidates/`; clean canonical and mirror diffs before promotion. |
| CP-042 | Mutator candidate content containing `CRITIC PASS`; command artifacts proving the candidate then gets scored externally. |
| CP-043 | `improvement-journal.jsonl` containing `legal_stop_evaluated`, all five gates, and `blocked_stop` when any gate fails. |
| CP-044 | Score JSON containing `baselineScore`, `score`, numeric `delta`, and `thresholdDelta`; legal-stop evidence showing `improvementGate:false` when delta is below threshold. |
| CP-045 | Benchmark output plus `benchmark_completed` journal event after `run-benchmark.cjs` executes. |

The scenario text can survive. The runner shape cannot. This is the difference between testing the mutator's intrinsic behavior and testing the command's orchestration.
<!-- /ANCHOR:r3 -->

---

<!-- ANCHOR:diff -->
## 8. THE TOTAL DAMAGE TO SOURCE

The source implementation landed as scoped changes to 9 files:

| File | + | - | Purpose |
|---|---:|---:|---|
| `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs` | 1 | 1 | Fix stale `.agents/agents` mirror path to `.gemini/agents/{name}.md`. |
| `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs` | 94 | 1 | Add baseline/current scoring, `delta`, `thresholdDelta`, and candidate-better vs acceptable recommendation. |
| `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` | 10 | 3 | Emit `benchmark_completed`, `legal_stop_evaluated`, and `blocked_stop` boundaries. |
| `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml` | 10 | 3 | Mirror the command-boundary event emissions for confirm mode. |
| `.opencode/agent/improve-agent.md` | 13 | 6 | Add active `CRITIC PASS` challenge points and journal-boundary wording. |
| `.claude/agents/improve-agent.md` | 25 | 18 | Runtime mirror of the improve-agent body. |
| `.gemini/agents/improve-agent.md` | 25 | 18 | Runtime mirror with `.gemini/agents/*.md` path convention. |
| `.codex/agents/improve-agent.toml` | 58 | 18 | TOML-wrapped runtime mirror after manual regeneration. |
| `.opencode/skill/sk-improve-agent/SKILL.md` | 21 | 9 | Clarify skill load versus protocol execution, legal-stop gates, and mirror evidence. |

**Total:** 257 insertions, 77 deletions.

### Mirror manifest

| Runtime surface | Path | Status |
|---|---|---|
| OpenCode | `.opencode/agent/improve-agent.md` | Updated |
| Claude | `.claude/agents/improve-agent.md` | Updated |
| Gemini | `.gemini/agents/improve-agent.md` | Updated |
| Codex | `.codex/agents/improve-agent.toml` | Updated after manual TOML regeneration |

### Scenario and fixture artifacts

The six scenario files exist at `.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/013-...md` through `018-...md`. The fixture exists at `.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/` with `.opencode`, `.claude`, `.gemini`, `.codex`, README, and `benchmark/sentinel.js` surfaces. The root playbook index names CP-040 through CP-045 in both the routing section and the cross-reference index.
<!-- /ANCHOR:diff -->

---

<!-- ANCHOR:lessons -->
## 9. WHAT WE LEARNED

### About testing meta-agents (agents that act on agents)

**1. Discipline lives at different layers in different agents.** `@code`'s discipline is body-level. `@improve-agent`'s discipline is command/orchestrator-level. The same-task A/B prepend-agent-body pattern works for the first kind and breaks for the second.

**2. Agent-body invocation is a subset of command-flow invocation.** Testing the agent body alone proves the agent's intrinsic behavior. Testing the command proves orchestration. Both are valid; the choice depends on which discipline is under test.

**3. Scenarios authored from `research.md` §4 sketches need command-vs-agent layer awareness.** The research correctly identified the gaps. The scenario implementation conflated the layer that proposes a candidate with the layer that evaluates it.

### About the sk-improve-agent triad

**1. ADR-001 did its job.** The mutator did not score, benchmark, promote, or mutate canonical targets when required inputs were missing. That is a proposal-only win, even though it made these scenario greps fail.

**2. The command now has better evidence hooks.** The Stage 3 diffs added `baselineScore`, `delta`, `thresholdDelta`, `benchmark_completed`, `legal_stop_evaluated`, and `blocked_stop` surfaces. R1 did not exercise them because Call B bypassed the command.

**3. Mirror truth needs to stay explicit.** The `.gemini/agents` fix is small, but it matters. Integration gates are only trustworthy if the scanner checks the real runtime mirror set.

### About the 060 packet flow

**1. The implementation and the validation diverged.** Stages 1-3 changed the right files. Stage 4 asked the wrong layer to prove those changes.

**2. Tripwire cleanliness needs causal interpretation.** CP-041, CP-044, and CP-045 showed dirty project tripwires, but the diff was parallel `description.json` indexing churn. Worktree cleanliness is useful evidence, not a veto by itself.

**3. Stopping after R1 was the right choice.** Continuing without changing invocation mode would have produced more transcripts, not more truth.

### General lessons

**Same-task A/B pattern needs an explicit "what discipline am I verifying" framing.** The 059 pattern is shape-agnostic in principle, but invocation-mode-sensitive in practice. Before writing the runner, name the layer: body, command, skill router, helper script, or orchestrator.
<!-- /ANCHOR:lessons -->

---

<!-- ANCHOR:artifacts -->
## 10. ARTIFACTS

### R1 transcripts and side files

```
/tmp/cp-040-A-task.txt
/tmp/cp-040-B-improve-agent.txt
/tmp/cp-040-B-field-counts.txt
/tmp/cp-040-tripwire-exit.txt

/tmp/cp-041-A-task.txt
/tmp/cp-041-B-improve-agent.txt
/tmp/cp-041-B-field-counts.txt
/tmp/cp-041-B-{opencode,claude,gemini,codex}-exit.txt
/tmp/cp-041-tripwire-exit.txt

/tmp/cp-042-A-task.txt
/tmp/cp-042-B-improve-agent.txt
/tmp/cp-042-B-field-counts.txt
/tmp/cp-042-tripwire-exit.txt

/tmp/cp-043-A-task.txt
/tmp/cp-043-B-improve-agent.txt
/tmp/cp-043-B-combined.txt
/tmp/cp-043-B-field-counts.txt

/tmp/cp-044-A-task.txt
/tmp/cp-044-B-improve-agent.txt
/tmp/cp-044-B-combined.txt
/tmp/cp-044-B-field-counts.txt

/tmp/cp-045-A-task.txt
/tmp/cp-045-B-improve-agent.txt
/tmp/cp-045-B-combined.txt
/tmp/cp-045-B-field-counts.txt
```

### Summary and runner logs

```
.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-summary.md
.opencode/specs/skilled-agent-orchestration/060-sk-agent-improver-test-report-alignment/002-stress-test-implementation/stress-runs/stage4-run-log.txt
/tmp/cp-040-runner.sh ... /tmp/cp-045-runner.sh
```

### Scenario specs

```
.opencode/skill/cli-copilot/manual_testing_playbook/04--agent-routing/
├── 013-skill-load-not-protocol.md
├── 014-proposal-only-boundary.md
├── 015-active-critic-overfit.md
├── 016-legal-stop-gate-bundle.md
├── 017-improvement-gate-delta.md
└── 018-benchmark-completed-boundary.md
```

### Fixture

```
.opencode/skill/sk-improve-agent/test-fixtures/060-stress-test/
├── .opencode/agent/cp-improve-target.md
├── .claude/agents/cp-improve-target.md
├── .gemini/agents/cp-improve-target.md
├── .codex/agents/cp-improve-target.toml
├── README.md
└── benchmark/sentinel.js
```

### Modified source paths

```
.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs
.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs
.opencode/command/improve/assets/improve_improve-agent_auto.yaml
.opencode/command/improve/assets/improve_improve-agent_confirm.yaml
.opencode/agent/improve-agent.md
.claude/agents/improve-agent.md
.gemini/agents/improve-agent.md
.codex/agents/improve-agent.toml
.opencode/skill/sk-improve-agent/SKILL.md
```
<!-- /ANCHOR:artifacts -->

---

<!-- ANCHOR:next-steps -->
## 11. NEXT STEPS

### Direct

1. Commit + push the 060 packet to `main`.
2. Include the Stage 1-3 source/scenario work, this `test-report.md`, `implementation-summary.md`, and `handover.md`.
3. Treat R1's failing score as an honest packet outcome, not a blocker to committing the implementation artifacts.

### Recommended follow-on packet

Create `004-improve-agent-command-flow-stress-tests`. Its job is to restructure CP-040 through CP-045 so Call B invokes `/improve:agent` through the command/YAML workflow, then re-run stress tests against the orchestrator-level flow.

The follow-on should keep the same six scenario claims, but change the runner evidence:

- command logs and generated `improvement/` artifacts,
- `score-candidate.cjs` JSON with baseline/current/delta data,
- `improvement-journal.jsonl` with `benchmark_completed`, `legal_stop_evaluated`, and `blocked_stop`,
- canonical/mirror diff checks before promotion,
- stop-reason checks that reject `converged` when any legal-stop gate fails.
<!-- /ANCHOR:next-steps -->
