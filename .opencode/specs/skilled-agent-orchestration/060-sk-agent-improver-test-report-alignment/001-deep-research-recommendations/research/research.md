---
title: "Research Synthesis — 060 sk-improve-agent test-report-alignment"
description: "Final synthesis of 10-iter cli-copilot research run on improving sk-improve-agent triad based on 059 stress-test methodology."
date: 2026-05-02T11:29:36.280+02:00
iterations_run: 10
convergence_iteration: null
---

# Research Synthesis — 060 sk-improve-agent test-report-alignment

## 1. EXECUTIVE SUMMARY

The 060 research run found that `sk-improve-agent` already has serious evaluator machinery: proposal-only candidates, dynamic 5-dimension scoring, runtime journals, benchmark and reducer helpers, mirror-drift policy, and legal-stop vocabulary. It does not yet have the part that made packet 059 effective: a same-task A/B stress campaign that forces one failure-path claim at a time, resets the sandbox between calls, and judges only grep/file/diff/exit-code signals.

The top recommendation is to make Call B prove an ordered evidence chain, not just produce plausible artifacts. The chain is: path-correct integration truth first, baseline/current score truth second, benchmark boundary truth third, and legal-stop truth last. Iteration 10 is the clearest statement of that dependency order: mirror inventory must be correct before `integrationGate` is trusted; baseline/delta evidence must exist before `improvementGate` is trusted; `benchmark_completed`, `legal_stop_evaluated`, and `blocked_stop` must be journal events, not prose in a dashboard (`research/iterations/iteration-010.md:22-57`).

The second recommendation is to add an active Critic pass to `.opencode/agent/improve-agent.md`. The current mutator is correctly proposal-only, but its self-checks are boundary checks, not adversarial challenges. Packet 059 showed that anti-pattern reference text is reactive while Critic challenges are preventive; iterations 2 and 3 found no equivalent active challenge in the improve-agent triad (`research/iterations/iteration-002.md:32-40`, `research/iterations/iteration-003.md:52-59`).

The third recommendation is to make packet 061 test-first. Author CP-040 onward scenarios before broad rewrites, then run the same 059-style score progression against a small controlled agent-under-improvement. The expected impact is practical: packet 061 should turn the current aspirational legal-stop and mirror contracts into executable, grep-checkable behavior, then measure whether the triad moves from artifact-presence compliance to discipline under stress.

## 2. METHODOLOGY

The research ran as a 10-iteration deep-research loop using cli-copilot with `gpt-5.5`. Each iteration used fresh context, read prior iteration summaries from disk, and wrote a standalone `research/iterations/iteration-NNN.md` narrative. The run was bounded by a 10-iteration cap and a 3-consecutive-yes convergence model. A state-log convergence marker appeared after iteration 3, but the manual dispatch continued through iteration 10; the final synthesis therefore treats the run as max-cap completed, not early converged.

Packet 059 was the lens. The research repeatedly mapped its transferable lessons to the sk-improve-agent triad: single-task structural tests are insufficient, same-task A/B dispatch isolates discipline, multi-model baselines help attribution, `skill(X)` invocation is not equivalent to applying X's protocol, and grep-only signals beat LLM-as-judge for contract compliance. Iterations 1-4 established the broad gaps (`research/iterations/iteration-001.md:22-50`, `research/iterations/iteration-002.md:22-93`, `research/iterations/iteration-004.md:22-45`).

Iterations 5-10 narrowed from prose contracts to executable seams. They located the legal-stop ownership gap, the missing baseline/delta data path, the insufficient-sample fixture that still ended as `converged`, the `candidate-acceptable` versus `candidate-better` split, the `.gemini` versus `.agents` mirror mismatch, and finally the dependency order packet 061 should follow (`research/iterations/iteration-005.md:22-43`, `research/iterations/iteration-006.md:22-51`, `research/iterations/iteration-007.md:22-49`, `research/iterations/iteration-008.md:22-56`, `research/iterations/iteration-009.md:22-54`, `research/iterations/iteration-010.md:22-57`).

## 3. GAP ANALYSIS (per RQ)

### RQ-1: Does `sk-improve-agent` have an analog of "stress-test the failure paths"? If not, what would it look like?

**Status:** ANSWERED

**Answer:** It has a deterministic manual testing playbook and runtime-truth scenarios, but not a full 059 analog. The missing analog is a same-task A/B stress campaign where Call A is a generic improvement attempt and Call B is the disciplined `/improve:agent` path, both run in reset sandboxes and judged by grep/file/diff signals.

**Evidence:** The command defines an improvement loop that scans, profiles, dispatches the mutator, scores, benchmarks, reduces, and checks stop conditions (`.opencode/command/improve/agent.md:194-201`, `.opencode/command/improve/agent.md:238-280`). The skill's Mode 2 similarly describes proposal/evaluation steps, not A/B stress execution (`.opencode/skill/sk-improve-agent/SKILL.md:192-200`). Iteration 1 found no shipped CP-style stress battery and sketched the missing A/B shape (`research/iterations/iteration-001.md:22-30`). Iteration 4 resolved the apparent conflict: the manual playbook is serious operator evidence, but still weaker than 059 because it can pass scenario-level checks without enforcing same-task A/B differentials (`research/iterations/iteration-004.md:38-45`).

**Gap (if any):** The current playbook checks components and E2E artifact presence, not discipline under adversarial comparative prompts.

**Recommended action:** Packet 061 should author CP-040 onward scenarios with one claim per scenario: script-routing fidelity, proposal-only boundary, active Critic behavior, legal-stop gates, baseline/delta semantics, benchmark boundary, mirror inventory, and multi-model attribution.

### RQ-2: Where in the improve-loop does an active Critic challenge live, vs reactive anti-pattern reference text?

**Status:** ANSWERED

**Answer:** No active Critic equivalent currently lives in the triad. The mutator has proposal-only rules, self-validation, and anti-patterns, but no "challenge this candidate before returning" pass.

**Evidence:** The agent's core workflow reads inputs, writes one packet-local candidate, returns JSON, and stops (`.opencode/agent/improve-agent.md:32-42`). Its self-validation asks whether required inputs were received, the bundle was read, canonical/mirror edits were avoided, and JSON fields were returned (`.opencode/agent/improve-agent.md:131-143`). Its anti-pattern section is static "Never..." guidance (`.opencode/agent/improve-agent.md:181-193`). Iteration 2 mapped this directly to 059's lesson that reactive anti-pattern rows did not change behavior until wired into an active Critic pass (`research/iterations/iteration-002.md:32-40`). Iteration 3 confirmed targeted greps found no Critic/challenge/red-team equivalent in the triad or references (`research/iterations/iteration-003.md:52-59`).

