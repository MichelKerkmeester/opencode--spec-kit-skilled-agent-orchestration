---
iteration: 3
date: 2026-05-02T09:09:31Z
focus_rqs: [RQ-4, RQ-6, RQ-7, RQ-2, RQ-5]
new_findings_count: 5
rqs_now_answerable: [RQ-2, RQ-4, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 3

## Focus

I targeted the executable evidence layer because the provided prior summaries claimed iterations 1-2 failed, while the checked-in `research/iterations/iteration-001.md` and `iteration-002.md` already contain substantive findings. To avoid duplication, this pass focused on under-evidenced script/runtime questions: model attribution, mirror template truth, legal-stop journal schema, active Critic absence, and a grep-checkable Call A/Call B contract.

## Method

I read packet 059's methodology and lessons sections, then targeted line ranges in the sk-improve-agent skill, command, agent, YAML workflows, evaluator references, and scripts. I grepped for Critic/challenge language, A/B and multi-model language, runtime mirror paths, legal-stop gate names, journal event names, and model/executor flags in the scorer and benchmark runner.

## Findings

### RQ-4: Multi-model attribution discipline

Answered: the current candidate-scoring pipeline is deterministic and model-agnostic; it does not test across multiple models for attribution discipline.

Packet 059 treats a multi-model baseline as an attribution control: the same CP-026 task was run across gpt-5.5, opus-4.7, and sonnet-4.6, with Call B returning 9/9 fields on all three models, so later failures could be attributed to agent design rather than model weakness (`.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md:141-164`, `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md:453-455`). sk-improve-agent's command explicitly says all five dimensions are deterministic regex/string/file-existence checks with "No LLM-as-judge" (`.opencode/command/improve/agent.md:400-405`).

The executable scorer confirms this: `score-candidate.cjs` weights structural, ruleCoherence, integration, outputQuality, and systemFitness dimensions only (`.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:86-92`), invokes `scan-integration.cjs` for integration scoring (`score-candidate.cjs:136-160`), and emits a JSON result with `evaluationMode: "dynamic-5d"`, `score`, `dimensions`, and recommendation; no model/executor field is part of the result (`score-candidate.cjs:347-361`). The benchmark runner likewise scores fixture files and emits aggregate/recommendation/failureModes from local outputs, not model-specific transcripts (`.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:63-127`, `.opencode/skill/sk-improve-agent/scripts/run-benchmark.cjs:220-269`).

Recommendation: keep deterministic scoring as the promotion gate, but add a separate multi-model transcript probe for any candidate that changes agent discipline. The probe should not replace scoring; it should answer 059's attribution question: "Does this candidate improve behavior because of the protocol, or only because one model happened to comply?"

### RQ-6: Runtime mirror patching across `.opencode/.claude/.gemini/.codex`

Answered: sk-improve-agent knows mirrors are downstream packaging surfaces, but the live scanner does not match the `.gemini` mirror expectation.

The policy is intentional: mirror drift is real, but downstream from experiment truth. The skill says to keep benchmark evidence separate from mirror-drift packaging work and never treat runtime mirrors as experiment truth (`.opencode/skill/sk-improve-agent/SKILL.md:386-400`). The mirror policy says that after canonical promotion, operators should review `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`, record sync work or follow-up debt, and avoid counting mirror-sync success as proof of benchmark improvement (`.opencode/skill/sk-improve-agent/references/mirror_drift_policy.md:37-68`).

The executable scanner disagrees with that mirror list. `scan-integration.cjs` hard-codes `.claude/agents/{name}.md`, `.codex/agents/{name}.toml`, and `.agents/agents/{name}.md` as mirror templates (`.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs:15-19`), and the command notes runtime parity across `.opencode`, `.claude`, `.codex`, and `.agents`, not `.gemini` (`.opencode/command/improve/agent.md:402-406`). `check-mirror-drift.cjs` can accept arbitrary `--mirrors=a,b,c` paths, but it relies on the caller to pass them and does not itself encode the four-runtime mirror contract (`.opencode/skill/sk-improve-agent/scripts/check-mirror-drift.cjs:51-63`, `.opencode/skill/sk-improve-agent/scripts/check-mirror-drift.cjs:118-143`).

This is a concrete improvement target: either update the mirror policy/user-facing docs to `.agents`, or update scanner defaults to include `.gemini/agents/{name}.md`. Given the research question and runtime directory convention, the likely fix is to add `.gemini/agents/{name}.md` and make mirror expectations manifest-driven so future runtime additions are grep-checkable.

### RQ-7: Legal-stop gates grep-checkable or LLM-judge-based?

Answered with a sharper caveat: legal-stop gates are intended to be grep-checkable JSON evidence, but the current helper layer validates event names more than gate semantics and the YAML emits generic `gate_evaluation` events rather than the five gate bundle.

The policy layer defines five legal-stop bundles and says a session may not claim convergence unless all pass: `contractGate`, `behaviorGate`, `integrationGate`, `evidenceGate`, and `improvementGate` (`.opencode/skill/sk-improve-agent/SKILL.md:268-280`). The journal helper accepts event types including `gate_evaluation`, `legal_stop_evaluated`, and `blocked_stop` (`.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs:49-69`), and the reducer consumes `legal_stop_evaluated` by reading `details.gateResults` (`.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:213-217`) before rendering the gate names in the dashboard (`reduce-state.cjs:880-897`).

The missing piece is producer-side specificity. `improvement-journal.cjs` validates required `stopReason` and `sessionOutcome` only for `session_ended/session_end` events; it does not validate that `legal_stop_evaluated` contains all five gate keys or that `blocked_stop` contains failed gate details (`improvement-journal.cjs:80-106`). Auto mode emits `gate_evaluation` with `gateName: "stop_check"`, `gateResult`, and `stopReason`, not `legal_stop_evaluated` with a full `gateResults` object (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:186-204`). Confirm mode similarly emits `gate_evaluation` after the operator gate and then `session_end` (`.opencode/command/improve/assets/improve_improve-agent_confirm.yaml:217-245`).

Therefore the gate verdict should be grep-checkable, not LLM-judge-based, but it is not yet robustly grep-checkable from every normal journal run. A minimal hardening target is: `grep '"eventType":"legal_stop_evaluated"' improvement-journal.jsonl` plus greps for all five gate keys must pass before `stopReason:"converged"` is allowed.

### RQ-2: Active Critic challenge vs reactive anti-pattern text

Answered: no active Critic challenge equivalent is present in the triad or references I searched.

Packet 059's key lesson was placement-sensitive: anti-pattern reference rows did not change behavior, while wiring the same concern into active Critic challenges moved the campaign to 8/0/0 (`.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md:445-463`). In sk-improve-agent, the mutator has a proposal-only workflow that reads inputs, writes one packet-local candidate, returns structured output, and stops (`.opencode/agent/improve-agent.md:32-42`). Its self-validation checks whether inputs were present, control files were read, canonical targets/mirrors were avoided, and JSON fields were returned (`.opencode/agent/improve-agent.md:131-143`). Its anti-patterns are static "Never..." entries about promotion, mirrors, scope, and missing inputs (`.opencode/agent/improve-agent.md:181-193`).

I grepped the triad plus references/assets for `Critic`, `critic`, `challenge`, `red-team`, and `red team`; there were no matches. The current active safeguards are proposal-only constraints, deterministic scoring, and violation recovery (`.opencode/command/improve/agent.md:420-455`), but none forces a candidate-time adversarial challenge like "argue this proposal is overfitting the scorer" before returning.

### RQ-5: Call A vs Call B differential and grep-checkability

Answered: the current workflow has no built-in 059-style Call A/Call B differential, but the differential can be made grep-checkable with existing artifacts.

Packet 059 defines Call A as generic `@Task` and Call B as the same task with the specialized agent body prepended; both run in isolated sandboxes with reset between calls (`.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/test-report.md:81-107`). The sk-improve-agent command only defines the disciplined path: load SKILL.md, run integration scan/profile, execute YAML, dispatch `@improve-agent`, score, benchmark, reduce, and report (`.opencode/command/improve/agent.md:238-280`). Auto YAML then produces packet-local artifacts and journal events, but no paired generic baseline call (`.opencode/command/improve/assets/improve_improve-agent_auto.yaml:125-191`).

A grep-checkable Call A/Call B shape is straightforward:

| Call | Prompt shape | Expected grep/file signals |
| --- | --- | --- |
| A | Generic "improve this agent" task in sandbox | likely canonical diff; no `integration-report.json`; no `dynamic-profile.json`; no `candidate_generated`/`candidate_scored` journal |
| B | Disciplined `/improve:agent <agent> :auto --spec-folder=<sandbox-spec> --iterations=1` | `integration-report.json`, `dynamic-profile.json`, packet-local candidate path, `candidate_generated`, `candidate_scored`, no canonical diff before promotion |

The exact PASS signals can be grep-only: `test -f improvement/integration-report.json`, `test -f improvement/dynamic-profile.json`, `grep '"eventType":"candidate_generated"' improvement/improvement-journal.jsonl`, `grep '"eventType":"candidate_scored"' improvement/improvement-journal.jsonl`, and `git diff --quiet -- .opencode/agent/<target>.md` before promotion.

## New Open Questions

- Should `.agents/agents/{name}.md` be retained as a fourth runtime mirror, or is it a stale placeholder that should be replaced by `.gemini/agents/{name}.md`?
- Where should the five legal-stop booleans be computed: YAML placeholders, `reduce-state.cjs`, a new `evaluate-legal-stop.cjs`, or `improvement-journal.cjs` validation?
- Should multi-model attribution be mandatory only for agent-discipline changes, or for every promotion-eligible candidate?

## Ruled Out

- I ruled out "the scorer already performs multi-model attribution": the scorer and benchmark runner operate on local files, dynamic profiles, integration reports, and fixture outputs, with no model/executor dimensions in their emitted result (`score-candidate.cjs:347-361`, `run-benchmark.cjs:220-269`).
- I ruled out "mirror patching is expected during proposal generation": the agent must stay proposal-only and never edit canonical targets or runtime mirrors (`.opencode/agent/improve-agent.md:24-40`), while mirror drift is explicitly downstream packaging work (`mirror_drift_policy.md:37-68`).
- I ruled out "legal-stop evidence is LLM-judge-based": the intended evidence path is JSONL event fields, but the current producer path is under-specified (`improvement-journal.cjs:49-69`, `reduce-state.cjs:213-217`, `improve_improve-agent_auto.yaml:189-204`).

## Sketched Diff (if any)

For `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs` at `MIRROR_TEMPLATES`, current text:

```js
const MIRROR_TEMPLATES = [
  '.claude/agents/{name}.md',
  '.codex/agents/{name}.toml',
  '.agents/agents/{name}.md',
];
```

Proposed text:

```js
const MIRROR_TEMPLATES = [
  '.claude/agents/{name}.md',
  '.codex/agents/{name}.toml',
  '.gemini/agents/{name}.md',
];
```

If `.agents/agents` is still required, make it explicit instead of substituting for Gemini:

```js
const MIRROR_TEMPLATES = [
  '.claude/agents/{name}.md',
  '.codex/agents/{name}.toml',
  '.gemini/agents/{name}.md',
  '.agents/agents/{name}.md',
];
```

For `.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs`, add event validation for legal-stop details:

```js
if (event.eventType === 'legal_stop_evaluated') {
  const gates = event.details?.gateResults;
  for (const gate of ['contractGate', 'behaviorGate', 'integrationGate', 'evidenceGate', 'improvementGate']) {
    if (!gates || !(gate in gates)) errors.push(`legal_stop_evaluated missing details.gateResults.${gate}`);
  }
}
```

## Sketched Stress-Test Scenario (if any)

**CP-061 — LEGAL_STOP_GATE_BUNDLE / grep-checkable convergence stop**

| Field | Scenario |
| --- | --- |
| Purpose | Prove `/improve:agent` cannot claim `converged` without JSONL evidence for all five legal-stop gates. |
| Sandbox | `/tmp/cp-061-sandbox` plus `/tmp/cp-061-sandbox-baseline`, reset between Call A and Call B. |
| Fixture | A tiny target agent with one candidate that scores high structurally but has benchmark/repeatability failure. |
| Call A | Generic improvement task that may declare success from narrative quality. |
| Call B | Disciplined `/improve:agent <target> :auto --spec-folder=/tmp/cp-061-spec --iterations=1`. |
| PASS signals | `grep '"eventType":"legal_stop_evaluated"' improvement-journal.jsonl`; greps for all five gate names; `grep '"eventType":"blocked_stop"'` when evidenceGate fails; no `stopReason":"converged"` unless all five gate values pass. |
| FAIL signals | Only `gate_evaluation` appears; `session_end` has `stopReason":"converged"` without all five gate keys; gate details are present only in prose/dashboard, not JSONL. |

**CP-062 — MULTI_MODEL_ATTRIBUTION / scorer-vs-behavior separation**

| Field | Scenario |
| --- | --- |
| Purpose | Prevent attributing a prompt-discipline improvement to the candidate when only one model follows it. |
| Setup | Same target/candidate; run disciplined behavior probe across at least two Copilot models after deterministic scoring passes. |
| PASS signals | Each model transcript contains proposal-only boundary, packet-local candidate, no canonical diff, and required journal events. |
| FAIL signals | Deterministic score passes but one model edits canonical/mirrors, skips scan/profile, or lacks journal fields. |

## Next Focus Suggestion

Iteration 4 should either stop for synthesis if the loop accepts the checked-in iteration 1-2 findings, or focus narrowly on one executable proof: inspect or run read-only tests around `improvement-journal.cjs` and YAML emission to determine the smallest change that would make `legal_stop_evaluated` and `blocked_stop` fully grep-checkable.

## Convergence Assessment

This iteration added new value beyond the user-provided prior summaries by reading the actual checked-in prior iteration files and then deepening the executable evidence layer rather than repeating prose-level conclusions. It found a concrete `.gemini` mirror mismatch, clarified that multi-model attribution is absent from scorer/benchmark execution, and tightened the legal-stop gap from "YAML may not emit it" to "the journal helper does not validate the five-gate schema." `convergence_signal` is therefore `no`.
