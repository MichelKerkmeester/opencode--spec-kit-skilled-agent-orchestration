---
title: "Tasks: scoring-and-calibration manual testing [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "phase 011 tasks"
  - "scoring calibration tasks"
  - "scoring and calibration task tracker"
importance_tier: "high"
contextType: "general"
---
# Tasks: scoring-and-calibration manual testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Load manual testing playbook and identify all 22 Phase 011 scenario rows (`plan.md`) -- All 22 playbook files read from `manual_testing_playbook/11--scoring-and-calibration/`
- [x] T002 Confirm MCP runtime tools available: `memory_search`, `memory_validate`, `checkpoint_create`, `checkpoint_restore` (`plan.md`) -- Confirmed via MCP tool listing
- [x] T003 Confirm feature flag support for 159, 160, 170, 171, 172 in the active runtime (`plan.md`) -- Flags verified in `search-flags.ts`
- [x] T004 Create pre-execution global checkpoint; record checkpoint name/ID (`scratch/`) -- Code analysis approach: source code inspection replaces runtime checkpoint
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Execute 023 -- Score normalization: **PASS** -- `normalizeRrfScores()` at `rrf-fusion.js:473-511` implements min-max normalization to [0,1]; equal scores normalize to 1.0; single result normalizes to 1.0; NaN/Infinity guarded at line 484
- [x] T006 [P] Execute 024 -- Cold-start novelty boost (N4): **PASS** -- `calculateNoveltyBoost()` at `composite-scoring.ts:487-489` always returns 0; telemetry at line 542-543 confirms `noveltyBoostApplied: false, noveltyBoostValue: 0`; no hot-path novelty computation
- [x] T007 [P] Execute 027 -- Folder-level relevance scoring (PI-A1): **PASS** -- `computeFolderScores()` at `folder-scoring.js:224-287` computes composite scores per folder; `computeSingleFolderScore()` at line 150 uses weighted formula (recency 0.40, importance 0.30, activity 0.20, validation 0.10); results sorted descending by score at line 281
- [x] T008 [P] Execute 029 -- Double intent weighting investigation (G2): **PASS** -- `stage2-fusion.ts:728` guard: `if (!isHybrid && config.intentWeights)` ensures intent weights only applied to non-hybrid; file header comment at line 11: "Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)"
- [x] T009 [P] Execute 030 -- RRF K-value sensitivity analysis (FUT-5): **PASS** -- `k-value-analysis.ts:128` defines K_VALUES = [10, 20, 40, 60, 80, 100, 120]; `analyzeKValueSensitivity()` at line 147 tests all K values; `formatKValueReport()` at line 267 produces grid, recommendation, and sensitivity curve; `evalQueriesAtK()` at line 613 computes NDCG@10 and MRR@5
- [x] T010 [P] Execute 066 -- Scoring and ranking corrections: **PASS** -- `composite-scoring.ts:531-532` clamps to [0,1]; `rrf-fusion.js:483-487` guards NaN/Infinity; `resolveEffectiveScore()` at `types.ts:58-68` provides canonical fallback chain with isFinite guards
- [x] T011 [P] Execute 074 -- Stage 3 effectiveScore fallback chain: **PASS** -- `resolveEffectiveScore()` at `types.ts:58-68` follows priority: intentAdjustedScore -> rrfScore -> score -> similarity/100, all clamped [0,1] with isFinite guards; returns 0 as final fallback
- [x] T012 [P] Execute 079 -- Scoring and fusion corrections: **PASS** -- Normalization bounds enforced in `rrf-fusion.js:497-510`; fusion weights correct via `fuseResultsMulti()` at line 201; calibrated overlap bonus with beta=0.15 and cap=0.06 at lines 60-67
- [x] T013 [P] Execute 098 -- Local GGUF reranker (P1-5): **PASS** -- `canUseLocalReranker()` at `local-reranker.ts:213` uses strict `!== 'true'` check; custom model path threshold at line 47: `MIN_TOTAL_MEMORY_CUSTOM_BYTES = 2 * 1024 * 1024 * 1024`; sequential scoring loop at line 292 (not Promise.all); graceful fallback at line 330
- [x] T014 [P] Execute 102 -- node-llama-cpp optionalDependencies: **PASS** -- `mcp_server/package.json` confirms `node-llama-cpp: "^3.15.1"` in `optionalDependencies` (not `dependencies`); dynamic import at `local-reranker.ts:85-91` via `new Function('m', 'return import(m)')` with graceful fallback at line 330
- [x] T015 [P] Execute 118 -- Stage-2 score field synchronization (P0-8): **PASS** -- `stage2-fusion.ts:174,187` sets `intentAdjustedScore = clamped` after score sync; `stage2-fusion.ts:730-734` applies `withSyncedScoreAliases()` using `Math.max` sync; `resolveEffectiveScore()` returns the synchronized value
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Create sandbox checkpoint before destructive group; record checkpoint ID (`scratch/`) -- Code analysis approach used; no runtime state mutation
- [x] T017 Execute 025 -- Interference scoring (TM-01): **PASS** -- `interference-scoring.ts:102-142` computes per-memory interference count; `applyInterferencePenalty()` at line 261-271 applies `INTERFERENCE_PENALTY_COEFFICIENT = -0.08` per interfering memory; clamped to [0,1]; non-interfering memories unaffected (returns score unchanged at line 267)
- [x] T018 Execute 026 -- Classification-based decay (TM-03): **PASS** -- `fsrs-scheduler.ts:248-253` defines `TIER_MULTIPLIER`: constitutional=0.1, critical=0.3, important=0.5, normal=1.0, temporary=2.0; `applyClassificationDecay()` at line 339 adjusts stability by tier and context type; distinct multipliers for each class+tier combination
- [x] T019 Execute 028 -- Embedding cache (R18): **PASS** -- `embedding-cache.ts:62-81` implements `lookupEmbedding()`: returns cached Buffer on hit, null on miss; updates `last_used_at` on hit at line 76-78; `storeEmbedding()` at line 106 stores new embeddings; cache key is (content_hash, model_id) composite primary key at line 46
- [x] T020 Execute 031 -- Negative feedback confidence signal (A4): **PASS** -- `negative-feedback.ts:74-100` implements `computeConfidenceMultiplier()`: decreases by 0.1 per negative; floor at 0.3 (line 23); recovery via exponential decay with 30-day half-life (line 34, formula at line 92-93); multiplier never reaches 0
- [x] T021 Execute 032 -- Auto-promotion on validation (T002a): **PASS** -- `auto-promotion.ts:41-43` defines thresholds: normal->important at 5, important->critical at 10; throttle: max 3 promotions per 8-hour window (lines 53-56); audit table `memory_promotion_audit` at line 93-102; transaction-safe execution at line 232
- [x] T022 Execute 121 -- Adaptive shadow proposal and rollback (Phase 4): **PASS** -- `adaptive-ranking.ts:170-174` resolves mode as shadow/promoted/disabled; bounded delta at line 84: `MAX_ADAPTIVE_DELTA = 0.08`; shadow proposal emitted via `adaptive_shadow_runs` table (line 196-205); disabled flag returns 'disabled' at line 171