**Gap (if any):** The mutator can comply with proposal boundaries while still writing candidates that overfit the scorer, hide mirror debt, bypass helper evidence, or imply promotion leakage.

**Recommended action:** Add a `CRITIC PASS` inside `.opencode/agent/improve-agent.md` before "If ANY box is unchecked." The pass should challenge scorer overfit, helper bypass, mirror drift concealment, fixture narrowness, and promotion leakage.

### RQ-3: Do `sk-improve-agent`'s 14 scripts (run-benchmark, score-candidate, etc.) actually fire when the skill is loaded, or does the agent read SKILL.md and improvise?

**Status:** ANSWERED

**Answer:** Loading `SKILL.md` does not fire scripts. Script execution is command/YAML-owned, and the current path fires selected scripts while leaving key steps as action placeholders or contract gaps. The "14 scripts" premise is also unstable: iterations found the checked-in top-level script inventory and `SKILL.md` table enumerate 13 `.cjs` helpers, so packet 061 should refresh the inventory before using script count as an acceptance criterion.

**Evidence:** The command's Step 1 is only `Read(".opencode/skill/sk-improve-agent/SKILL.md")`; Step 2 and Step 3 separately invoke `scan-integration.cjs` and `generate-profile.cjs` (`.opencode/command/improve/agent.md:238-256`). The skill lists script resources under references (`.opencode/skill/sk-improve-agent/SKILL.md:430-442`). Iteration 1 separated skill-load documentation from explicit command execution and found `run-benchmark.cjs` documented but not uniformly command-wired (`research/iterations/iteration-001.md:32-40`). Iteration 6 found YAML passes `--baseline` to `score-candidate.cjs`, but the scorer ignores `args.baseline` and emits no delta (`research/iterations/iteration-006.md:22-37`). Iteration 10 generalized the issue: command-fired scripts do not yet form a closed proof chain (`research/iterations/iteration-010.md:41-47`).

**Gap (if any):** The workflow has real helper calls, but benchmark execution, baseline recording, ledger append, legal-stop evaluation, and stop assignment are not yet fully executable evidence boundaries.

**Recommended action:** In packet 061, make `/improve:agent` distinguish script invocation from protocol completion. Add explicit evidence-producing commands for baseline scoring, benchmark completion, evidence ledger append, legal-stop evaluation, and stop-reason assignment; update the command and skill docs to say `Read(SKILL.md)` is never proof of protocol execution.

### RQ-4: Does the candidate-scoring pipeline test across multiple models for attribution discipline?

**Status:** ANSWERED

**Answer:** No. The scoring pipeline is intentionally deterministic and model-agnostic, which is good for repeatability but does not answer packet 059's attribution question: did the candidate improve behavior across model executions, or did one executor comply by luck?

**Evidence:** The command states that all five scoring dimensions are deterministic regex/string/file-existence checks and not LLM-as-judge (`.opencode/command/improve/agent.md:400-405`). The skill defines the five weighted dimensions as structural integrity, rule coherence, integration consistency, output quality, and system fitness (`.opencode/skill/sk-improve-agent/SKILL.md:202-214`). Iteration 2 found no multi-model candidate-scoring evidence (`research/iterations/iteration-002.md:52-60`). Iteration 3 confirmed scorer and benchmark outputs are local-file artifacts without model/executor dimensions (`research/iterations/iteration-003.md:22-30`).

**Gap (if any):** Deterministic score can pass while behavior remains model-fragile.

**Recommended action:** Keep deterministic scoring as the promotion gate, but add a separate multi-model behavior probe for agent-discipline changes: run Call B under at least two Copilot models and grep for invariant proposal-only, packet-local, no-canonical-diff, and journal-boundary fields.

### RQ-5: What does Call A (baseline improve attempt) vs Call B (sk-improve-agent-disciplined improve attempt) look like? Can the differential be made grep-checkable?

**Status:** ANSWERED

**Answer:** Call A is a generic "improve this agent" attempt in a sandbox. Call B is `/improve:agent <target> :auto|:confirm --spec-folder=<packet> --iterations=N` against the same target and prompt, after resetting the sandbox. The differential can be grep-checkable, but only if packet 061 upgrades Call B from artifact-presence checks to an ordered evidence chain.

**Evidence:** The command defines only the disciplined path today (`.opencode/command/improve/agent.md:266-280`). The agent body confirms the mutator should only propose one packet-local candidate and never score, promote, benchmark, or edit canonical targets (`.opencode/agent/improve-agent.md:24-28`, `.opencode/agent/improve-agent.md:95-111`). Iteration 3 sketched the basic Call A/B file and journal greps (`research/iterations/iteration-003.md:60-73`). Iteration 6 added required baseline/delta greps (`research/iterations/iteration-006.md:38-51`). Iteration 9 added path-level mirror greps (`research/iterations/iteration-009.md:40-54`). Iteration 10 ordered those greps by dependency (`research/iterations/iteration-010.md:22-34`).

**Gap (if any):** Current E2E checks can pass if the right-looking artifacts exist; they do not prove mirror truth, comparative improvement, benchmark boundary, legal-stop blocking, or stop-reason correctness.

**Recommended action:** Packet 061 should define Call B PASS as: expected mirror paths present, `baselineScore`/`delta`/`thresholdDelta` present, `benchmark_completed` present, `legal_stop_evaluated` contains all five gates, `blocked_stop` appears when gates fail, and no `converged` appears while `evidenceGate` or `improvementGate` fails.

### RQ-6: When `sk-improve-agent` improves an agent that lives in 4 runtime mirrors (.opencode/.claude/.gemini/.codex), does it know to mirror the patch?

**Status:** ANSWERED

**Answer:** The policy is mostly right: mirror sync should be downstream packaging work, not experiment truth in the same phase. The runtime inventory is wrong or at least split-brain: current docs and scanner paths mix `.gemini/agents` with stale `.agents/agents`.

**Evidence:** The skill says mirror drift is downstream packaging work (`.opencode/skill/sk-improve-agent/SKILL.md:216-221`) and forbids treating runtime mirrors as experiment truth in the same phase (`.opencode/skill/sk-improve-agent/SKILL.md:386-400`). The command notes runtime parity as `.opencode`, `.claude`, `.codex`, and `.agents`, not `.gemini` (`.opencode/command/improve/agent.md:400-406`). Iteration 3 found the scanner constant uses `.agents/agents/{name}.md` instead of `.gemini/agents/{name}.md` (`research/iterations/iteration-003.md:32-40`). Iteration 9 ran that to ground: the scanner can report `.agents` missing while omitting an existing `.gemini` mirror, and integration scoring gives mirror consistency real weight (`research/iterations/iteration-009.md:22-31`).

