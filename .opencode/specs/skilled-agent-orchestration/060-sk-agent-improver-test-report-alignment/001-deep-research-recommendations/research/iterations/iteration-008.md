---
iteration: 8
date: 2026-05-02T11:23:18.242+02:00
focus_rqs: [RQ-3, RQ-5, RQ-7]
new_findings_count: 4
rqs_now_answerable: [RQ-1, RQ-2, RQ-3, RQ-4, RQ-5, RQ-6, RQ-7]
convergence_signal: no
---

# Iteration 8

## Focus

I targeted the gap left by iteration 7: whether the `candidate-better`/`delta` promotion contract is consistently reflected in references, fixtures, and end-to-end playbook checks. This is highest leverage because the loop can have strong legal-stop gates yet still confuse "acceptable score" with "promotable improvement."

## Method

I read iterations 1-7 first, then avoided broad rereads and traced only promotion-adjacent references and executable seams. I inspected `promotion_rules.md`, `evaluator_contract.md`, `rollback_runbook.md`, `loop_protocol.md`, the E2E and RT playbook rows, `score-candidate.cjs`, `promote-candidate.cjs`, config thresholds, and targeted grep/glob results for `candidate-acceptable`, `candidate-better`, `thresholdDelta`, `delta`, and score/promote tests.

## Findings

### RQ-7: Are the 5 legal-stop gates grep-checkable from journal output, or LLM-judge-based?

The legal-stop model is already explicit that `improvementGate` means "weighted delta >= `scoring.thresholdDelta`" (`.opencode/skill/sk-improve-agent/SKILL.md:278`; `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:22-28`). The config also says a baseline is required and sets `scoring.thresholdDelta` to `2` (`.opencode/skill/sk-improve-agent/assets/improvement_config.json:8-10`, `.opencode/skill/sk-improve-agent/assets/improvement_config.json:41-54`). That confirms the intended gate is grep-checkable from structured score/baseline/delta evidence, not an LLM judge.

The new gap is documentation drift in the promotion reference: `promotion_rules.md` says the shipped promotion script enforces "`candidate-acceptable` dynamic-mode 5-dimension scoring above `scoring.thresholdDelta`" plus benchmark/repeatability/operator approval (`.opencode/skill/sk-improve-agent/references/promotion_rules.md:31-39`). That wording is internally inconsistent because `candidate-acceptable` is a recommendation label, while `thresholdDelta` is a baseline-delta concept. It also contradicts the actual promotion script, which requires `score.recommendation === "candidate-better"` and `Number(score.delta || 0) >= threshold` before mutation (`.opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs:156-163`).

The contradiction is not merely prose. `evaluator_contract.md` defines scorer output as `status`, `profileId`, `family`, `evaluationMode`, `target`, `candidate`, `score`, `dimensions`, `recommendation`, `failureModes`, and `legacyScore` with no `baselineScore` or `delta` (`.opencode/skill/sk-improve-agent/references/evaluator_contract.md:59-72`), and says the recommendation is `"candidate-acceptable"` at weighted score >= 70 (`.opencode/skill/sk-improve-agent/references/evaluator_contract.md:85-88`). The executable scorer matches that contract: it reads `args.candidate`, `args.manifest`, `args.target`, and `args.output` but not `args.baseline` (`.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:260-265`), then emits `recommendation: dynamicResult.weightedScore >= 70 ? "candidate-acceptable" : "needs-improvement"` without baseline score or delta (`.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs:347-361`).

So the remaining legal-stop hardening is not just "emit `legal_stop_evaluated`." It must also define the authoritative artifact that turns scorer output into `candidate-better`, `baselineScore`, and `delta`; otherwise `improvementGate` can be grep-checkable in name while impossible to prove from current scorer output.

### RQ-3: Do sk-improve-agent's scripts actually fire when the skill is loaded, or does the agent read SKILL.md and improvise?

Prior iterations answered that skill load does not fire scripts. This pass adds a reference-to-runtime drift variant: the loop protocol says init records the baseline in `agent-improvement-state.jsonl`, scoring/benchmarking records baseline/candidate/benchmark/rejected/accepted/infra-failure events, and reduce/decide continues only if "the score delta is meaningful" (`.opencode/skill/sk-improve-agent/references/loop_protocol.md:31-40`, `.opencode/skill/sk-improve-agent/references/loop_protocol.md:53-70`). But the scorer itself does not compute that score delta, and the promotion helper requires fields the scorer does not emit.

One reference already states the executable promotion shape correctly: `rollback_runbook.md` lists promotion preconditions as "recommendation is `candidate-better`" and "delta meets threshold" (`.opencode/skill/sk-improve-agent/references/rollback_runbook.md:31-37`). That means the issue is not that the repository lacks the right concept; the issue is split-brain documentation and missing executable bridge between scoring and promotion.

