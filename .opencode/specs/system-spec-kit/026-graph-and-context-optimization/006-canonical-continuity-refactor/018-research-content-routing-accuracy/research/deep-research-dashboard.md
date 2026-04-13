---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Content routing classification accuracy and threshold optimization
- Started: 2026-04-13T04:51:24Z
- Status: COMPLETE
- Iteration: 38 of 20
- Session ID: 73f56143-edd1-45c2-9893-149fa736250f
- Parent Session: none
- Lifecycle Mode: resume
- Generation: 1
- continuedFromRun: 10
- stopReason: Stopped early after three consecutive post-fix verification iterations below the 0.10 novelty threshold; preserved-subset accuracy stayed at 95.65%, the metadata_only fix remained confined to routed save-target identity, and no new router edge cases surfaced.

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Router constants, category set, and Tier1 hard-rule inventory | classification | 0.95 | 4 | complete |
| 2 | Tier1 heuristic cues, target mapping, and Tier2 prototype inventory | classification | 0.88 | 4 | complete |
| 3 | Tier3 prompt contract and runtime wiring reality | runtime-wiring | 0.82 | 4 | complete |
| 4 | Decision-path and escalation-trigger analysis | decision-path | 0.78 | 4 | complete |
| 5 | Synthetic corpus baseline accuracy and hard-rule performance | measurement | 0.86 | 5 | complete |
| 6 | Confusion pairs and concrete edge-case failures | measurement | 0.74 | 5 | complete |
| 7 | Merge-mode mapping and payload construction by category | merge | 0.70 | 4 | complete |
| 8 | Merge legality and failure conditions | merge | 0.66 | 5 | complete |
| 9 | Override semantics and threshold sensitivity sweep | thresholds | 0.62 | 5 | complete |
| 10 | Synthesis and implementation-ready recommendations | synthesis | 0.58 | 5 | complete |
| 11 | Delivery versus progress cue audit | remediation-delivery | 0.72 | 4 | complete |
| 12 | Delivery and progress prototype quality | remediation-delivery | 0.68 | 4 | complete |
| 13 | Handover versus drop heuristic collision | remediation-handover | 0.71 | 4 | complete |
| 14 | Handover and drop prototype boundary | remediation-handover | 0.63 | 4 | complete |
| 15 | Tier3 wiring gap in the save path | runtime-wiring | 0.66 | 4 | complete |
| 16 | Tier3 latency and cost envelope | runtime-wiring | 0.57 | 4 | complete |
| 17 | Prototype distribution beyond the hotspots | prototypes | 0.52 | 4 | complete |
| 18 | Test coverage gaps and untested edges | test-coverage | 0.61 | 4 | complete |
| 19 | Phase-by-phase implementation guidance | phase-guidance | 0.46 | 4 | complete |
| 20 | Remediation synthesis and sequencing | synthesis | 0.38 | 5 | complete |
| 21 | Exact delivery-versus-progress cue changes | remediation-delivery | 0.33 | 4 | complete |
| 22 | Exact handover patterns that collide with drop | remediation-handover | 0.31 | 4 | complete |
| 23 | Tier3 wiring effort estimate and test strategy | runtime-wiring | 0.28 | 5 | complete |
| 24 | Routing-category coverage floor in content-router tests | test-coverage | 0.22 | 4 | complete |
| 25 | Final convergence synthesis with exact phase change descriptions | synthesis | 0.14 | 4 | complete |
| 26 | Preserved-subset benchmark replay | post-impl-benchmark | 0.44 | 5 | complete |
| 27 | Compact replay caveat and residual short-fragment risk | benchmark-caveat | 0.39 | 5 | complete |
| 28 | Tier 3 always-on runtime trace | tier3-runtime | 0.35 | 5 | complete |
| 29 | Tier 3 prompt-body and fail-open verification | tier3-verification | 0.31 | 5 | complete |
| 30 | save.md and SKILL.md parity audit | doc-parity | 0.29 | 5 | complete |
| 31 | save_workflow.md parity and endpoint wording nuance | doc-parity | 0.24 | 5 | complete |
| 32 | Prototype centroid separation after refresh | prototypes | 0.28 | 5 | complete |
| 33 | Nearest-neighbor prototype risk pairs | prototypes | 0.23 | 5 | complete |
| 34 | Residual-gap synthesis after implementation | synthesis | 0.19 | 5 | complete |
| 35 | Reconverged synthesis and 95%+ path | synthesis | 0.15 | 5 | complete |
| 36 | Preserved replay after metadata-only fix | post-fix-benchmark | 0.06 | 3 | complete |
| 37 | Metadata-only identity verification | post-fix-identity | 0.04 | 3 | complete |
| 38 | Final post-fix edge sweep | post-fix-convergence | 0.03 | 3 | complete |