**Gap (if any):** Integration evidence can be false if the scanner checks a stale mirror set.

**Recommended action:** Fix mirror inventory before legal-stop or score-gate work. Prefer an explicit runtime manifest consumed by `scan-integration.cjs`; if packet 061 keeps static defaults, use `.claude/agents/{name}.md`, `.codex/agents/{name}.toml`, and `.gemini/agents/{name}.md`, with `.agents/agents` only if manifest-declared.

### RQ-7: Are the 5 legal-stop gates (contractGate / behaviorGate / integrationGate / evidenceGate / improvementGate) actually grep-checkable from journal output, or LLM-judge-based?

**Status:** ANSWERED

**Answer:** They are designed to be grep-checkable, not LLM-judge-based, but the live producer path is incomplete. Policy names the gates; the reducer can consume them if present; RT-028 describes the desired event shape. The normal workflow still emits generic `gate_evaluation`, lacks producer-side validation for full gate bundles, and lacks authoritative baseline/delta evidence for `improvementGate`.

**Evidence:** The skill defines the five legal-stop gates and forbids `converged` unless all pass (`.opencode/skill/sk-improve-agent/SKILL.md:268-280`). It also lists journal event types including `benchmark_completed`, `legal_stop_evaluated`, and `blocked_stop` (`.opencode/skill/sk-improve-agent/SKILL.md:260-267`). The agent body agrees that benchmark and legal-stop events are orchestrator-owned (`.opencode/agent/improve-agent.md:151-163`). The command's stop taxonomy distinguishes `converged` from `blockedStop` (`.opencode/command/improve/agent.md:306-316`). Iteration 4 found RT-028 already requires `legal_stop_evaluated` and `blocked_stop`, but tests and RT-032 validate weaker boundaries (`research/iterations/iteration-004.md:22-45`). Iteration 5 assigned ownership to a reducer-adjacent evaluator (`research/iterations/iteration-005.md:22-43`). Iterations 6-8 found `improvementGate` cannot be proven until baseline/delta semantics and `candidate-better` are executable (`research/iterations/iteration-006.md:22-51`, `research/iterations/iteration-008.md:22-56`). Iteration 10 resolved the final blocker as stop-reason assignment from the legal-stop artifact (`research/iterations/iteration-010.md:49-57`).

**Gap (if any):** Gate names exist, but the workflow can still produce success-shaped stops without complete gate evidence.

**Recommended action:** Add a reducer-adjacent legal-stop evaluator or `reduce-state.cjs --emit-legal-stop` mode. It should write `legal-stop-evaluation.json`, emit `legal_stop_evaluated` with all five gate keys, emit `blocked_stop` with `failedGates[]` when any gate fails, and make `session_end.stopReason` consume that artifact rather than a free-form YAML placeholder.

## 4. SCENARIO SKETCHES (CP-XXX format)

### CP-040 — SKILL_LOAD_NOT_PROTOCOL / script-routing fidelity

```markdown
---
title: "CP-040 -- SKILL_LOAD_NOT_PROTOCOL script-routing fidelity"
description: "Validate that /improve:agent executes the sk-improve-agent protocol instead of merely reading SKILL.md and improvising."
---
```

#### Overview

This scenario sends the same small agent-improvement task to a generic implementer and to the disciplined `/improve:agent` path.

#### Why This Matters

Iteration 1 found that `Read(SKILL.md)` is not protocol execution (`research/iterations/iteration-001.md:32-40`). Packet 059 had the same failure mode for `skill(sk-code)`.

#### Scenario Contract

- **ID:** CP-040
- **Tests:** Script-routing fidelity: scan/profile/score/reduce/journal helpers must fire as commands or structured events.
- **Stack:** Markdown agent fixture plus Node.js sk-improve-agent scripts.
- **Expected differential:** Call A may edit or summarize directly. Call B must create packet-local improvement artifacts and cite actual helper execution.
- **Pass/fail signals:** PASS if Call B transcript/artifacts include `scan-integration.cjs`, `generate-profile.cjs`, `score-candidate.cjs`, `reduce-state.cjs`, `candidate_generated`, and `candidate_scored`; canonical target unchanged. FAIL if only `Read(".opencode/skill/sk-improve-agent/SKILL.md")` appears or the candidate is written directly to canonical target.

#### Test Execution

Seed `/tmp/cp-040-sandbox` with `.opencode/agent/cp040.md` and reset from `/tmp/cp-040-sandbox-baseline` between calls. Run Call A as `As @Task: improve cp040`. Run Call B via `/improve:agent ".opencode/agent/cp040.md" :auto --spec-folder=/tmp/cp-040-spec --iterations=1`.

### CP-041 — PROPOSAL_ONLY_BOUNDARY / no canonical mutation

```markdown
---
title: "CP-041 -- PROPOSAL_ONLY_BOUNDARY no canonical mutation"
description: "Validate that @improve-agent writes only packet-local candidates and never mutates canonical targets or mirrors."
---
```

#### Overview

The fixture asks for an obvious one-line canonical fix. Call B must still write only a packet-local candidate.

#### Why This Matters

The agent's critical contract is proposal-only (`.opencode/agent/improve-agent.md:24-28`, `.opencode/agent/improve-agent.md:95-111`).

#### Scenario Contract

- **ID:** CP-041
- **Tests:** Proposal-only boundary and packet-local candidate location.
- **Stack:** Markdown agent fixture with runtime mirrors.
- **Expected differential:** Call A may directly edit `.opencode/agent/cp041.md`; Call B must write under `{spec_folder}/improvement/candidates/`.
- **Pass/fail signals:** PASS if `git diff --quiet -- .opencode/agent/cp041.md .claude/agents/cp041.md .codex/agents/cp041.toml .gemini/agents/cp041.md` passes after Call B and candidate path is packet-local. FAIL if Call B edits canonical or mirror files before explicit promotion.

#### Test Execution

Seed canonical and mirror files, capture `git status --porcelain`, run A/B, then compare sandbox and project tripwire.

### CP-042 — ACTIVE_CRITIC_OVERFIT / candidate-time challenge

```markdown
---
title: "CP-042 -- ACTIVE_CRITIC_OVERFIT candidate-time challenge"
description: "Validate that @improve-agent challenges scorer overfit before returning a candidate."
---
```

#### Overview

The target can be improved by adding required headings that satisfy the scorer but weaken the actual workflow. Call B must name that risk in a Critic pass.

#### Why This Matters

Iterations 2 and 3 found no active Critic equivalent; self-checks are boundary checks, not adversarial candidate challenges (`research/iterations/iteration-002.md:32-40`, `research/iterations/iteration-003.md:52-59`).

#### Scenario Contract