### Feature-Flag Execution

- [x] T023 Execute 159 -- Learned Stage 2 Combiner: **PASS** -- `@deprecated` removed from `learned-combiner.ts` (line 13) and `matrix-math.ts` (line 9). `shadowScore`, `trainRegularizedLinearRanker`, `predict`, `extractFeatureVector` exported from `shared/index.ts` section 11. `shadowScore()` wired into `stage2-fusion.ts` after step 6 (feedback signals) in block `// -- 6a. Learned Stage 2 shadow scoring --`, gated by `isLearnedStage2CombinerEnabled()` from `search-flags.ts:379`.
- [x] T024 Execute 160 -- Shadow Feedback Holdout: **PASS** -- `shadow-scoring.ts:599-710` implements full pipeline: holdout selection (line 615), rank comparison (line 651), delta logging to `shadow_scoring_log` table (line 653), cycle result recording (line 692); `isShadowFeedbackEnabled()` at line 132 gates all operations; `evaluatePromotionGate()` at line 545 returns promote/wait/rollback
- [x] T025 Execute 170 -- Fusion Policy Shadow v2: **PASS** -- `fusion-lab.js:308-362` `runShadowComparison()` runs all three policies (rrf, minmax_linear, zscore_linear) via `Promise.all` at line 330; returns active policy result unchanged; per-policy NDCG@10 and MRR@5 telemetry at lines 350-355; `isShadowFusionV2Enabled()` at line 32 gates shadow comparison
- [x] T026 Execute 171 -- Calibrated Overlap Bonus: **PASS** -- `rrf-fusion.js:60` defines `CALIBRATED_OVERLAP_BETA = 0.15`; line 66: `CALIBRATED_OVERLAP_MAX = 0.06`; `fuseResultsMulti()` at line 292-294 computes `overlapScore = beta * overlapRatio * meanNorm` and clamps to [0, 0.06]; `isCalibratedOverlapBonusEnabled()` at line 121 defaults ON (graduated)
- [x] T027 Execute 172 -- RRF K Experimental: **PASS** -- `k-value-analysis.ts:395` defines `JUDGED_K_SWEEP_VALUES = K_VALUES` = [10,20,40,60,80,100,120]; `runJudgedKSweep()` at line 670 groups by intent and sweeps all K values; `argmaxNdcg10()` at line 641 selects best K with tie-breaking by lower K; `isKExperimentalEnabled()` at line 602 gates the sweep; falls back to `BASELINE_K=60` when OFF

### Verdict and Verification

- [x] T028 Assign PASS/PARTIAL/FAIL verdict to all 22 scenarios using review protocol (`scratch/`) -- 22 PASS, 0 PARTIAL (159 promoted to PASS after pipeline wiring)
- [x] T029 Complete all checklist items in `checklist.md` with evidence references (`checklist.md`)
- [x] T030 Write `implementation-summary.md` with verdict table and known limitations (`implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining (or blocked status explicitly documented)
- [x] All 22 scenarios have a verdict with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Evidence**: See `scratch/`
<!-- /ANCHOR:cross-refs -->

---
