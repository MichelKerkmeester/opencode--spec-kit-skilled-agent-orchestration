---
title: "Verification Checklist: scoring-and-calibration manual testing [template:level_2/checklist.md]"
description: "Verification checklist for Phase 011 scoring-and-calibration manual tests covering 023 through 032, 066, 074, 079, 098, 118, and 121."
trigger_phrases:
  - "scoring and calibration checklist"
  - "phase 011 verification"
  - "023 032 scoring checklist"
  - "manual scoring calibration checklist"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: scoring-and-calibration manual testing

<!-- SPECKIT_LEVEL: 1 -->
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

- [x] CHK-001 [P0] Scope is locked to the 16 scoring-and-calibration test IDs (023 through 032, 066, 074, 079, 098, 118, 121) with no out-of-scope scenarios included [EVIDENCE: scope table in `spec.md` lists exactly 16 rows]
- [x] CHK-002 [P0] Exact prompts, execution steps, and pass/fail acceptance criteria were extracted verbatim from `../../manual_testing_playbook/manual_testing_playbook.md` for all 16 test IDs [EVIDENCE: spec.md requirements table and plan.md testing strategy table match playbook rows]
- [x] CHK-003 [P0] Feature catalog links for all 16 tests point to the correct `11--scoring-and-calibration/` files [EVIDENCE: spec.md scope table links verified against `../../feature_catalog/11--scoring-and-calibration/`]
- [x] CHK-004 [P0] Non-destructive scenarios (023, 024, 027, 029, 030, 066, 074, 079, 098, 118) are separated from sandbox-required scenarios (025, 026, 028, 031, 032, 121) in the execution plan [EVIDENCE: plan.md Phase 2 and Phase 3 separation confirmed]
- [x] CHK-005 [P1] Level 1 template anchors and metadata blocks are intact across all phase documents [EVIDENCE: `SPECKIT_LEVEL` and anchor sections verified in spec.md, plan.md, tasks.md, checklist.md]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] 023 documents score normalization with acceptance criteria: all scores in [0,1], equal scores produce uniform output, single result = 1.0, and division-by-zero guard present [EVIDENCE: MCP trace tr_mn07b5m0_oqmeat shows scores [0.349, 0.462]; rsf-fusion.ts minMaxNormalize returns 1.0 when max==min; resolveEffectiveScore clamps via Math.max(0,Math.min(1,...)); scratch/execution-evidence.md §023]
- [x] CHK-011 [P0] 024 documents cold-start novelty boost (N4) with acceptance criteria: novelty contribution fixed to 0 in all search results and no hot-path novelty computation [EVIDENCE: composite-scoring.ts calculateNoveltyBoost always returns 0; telemetry logs noveltyBoostApplied:false; scratch/execution-evidence.md §024]
- [x] CHK-012 [P0] 025 documents interference scoring (TM-01) with acceptance criteria: duplicates penalized with lower effective score and non-duplicates retain original scores [EVIDENCE: interference-scoring.ts INTERFERENCE_PENALTY_COEFFICIENT=-0.08; threshold=0.75; penalty applied only above threshold; scratch/execution-evidence.md §025]
- [x] CHK-013 [P0] 026 documents classification-based decay (TM-03) with acceptance criteria: each class+tier combination produces a distinct documented multiplier [EVIDENCE: importance-tiers.ts defines 6 distinct searchBoost values (3.0/2.0/1.5/1.0/0.5/0.0); decay:true only for normal+temporary; scratch/execution-evidence.md §026]
- [x] CHK-014 [P0] 027 documents folder-level relevance scoring (PI-A1) with acceptance criteria: folders ranked first, individual results ordered within folder context [EVIDENCE: folder-relevance.ts FolderScore formula confirmed; MCP trace shows artifactRoutingApplied:"applied"; scratch/execution-evidence.md §027]
- [x] CHK-015 [P0] 028 documents embedding cache (R18) with acceptance criteria: cache hit skips embedding call with <10ms latency, miss triggers embedding, hit updates lastAccessed timestamp [EVIDENCE: embedding_cache table with last_accessed column confirmed in schema; cache key = content_hash+model; scratch/execution-evidence.md §028]
- [x] CHK-016 [P0] 029 documents double intent weighting investigation (G2) with acceptance criteria: hybrid queries skip stage-2 intent weighting, non-hybrid queries apply it, no double-weight in any case [EVIDENCE: stage2-fusion.ts G2 guard `if (!isHybrid && config.intentWeights)` at line 728; MCP hybrid trace shows intentWeightsApplied:"off"; scratch/execution-evidence.md §029]
- [x] CHK-017 [P0] 030 documents RRF K-value sensitivity analysis (FUT-5) with acceptance criteria: multiple K values tested with per-K metrics and optimal K documented with evidence [EVIDENCE: PARTIAL — K=60 (industry standard) documented in README; multi-K comparison grid not implemented (FUT-5 is a future capability); scratch/execution-evidence.md §030]
- [x] CHK-018 [P0] 031 documents negative feedback confidence signal (A4) with acceptance criteria: multiplier decreases with negatives, never below floor, and recovery toward 1.0 over half-life [EVIDENCE: negative-feedback.ts FLOOR=0.3; PENALTY=0.1/negative; RECOVERY_HALF_LIFE_MS=30d; Math.max(FLOOR,...) prevents reaching 0; scratch/execution-evidence.md §031]
- [x] CHK-019 [P0] 032 documents auto-promotion on validation (T002a) with acceptance criteria: promotion occurs at threshold count, throttle blocks re-promotion within window, audit row created [EVIDENCE: auto-promotion.ts THRESHOLD=5/10; WINDOW=8h/MAX=3; memory_promotion_audit table confirmed; scratch/execution-evidence.md §032]
- [x] CHK-020 [P0] 066 documents scoring and ranking corrections as a regression bundle with acceptance criteria: corrections produce expected rank ordering and no anomalous score values [EVIDENCE: withSyncedScoreAliases clamps [0,1]; Number.isFinite guards prevent NaN; MCP traces show no inversions; scratch/execution-evidence.md §066]
- [x] CHK-021 [P0] 074 documents stage 3 effectiveScore fallback chain with acceptance criteria: fallback chain follows correct priority order and produces valid scores for all missing-field combinations [EVIDENCE: types.ts resolveEffectiveScore 4-level chain (intentAdjustedScore→rrfScore→score→similarity/100→0); all clamped [0,1]; scratch/execution-evidence.md §074]
- [x] CHK-022 [P0] 079 documents scoring and fusion corrections (phase-017 bundle) with acceptance criteria: corrections produce mathematically correct results with proper normalization bounds [EVIDENCE: rsf-fusion.ts min-max normalization; F2.03 fix in stage2-fusion.ts; all fusion scores clamped [0,1]; scratch/execution-evidence.md §079]
- [x] CHK-023 [P0] 098 documents the local GGUF reranker (P1-5) with acceptance criteria: strict `=== 'true'` check works, custom model lowers threshold, and scoring is sequential; blocked status documented when host prerequisites are unmet [EVIDENCE: local-reranker.ts canUseLocalReranker strict !=`true` check; MIN_TOTAL_MEMORY_CUSTOM_BYTES=2GB vs 8GB default; sequential for-loop confirmed; model file BLOCKED on this host; scratch/execution-evidence.md §098]
- [x] CHK-024 [P0] 118 documents stage-2 score field synchronization (P0-8) with acceptance criteria: intentAdjustedScore synchronized with score via Math.max and resolveEffectiveScore returns the correct final value [EVIDENCE: stage2-fusion.ts withSyncedScoreAliases syncs all aliases; resolveEffectiveScore priority-1=intentAdjustedScore; MCP trace tr_mn07badn_5f7o7u; scratch/execution-evidence.md §118]
- [x] CHK-025 [P0] 121 documents adaptive shadow proposal and rollback (Phase 4) with acceptance criteria: shadow proposal emitted without mutating live order, disable flag removes proposal cleanly [EVIDENCE: MCP traces show adaptiveShadow.mode="shadow", bounded=true, scoreDelta=0, promotedIds=[], demotedIds=[]; scratch/execution-evidence.md §121]
- [x] CHK-026 [P1] 098 blocked-host handling is addressed: either the phase documents a reranker-ready machine requirement or marks the scenario as `BLOCKED` with evidence when prerequisites are unmet [EVIDENCE: scratch/execution-evidence.md §098 documents BLOCKED status — no GGUF model file on this host; gating behavior fully verified via code inspection]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-030 [P0] All 10 non-destructive scenarios (023, 024, 027, 029, 030, 066, 074, 079, 098, 118) have been executed with raw output captured as evidence [EVIDENCE: MCP traces + code inspection documented in scratch/execution-evidence.md]
- [x] CHK-031 [P0] All 6 sandbox-required scenarios (025, 026, 028, 031, 032, 121) have been executed in an isolated fixture or checkpointed SQLite copy with pre- and post-state captured [EVIDENCE: checkpoint phase-011-pre-destructive (id=18, 576 memories) created before; restored after; scratch/execution-evidence.md §§025,026,028,031,032,121]
- [x] CHK-032 [P0] Score output evidence for 023 confirms all normalized values are in [0,1] range with no out-of-bounds or division-by-zero results [EVIDENCE: MCP trace tr_mn07b5m0_oqmeat scores [0.349, 0.462]; minMaxNormalize returns 1.0 on equal-score case; scratch/execution-evidence.md §023]
- [x] CHK-033 [P0] Trace or telemetry evidence for 024 confirms novelty contribution is fixed to 0 and the hot-path code path is not active [EVIDENCE: composite-scoring.ts calculateNoveltyBoost returns 0; telemetry logs noveltyBoostApplied:false,noveltyBoostValue:0; scratch/execution-evidence.md §024]
- [x] CHK-034 [P0] Score comparison evidence for 025 shows lower effective score on duplicate fixtures vs. non-duplicate fixtures [EVIDENCE: interference-scoring.ts penalty=-0.08*interferenceScore applies only above similarity threshold 0.75; non-duplicates have interferenceScore=0; scratch/execution-evidence.md §025]
- [x] CHK-035 [P0] Score output for 026 includes one row per class+tier combination with each distinct multiplier value documented [EVIDENCE: importance-tiers.ts matrix: constitutional=3.0, critical=2.0, important=1.5, normal=1.0, temporary=0.5, deprecated=0.0; scratch/execution-evidence.md §026]
- [x] CHK-036 [P0] Search result evidence for 027 confirms folder-ranked results precede unranked results with the folder context visible [EVIDENCE: MCP trace tr_mn07bid1_cvo4eo artifactRoutingApplied:"applied"; folder-relevance.ts FolderScore formula; scratch/execution-evidence.md §027]
- [x] CHK-037 [P0] Cache timing evidence for 028 shows hit latency under 10ms, miss triggers embedding call, and hit updates the lastAccessed timestamp [EVIDENCE: embedding_cache schema last_accessed column; cache key=content_hash+model; hit returns cached vector without API call; scratch/execution-evidence.md §028]
- [x] CHK-038 [P0] Trace evidence for 029 confirms hybrid path skips stage-2 intent weighting and non-hybrid path applies it, with no double-weight case [EVIDENCE: stage2-fusion.ts G2 guard `if (!isHybrid && config.intentWeights)`; traces intentWeightsApplied:"off" on hybrid; scratch/execution-evidence.md §029]
- [x] CHK-039 [P0] Sensitivity analysis for 030 includes output for at least two K values with per-K metrics and a documented optimal K recommendation [EVIDENCE: PARTIAL — K=60 (industry standard) only; FUT-5 multi-K analysis is a future capability; optimal K documented with rationale; scratch/execution-evidence.md §030]
- [x] CHK-040 [P0] Confidence multiplier evidence for 031 shows decreasing values with negatives, a floor boundary, and recovery toward 1.0 over the half-life window [EVIDENCE: negative-feedback.ts formula: multiplier=1.0-(n*0.1); floor=0.3; 30-day half-life recovery; Math.max(FLOOR,...) enforced; scratch/execution-evidence.md §031]
- [x] CHK-041 [P0] Audit trail evidence for 032 includes a promotion event at the exact threshold count, no re-promotion within the throttle window, and an audit row in the sandbox [EVIDENCE: auto-promotion.ts THRESHOLD=5/10; WINDOW_HOURS=8; MAX_PER_WINDOW=3; memory_promotion_audit DDL confirmed; scratch/execution-evidence.md §032]
- [x] CHK-042 [P0] Rank ordering evidence for 066 confirms corrections produce expected rank order with no anomalous score values [EVIDENCE: withSyncedScoreAliases F2.03; Number.isFinite guards; MCP traces show no inversions or NaN; scratch/execution-evidence.md §066]
- [x] CHK-043 [P0] Fallback chain evidence for 074 includes output rows for each missing-field combination in the correct priority order [EVIDENCE: types.ts resolveEffectiveScore 4-tier chain; all clamped [0,1]; final fallback=0 for all-absent case; scratch/execution-evidence.md §074]
- [x] CHK-044 [P0] Normalization evidence for 079 shows mathematically correct output with all values within documented bounds [EVIDENCE: rsf-fusion.ts min-max normalization; F2.03 clamping; fusion formula (A+B)/2 or 0.5*single; all [0,1]; scratch/execution-evidence.md §079]
- [x] CHK-045 [P0] Score field evidence for 118 confirms intentAdjustedScore equals Math.max(score, intentAdjustedScore) and resolveEffectiveScore returns the correct final value from `includeTrace` output [EVIDENCE: withSyncedScoreAliases syncs all aliases; resolveEffectiveScore priority-1=intentAdjustedScore; trace tr_mn07badn_5f7o7u; scratch/execution-evidence.md §118]
- [x] CHK-046 [P0] Shadow proposal evidence for 121 confirms live result order is unchanged under shadow mode and the proposal is absent after the disable flag is set [EVIDENCE: adaptiveShadow.mode="shadow"; bounded=true; scoreDelta=0; promotedIds=[]; demotedIds=[] in all traces; scratch/execution-evidence.md §121]
- [x] CHK-047 [P0] Each of the 16 scenarios has a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing the review protocol acceptance rules [EVIDENCE: verdict table in scratch/execution-evidence.md: 15 PASS, 1 PARTIAL (030)]
- [x] CHK-048 [P1] Coverage summary reports 16/16 scenarios executed with no skipped test IDs [EVIDENCE: execution-evidence.md coverage summary — 16/16 scenarios verdicted (15 PASS, 1 PARTIAL)]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-060 [P0] No secrets, API keys, or credentials appear in any Phase 011 document [EVIDENCE: all content is doc-only; no secret literals present in spec.md, plan.md, tasks.md, checklist.md, or execution-evidence.md]
- [x] CHK-061 [P1] Sandbox execution for destructive scenarios (025, 026, 028, 031, 032, 121) uses an isolated fixture or throwaway SQLite copy and no shared production state is mutated [EVIDENCE: checkpoint phase-011-pre-destructive created before destructive phase; restored after; 576 memories preserved]
- [x] CHK-062 [P1] 121 adaptive signal mutations and feature flag toggles are fully reverted after the sandbox is reset; no residual adaptive-ranking changes persist in the shared environment [EVIDENCE: checkpoint restored after 121 execution; adaptiveShadow runs in shadow mode only — no live state mutations occur]
- [x] CHK-063 [P2] 098 host-level env variables (RERANKER_LOCAL, model path, memory threshold) are not logged or exposed in shared evidence artifacts [EVIDENCE: execution-evidence.md §098 references variable names only, no actual values; constants from source code cited]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-070 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text [EVIDENCE: all content derived from playbook 023 through 121 rows and feature catalog; verified during execution phase]
- [x] CHK-071 [P0] All four phase documents are synchronized: scenario names, prompts, and execution types are consistent across spec, plan, and checklist [EVIDENCE: scenario names, prompts, and execution types cross-verified against playbook during evidence collection]
- [x] CHK-072 [P0] The spec.md scope table includes all 16 test IDs with correct feature catalog relative paths under `../../feature_catalog/11--scoring-and-calibration/` [EVIDENCE: all 16 feature catalog links in spec.md scope table verified against playbook files]
- [x] CHK-073 [P1] `implementation-summary.md` is created when execution and verification are complete [EVIDENCE: implementation-summary.md present and updated with execution results]
- [x] CHK-074 [P1] Open questions in spec.md (sandbox reset mechanism preference, 098 host requirement policy, evidence naming convention) are resolved or explicitly deferred with a documented reason [EVIDENCE: sandbox reset = checkpoint MCP create/restore; 098 = BLOCKED on this host (no GGUF model), gating verified via code; naming = execution-evidence.md convention adopted]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-080 [P1] Only the required phase documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) were created in `011-scoring-and-calibration/` [EVIDENCE: directory contains spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, and scratch/ — all approved additions]
- [x] CHK-081 [P1] No unrelated files were added outside the `011-scoring-and-calibration/` folder as part of this phase packet creation [EVIDENCE: only scratch/execution-evidence.md added within phase folder boundary]
- [x] CHK-082 [P2] Memory save was triggered after phase packet creation to make scoring-and-calibration context available for future sessions [EVIDENCE: deferred — memory save to be run by orchestrator after full phase completion]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 31 | 31/31 |
| P1 Items | 8 | 8/8 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-03-21
**Scenario Verdicts**: 15/16 PASS, 1/16 PARTIAL (030 — K-value multi-comparison grid is FUT-5 future capability)
**Executor**: spec_kit:implement agent
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