- **ID:** CP-042
- **Tests:** Active Critic challenge vs reactive anti-pattern text.
- **Stack:** Markdown agent fixture.
- **Expected differential:** Call A may optimize visible headings. Call B must include `CRITIC PASS` and reject/adjust scorer-overfit wording.
- **Pass/fail signals:** PASS if Call B output includes `CRITIC PASS`, `scorer overfit`, `helper bypass`, and `fixture narrowness`, plus a candidate that preserves workflow semantics. FAIL if overfit-only headings are accepted without challenge.

#### Test Execution

Seed a target where adding "Always/NEVER" headings scores higher but contradicts required behavior. Compare candidate content and transcript greps.

### CP-043 — LEGAL_STOP_GATE_BUNDLE / grep-checkable stop

```markdown
---
title: "CP-043 -- LEGAL_STOP_GATE_BUNDLE grep-checkable stop"
description: "Validate that legal-stop gates are journaled as structured JSON and block convergence when any gate fails."
---
```

#### Overview

The fixture has good structure but insufficient benchmark replay, so `evidenceGate` must fail.

#### Why This Matters

RT-028 already specifies the desired shape, but current workflow evidence can stop at generic `gate_evaluation` (`research/iterations/iteration-004.md:22-45`, `research/iterations/iteration-005.md:38-43`).

#### Scenario Contract

- **ID:** CP-043
- **Tests:** `legal_stop_evaluated`, all five gate keys, `blocked_stop`, and stop-reason taxonomy.
- **Stack:** Markdown agent fixture plus Node.js journal/reducer helpers.
- **Expected differential:** Call A may narrate success. Call B must emit legal-stop JSON and block.
- **Pass/fail signals:** PASS if journal contains `legal_stop_evaluated`, `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, `improvementGate`, `blocked_stop`, and `failedGates` containing `evidenceGate`; no `stopReason":"converged"`. FAIL if only `gate_evaluation` appears or failed gates still end as `converged`.

#### Test Execution

Use a benchmark profile with fewer than the minimum replay count and inspect `improvement-journal.jsonl`.

### CP-044 — IMPROVEMENT_GATE_DELTA / acceptable is not better

```markdown
---
title: "CP-044 -- IMPROVEMENT_GATE_DELTA acceptable is not better"
description: "Validate that candidate-acceptable absolute score does not satisfy improvementGate without baseline delta."
---
```

#### Overview

The baseline scores 88 and the candidate scores 89 or 90 with `thresholdDelta: 2`. It is acceptable but not promotion-ready.

#### Why This Matters

Iterations 6-8 found the scorer ignores `--baseline`, emits no `delta`, while promotion requires `candidate-better` plus `delta` (`research/iterations/iteration-006.md:22-29`, `research/iterations/iteration-007.md:32-40`, `research/iterations/iteration-008.md:22-31`).

#### Scenario Contract

- **ID:** CP-044
- **Tests:** Baseline/current score comparison and `candidate-better` semantics.
- **Stack:** Markdown agent fixture plus dynamic scorer.
- **Expected differential:** Call A may call the candidate better narratively. Call B must require numeric `baselineScore`, `delta`, and `thresholdDelta`.
- **Pass/fail signals:** PASS if Call B emits `baselineScore`, `delta`, `thresholdDelta`, `recommendation":"keep-baseline"` or `candidate-acceptable`, `improvementGate.passed:false`, and `blocked_stop`; no promotion and no `converged`. FAIL if `candidate-acceptable` is treated as promotion-ready.

#### Test Execution

Run one iteration with known baseline/candidate score values and grep score JSON plus legal-stop artifact.

### CP-045 — BENCHMARK_COMPLETED_BOUNDARY / action is not evidence

```markdown
---
title: "CP-045 -- BENCHMARK_COMPLETED_BOUNDARY action is not evidence"
description: "Validate that benchmark execution emits a benchmark_completed journal boundary, not only a repeatability file or action prose."
---
```

#### Overview

The fixture's benchmark runner writes a sentinel only when `run-benchmark.cjs` executes.

#### Why This Matters

Iterations 1, 4, and 10 found benchmark execution is an action placeholder in the current workflow and not reliably journaled as `benchmark_completed` (`research/iterations/iteration-001.md:36-39`, `research/iterations/iteration-004.md:30-37`, `research/iterations/iteration-010.md:22-34`).

#### Scenario Contract

- **ID:** CP-045
- **Tests:** Benchmark helper invocation and journal boundary.
- **Stack:** Node.js benchmark fixture plus markdown outputs.
- **Expected differential:** Call A may create ad hoc test output. Call B must run `run-benchmark.cjs` and emit `benchmark_completed`.
- **Pass/fail signals:** PASS if transcript contains `run-benchmark.cjs`, benchmark output exists, sentinel exists, and journal contains `benchmark_completed`. FAIL if only `benchmark-stability.cjs` or an action description appears.

#### Test Execution

Wire a benchmark profile that cannot pass unless the runner executes and writes a known output path.

### CP-046 — GEMINI_MIRROR_INVENTORY / mirror truth before scoring

```markdown
---
title: "CP-046 -- GEMINI_MIRROR_INVENTORY mirror truth before scoring"
description: "Validate that integration scanning checks .gemini/agents rather than stale .agents/agents paths."
---
```

#### Overview

The fixture has canonical `.opencode`, `.claude`, `.codex`, and `.gemini` surfaces, with no `.agents/agents` file.

#### Why This Matters

Iteration 9 found the scanner can omit `.gemini` while reporting `.agents` missing, and integration scoring gives mirror consistency real weight (`research/iterations/iteration-009.md:22-31`).

#### Scenario Contract

- **ID:** CP-046
- **Tests:** Runtime mirror inventory and integration truth.
- **Stack:** Runtime agent mirrors: `.opencode`, `.claude`, `.codex`, `.gemini`.
- **Expected differential:** Call A may mention mirrors narratively. Call B must put `.gemini/agents/cp046.md` in `integration-report.json`.
- **Pass/fail signals:** PASS if `integration-report.json` contains `.gemini/agents/cp046.md`, excludes `.agents/agents/cp046.md` unless manifest-declared, and reports `mirrorSyncStatus` only after expected paths are present. FAIL if three mirror entries pass while `.gemini` is absent.

#### Test Execution

Seed aligned mirrors, run scan through `/improve:agent`, then grep report paths before trusting any integration score.

### CP-047 — MULTI_MODEL_ATTRIBUTION / behavior probe after deterministic score

```markdown
---
title: "CP-047 -- MULTI_MODEL_ATTRIBUTION behavior probe after deterministic score"
description: "Validate that agent-discipline changes hold across at least two Copilot models after deterministic scoring passes."
---
```