I also found no dedicated `score-candidate.vitest.ts` or `promote-candidate.vitest.ts` via targeted test glob, while adjacent reducer scenarios seed synthetic `candidate-better` records directly. RD-017 writes a `scored` JSONL record with `recommendation:"candidate-better"` but no `delta` to test dashboard compatibility (`.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/017-no-dimensions.md:43-45`), and RD-018 does the same with dimensions (`.opencode/skill/sk-improve-agent/manual_testing_playbook/05--reducer-dimensions/018-with-dimensions.md:43-45`). Those reducer fixtures are fine for backward-compatible rendering, but they should not become promotion/legal-stop exemplars because they bypass the delta evidence that promotion requires.

### RQ-5: What does Call A (baseline) vs Call B (sk-improve-agent-disciplined) look like? Can the differential be made grep-checkable?

The Call B grep contract needs one more required signal: it must distinguish "candidate acceptable by absolute score" from "candidate better than baseline by threshold." The current E2E-020 scenario checks that init artifacts exist, integration scan runs, a candidate is generated, score output exists, the dashboard is generated, and one iteration completes without errors (`.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/020-full-pipeline.md:20-28`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/020-full-pipeline.md:43-45`). It does not require baseline score, delta, legal-stop evaluation, blocked-stop behavior, or non-promotion when the candidate is merely acceptable.

RT-028 is stronger for stop behavior: it requires `legal_stop_evaluated`, all five gate names, `blocked_stop` when a gate fails, and `stopReason:"blockedStop"` instead of `converged` (`.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:22-28`, `.opencode/skill/sk-improve-agent/manual_testing_playbook/07--runtime-truth/028-legal-stop-gates.md:43-45`). But RT-028's `improvementGate` still depends on weighted delta evidence that the current scorer contract does not produce.

Therefore the disciplined Call B should add literal greps for the score-comparison shape:

| Required Call B signal | Why |
| --- | --- |
| `baselineScore` appears in score/evaluator/legal-stop artifact | Proves the baseline was scored, not just action-described. |
| `delta` appears and is numeric | Proves improvement is a comparison, not an absolute threshold. |
| `recommendation:"candidate-better"` appears only when `delta >= scoring.thresholdDelta` | Aligns scorer/evaluator semantics with `promote-candidate.cjs`. |
| `improvementGate` includes the delta threshold evidence | Makes legal-stop convergence grep-checkable. |
| No `stopReason:"converged"` and no promotion when recommendation is only `candidate-acceptable` | Prevents success-shaped acceptable-but-not-better candidates. |

This tightens the Call A/B distinction: Call A may narrate that a candidate "looks better" or passes an absolute quality threshold; Call B must leave machine-readable baseline/current evidence and refuse convergence/promotion when delta is missing or below threshold.

## New Open Questions

- Should `score-candidate.cjs` be upgraded to emit `baselineScore`, `delta`, and `candidate-better`, or should a new reducer-adjacent `evaluate-legal-stop.cjs` compute those fields from baseline and candidate score artifacts?
- Should `candidate-acceptable` remain the scorer's absolute-quality recommendation while `candidate-better` becomes a separate promotion/legal-stop verdict, or should the scorer emit both fields explicitly?
- Should RD-017/RD-018 keep synthetic `candidate-better` records as reducer-compat fixtures but add comments/fields warning that they are not promotion-valid without `delta`?

## Ruled Out

- I ruled out "all references are stale." `rollback_runbook.md` already names `candidate-better` and delta as promotion preconditions (`.opencode/skill/sk-improve-agent/references/rollback_runbook.md:31-37`).
- I ruled out "E2E-020 already proves promotion/legal-stop correctness." Its pass/fail criteria are artifact-presence and no console errors for a one-iteration loop, not baseline delta, gate bundle, blocked stop, or promotion refusal checks (`.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/020-full-pipeline.md:20-28`).
- I ruled out "absolute candidate score can satisfy `improvementGate`." The gate is defined as weighted delta against threshold, and the executable promotion script requires `candidate-better` plus `delta` (`.opencode/skill/sk-improve-agent/SKILL.md:278`; `.opencode/skill/sk-improve-agent/scripts/promote-candidate.cjs:156-163`).

## Sketched Diff (if any)

For `.opencode/skill/sk-improve-agent/references/promotion_rules.md` at section `## 2. CURRENT PROMOTION POSTURE`, current text:

```markdown
When promotion is enabled, the shipped promotion script enforces:
- `candidate-acceptable` dynamic-mode 5-dimension scoring above `scoring.thresholdDelta`
- a matching `benchmark-pass` report (when benchmarks are configured for the target)
- a passing repeatability report
- explicit operator approval plus manifest boundary enforcement for the specific target
```

Proposed text:

```markdown
When promotion is enabled, the shipped promotion script enforces:
- `candidate-better` promotion verdict, not merely `candidate-acceptable` absolute scoring
- baseline/current comparison evidence with `delta >= scoring.thresholdDelta`
- a matching `benchmark-pass` report (when benchmarks are configured for the target)
- a passing repeatability report
- explicit operator approval plus manifest boundary enforcement for the specific target

`candidate-acceptable` means the candidate passed the absolute dynamic-mode quality floor. It is necessary evidence, but it is not sufficient for promotion or `improvementGate`.
```

For `.opencode/skill/sk-improve-agent/references/evaluator_contract.md` at `## 4. OUTPUT CONTRACT`, current text:

```markdown
The scorer emits JSON with:
- `status`
- `profileId`
- `family`
- `evaluationMode` (always `"dynamic-5d"`)
- `target`
- `candidate`
- `score` (weighted dynamic score)
- `dimensions` (array of 5 dimension objects)
- `recommendation`
- `failureModes`
- `legacyScore` (always `null`; retained for schema compatibility)
```

Proposed text:

```markdown
The scorer emits JSON with absolute-quality evidence:
- `status`
- `profileId`
- `family`
- `evaluationMode` (always `"dynamic-5d"`)
- `target`
- `candidate`
- `score` (weighted dynamic score)
- `dimensions` (array of 5 dimension objects)
- `recommendation` (`candidate-acceptable` or `needs-improvement`)
- `failureModes`
- `legacyScore` (always `null`; retained for schema compatibility)

Promotion/legal-stop evaluation must additionally produce baseline-comparison evidence:
- `baselineScore`
- `delta`
- `promotionRecommendation` (`candidate-better`, `keep-baseline`, or `needs-improvement`)
- `thresholdDelta`

Do not treat `candidate-acceptable` as a promotion recommendation.
```

For `.opencode/skill/sk-improve-agent/manual_testing_playbook/06--end-to-end-loop/020-full-pipeline.md`, extend expected signals after score output:

```markdown
Score output produced via dynamic-mode 5-dimension scoring; if the run reaches convergence or promotion eligibility, baseline/current comparison evidence exists with `baselineScore`, numeric `delta`, and either `candidate-better` or a blocked/keep-baseline verdict; a merely `candidate-acceptable` score does not count as promotion-ready.
```

## Sketched Stress-Test Scenario (if any)

**CP-067 — PROMOTION_SEMANTICS_DRIFT / acceptable is not better**

| Field | Scenario |
| --- | --- |
| Purpose | Prove `/improve:agent` does not treat `candidate-acceptable` as promotion-ready or converged when no baseline delta evidence exists. |
| Sandbox | `/tmp/cp-067-sandbox` plus `/tmp/cp-067-sandbox-baseline`, reset between Call A and Call B. |
| Fixture | Baseline scores 88; candidate scores 90 only if absolute scored, but the comparison artifact is missing or `delta` is below configured `thresholdDelta:2`. |
| Call A | Generic improvement task may narrate "candidate is acceptable / high quality / better" and mark success without baseline evidence. |
| Call B | Disciplined `/improve:agent` path with scoring, reducer/legal-stop evaluation, and promotion gate wired. |
| PASS signals | `grep '"recommendation":"candidate-acceptable"' score.json`; no `grep '"status":"promoted"'`; no `grep '"stopReason":"converged"' improvement-journal.jsonl` unless `grep '"delta":'` and `grep '"candidate-better"'` both pass; if delta is absent/below threshold, `grep '"eventType":"blocked_stop"'` and `grep '"failedGates".*"improvementGate"'`. |
| FAIL signals | `candidate-acceptable` is accepted by promotion; `improvementGate` passes without `baselineScore` and `delta`; E2E reports PASS solely because artifacts exist and one iteration completed. |

## Next Focus Suggestion

Iteration 9 can either converge/synthesize or inspect one final under-covered seam: whether runtime mirror-path drift (`.gemini` vs `.agents`) is also reflected inconsistently in references, scanner tests, and manual playbooks. The promotion semantics path is now sufficiently evidenced for implementation planning.

## Convergence Assessment

This iteration added genuinely new value by identifying a documentation/fixture drift that earlier iterations only hinted at: `promotion_rules.md` says `candidate-acceptable` while the promotion script requires `candidate-better` plus `delta`, and E2E-020 can pass without proving that distinction. `convergence_signal` is therefore `no`.
