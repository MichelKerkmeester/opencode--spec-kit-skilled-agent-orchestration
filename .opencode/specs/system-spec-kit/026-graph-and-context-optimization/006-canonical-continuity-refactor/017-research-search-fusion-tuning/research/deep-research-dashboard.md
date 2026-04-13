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
- Topic: Search fusion weight optimization and reranking threshold calibration
- Started: 2026-04-13T04:50:40Z
- Status: INITIALIZED
- Iteration: 25 of 25
- Session ID: 75c06db9-0994-48a7-916d-bd008514d63a
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Inventory cross-encoder constants, provider ladder, cache TTL, and rerank thresholds | constants | 0.85 | 3 | complete |
| 2 | Document Stage 1, Stage 2, and search-weights hardcoded values | constants | 0.78 | 3 | complete |
| 3 | Trace canonical decay math and real source-of-truth file layout | architecture | 0.72 | 3 | complete |
| 4 | Analyze adaptive fusion assembly and normalized intent-weight profiles | fusion | 0.62 | 3 | complete |
| 5 | Review RRF K-sensitivity analysis and intent-specific optimization hooks | fusion | 0.55 | 3 | complete |
| 6 | Map fusion findings onto continuity-query priorities and config ownership | fusion | 0.46 | 3 | complete |
| 7 | Profile provider contracts, fallback score bands, and fixture quality differences | rerank | 0.38 | 3 | complete |
| 8 | Compare length-penalty thresholds against real spec-doc corpus shape and cache observability | rerank | 0.30 | 3 | complete |
| 9 | Synthesize threshold recommendations for continuity-first reranking | recommendations | 0.22 | 3 | complete |
| 10 | Finalize cross-question recommendations and packet-local synthesis | synthesis | 0.12 | 4 | complete |
| 11 | Map length-penalty call graph, compatibility surface, and phase-001 blast radius | length-penalty | 0.74 | 4 | complete |
| 12 | Audit penalty-specific tests and convert the removal decision into safe phase-001 implementation guidance | length-penalty | 0.67 | 4 | complete |
| 13 | Design reranker cache counters and identify the smallest canonical status surface for phase 002 | telemetry | 0.71 | 4 | complete |
| 14 | Differentiate core reranker status changes from optional operator-visible telemetry exposure | telemetry | 0.59 | 4 | complete |
| 15 | Locate the minimum adaptive-fusion seam for a dedicated continuity profile | continuity-profile | 0.64 | 4 | complete |
| 16 | Trace the wider public-intent blast radius for continuity beyond adaptive-fusion.ts | continuity-profile | 0.69 | 4 | complete |
| 17 | Map Stage 3 rerank-minimum behavior and determine the safest first threshold | rerank-threshold | 0.62 | 4 | complete |
| 18 | Audit Stage 3 regression fixtures for MIN_RESULTS_FOR_RERANK = 4 fallout | rerank-threshold | 0.58 | 4 | complete |
| 19 | Choose the lowest-blast-radius harness for continuity-specific RRF K sweeps | k-sweep | 0.66 | 4 | complete |
| 20 | Synthesize the safe implementation map for phases 001-004 plus the continuity-specific K-sweep follow-up | synthesis-implementation | 0.34 | 5 | complete |
| 21 | Cross-validate the phase recommendations against each other and the current repo state | convergence | 0.24 | 4 | complete |
| 22 | Prioritize phases 001-004 by combined impact, risk, and sequencing value | prioritization | 0.19 | 4 | complete |
| 23 | Identify edge cases and rollout risks inside the recommended changes | risk-register | 0.15 | 4 | complete |
| 24 | Validate how to extend the K-sweep harness without destabilizing existing tests | k-sweep-validation | 0.11 | 4 | complete |
| 25 | Finalize convergence, resolve the remaining phase-003 scope question, and produce implementation-ready synthesis | final-synthesis | 0.07 | 5 | complete |