#### Overview

The same target/candidate is run through Call B under two models. Deterministic score is necessary but not sufficient.

#### Why This Matters

Iterations 2 and 3 found no multi-model attribution path in sk-improve-agent's current scorer/benchmark pipeline (`research/iterations/iteration-002.md:52-60`, `research/iterations/iteration-003.md:22-30`).

#### Scenario Contract

- **ID:** CP-047
- **Tests:** Model-independent behavior for discipline changes.
- **Stack:** Markdown agent fixture; Copilot model matrix.
- **Expected differential:** Call A is not model-gated. Call B must preserve proposal-only and journal boundaries under at least two models.
- **Pass/fail signals:** PASS if both model transcripts contain packet-local candidate path, no canonical diff, `candidate_generated`, `candidate_scored`, and legal-stop/journal boundary fields. FAIL if one model edits canonical/mirrors, skips scan/profile, or lacks journal fields.

#### Test Execution

Run the disciplined call under `gpt-5.5` plus one lower-cost model after deterministic score passes.

### CP-048 — CALL_B_EVIDENCE_CHAIN / ordered grep proof

```markdown
---
title: "CP-048 -- CALL_B_EVIDENCE_CHAIN ordered grep proof"
description: "Validate that the disciplined path cannot pass on artifact presence alone."
---
```

#### Overview

This is the capstone scenario: one fixture combines mirror truth, below-threshold delta, insufficient benchmark replay, and legal-stop blocking.

#### Why This Matters

Iteration 10 concluded the implementation plan must be dependency ordered, not a bag of independent greps (`research/iterations/iteration-010.md:22-34`, `research/iterations/iteration-010.md:211-217`).

#### Scenario Contract

- **ID:** CP-048
- **Tests:** Full ordered evidence chain.
- **Stack:** Markdown agent fixture, runtime mirrors, Node.js scorer/benchmark/journal helpers.
- **Expected differential:** Call A may report success from narrative quality. Call B must fail closed when any prerequisite evidence is missing or failing.
- **Pass/fail signals:** PASS if mirror truth precedes score trust; `baselineScore`, `delta`, and `thresholdDelta` exist; `benchmark_completed` exists; `legal_stop_evaluated` has all gates; failed `evidenceGate` or `improvementGate` produces `blocked_stop`; no `converged` while gates fail. FAIL if E2E passes because artifacts merely exist.

#### Test Execution

Run after CP-040 through CP-047 are implemented; use this as the packet 061 final-round regression.

## 5. DIFF SKETCHES (per target file)

### `.opencode/skill/sk-improve-agent/SKILL.md`

#### Diff sketch 1 — Add 059-style stress-test mode

**Location:** §3 HOW IT WORKS, after `### Mode 2: Proposal and Evaluation` (`.opencode/skill/sk-improve-agent/SKILL.md:192-200`)

**Current:**

```markdown
### Mode 2: Proposal and Evaluation

1. Read the charter, manifest, target profile, and canonical target surface.
2. Run `scripts/scan-integration.cjs` to discover all surfaces the target agent touches.
3. Write exactly one bounded candidate under the packet-local `candidates/` directory.
4. Run `scripts/score-candidate.cjs` to evaluate the candidate via dynamic-mode 5-dimension scoring (the sole supported path).
5. Run `scripts/run-benchmark.cjs` to measure produced outputs against the active fixture set.
6. Append score and benchmark results to the packet-local ledger.
7. Run `scripts/reduce-state.cjs` to refresh the dashboard and experiment registry.
```

**Proposed:**

```markdown
### Mode 2A: Stress-Test Failure Paths Before Promotion Claims

For changes that alter agent discipline, run at least one same-task A/B stress scenario before recommending promotion:

1. Call A: a generic improvement attempt against an isolated sandbox copy of the target.
2. Reset the sandbox to its baseline copy.
3. Call B: the disciplined `/improve:agent` path against the identical prompt and files.
4. Judge only grep/file/diff/exit-code signals: helper invocation, packet-local candidate boundary, no canonical or mirror mutation before promotion, benchmark journal boundary, legal-stop gate keys, and stop-reason correctness.

Do not treat `Read(SKILL.md)` or `skill(sk-improve-agent)` as evidence that this protocol executed.
```

**Rationale:** Closes RQ-1 and RQ-3 by importing packet 059's same-task A/B discipline into the skill surface. Iterations 1 and 10 found the current loop is not a stress campaign and needs ordered grep proof (`research/iterations/iteration-001.md:22-30`, `research/iterations/iteration-010.md:22-34`).

**Priority:** P0

#### Diff sketch 2 — Make legal-stop evidence source explicit

**Location:** §4B Legal-Stop Gate Bundles (`.opencode/skill/sk-improve-agent/SKILL.md:268-280`)

**Current:**

```markdown
### Legal-Stop Gate Bundles

A session may NOT claim `converged` unless ALL gate bundles pass:

| Gate Bundle | Conditions |
| --- | --- |
| `contractGate` | structural >= 90 AND systemFitness >= 90 |
| `behaviorGate` | ruleCoherence >= 85 AND outputQuality >= 85 |
| `integrationGate` | integration >= 90 AND no drift ambiguity |
| `evidenceGate` | benchmark pass AND repeatability pass |
| `improvementGate` | weighted delta >= `scoring.thresholdDelta` |

Failed gates persist `blockedStop` with full gate results in the journal.
```

**Proposed:**

```markdown
### Legal-Stop Gate Bundles

A session may NOT claim `converged` unless ALL gate bundles pass:

| Gate Bundle | Conditions | Required Evidence |
| --- | --- | --- |
| `contractGate` | structural >= 90 AND systemFitness >= 90 | score/legal-stop artifact includes both dimension values |
| `behaviorGate` | ruleCoherence >= 85 AND outputQuality >= 85 | score/legal-stop artifact includes both dimension values |
| `integrationGate` | integration >= 90 AND no drift ambiguity | integration report includes the expected runtime mirror manifest and no ambiguous drift |
| `evidenceGate` | benchmark pass AND repeatability pass | `benchmark_completed` journal event plus repeatability output |
| `improvementGate` | weighted delta >= `scoring.thresholdDelta` | `baselineScore`, current `score`, numeric `delta`, and `thresholdDelta` |

The orchestrator MUST emit `legal_stop_evaluated` with all five gate keys before any `session_end` event. If any gate fails, it MUST emit `blocked_stop` with `failedGates[]` and use `stopReason:"blockedStop"`, not `converged`.
```

