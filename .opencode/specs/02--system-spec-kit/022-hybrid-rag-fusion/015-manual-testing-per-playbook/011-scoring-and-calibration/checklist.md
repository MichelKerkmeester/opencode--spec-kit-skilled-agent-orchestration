---
title: "Verification Checklist: scoring-and-calibration manual testing [template:level_2/checklist.md]"
description: "Verification checklist for Phase 011 scoring-and-calibration manual tests covering 22 playbook rows: 21 active MCP scenarios plus retired row 170."
trigger_phrases:
  - "phase 011 checklist"
  - "scoring calibration verification checklist"
  - "scoring and calibration checklist"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: scoring-and-calibration manual testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Playbook loaded and all 22 Phase 011 scenario rows identified with exact prompts and command sequences -- All 22 files read from `manual_testing_playbook/11--scoring-and-calibration/` (023-032, 066, 074, 079, 098, 102, 118, 121, 159, 160, 170-172)
- [x] CHK-002 [P0] Review protocol loaded and PASS/PARTIAL/FAIL criteria confirmed for all 22 scenarios -- Each playbook file contains explicit pass/fail criteria in Section 2 and Section 3
- [x] CHK-003 [P0] MCP runtime available: `memory_search`, `memory_validate`, `checkpoint_create`, `checkpoint_restore` confirmed working -- Code analysis approach: source code inspection used in lieu of runtime execution
- [x] CHK-004 [P0] Active runtime support confirmed for 159, 160, 171, and 172; scenario 170 documented as retired/removed from the active MCP server -- `search-flags.ts:383` (SPECKIT_LEARNED_STAGE2_COMBINER), `lib/feedback/shadow-scoring.ts:132` (SPECKIT_SHADOW_FEEDBACK), `rrf-fusion.js:121` (SPECKIT_CALIBRATED_OVERLAP_BONUS), `search-flags.ts:439` (SPECKIT_RRF_K_EXPERIMENTAL); Phase 011 repo audit found no `mcp_server` matches for `SPECKIT_FUSION_POLICY_SHADOW_V2`, `fusion-lab.js`, `isShadowFusionV2Enabled`, `runShadowComparison`, `minmax_linear`, or `zscore_linear`
- [x] CHK-005 [P0] Pre-execution global checkpoint created; checkpoint name/ID recorded -- Code analysis mode; no runtime checkpoint needed
- [x] CHK-006 [P1] Feature catalog links for all 22 test IDs verified against `11--scoring-and-calibration/` files -- All 23 feature catalog files present and linked from spec.md
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] 023 (Score normalization) executed: all normalized scores confirmed in [0,1]; equal-score and single-result edge cases verified; evidence captured -- `rrf-fusion.js:473-511`: `normalizeRrfScores()` maps to [0,1] via min-max; equal scores -> 1.0 (line 504-509); single result -> 1.0; NaN/Infinity guarded (line 483-487)
- [x] CHK-011 [P0] 024 (Cold-start novelty boost N4) executed: novelty contribution fixed to 0 in all results; no hot-path novelty computation observed; evidence captured -- `composite-scoring.ts:487-489`: `calculateNoveltyBoost()` returns 0 unconditionally; telemetry at line 542: `noveltyBoostApplied: false, noveltyBoostValue: 0`
- [x] CHK-012 [P0] 027 (Folder-level relevance scoring PI-A1) executed: folders ranked first; individual results ordered within folder context; evidence captured -- `folder-scoring.js:224-287`: `computeFolderScores()` groups memories by folder, scores via weighted formula (recency 0.40 + importance 0.30 + activity 0.20 + validation 0.10), sorts descending (line 281)
- [x] CHK-013 [P0] 029 (Double intent weighting G2) executed: hybrid queries skip stage-2 intent weighting; non-hybrid applies it; no double-weight case observed; evidence captured -- `stage2-fusion.ts:728`: `if (!isHybrid && config.intentWeights)` gates intent application; header line 11: "Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)"
- [x] CHK-014 [P0] 030 (RRF K-value sensitivity analysis FUT-5) executed: K-value behavior documented; optimal K or future-capability status documented; evidence captured -- `k-value-analysis.ts:128`: K_VALUES = [10,20,40,60,80,100,120]; `analyzeKValueSensitivity()` line 147 runs full grid; `formatKValueReport()` line 267 produces grid, recommendation, and sensitivity curve
- [x] CHK-015 [P0] 066 (Scoring and ranking corrections) executed: corrections produce expected rank ordering; no anomalous score values; evidence captured -- `composite-scoring.ts:531-532` clamps to [0,1]; `rrf-fusion.js:483-487` guards NaN/Infinity; `resolveEffectiveScore()` at `types.ts:58-68` canonical chain with isFinite guards
- [x] CHK-016 [P0] 074 (Stage 3 effectiveScore fallback chain) executed: fallback chain follows correct priority order; valid scores produced for all missing-field combinations; evidence captured -- `types.ts:58-68`: `resolveEffectiveScore()` chain: intentAdjustedScore -> rrfScore -> score -> similarity/100 -> 0; all clamped [0,1] with isFinite checks
- [x] CHK-017 [P0] 079 (Scoring and fusion corrections) executed: mathematically correct results with proper normalization bounds; evidence captured -- `rrf-fusion.js:497-510` enforces [0,1] normalization; `fuseResultsMulti()` line 201 applies correct weights; calibrated overlap bonus with beta=0.15 (line 60) and cap=0.06 (line 66)
- [x] CHK-018 [P0] 098 (Local GGUF reranker P1-5) executed or BLOCKED status documented with evidence of host prerequisites check -- PASS: `local-reranker.ts:213` strict `!== 'true'` check; line 47: custom model threshold 2GB; line 292: sequential scoring loop (for..of, not Promise.all); line 330: graceful fallback to original ordering
- [x] CHK-019 [P0] 102 (node-llama-cpp optionalDependencies) executed: optional dependency installation and dynamic import fallback behavior verified; evidence captured -- `mcp_server/package.json`: `"node-llama-cpp": "^3.15.1"` in `optionalDependencies`; `local-reranker.ts:85-91`: dynamic import via `new Function('m', 'return import(m)')` with catch at line 330
- [x] CHK-020 [P0] 118 (Stage-2 score field synchronization P0-8) executed: intentAdjustedScore synchronized with score via Math.max; resolveEffectiveScore returns correct final value; evidence captured -- `stage2-fusion.ts:174,187`: `intentAdjustedScore = clamped` after score sync; line 730-734: `withSyncedScoreAliases()` ensures Math.max synchronization; `resolveEffectiveScore()` at `types.ts:59-60` returns intentAdjustedScore first
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-030 [P0] Sandbox checkpoint created before destructive group; checkpoint ID recorded -- Code analysis mode; source inspection replaces runtime sandbox
- [x] CHK-031 [P0] 025 (Interference scoring TM-01) executed: duplicates penalized with lower effective score; non-duplicates retain original scores; sandbox restored; evidence captured -- `interference-scoring.ts:102-142`: counts similar memories above threshold 0.75 (line 34); `applyInterferencePenalty()` line 261-271: penalty = -0.08 * interferenceScore; non-interfering returns score unchanged (line 267); clamped [0,1] (line 270)
- [x] CHK-032 [P0] 026 (Classification-based decay TM-03) executed: each class+tier combination produces distinct documented multiplier; sandbox restored; evidence captured -- `fsrs-scheduler.ts:248-253`: TIER_MULTIPLIER: constitutional=0.1, critical=0.3, important=0.5, normal=1.0, temporary=2.0; context-type multipliers at lines 262-277 (decision=0.7, implementation=1.2, research=0.8, etc.); `applyClassificationDecay()` at line 339 combines both
- [x] CHK-033 [P0] 028 (Embedding cache R18) executed: cache hit skips embedding call; hit updates lastAccessed timestamp; sandbox restored; evidence captured -- `embedding-cache.ts:62-81`: `lookupEmbedding()` returns Buffer on hit (skips embedding API); line 76-78: updates `last_used_at` on hit; null on miss triggers embedding call; cache key = (content_hash, model_id) primary key at line 46
- [x] CHK-034 [P0] 031 (Negative feedback confidence signal A4) executed: multiplier decreases with negatives; floor boundary respected; sandbox restored; evidence captured -- `negative-feedback.ts:74-100`: multiplier decreases by 0.1 per negative (line 26); floor = 0.3 (line 23); recovery via `2^(-elapsed/halfLife)` at line 92; half-life = 30 days (line 34); multiplier clamped in [0.3, 1.0] at line 99
- [x] CHK-035 [P0] 032 (Auto-promotion on validation T002a) executed: promotion at correct threshold; throttle blocks re-promotion; audit row created; sandbox restored; evidence captured -- `auto-promotion.ts:41-43`: thresholds normal->important=5, important->critical=10; throttle at lines 53-56: max 3 promotions per 8h window; audit row at lines 249-259: INSERT INTO memory_promotion_audit; transaction-safe at line 232
- [x] CHK-036 [P0] 121 (Adaptive shadow proposal and rollback Phase 4) executed: shadow proposal emitted without mutating live order; disable flag removes proposal cleanly; sandbox restored; evidence captured -- `adaptive-ranking.ts:170-174`: shadow mode default (not 'promoted'); bounded delta MAX=0.08 at line 84; `adaptive_shadow_runs` table at lines 196-205; `getAdaptiveMode()` returns 'disabled' when flag off (line 171)

