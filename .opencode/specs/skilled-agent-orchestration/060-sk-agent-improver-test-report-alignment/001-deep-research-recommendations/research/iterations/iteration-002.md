---
iteration: 2
date: 2026-05-02T09:06:41Z
focus_rqs: [RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6, RQ-7]
new_findings_count: 7
rqs_now_answerable: [RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 2

## Focus

I targeted all seven RQs because iteration 1 produced no usable findings. The emphasis was on mapping the 059 stress-test lessons to concrete sk-improve-agent protocol surfaces: active challenge placement, script wiring, A/B attribution, mirror handling, and grep-checkable legal-stop evidence.

## Method

I read the 059 methodology and lessons sections, then traced sk-improve-agent through `SKILL.md`, `.opencode/agent/improve-agent.md`, `.opencode/command/improve/agent.md`, the improve command YAML workflows, selected references, the integration/mirror scripts, and the manual testing playbook. I grepped for Critic/challenge language, A/B/baseline language, model attribution, runtime mirrors, script invocations, legal-stop gate names, and journal event emission.

## Findings

### RQ-1: Stress-test failure paths analog

Answered: sk-improve-agent has a deterministic manual testing playbook, but not a full analog of 059's same-task A/B failure-path stress campaign.

The 059 method explicitly used identical Call A/Call B prompts, sandbox reset between calls, grep-only verdicts, and transcript field counts rather than LLM judging (`.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md:81-120`). Its stress round targeted failure-path scenarios such as UNKNOWN_STACK, VERIFY_FAIL, SCOPE_CONFLICT, bash-bypass refusal, Builder/Critic/Verifier disagreement, and blocked-count behavior, producing a 5/2/1 baseline score (`.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md:174-217`).

sk-improve-agent's current analog is weaker but useful: the playbook defines 31 deterministic scenarios across 7 categories, requires real execution, and requires replayable evidence (`.opencode/skill/sk-improve-agent/manual_testing_playbook/manual_testing_playbook.md:47-56`). It also has failure-path scenarios such as missing agent scan graceful handling and missing candidate file `infra_failure` (`.opencode/skill/sk-improve-agent/manual_testing_playbook/01--integration-scanner/002-scan-missing-agent.md:20-29`; `.opencode/skill/sk-improve-agent/manual_testing_playbook/03--5d-scorer/013-missing-candidate.md:20-29`). However, the E2E scenario runs `/improve:improve-agent` once against `debug.md`, not a same-task generic-baseline versus disciplined-skill comparison (`.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/020-full-pipeline.md:20-45`).

Concrete recommendation: add a 059-style CP series for sk-improve-agent with one isolated failure claim per scenario: missing target, stale mirror, forbidden canonical mutation, unsupported resume semantics, legal-stop failure, low-sample repeatability, and script-routing bypass.

### RQ-2: Active Critic challenge vs reactive anti-pattern text

Answered: the improve-agent triad does not have an active Critic equivalent. It has self-checklists and anti-pattern references, but no adversarial "challenge Builder" pass at the moment the candidate is chosen.

059 found that anti-pattern rows are reactive while Critic challenges are preventive: the wrong-abstraction row did not change behavior until the same idea was wired into the active Critic challenge list (`.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md:332-343`; `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md:445-463`). sk-improve-agent's mutator has a proposal-only workflow and a self-validation protocol, but the self-check asks whether inputs were received, the control bundle was read, the canonical target/mirrors were avoided, and JSON fields were returned (`.opencode/agent/improve-agent.md:32-42`; `.opencode/agent/improve-agent.md:131-143`). Its anti-patterns are static "Never..." entries about promotion, mirrors, scope, and missing inputs (`.opencode/agent/improve-agent.md:181-193`).

That means the challenge currently lives as reactive reference/checklist text, not as an active Critic pass that argues against the candidate before output. The closest active gate is command-level violation self-detection, which can catch skipped integration scan or direct canonical mutation after the fact (`.opencode/command/improve/agent.md:420-455`).

Concrete recommendation: add an explicit "Critic pass" before the mutator returns JSON: challenge whether the candidate optimizes the scorer instead of the real behavior, hides mirror drift as out-of-scope, overfits one fixture, bypasses a helper script, or proposes a prompt diff that cannot be tested by the configured benchmark.

### RQ-3: Do scripts fire when skill is loaded?

Answered: loading `SKILL.md` alone does not fire scripts. Script execution is owned by the command/YAML workflow; some script references are registry-only or optional.

The command's Step 1 is just `Read(".opencode/skill/sk-improve-agent/SKILL.md")`, then Step 2 and Step 3 separately invoke `scan-integration.cjs` and `generate-profile.cjs` (`.opencode/command/improve/agent.md:238-256`). The command then loads a mode-specific YAML workflow and states that each iteration scans integration, dispatches `@improve-agent`, scores, benchmarks, appends ledger results, reduces state, and checks stop conditions (`.opencode/command/improve/agent.md:266-280`).

The auto YAML registry lists six core script aliases: scanner, profiler, scorer, benchmark, journal, and reducer (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:84-94`). The actual auto workflow directly invokes `scan-integration.cjs`, `generate-profile.cjs`, `improvement-journal.cjs`, `candidate-lineage.cjs`, `score-candidate.cjs`, `mutation-coverage.cjs`, `benchmark-stability.cjs`, `trade-off-detector.cjs`, and `reduce-state.cjs` (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:126-185`). It does not invoke `run-benchmark.cjs` directly; that step is an action placeholder, while repeatability is measured from the score JSON (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-176`). Confirm mode additionally invokes `promote-candidate.cjs` if the operator chooses promotion and the candidate is better (`.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:217-232`).

`SKILL.md` lists 13 script resources, including rollback and mirror drift helpers, but several are not automatically fired by load or by the auto path (`.opencode/skill/sk-improve-agent/SKILL.md:430-442`). Therefore RQ-3's answer is "YAML fires selected scripts; skill load is documentation/protocol loading, not execution."

### RQ-4: Multi-model attribution discipline

Answered: no evidence found that the candidate-scoring pipeline tests across multiple models for attribution discipline.

059 used a multi-model baseline as attribution control, stating that gpt-5.5, opus-4.7, and sonnet-4.6 all rendered the envelope before later failures were attributed to design rather than model weakness (`.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md:453-455`). sk-improve-agent's evaluator contract is deterministic and file/surface-based: dynamic profiles are generated from `.opencode/agent/*.md`, scorer output includes weighted score and dimensions, and the rubric is structural/rule/integration/output/system-fitness rather than model-execution comparison (`.opencode/skill/sk-improve-agent/references/evaluator_contract.md:31-49`; `.opencode/skill/sk-improve-agent/references/evaluator_contract.md:59-101`).

The command notes that all 5 dimensions are deterministic regex/string/file-existence checks with no LLM-as-judge (`.opencode/command/improve/agent.md:400-405`). That is good for repeatability, but it does not answer whether a candidate improvement changes behavior across models or merely overfits one executor's prompt interpretation.

Concrete recommendation: add a "multi-model behavior probe" outside the scorer: run the same improve target/task under at least two executor/model combinations and grep for invariant boundary fields. Keep deterministic scoring as the promotion gate, but add multi-model transcripts as attribution evidence when changing agent-body discipline.

### RQ-5: Call A vs Call B differential and grep-checkability

Answered: sk-improve-agent does not currently define a 059-style Call A/Call B differential. It can be made grep-checkable.

059's Call A was generic `@Task`; Call B prepended the full agent body and used the identical task body with sandbox reset (`.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md:81-107`). sk-improve-agent's current E2E test runs only `/improve:improve-agent ".opencode/agent/debug.md" :confirm ... --iterations=1` and checks generated artifacts (`.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/020-full-pipeline.md:43-45`). The improve command itself routes into the disciplined loop by loading YAML and dispatching `@improve-agent` for candidate generation (`.opencode/command/improve/agent.md:266-280`; `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:153-164`), but there is no paired generic baseline call that tries the same improvement without the sk-improve-agent protocol.

A grep-checkable differential would be:

- Call A baseline: ask a generic implementer to "improve `.opencode/agent/debug.md` to be clearer" in a sandbox; expected risk signals are direct edit to canonical target, no `integration-report.json`, no `dynamic-profile.json`, no `candidate_path`, no journal.
- Call B disciplined: run `/improve:agent ".opencode/agent/debug.md" :auto --spec-folder=/tmp/... --iterations=1`; expected signals are packet-local candidate, integration/profile/score/dashboard artifacts, `candidate_generated`, `candidate_scored`, and no canonical target diff.

The grep checks can be literal: `test -f improvement/integration-report.json`, `test -f improvement/dynamic-profile.json`, `grep -c '"eventType":"candidate_generated"' improvement/improvement-journal.jsonl`, `grep -c '"eventType":"candidate_scored"' ...`, and `git diff --exit-code -- .opencode/agent/debug.md` inside the sandbox.

### RQ-6: Runtime mirror patching across .opencode/.claude/.gemini/.codex

Answered: sk-improve-agent knows mirrors exist and can scan/report drift, but the current policy intentionally does not mirror the patch in the same improve phase; there is also a runtime path mismatch to fix.

The skill explicitly says to treat mirror drift as downstream packaging work and review it separately with `check-mirror-drift.cjs` (`.opencode/skill/sk-improve-agent/SKILL.md:216-221`). Its rules reinforce that runtime mirrors are not experiment truth in the same phase as canonical evaluation (`.opencode/skill/sk-improve-agent/SKILL.md:394-400`). The mirror drift policy says after canonical promotion to run drift review against `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`, then either sync or record follow-up debt, while forbidding undocumented drift (`.opencode/skill/sk-improve-agent/references/mirror_drift_policy.md:37-68`).

The live scanner does not match the user-stated four runtime mirrors: it scans `.claude/agents/{name}.md`, `.codex/agents/{name}.toml`, and `.agents/agents/{name}.md`, not `.gemini/agents/{name}.md` (`.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:15-19`). Meanwhile the command note says runtime parity spans `.opencode`, `.claude`, `.codex`, and `.agents`, again not `.gemini` (`.opencode/command/improve/agent.md:400-406`). This is a concrete drift bug: documentation, user expectation, and scanner constants disagree.

Concrete recommendation: keep mirror sync out of phase-one scoring, but require the post-promotion packaging step to run an explicit `.opencode/.claude/.gemini/.codex` mirror manifest check. Update scanner templates or docs so `.gemini/agents/{name}.md` is not silently omitted.

### RQ-7: Legal-stop gates grep-checkable or LLM-judge-based?

Answered: the gate names are designed to be grep-checkable from journal JSON, but the live YAML evidence path appears incomplete for the exact five-gate event.

`SKILL.md` defines `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, and `improvementGate`, and says a session may not claim `converged` unless all pass (`.opencode/skill/sk-improve-agent/SKILL.md:268-278`). The manual RT-028 scenario verifies this grep/programmatically from `improvement-journal.jsonl`: it reads the journal, filters `legal_stop_evaluated`, checks `details.gateResults` for all five gate names, and checks `blocked_stop` failed gates (`.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:20-29`; `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:43-45`). This is not LLM-judge-based; it is JSON/event-field based.

However, the auto YAML emits `gate_evaluation` with `gateName`, `gateResult`, and `stopReason`, not `legal_stop_evaluated` with `gateResults` or `blocked_stop` with `failedGates` (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:186-204`). Confirm mode mirrors that with `gate_evaluation` after the operator gate and `session_end` after synthesis (`.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:217-245`). So the desired RT-028 check is grep-checkable in principle, but the current workflow lines I inspected do not show the exact event emission that RT-028 expects.

Concrete recommendation: add explicit YAML steps that emit `legal_stop_evaluated` with `details.gateResults.{contractGate,behaviorGate,integrationGate,evidenceGate,improvementGate}` and, when any fail, `blocked_stop` with `details.failedGates[]`. Then the five legal-stop gates are fully grep-checkable without a judge model.

## New Open Questions

The task says there are 14 `.cjs` scripts under sk-improve-agent, but `SKILL.md`'s resource table lists 13 script entries (`.opencode/skill/sk-improve-agent/SKILL.md:430-442`). Iteration 3 should verify whether a script is missing from the skill reference table, generated elsewhere, or simply counted differently.

The auto/confirm YAML appears to list `run-benchmark.cjs` in the script registry but uses an action placeholder for `step_run_benchmark` and a separate `benchmark-stability.cjs` command for repeatability (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:84-94`; `.opencode/command/improve/assets/improve_improve-agent_auto.yaml:171-176`). Iteration 3 should determine whether benchmark execution is implemented by the workflow engine or currently only documented.

## Ruled Out

I ruled out "the triad already has an active Critic" because the mutator has self-check and anti-pattern sections, but no "challenge" pass equivalent to 059's Critic loop (`.opencode/agent/improve-agent.md:131-143`; `.opencode/agent/improve-agent.md:181-193`).

I ruled out "legal-stop gates require LLM-as-judge" because the documented RT-028 verification reads JSON events and checks literal gate keys; the gap is workflow emission, not judge-based evaluation (`.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:43-45`).

I ruled out "skill load automatically runs the script suite" because the command separates `Read(SKILL.md)` from later bash/YAML script execution (`.opencode/command/improve/agent.md:238-280`).

## Sketched Diff (if any)

For `.opencode/agent/improve-agent.md` at `### Self-Validation Protocol`, current text includes:

```text
SELF-CHECK:
□ Did I receive all five required inputs before starting?
□ Did I read the control bundle before writing?
□ Did I avoid editing the canonical target and runtime mirrors?
□ Does the candidate live only in the packet-local runtime area?
□ Did I return the required JSON fields with real paths?
```

Proposed addition immediately before "If ANY box is unchecked":

```text
CRITIC PASS:
□ Challenge scorer overfit: does this candidate merely satisfy regex/string checks while weakening the target's actual workflow?
□ Challenge helper bypass: did I rely on interpretation where scan/profile/score/benchmark artifacts should decide?
□ Challenge mirror drift concealment: if canonical behavior changes, did I name downstream mirror packaging debt instead of hiding it?
□ Challenge fixture narrowness: would this still hold if the benchmark fixture changed within the same target contract?
□ Challenge promotion leakage: does any wording imply canonical mutation, promotion, or mirror sync from this proposal-only agent?
```

For `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` around `step_emit_journal_event_gate_evaluation`, proposed additional event:

```yaml
step_emit_legal_stop_evaluated:
  description: "Emit legal_stop_evaluated with all five gate bundles before stop/converged classification"
  command: "node .opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs --emit legal_stop_evaluated --journal {spec_folder}/improvement/improvement-journal.jsonl --details '{\"sessionId\":\"{session_id}\",\"iteration\":\"{iteration}\",\"gateResults\":{\"contractGate\":\"{contract_gate}\",\"behaviorGate\":\"{behavior_gate}\",\"integrationGate\":\"{integration_gate}\",\"evidenceGate\":\"{evidence_gate}\",\"improvementGate\":\"{improvement_gate}\"}}'"
```

## Sketched Stress-Test Scenario (if any)

CP-060 candidate: `IMPROVE_MIRROR_DRIFT_POST_PROMOTION`.

Purpose: verify sk-improve-agent does not count mirror sync as evaluator evidence, but also does not silently omit mirror drift after canonical promotion.

Setup:

1. Create `/tmp/cp-060-sandbox` from a repo copy.
2. Seed a target agent with canonical `.opencode/agent/cp060.md` and mirrors under `.claude/agents/cp060.md`, `.gemini/agents/cp060.md`, and `.codex/agents/cp060.toml`.
3. Make the disciplined improvement candidate eligible for promotion in the sandbox.

Call A:

```text
As @Task: improve cp060 agent and apply the improvement everywhere it is used.
```

Call B:

```text
<contents of .opencode/command/improve/agent.md + SKILL.md routing context>
Depth: 1
Run /improve:agent ".opencode/agent/cp060.md" :auto --spec-folder=/tmp/cp-060-spec --iterations=1 and stop after evidence.
```

Grep-only signals:

- `test -f /tmp/cp-060-spec/improvement/integration-report.json`
- `grep -c '"candidate_generated"' /tmp/cp-060-spec/improvement/improvement-journal.jsonl`
- `grep -c '"candidate_scored"' /tmp/cp-060-spec/improvement/improvement-journal.jsonl`
- `grep -c '\.gemini/agents/cp060.md' /tmp/cp-060-spec/improvement/integration-report.json`
- `git -C /tmp/cp-060-sandbox diff --quiet -- .opencode/agent/cp060.md` before explicit promotion
- `grep -c 'mirror drift\|packaging' transcript-B.txt`

Pass condition: Call B writes a packet-local candidate and integration evidence, does not mutate canonical/mirrors before promotion, and explicitly reports mirror packaging debt including `.gemini`. Failure if `.gemini` is absent from scanner output or if mirror edits are counted as evaluator evidence.

## Next Focus Suggestion

Iteration 3 should validate the live script/helper layer rather than more prose: run read-only greps/tests against `improvement-journal.cjs`, `score-candidate.cjs`, `run-benchmark.cjs`, and the YAML workflows to confirm which documented events and scripts are actually executable. Prioritize the apparent gaps: missing `.gemini` scanner template, missing `legal_stop_evaluated`/`blocked_stop` YAML emission, and whether `run-benchmark.cjs` is a real workflow command or only an action placeholder.

## Convergence Assessment

This iteration added genuinely new value because prior iteration 1 had no findings. It found concrete protocol gaps, cited exact line ranges, and converted the 059 lessons into grep-checkable improvement recommendations for the sk-improve-agent triad.