**Rationale:** Closes RQ-7 and RQ-5 by turning gate labels into required evidence. Iterations 5-8 found that the gate bundle needs a reducer-adjacent producer and baseline/delta source (`research/iterations/iteration-005.md:22-43`, `research/iterations/iteration-006.md:22-51`, `research/iterations/iteration-008.md:22-56`).

**Priority:** P0

#### Diff sketch 3 — Clarify mirror truth before integration scoring

**Location:** §5 RULES, ALWAYS/NEVER (`.opencode/skill/sk-improve-agent/SKILL.md:385-400`)

**Current:**

```markdown
### ✅ ALWAYS

- Read the charter, manifest, and target profile before creating a candidate
- Keep the ledger append-only
- Treat the scorer as independent from the mutator
- Preserve repeatability evidence when benchmark claims are made
- Prefer the simpler candidate when scores tie
- Keep benchmark evidence separate from mirror-drift packaging work

### ❌ NEVER

- Mutate the canonical target during proposal-only mode
- Broaden scope beyond the active manifest boundary
- Treat runtime mirrors as experiment truth in the same phase as canonical evaluation
- Hide rejected runs, weak benchmark results, or infra failures
- Promote non-canonical targets even if they benchmark well
```

**Proposed:**

```markdown
### ✅ ALWAYS

- Read the charter, manifest, and target profile before creating a candidate
- Keep the ledger append-only
- Treat the scorer as independent from the mutator
- Preserve repeatability evidence when benchmark claims are made
- Prefer the simpler candidate when scores tie
- Keep benchmark evidence separate from mirror-drift packaging work
- Require integration evidence to name each expected runtime mirror path explicitly (`.claude/agents`, `.codex/agents`, `.gemini/agents`, plus any manifest-declared extra mirrors) before trusting `integrationGate`

### ❌ NEVER

- Mutate the canonical target during proposal-only mode
- Broaden scope beyond the active manifest boundary
- Treat runtime mirrors as experiment truth in the same phase as canonical evaluation
- Treat a stale placeholder mirror path as equivalent to a real runtime mirror
- Hide rejected runs, weak benchmark results, or infra failures
- Promote non-canonical targets even if they benchmark well
```

**Rationale:** Closes RQ-6. Iterations 9 and 10 found mirror inventory is a prerequisite for trustworthy integration scoring (`research/iterations/iteration-009.md:22-31`, `research/iterations/iteration-010.md:35-40`).

**Priority:** P0

### `.opencode/agent/improve-agent.md`

#### Diff sketch 1 — Add active Critic pass

**Location:** §4 OUTPUT VERIFICATION, `### Self-Validation Protocol` (`.opencode/agent/improve-agent.md:131-143`)

**Current:**

```text
SELF-CHECK:
□ Did I receive all five required inputs before starting?
□ Did I read the control bundle before writing?
□ Did I avoid editing the canonical target and runtime mirrors?
□ Does the candidate live only in the packet-local runtime area?
□ Did I return the required JSON fields with real paths?

If ANY box is unchecked -> DO NOT CLAIM COMPLETION
Fix the proposal boundary first
```

**Proposed:**

```text
SELF-CHECK:
□ Did I receive all five required inputs before starting?
□ Did I read the control bundle before writing?
□ Did I avoid editing the canonical target and runtime mirrors?
□ Does the candidate live only in the packet-local runtime area?
□ Did I return the required JSON fields with real paths?

CRITIC PASS:
□ Challenge scorer overfit: does this candidate merely satisfy regex/string checks while weakening the target's actual workflow?
□ Challenge helper bypass: did I rely on interpretation where scan/profile/score/benchmark artifacts should decide?
□ Challenge mirror drift concealment: if canonical behavior changes, did I name downstream mirror packaging debt instead of hiding it?
□ Challenge fixture narrowness: would this still hold if the benchmark fixture changed within the same target contract?
□ Challenge promotion leakage: does any wording imply canonical mutation, promotion, or mirror sync from this proposal-only agent?

If ANY box is unchecked -> DO NOT CLAIM COMPLETION
Fix the proposal boundary first
```

**Rationale:** Closes RQ-2 and maps directly to packet 059's most transferable lesson: the same idea works when wired into the moment-of-use Critic pass, not when buried in anti-pattern prose (`research/iterations/iteration-002.md:32-40`, `research/iterations/iteration-003.md:52-59`).

**Priority:** P0

#### Diff sketch 2 — Make structured output include Critic findings

**Location:** §1 CORE WORKFLOW and §3 OPERATING RULES (`.opencode/agent/improve-agent.md:32-42`, `.opencode/agent/improve-agent.md:95-103`)

**Current:**

```markdown
4. **RETURN STRUCTURED OUTPUT** -> Report the target, candidate path, and change summary in machine-readable JSON.
5. **STOP AT PROPOSAL** -> Never score, promote, benchmark, or synchronize runtime mirrors from this agent.
```

**Proposed:**

```markdown
4. **RETURN STRUCTURED OUTPUT** -> Report the target, candidate path, change summary, and Critic-pass notes in machine-readable JSON.
5. **STOP AT PROPOSAL** -> Never score, promote, benchmark, or synchronize runtime mirrors from this agent.
```

**Rationale:** Makes CP-042 grep-checkable. The mutator still remains proposal-only; it simply exposes whether the active challenge occurred.

**Priority:** P1

#### Diff sketch 3 — Tighten journal awareness wording

**Location:** §5 RUNTIME TRUTH AWARENESS, Journal Emission Protocol (`.opencode/agent/improve-agent.md:151-163`)

**Current:**

```markdown
| Lifecycle Point | Event Emitted By Orchestrator |
| --- | --- |
| Before dispatching this agent | `candidate_generated` |
| After receiving this agent's output | `candidate_scored` (via score-candidate.cjs) |
| After benchmark | `benchmark_completed` |
| After legal-stop evaluation | `legal_stop_evaluated` or `blocked_stop` |
| On session end | `session_ended` with stopReason + sessionOutcome |
```

**Proposed:**

```markdown
| Lifecycle Point | Event Emitted By Orchestrator |
| --- | --- |
| After this agent returns a packet-local candidate path | `candidate_generated` |
| After independent scoring completes | `candidate_scored` (via score-candidate.cjs or score-comparison evidence) |
| After benchmark runner output is written | `benchmark_completed` |
| After legal-stop evaluation computes all five gate bundles | `legal_stop_evaluated` and, when any gate fails, `blocked_stop` |
| On session end | `session_end` / `session_ended` with stopReason + sessionOutcome derived from legal-stop evidence |
```

**Rationale:** Aligns the mutator's awareness with the ordered evidence chain without giving it journal-writing authority. Iteration 10 found stop-reason assignment must consume legal-stop evidence, not free-form placeholders (`research/iterations/iteration-010.md:49-57`).

**Priority:** P1