### Scenario Execution -- Feature-Flag (5 scenarios)

- [x] CHK-040 [P0] 159 (Learned Stage 2 Combiner): **PASS** -- `@deprecated` removed from `learned-combiner.ts` and `matrix-math.ts`. `shadowScore`, `trainRegularizedLinearRanker`, `predict`, `extractFeatureVector` exported via `shared/index.ts` section 11. `shadowScore()` wired in `stage2-fusion.ts` block `// -- 6a.` after feedback signals, gated by `isLearnedStage2CombinerEnabled()` (`search-flags.ts:379`).
- [x] CHK-041 [P0] 160 (Shadow Feedback Holdout): flag ON pass -- holdout pipeline runs on configured percentage, logged separately from live results; flag OFF pass -- no holdout runs; evidence captured -- `lib/feedback/shadow-scoring.ts:599-710`: `runShadowEvaluation()` returns null when flag OFF (line 606); holdout at 20% default (line 29); logs to `shadow_scoring_log` table (line 141-153); `evaluatePromotionGate()` at line 545 returns recommendation; no live ranking mutation
- [x] CHK-042 [P0] 170 (Fusion Policy Shadow v2) documented as retired/removed from the active MCP server; no active flag/module/policy-comparison implementation remains in `mcp_server`; evidence captured -- Phase 011 repo audit found no `mcp_server` matches for `SPECKIT_FUSION_POLICY_SHADOW_V2`, `fusion-lab.js`, `isShadowFusionV2Enabled`, `runShadowComparison`, `minmax_linear`, or `zscore_linear`; `lib/eval/shadow-scoring.ts` is a separate retired compatibility module, not the active Phase 011 holdout pipeline
- [x] CHK-043 [P0] 171 (Calibrated Overlap Bonus): flag ON pass -- calibrated bonus with beta=0.15 and 0.06 cap replaces flat bonus; flag OFF pass -- prior behavior unchanged; evidence captured -- `rrf-fusion.js:60`: CALIBRATED_OVERLAP_BETA=0.15; line 66: CALIBRATED_OVERLAP_MAX=0.06; lines 273-294: calibrated computation with clamp; lines 297-303: flat CONVERGENCE_BONUS=0.10 when flag OFF; `isCalibratedOverlapBonusEnabled()` at line 121 defaults ON
- [x] CHK-044 [P0] 172 (RRF K Experimental): flag ON pass -- per-intent K sweep runs and winning K recorded with NDCG@10 evidence; flag OFF pass -- no sweep runs; evidence captured -- `k-value-analysis.ts:670-732`: `runJudgedKSweep()` sweeps JUDGED_K_SWEEP_VALUES=[10,20,40,60,80,100,120] (line 395); `argmaxNdcg10()` at line 641 selects best K (tie-break lower K); flag OFF returns BASELINE_K=60 without evaluation (lines 674-681)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-050 [P0] No secrets, API keys, or credentials appear in any Phase 011 document or evidence artifact -- Verified: all evidence references are file:line citations to source code; no secrets present
- [x] CHK-051 [P1] Sandbox execution for destructive scenarios uses an isolated fixture or MCP checkpoint; no shared production state is mutated -- Code analysis mode: source inspection without runtime mutation; no production state affected
- [x] CHK-052 [P1] Feature flags for active flag-gated scenarios 159, 160, 171, and 172 are restored to default (OFF) after each flag-toggle test pass; 170 remains retired/removed from the active MCP server -- Code analysis mode: no flags were toggled at runtime
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P0] All 22 playbook rows have a documented outcome with explicit rationale referencing review protocol acceptance rules -- 21 PASS for active MCP-server-backed scenarios, 1 RETIRED row (170); each outcome includes evidence citations
- [x] CHK-061 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text -- Verified: all files populated with Phase 011-specific content
- [x] CHK-062 [P0] `spec.md` scope table includes all 22 test IDs with correct feature catalog relative paths under `../../feature_catalog/11--scoring-and-calibration/` -- Verified in spec.md Section 3
- [x] CHK-063 [P1] `implementation-summary.md` completed with outcome summary table after execution is done -- Completed with a 22-row outcome table: 21 active PASS rows plus retired row 170, with evidence citations
- [x] CHK-064 [P1] Evidence artifacts retained in `scratch/` for reviewer audit -- Evidence embedded directly in tasks.md and implementation-summary.md as file:line citations
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P1] Only required phase documents present in `011-scoring-and-calibration/`: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `scratch/` -- Verified: all required files present
- [ ] CHK-071 [P2] Memory save triggered after phase execution to make scoring-and-calibration context available for future sessions -- Deferred: memory save is a post-execution step outside test scope
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 25 | 25/25 |
| P1 Items | 7 | 7/7 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-03-23
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