- iterationsCompleted: 38
- keyFindings: 171
- openQuestions: 0
- resolvedQuestions: 16

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 16/16
- [x] RQ-1: What is the classification accuracy of Tier1 hard rules? Which of the 7 rules fire most often, and do any produce false positives?
- [x] RQ-2: What is the Tier1->Tier2 escalation rate? What types of content trigger escalation (top1 below threshold, narrow margin, mixed signals)?
- [x] RQ-3: What are the confusion pairs between categories? (for example, does `narrative_progress` get confused with `task_update`?)
- [x] RQ-4: Are the 0.70/0.70/0.50 thresholds optimal, or would different values reduce escalation without losing accuracy?
- [x] RQ-5: What merge modes succeed vs fail for each category? Are there categories where the default merge mode is wrong?
- [x] RQ-6: How does the `routeAs` override interact with natural classification? Does override produce better or worse outcomes?
- [x] RQ-7: Which exact delivery-versus-progress cues cause the current misclassifications, and what delivery lexicon should be added?
- [x] RQ-8: Which handover patterns are currently pulled into `drop`, and how should the drop heuristic be relaxed?
- [x] RQ-9: What exact code is missing to wire Tier3 into `memory-save.ts`, and what latency or cost envelope does that imply?
- [x] RQ-10: Are the Tier2 prototype vectors well distributed across categories, especially at the delivery/progress and handover/drop boundaries?
- [x] RQ-11: Which routing categories and edge cases lack meaningful regression coverage today?
- [x] RQ-12: How did the post-implementation benchmark change, and what confusion pairs remain after the cue and prototype fixes?
- [x] RQ-13: Does the always-on Tier3 save path now route end to end with correct fail-open behavior?
- [x] RQ-14: Do `save.md`, `SKILL.md`, and `save_workflow.md` match the shipped router behavior line by line?
- [x] RQ-15: Are the refreshed prototypes actually well separated in embedding space after the targeted edits?
- [x] RQ-16: What is the smallest follow-on work that would make the abbreviated-fragment story credibly exceed 95%?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.06 -> 0.04 -> 0.03
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.03
- coverageBySources: {"code":175,"other":13}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Historical save-log mining. The packet scope and current memory model explicitly require synthetic payloads instead. (iteration 1)
- Treating the spec's "7 rules" text as authoritative. The code clearly ships eight hard rules today. (iteration 1)
- Assuming the prototype library is sparse or skewed toward one category. It is balanced by count. (iteration 2)
- Treating Tier2 as independent from target selection. The prototype scorer still inherits the same `buildTarget()` mapping as Tier1 and Tier3. (iteration 2)
- Looking for a hidden `classifyWithTier3` injection elsewhere in the non-test server code. The only production callsite creates the router without one. (iteration 3)
- Treating the Tier3 prompt as active production behavior in the current canonical save path. (iteration 3)
- Assuming `manual_retry` means a forced escalation. In code it is the neutral/default reason after a non-blocked Tier1 result. (iteration 4)
- Searching for a fifth hidden escalation reason. (iteration 4)
- Assuming hard rules are the dominant driver of routing quality. On this corpus they are precise but relatively rare. (iteration 5)
- Making accuracy claims from prototype count balance alone. (iteration 5)
- Blaming delivery and handover failures on Tier2. In the key examples, Tier2 preferred the expected class but never got a chance because Tier1 accepted early or `drop` cues dominated. (iteration 6)
- Treating phase-anchor inference as the main handover failure driver. (iteration 6)
- Assuming metadata-only and task updates share the same failure profile because both report `update-in-place`. (iteration 7)
- Treating all categories as equally safe once the router selects a target doc. (iteration 7)
- Assuming merge safety is fully captured by the router's category-to-target map. (iteration 8)
- Treating `append-section` and `update-in-place` as equally tolerant operations. (iteration 8)
- Assuming `routeAs` makes any classified chunk merge-safe regardless of target and merge-mode validity. (iteration 9)
- Recommending a blanket threshold increase as an unqualified improvement. (iteration 9)
- Shipping a threshold-only fix as the sole remediation. (iteration 10)
- Treating the currently unwired Tier3 contract as the main source of routing inaccuracy. (iteration 10)
- Looking only at `RULE_CUES` without tracing the extra progress floor in `scoreCategories()`. (iteration 11)
- Treating delivery confusion as a prototype-only issue. The heuristic floor in `scoreCategories()` is part of the bug. (iteration 11)
- Assuming balanced prototype counts are enough to prevent confusion in Tier2. (iteration 12)
- Expecting `negativeHints` to already act as a live penalty signal. (iteration 12)
- Keeping `git diff` in the same severity class as transcript wrappers and table-of-contents scaffolding. (iteration 13)
- Treating every command mention inside a handover chunk as proof that the content is generic operator boilerplate. (iteration 13)
- Rewriting the drop corpus as the main fix for handover/drop confusion. (iteration 14)
- Treating command-first handover prose as harmless prototype decoration. (iteration 14)
- Assuming there is already a hidden production caller for `buildTier3Prompt()`. (iteration 15)
- Treating phase `003` as a one-line constructor tweak in `memory-save.ts`. (iteration 15)
- Assuming the current 2-second timeout is automatically safe for arbitrarily long routed save bodies. (iteration 16)
- Treating Tier3 cost as the main blocker before measuring the ambiguous-call rate. (iteration 16)
- Rebuilding the entire prototype library as the first remediation step. (iteration 17)
- Using prototype count balance as a proxy for semantic separation. (iteration 17)
- Looking only at router tests and ignoring the handler path where Tier3 would actually be wired. (iteration 18)
- Treating the current test suite as sufficient because every category already has one positive-path assertion. (iteration 18)
- Deferring the regression tests until after the cue/prototype fixes land. (iteration 19)
- Treating the implementation phases as independent. The code and test changes need to move together. (iteration 19)
- Reopening the threshold debate as the primary path forward before the cue, prototype, and test fixes land. (iteration 20)
- Treating Tier3 wiring as the fix for delivery/progress and handover/drop by itself. (iteration 20)
- Solving delivery confusion by adding one more rollout noun while leaving the current progress floor unconditional. (iteration 21)
- Treating `same-pass` as sufficient by itself. The overlap spans sequencing, pending-until-verification language, and synchronized-surface wording. (iteration 21)
- Removing all command language from handover guidance. Real handover notes legitimately contain commands; the fix is to demote the soft ones, not ban them. (iteration 22)
- Treating resume-command language as the same thing as transcript or wrapper boilerplate. (iteration 22)
- Assuming a reusable production `RouterCache` already exists and phase `003` only needs to pass it through. (iteration 23)
- Treating the env contract choice as free. Reuse-versus-new-env naming is a real scope decision inside the wiring phase. (iteration 23)
- Looking for a routing category that is completely absent from `content-router.vitest.ts`. (iteration 24)
- Treating category presence as equivalent to meaningful regression coverage. (iteration 24)
- Continuing the research loop instead of handing the packet back to implementation. (iteration 25)
- Expecting another research pass to change the phase order or revive threshold tuning as the primary fix. (iteration 25)
- Looking for the old delivery and handover confusion pairs in the preserved replay after the implemented cue and prototype changes. (iteration 26)
- Treating the absence of the original compact-variant generator as a reason to skip post-implementation benchmarking. (iteration 26)
- Treating the reconstructed compact replay as a strict substitute for the earlier 132-sample benchmark. (iteration 27)
- Trying to infer the exact earlier compact-variant generator from the current packet state alone. (iteration 27)
- Assuming that always-on Tier 3 makes every canonical save network-dependent. (iteration 28)
- Treating the handler change as proof that Tier 3 necessarily decides every routed save. (iteration 28)
- Treating the routing-only Tier 3 tests as redundant now that the handler wiring exists in code. (iteration 29)
- Using the full handler suite as the primary signal for this question when unrelated atomic-save failure-injection tests still fail elsewhere in the file. (iteration 29)
- Looking for a missing category or stale Tier 3 flag claim in the primary save docs after the doc-alignment phase was already shipped. (iteration 30)
- Treating the packet as still documentation-drifted just because earlier research was written before implementation landed. (iteration 30)
- Looking for a second hidden doc drift after the save docs already agree on categories, tiers, boundaries, and context rules. (iteration 31)
- Treating the endpoint-availability wording nuance as a substantive documentation mismatch. (iteration 31)
- Treating centroid distance alone as a proxy for live routed accuracy. (iteration 32)
- Using balanced prototype counts as proof that the refreshed corpus is now semantically well separated. (iteration 32)
- Expecting prototype refreshes alone to remove the need for heuristic boundary rules in the narrative categories. (iteration 33)
- Treating the refreshed hotspot prototypes as still behaviorally broken just because their embeddings remain close. (iteration 33)
- Reopening the delivery/progress or handover/drop remediation plan as the primary next step. (iteration 34)
- Treating documentation parity as the missing ingredient in the residual accuracy story. (iteration 34)
- Continuing the research loop again before deciding whether short-fragment robustness is worth another targeted code pass. (iteration 35)
- Treating a missing exact compact-generator replay as a blocker to drawing a useful post-implementation verdict. (iteration 35)
- Counting `DR-05-s1` as a clean pass because the category stays `drop` even though it still refuses below the floor. (iteration 36)
- Treating the `metadata_only` target fix as a silent routing-accuracy change. (iteration 36)
- Looking for a new same-path identity collision after the fix; the helper now resolves continuity identity onto the canonical host doc and anchor explicitly. (iteration 37)
- Treating F7 as a hidden fix for the `research_finding` versus `metadata_only` classification seam. (iteration 37)
- Opening a new remediation phase for the `metadata_only` fix itself. (iteration 38)
- Treating historical packet-doc flag mentions as evidence of an active documentation regression in the shipped save surfaces. (iteration 38)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
None. Stop early and hand the packet back as converged unless the team explicitly chooses the optional short-fragment follow-on.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