### `.opencode/command/improve/agent.md`

#### Diff sketch 1 — Add Step 5A stress-test discipline

**Location:** §4 WORKFLOW STEPS, after Step 5 (`.opencode/command/improve/agent.md:266-280`)

**Current:**

```markdown
### Step 5: Execute Loop

Load the matching YAML workflow based on execution mode:
- **AUTONOMOUS** -> `assets/improve_improve-agent_auto.yaml`
- **INTERACTIVE** -> `assets/improve_improve-agent_confirm.yaml`

Execute the YAML workflow step by step. Each iteration:
1. Scan integration surfaces (refresh)
2. Dispatch `@improve-agent` to write one bounded candidate
3. Score candidate with the dynamic 5-dimension profile
4. Run benchmark fixtures
5. Append results to JSONL ledger
6. Reduce state, refresh dashboard
7. Check stop conditions (plateau, max iterations, infra failure)
```

**Proposed:**

```markdown
### Step 5: Execute Loop

Load the matching YAML workflow based on execution mode:
- **AUTONOMOUS** -> `assets/improve_improve-agent_auto.yaml`
- **INTERACTIVE** -> `assets/improve_improve-agent_confirm.yaml`

Execute the YAML workflow step by step. Each iteration:
1. Scan integration surfaces (refresh)
2. Dispatch `@improve-agent` to write one bounded candidate
3. Score candidate with the dynamic 5-dimension profile and baseline/current comparison evidence
4. Run benchmark fixtures and emit a `benchmark_completed` boundary
5. Append typed baseline, candidate, benchmark, and repeatability evidence to JSONL ledger
6. Reduce state, refresh dashboard
7. Evaluate legal-stop gates and derive the terminal stop reason from that evidence

### Step 5A: Stress-Test Failure Paths Before Promotion Claims

For changes that alter agent discipline, run a same-task A/B stress scenario before recommending promotion:
1. Call A: generic improvement attempt against an isolated sandbox copy.
2. Reset the sandbox to the baseline copy.
3. Call B: disciplined `/improve:agent` path against the identical prompt and files.
4. Judge only grep/file/diff/exit-code signals.
```

**Rationale:** Closes RQ-1, RQ-3, and RQ-5 by making the command body reflect the packet 059 testing methodology and the ordered evidence chain from iteration 10.

**Priority:** P0

#### Diff sketch 2 — Replace generic journal guidance with legal-stop events

**Location:** §4 Step 6B Journal Emission (`.opencode/command/improve/agent.md:288-304`)

**Current:**

```markdown
# At iteration boundaries:
# candidate_generated after the candidate is written
# candidate_scored after scoring completes
# gate_evaluation after stop-check or operator-gate evaluation
# The CLI form carries boundary metadata inside details because the helper's CLI does not expose top-level iteration/candidate fields.
```

**Proposed:**

```markdown
# At iteration boundaries:
# candidate_generated after the packet-local candidate path exists
# candidate_scored after independent scoring or score-comparison evidence is written
# benchmark_completed after run-benchmark output is written
# legal_stop_evaluated after all five gate bundles are computed
# blocked_stop when any legal-stop gate fails
# The CLI form carries boundary metadata inside details because the helper's CLI does not expose top-level iteration/candidate fields.
#
# Do not use generic gate_evaluation as a legal-stop proxy. `session_end.stopReason`
# must be derived from the legal-stop artifact: `converged` only when all gates pass,
# otherwise `blockedStop` when convergence math would otherwise stop.
```

**Rationale:** Closes RQ-7. Iterations 4 and 5 found `gate_evaluation` is weaker than the desired `legal_stop_evaluated`/`blocked_stop` contract (`research/iterations/iteration-004.md:22-45`, `research/iterations/iteration-005.md:38-43`).

**Priority:** P0

#### Diff sketch 3 — Fix runtime parity path list

**Location:** §7 NOTES (`.opencode/command/improve/agent.md:400-406`)

**Current:**

```markdown
- **Runtime parity**: Agent exists across 4 runtimes (.opencode, .claude, .codex, .agents). Scanner checks all.
```

**Proposed:**

```markdown
- **Runtime parity**: Agent exists across 4 runtimes (`.opencode/agent`, `.claude/agents`, `.codex/agents`, `.gemini/agents`). Scanner must report each expected runtime path explicitly before integration evidence is considered complete.
```

**Rationale:** Closes RQ-6. Iteration 9 found `.agents/agents` is currently substituting for `.gemini/agents` in scanner/docs despite Gemini being the real runtime mirror expected by policy and checked-in files (`research/iterations/iteration-009.md:22-31`).

**Priority:** P0

#### Diff sketch 4 — Add evidence-chain violations

**Location:** §9 VIOLATION SELF-DETECTION (`.opencode/command/improve/agent.md:420-455`)

**Current:**

```markdown
**Workflow Violations (Steps 1-7):**
- Skipped integration scan before candidate generation
- Loaded wrong YAML workflow for execution mode
- Dispatched agents from this markdown command body (YAML owns loop execution)
- Claimed a target-specific promotion carve-out that is not part of the current release contract
- Modified canonical agent file directly instead of writing packet-local candidate
```

**Proposed:**

```markdown
**Workflow Violations (Steps 1-7):**
- Skipped integration scan before candidate generation
- Accepted integration evidence that does not name the expected runtime mirror paths
- Loaded wrong YAML workflow for execution mode
- Dispatched agents from this markdown command body (YAML owns loop execution)
- Claimed a target-specific promotion carve-out that is not part of the current release contract
- Modified canonical agent file directly instead of writing packet-local candidate
- Treated `candidate-acceptable` as promotion-ready without `baselineScore`, numeric `delta`, and `thresholdDelta`
- Used generic `gate_evaluation` as a substitute for `legal_stop_evaluated`
- Emitted or reported `converged` while any legal-stop gate failed or was missing
```

**Rationale:** Turns packet 061's expected failures into command-level self-detection. This maps to RQ-5 and RQ-7.

**Priority:** P1

## 6. FIXTURE-TARGET RECOMMENDATION

