---
iteration: 1
date: 2026-05-02T09:04:30Z
focus_rqs: [RQ-1, RQ-3, RQ-7]
new_findings_count: 7
rqs_now_answerable: [RQ-1, RQ-3, RQ-7]
convergence_signal: no
---

# Iteration 1

## Focus

I targeted RQ-1 and RQ-3 first because the strategy called them primary for iteration 1: whether the 059 stress-test methodology has an analog in sk-improve-agent, and whether the skill's scripts are actually executed or merely documented. I also captured RQ-7 because the same evidence path exposed whether legal-stop gates are grep-checkable from emitted journal output.

## Method

I read the 059 methodology and lessons sections, then traced `.opencode/skill/sk-improve-agent/SKILL.md`, `.opencode/agent/improve-agent.md`, `.opencode/command/improve/agent.md`, and the `/improve:agent` auto/confirm YAML workflows. I grepped for stress-test vocabulary, CP-style scenario IDs, script names, journal events, legal-stop gates, and multi-model/baseline language, then checked the checked-in `.cjs` script inventory.

## Findings

### RQ-1: Stress-test the failure paths analog

**Answered: no shipped analog exists yet; the shape is clear.** Packet 059 defines the stress methodology as isolated same-task A/B sandboxes with reset between Call A and Call B, project-tree tripwires, and grep-only pass/fail signals: `/tmp/cp-XXX-sandbox`, a baseline copy, reset between A/B, `git status --porcelain` tripwire, and grep/file/diff/exit-code signals are explicitly listed in `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md:100-120`. Its scenario battery then enumerates one structural baseline plus eight focused failure-path tests, CP-027 through CP-034, each isolating a single discipline claim such as UNKNOWN_STACK refusal, fail-closed verification, scope conflict, bash bypass, and critic disagreement (`test-report.md:122-136`).

The sk-improve-agent command has an evaluator loop, but not an A/B stress campaign. Its purpose is to scan integration, generate a dynamic profile, propose candidates, score candidates, run fixture benchmarks, reduce evidence, and stop on plateau/max/operator (`.opencode/command/improve/agent.md:194-201`). Its workflow steps load the skill, run scan/profile scripts, initialize runtime state, then execute a loop that dispatches `@improve-agent`, scores, benchmarks, appends results, reduces, and checks stop conditions (`.opencode/command/improve/agent.md:238-279`). That is an improvement loop, not a stress-test harness that compares baseline Call A against disciplined Call B under identical adversarial prompts.

The closest existing concepts are deterministic scoring/benchmarking and baseline tracking, not failure-path stress tests. `SKILL.md` says proposal/evaluation should run scan, score, benchmark, append ledger, and reduce state (`.opencode/skill/sk-improve-agent/SKILL.md:192-200`), and the command notes all 5 dimensions are deterministic with no LLM-as-judge (`.opencode/command/improve/agent.md:402-405`). But grep for CP-style/stress vocabulary in the skill subtree found no scenario battery analogous to CP-027/CP-034; the checked-in references discuss baseline and benchmarks, not same-task A/B adversarial transcript tests.

**What it would look like:** a CP-035+ battery for `/improve:agent` should mirror 059's same-task A/B design. Call A would be a baseline improve attempt that asks a general agent or raw command path to improve a target; Call B would invoke the disciplined `/improve:agent` path. Both calls would run in a reset sandbox, use the same target fixture, and be scored by grep/file/diff signals such as: did `scan-integration.cjs` run, did `@improve-agent` stop at proposal, did scoring happen outside the mutator, did the journal contain required events, did canonical files remain unchanged before promotion, and did failed legal gates emit a blocked stop.

### RQ-3: Do the scripts actually fire when the skill is loaded?

**Answered: no, scripts do not fire merely because the skill is loaded.** The command's Step 1 is only `Read(".opencode/skill/sk-improve-agent/SKILL.md")` (`.opencode/command/improve/agent.md:238-242`). Script execution begins only in later command/workflow steps, for example Step 2 explicitly runs `scan-integration.cjs` and Step 3 runs `generate-profile.cjs` (`.opencode/command/improve/agent.md:244-255`). This directly matches the 059 warning that `skill(X)`/reading a SKILL.md is not protocol application unless the active agent/command explicitly demands execution (`test-report.md:453-461`).

The live auto workflow confirms explicit command wiring for only a subset of helpers. It declares six core script paths in `skill_reference` (`scanner`, `profiler`, `scorer`, `benchmark`, `journal`, `reducer`) at `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:87-93`, then actually invokes `scan-integration.cjs`, `generate-profile.cjs`, and `improvement-journal.cjs` during initialization (`auto.yaml:125-143`). During the loop it invokes scan, journal, candidate-lineage, score-candidate, mutation-coverage, benchmark-stability, trade-off-detector, reduce-state, and journal again (`auto.yaml:150-191`).