- iterationsCompleted: 25
- keyFindings: 119
- openQuestions: 0
- resolvedQuestions: 1

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 1/1
- [x] Decide whether phase `003-continuity-search-profile` should stay adaptive-fusion-only or widen into a public continuity intent across classifier/routing/tool surfaces.

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.15 -> 0.11 -> 0.07
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.07
- coverageBySources: {"code":90,"other":71}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None this iteration. (iteration 1)
- None this iteration. (iteration 1)
- None this iteration. (iteration 2)
- None this iteration. (iteration 2)
- None this iteration. (iteration 3)
- Treating the packet's shorter Stage 1 and Stage 2 file paths as authoritative. (iteration 3)
- None this iteration. (iteration 4)
- None this iteration. (iteration 4)
- None this iteration. (iteration 5)
- None this iteration. (iteration 5)
- None this iteration. (iteration 6)
- Using `search-weights.json` as the primary continuity tuning surface. (iteration 6)
- Claiming real provider latency distributions from the fixture-only test corpus. (iteration 7)
- Live benchmark runs against configured providers were not available within packet constraints. (iteration 7)
- Changing the TTL based on a derived hit rate from current exports. (iteration 8)
- None beyond the cache observability gap. (iteration 8)
- None beyond previously ruled-out config assumptions. (iteration 9)
- None this iteration. (iteration 9)
- None this iteration. (iteration 10)
- None this iteration. (iteration 10)
- None this iteration. (iteration 11)
- Treating phase `001` as a one-line constant deletion with no compatibility work. (iteration 11)
- Keeping the constants in code "just for tests". That would preserve dead behavior rather than removing it. (iteration 12)
- Replacing the deleted penalty with a higher threshold in phase `001`; that contradicts the user’s explicit removal decision. (iteration 12)
- Adding counters directly to per-result payload rows; cache behavior is module-level, not document-level. (iteration 13)
- None this iteration. (iteration 13)
- Coupling phase `002` to TTL retuning or dashboard work; the packet sub-phase spec is right to keep that out of scope. (iteration 14)
- Treating `getRerankerStatus()` as already operator-visible; the repo evidence does not support that. (iteration 14)
- None this iteration. (iteration 15)
- Treating the new profile as a change to `DEFAULT_WEIGHTS`; continuity needs to be explicit, not a silent default drift. (iteration 15)
- None this iteration. (iteration 16)
- Sneaking `continuity` into `INTENT_WEIGHT_PROFILES` and pretending the MCP/tool surface automatically supports it; the handler currently validates explicit intents against `IntentType`. (iteration 16)
- Changing the threshold inside `cross-encoder.ts`; that would be the wrong layer and would break direct reranker tests unnecessarily. (iteration 17)
- None this iteration. (iteration 17)
- Mass-editing every reranker test file after raising the Stage 3 minimum; the threshold blast radius is narrower than that. (iteration 18)
- Treating the evaluation-comparison suite as evidence for Stage 3 threshold behavior; it tests the reranker module directly. (iteration 18)
- None this iteration. (iteration 19)
- Starting with `runJudgedKSweep()` for continuity before the profile/intent question is settled. (iteration 19)
- None this iteration. (iteration 20)
- Treating all four implementation sub-phases as symmetric. Their safe scopes are meaningfully different. (iteration 20)
- None this iteration. (iteration 21)
- Reopening FSRS or `search-weights.json` as unresolved convergence topics. (iteration 21)
- None this iteration. (iteration 22)
- Ranking the follow-on phases by algorithmic novelty instead of combined impact and implementation risk. (iteration 22)
- Treating local reranker behavior as independent from the Stage 3 minimum-results gate. (iteration 23)
- Trying to keep a broad public continuity intent "optional" while leaving the current validator and test enums untouched. (iteration 23)
- None this iteration. (iteration 24)
- Using ground-truth or typed judged-sweep expansion as the first continuity benchmark step. (iteration 24)
- Continuing to treat broad public continuity intent as the default scope for phase `003`. (iteration 25)
- None this iteration. (iteration 25)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Hand off to implementation with this order: `002` telemetry source of truth, `001` length-penalty behavior removal, `004` rerank minimum = `4`, then `003` narrow continuity profile, with the continuity-specific K-sweep running as supporting validation rather than as a prerequisite.

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