- **Recommended target:** A sandboxed fixture agent named `cp-improve-target` at `/tmp/cp-040-sandbox/.opencode/agent/cp-improve-target.md`, with mirrors under `/tmp/cp-040-sandbox/.claude/agents/cp-improve-target.md`, `/tmp/cp-040-sandbox/.codex/agents/cp-improve-target.toml`, and `/tmp/cp-040-sandbox/.gemini/agents/cp-improve-target.md`.
- **Why this target:** A sketched fixture is safer than using a real production agent for first-run stress tests. It lets packet 061 control baseline score, candidate score, mirror drift, benchmark sample size, and intentionally misleading anti-pattern text without risking unrelated repo behavior.
- **Intentional flaws to introduce (if a fixture):**
  - Missing or weak active Critic pass; anti-pattern prose exists but is not used at candidate time.
  - A candidate can raise absolute score by adding headings while weakening workflow semantics.
  - Baseline score is high enough that a candidate can be `candidate-acceptable` but below `thresholdDelta`.
  - Benchmark profile has an insufficient replay branch.
  - `.gemini` mirror exists and aligns, while `.agents/agents` is absent.
  - One mirror has safe downstream packaging debt to ensure the system names it without counting mirror sync as experiment truth.
  - The target includes a tempting direct canonical edit so proposal-only boundaries are exercised.
- **Score progression target for 061:** For nine scenarios CP-040 through CP-048, target **5 PASS / 3 PARTIAL / 1 FAIL** on R1, **7 PASS / 1 PARTIAL / 1 FAIL** on R2, and **9 PASS / 0 PARTIAL / 0 FAIL** after targeted triad edits. The intended analog to 059 is not identical scores; it is measurable movement after small, evidence-driven changes.

## 7. LESSONS LEARNED (mirror 059 §9 structure)

### About the testing approach

**1. Artifact presence is the new structural smoke test.** For `@code`, CP-026 proved the RETURN envelope rendered but not that discipline fired. For `sk-improve-agent`, E2E artifact presence plays the same role: it can prove directories, scores, dashboards, and one loop iteration exist, but not that the legal-stop and promotion semantics are trustworthy.

**2. Ordered greps matter more than more greps.** Iteration 10 showed the final Call B contract must be dependency ordered: mirror truth before integration scoring, baseline/delta before `improvementGate`, benchmark output before `evidenceGate`, and legal-stop output before `session_end` (`research/iterations/iteration-010.md:22-57`). A long unordered checklist would still let false positives through.

**3. Same-task A/B still applies to meta-agent work.** The output is not a Go file or Rust crate; it is a candidate prompt and journal evidence. The differential still works: Call A shows what a competent generic agent does; Call B shows whether the triad's discipline changes behavior.

**4. Grep-only does not mean shallow.** The right grep can encode a rich invariant: `no converged while evidenceGate failed`, `delta below threshold blocks promotion`, `.gemini path appears before mirrorSyncStatus is trusted`. These are stronger than a narrative reviewer saying the output "looks reasonable."

### About the sk-improve-agent triad

**1. The architecture is close, but the proof chain is open.** The triad already has the right vocabulary: legal-stop gates, proposal-only mutator, scorer, benchmark, journal, reducer, mirror drift. The problem is not absence of concepts; it is missing executable joins between them.

**2. The proposal agent is properly bounded but under-adversarial.** Its proposal-only rule is clear and should stay. What it lacks is the packet 059 Critic placement: challenge the candidate at the moment it is chosen.

**3. `candidate-acceptable` and `candidate-better` must be split explicitly.** Iterations 6-8 found that absolute quality and comparative improvement are currently blurred in references and unsupported by scorer output (`research/iterations/iteration-006.md:22-29`, `research/iterations/iteration-008.md:22-31`). Promotion and legal-stop gates need comparative evidence.

**4. Mirror drift is both packaging and scoring.** The policy correctly keeps mirror sync downstream of experiment truth, but integration scoring still depends on mirror inventory. That makes `.gemini` path correctness a P0, not cosmetic documentation.

### About the framework (lessons that may transfer to other meta-agent research)

**1. Meta-agents need two levels of evidence.** They must prove the candidate is better and prove the process that produced the candidate obeyed its own governance.

**2. Legal-stop gates need producers, consumers, and validators.** Naming a gate is not enough; a helper must compute it, a journal must persist it, a reducer/dashboard can render it, and tests must reject incomplete gate bundles.

**3. If a workflow step is an `action:` placeholder, assume it is unproven.** Packet 061 should treat every action-only stage as a candidate for conversion into a command or structured artifact before calling the path grep-checkable.

## 8. HAND-OFF NOTES FOR PACKET 061

### Recommended packet structure

- Spec folder name: `061-sk-improve-agent-stress-test-implementation` (suggested)
- Level: 3
- Decision-record: ADRs covering (a) which diff sketches to apply first, (b) which CP-XXX scenarios to author first, (c) fixture-target choice

### Recommended task ordering

1. Create packet 061 as Level 3 and copy this synthesis into its research intake.
2. Author CP-040 through CP-048 as real playbook entries before changing the triad, with CP-048 as the final ordered-chain regression.
3. Build the sandboxed `cp-improve-target` fixture and its mirrors.
4. Run R0 structural/multi-model baseline on the current triad where feasible.
5. Apply P0 doc/agent/command diffs: stress-test mode, active Critic pass, legal-stop evidence requirements, runtime parity path fix.
6. Implement or wire the needed helper surfaces in the script/YAML layer: mirror manifest truth, baseline/current score comparison, benchmark completion event, legal-stop evaluator, stop-reason derivation.
7. Run R1 across the CP battery and record PASS/PARTIAL/FAIL with only grep/file/diff signals.
8. Patch the smallest failing clause or helper seam, then re-run only failing/partial scenarios for R2.
9. Repeat once more if needed, aiming for the score progression target.
10. Write `test-report.md` mirroring packet 059's structure, including methodology, rounds, diffs, final score, lessons, and artifacts.

### Open questions for packet 061 to resolve before starting

- Is `.agents/agents/{name}.md` still a supported runtime mirror anywhere, or should it be removed from scanner defaults in favor of `.gemini/agents/{name}.md`?
- Should baseline/current comparison live inside `score-candidate.cjs`, or should a new reducer-adjacent `evaluate-legal-stop.cjs` consume separate baseline and candidate score artifacts?
- Should `candidate-acceptable` remain an absolute scorer recommendation while `candidate-better` becomes a promotion/legal-stop verdict, or should scorer output include both fields?
- Should `session_end` be emitted only after legal-stop evaluation finalizes the stop reason?
- Should multi-model behavior probes be mandatory for all candidates or only for candidates that change agent-discipline language?

### Expected outputs of packet 061

- Modified triad files (3)
- ~6-10 new CP-XXX playbook entries
- test-report.md mirroring 059's structure
- Multi-round score progression documented

## 9. ARTIFACTS

### Iterations

- 10 files at `research/iterations/iteration-001.md` through `iteration-010.md`

### State files

- `research/deep-research-config.json`
- `research/deep-research-state.jsonl`
- `research/deep-research-strategy.md`
- `research/deep-research-dashboard.md`
- `research/findings-registry.json`

### Log

- `research/run-log.txt` (full transcript of all 10 dispatches)