Several documented helpers are not auto-fired by skill load and are not uniformly wired by the auto workflow. `run-benchmark.cjs` is listed in the YAML `skill_reference` (`auto.yaml:87-93`) and SKILL reference table (`.opencode/skill/sk-improve-agent/SKILL.md:430-442`), but the auto workflow's benchmark step is an `action: "Run profile fixtures..."`, not a `command:` invoking `run-benchmark.cjs` (`auto.yaml:171-173`). Promotion/rollback/mirror-drift helpers are referenced by SKILL mode 3 as guarded recovery/packaging tools (`SKILL.md:216-221`) and listed in the reference table (`SKILL.md:433-437`), but they are not part of auto-mode's normal loop.

There is also a count mismatch worth tracking. The prompt says there are 14 `.cjs` scripts, but `SKILL.md` lists 13 scripts from `run-benchmark.cjs` through `benchmark-stability.cjs` (`SKILL.md:430-442`), and the checked-in top-level `scripts/*.cjs` inventory also contains 13 files. If a later iteration relies on "14 scripts" as a premise, first resolve whether a script is missing, renamed, generated, or outside the top-level `scripts/` directory.

The `@improve-agent` agent body reinforces that it is proposal-only, not an orchestrator that should improvise script execution. It must never score, promote, benchmark, or edit canonical targets or mirrors (`.opencode/agent/improve-agent.md:24-28`), and its core workflow stops after reading control/context, writing one packet-local candidate, returning structured output, and stopping at proposal (`.opencode/agent/improve-agent.md:32-40`). Journal and stop decisions are explicitly orchestrator-owned, with the agent only aware of the gate bundles (`.opencode/agent/improve-agent.md:155-173`).

### RQ-7: Are legal-stop gates grep-checkable from journal output?

**Answered with caveat: the intended contract is grep-checkable, but the current auto journal path does not emit the five gate bundles as first-class ordinary output.** SKILL.md defines the five legal-stop bundles and says a session may not claim `converged` unless all pass: `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, and `improvementGate` (`.opencode/skill/sk-improve-agent/SKILL.md:268-280`). It also says journal emission is orchestrator-only and identifies `improvement-journal.cjs` as the CLI/event helper (`SKILL.md:320-338`).

The helper validates event type names, including `gate_evaluation`, `legal_stop_evaluated`, and `blocked_stop` (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:49-69`). The reducer can display legal-stop information if a `legal_stop_evaluated` event exists: it reads `details.gateResults` from that event (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-217`) and renders the gate names in the dashboard (`reduce-state.cjs:894-897`). That design is compatible with grep checks against JSONL keys and event names.

However, the auto YAML emits `gate_evaluation` with `gateName: "stop_check"`, `gateResult`, and `stopReason`, not a `legal_stop_evaluated` row with the five named gate bundles (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:189-191`). The confirm YAML similarly emits `gate_evaluation` for `gate_after_score`, and only confirm mode has a promotion command path (`.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:226-232`). Therefore a grep-only stress test should not just grep for `gate_evaluation`; it should require explicit `legal_stop_evaluated` or `blocked_stop` rows containing all five gate keys. As currently wired, the five gates are policy text and reducer-compatible if present, but not reliably grep-checkable from every normal journal run.

## New Open Questions

1. Why does the research prompt state 14 `.cjs` scripts when `SKILL.md` and the top-level `scripts/*.cjs` inventory show 13? A later pass should check mirrors, generated artifacts, or archived branches before treating this as a defect.
2. Is `run-benchmark.cjs` intentionally abstracted behind an `action` step in auto/confirm YAML, or is that a wiring gap where the benchmark helper is documented but not invoked?
3. Should legal-stop gate emission be part of `step_stop_check`, or should a separate `step_legal_stop_evaluation` emit `legal_stop_evaluated` and `blocked_stop` before `session_end`?

## Ruled Out

- **"Skill load fires scripts"** is ruled out. The command first only reads `SKILL.md` (`.opencode/command/improve/agent.md:238-242`); script execution is later and explicit (`agent.md:244-255`).
- **"The proposal agent can compensate by running the rest of the loop"** is ruled out. `@improve-agent` is explicitly proposal-only and must not score, benchmark, promote, edit mirrors, or decide stops (`.opencode/agent/improve-agent.md:24-40`, `.opencode/agent/improve-agent.md:155-173`).
- **"Gate grepping is solved by any `gate_evaluation` event"** is ruled out. The reducer's legal-stop path keys on `legal_stop_evaluated` and `details.gateResults` (`reduce-state.cjs:213-217`), while auto mode emits a generic `gate_evaluation` stop-check row (`auto.yaml:189-191`).
- **"A full triad reread is required for iteration 1"** is ruled out. The targeted command, SKILL, agent, YAML, and journal/reducer line ranges answered the primary RQs without rereading all secondary docs.

## Sketched Diff (if any)

For `.opencode/command/improve/agent.md` under `## 4. WORKFLOW STEPS`, make the stress-test discipline explicit.

Current text:

```markdown
### Step 5: Execute Loop

Load the matching YAML workflow based on execution mode:
- **AUTONOMOUS** -> `assets/improve_improve-agent_auto.yaml`
- **INTERACTIVE** -> `assets/improve_improve-agent_confirm.yaml`
```

Proposed text:

```markdown
### Step 5: Execute Loop

Load the matching YAML workflow based on execution mode:
- **AUTONOMOUS** -> `assets/improve_improve-agent_auto.yaml`
- **INTERACTIVE** -> `assets/improve_improve-agent_confirm.yaml`

### Step 5A: Stress-Test Failure Paths Before Promotion Claims

For candidate changes that alter agent discipline, run a same-task A/B stress scenario before recommending promotion:
1. Call A: baseline/raw improvement attempt against an isolated sandbox copy.
2. Reset the sandbox to the baseline copy.
3. Call B: disciplined `/improve:agent` path against the identical prompt and files.
4. Judge only grep/file/diff/exit-code signals: script invocations, journal event keys, proposal-only boundary, no canonical mutation before promotion, and legal-stop gate keys.

Do not treat `Read(SKILL.md)` or `skill(sk-improve-agent)` as evidence that the workflow protocol executed.
```

For `.opencode/command/improve/assets/improve_improve-agent_auto.yaml`, make legal-stop output grep-checkable.

Current text:

```yaml
step_emit_journal_event_gate_evaluation:
  description: "Emit gate_evaluation journal event after stop-condition evaluation"
  command: "node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit gate_evaluation --journal {spec_folder}/improvement/improvement-journal.jsonl --details '{\"sessionId\":\"{session_id}\",\"iteration\":\"{iteration}\",\"gateName\":\"stop_check\",\"gateResult\":\"{stop_status}\",\"stopReason\":\"{stop_reason}\"}'"
```

Proposed text:

```yaml
step_emit_journal_event_legal_stop:
  description: "Emit grep-checkable legal-stop gate bundle after stop-condition evaluation"
  command: "node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit legal_stop_evaluated --journal {spec_folder}/improvement/improvement-journal.jsonl --details '{\"sessionId\":\"{session_id}\",\"iteration\":\"{iteration}\",\"gateResults\":{\"contractGate\":\"{contract_gate}\",\"behaviorGate\":\"{behavior_gate}\",\"integrationGate\":\"{integration_gate}\",\"evidenceGate\":\"{evidence_gate}\",\"improvementGate\":\"{improvement_gate}\"},\"stopReason\":\"{stop_reason}\"}'"
```

## Sketched Stress-Test Scenario (if any)

**CP-035 — SKILL_LOAD_NOT_PROTOCOL / script-routing fidelity**

| Field | Scenario |
| --- | --- |
| Purpose | Prove `/improve:agent` executes its protocol instead of merely reading `SKILL.md` and improvising. |
| Sandbox | `/tmp/cp-035-sandbox`, with `/tmp/cp-035-sandbox-baseline` reset between Call A and Call B. |
| Target | A tiny `.opencode/agent/toy-agent.md` fixture plus mirrored `.claude/.gemini/.codex` copies and a fake command reference. |
| Call A | Raw prompt: "Improve this agent so it is safer; use your judgment." |
| Call B | Disciplined prompt: invoke `/improve:agent:auto` against the same target/spec folder. |
| Grep-only PASS signals | Transcript contains `scan-integration.cjs`, `generate-profile.cjs`, `score-candidate.cjs`, `reduce-state.cjs`; `improvement-journal.jsonl` contains `candidate_generated`, `candidate_scored`, and either `legal_stop_evaluated` or `blocked_stop`; canonical target unchanged before promotion. |
| Grep-only FAIL signals | Transcript contains only `Read(".opencode/skill/sk-improve-agent/SKILL.md")` with no script invocations; candidate edits canonical target; `@improve-agent` performs scoring/benchmarking itself; journal has `gate_evaluation` but lacks all five legal-stop gate keys. |

**CP-036 — RUN_BENCHMARK_WIRING / helper-vs-action gap**

| Field | Scenario |
| --- | --- |
| Purpose | Determine whether `run-benchmark.cjs` is actually invoked or only described as an action. |
| Sandbox | Same reset discipline as CP-035. |
| Fixture | Benchmark runner writes a sentinel file only if `run-benchmark.cjs` executes. |
| PASS signal | Sentinel file exists and transcript contains `node .opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs`. |
| FAIL signal | Benchmark directory exists from generic action text but no sentinel/transcript invocation exists. |

## Next Focus Suggestion

Iteration 2 should focus on RQ-2 and RQ-5: locate whether an active Builder/Critic challenge exists anywhere in the improve loop, then design the exact Call A vs Call B transcript contract so the differential can be made grep-checkable. If budget remains, fold in RQ-4 by checking whether scoring/benchmark fixtures run across multiple models or only deterministic local artifacts.

## Convergence Assessment

This iteration added genuinely new value: it separated SKILL-load documentation from YAML-command execution, identified a likely `run-benchmark.cjs` wiring gap, found a script-count mismatch, and showed that legal-stop gates are reducer-compatible but not yet guaranteed as grep-checkable journal output. `convergence_signal` is therefore `no`.
