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

- [ ] CHK-001 [P0] Scope is locked to the 16 scoring-and-calibration test IDs (023 through 032, 066, 074, 079, 098, 118, 121) with no out-of-scope scenarios included [EVIDENCE: scope table in `spec.md` lists exactly 16 rows]
- [ ] CHK-002 [P0] Exact prompts, execution steps, and pass/fail acceptance criteria were extracted verbatim from `../../manual_testing_playbook/manual_testing_playbook.md` for all 16 test IDs [EVIDENCE: spec.md requirements table and plan.md testing strategy table match playbook rows]
- [ ] CHK-003 [P0] Feature catalog links for all 16 tests point to the correct `11--scoring-and-calibration/` files [EVIDENCE: spec.md scope table links verified against `../../feature_catalog/11--scoring-and-calibration/`]
- [ ] CHK-004 [P0] Non-destructive scenarios (023, 024, 027, 029, 030, 066, 074, 079, 098, 118) are separated from sandbox-required scenarios (025, 026, 028, 031, 032, 121) in the execution plan [EVIDENCE: plan.md Phase 2 and Phase 3 separation confirmed]
- [ ] CHK-005 [P1] Level 1 template anchors and metadata blocks are intact across all phase documents [EVIDENCE: `SPECKIT_LEVEL` and anchor sections verified in spec.md, plan.md, tasks.md, checklist.md]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] 023 documents score normalization with acceptance criteria: all scores in [0,1], equal scores produce uniform output, single result = 1.0, and division-by-zero guard present [EVIDENCE: spec.md REQ-023 acceptance criteria and plan.md 023 row]
- [ ] CHK-011 [P0] 024 documents cold-start novelty boost (N4) with acceptance criteria: novelty contribution fixed to 0 in all search results and no hot-path novelty computation [EVIDENCE: spec.md REQ-024 and plan.md 024 row confirm manual execution type]
- [ ] CHK-012 [P0] 025 documents interference scoring (TM-01) with acceptance criteria: duplicates penalized with lower effective score and non-duplicates retain original scores [EVIDENCE: spec.md REQ-025 and plan.md 025 sandbox flag]
- [ ] CHK-013 [P0] 026 documents classification-based decay (TM-03) with acceptance criteria: each class+tier combination produces a distinct documented multiplier [EVIDENCE: spec.md REQ-026 and plan.md 026 sandbox flag]
- [ ] CHK-014 [P0] 027 documents folder-level relevance scoring (PI-A1) with acceptance criteria: folders ranked first, individual results ordered within folder context [EVIDENCE: spec.md REQ-027 and plan.md 027 row]
- [ ] CHK-015 [P0] 028 documents embedding cache (R18) with acceptance criteria: cache hit skips embedding call with <10ms latency, miss triggers embedding, hit updates lastAccessed timestamp [EVIDENCE: spec.md REQ-028 and plan.md 028 sandbox flag]
- [ ] CHK-016 [P0] 029 documents double intent weighting investigation (G2) with acceptance criteria: hybrid queries skip stage-2 intent weighting, non-hybrid queries apply it, no double-weight in any case [EVIDENCE: spec.md REQ-029 and plan.md 029 row]
- [ ] CHK-017 [P0] 030 documents RRF K-value sensitivity analysis (FUT-5) with acceptance criteria: multiple K values tested with per-K metrics and optimal K documented with evidence [EVIDENCE: spec.md REQ-030 and plan.md 030 row]
- [ ] CHK-018 [P0] 031 documents negative feedback confidence signal (A4) with acceptance criteria: multiplier decreases with negatives, never below floor, and recovery toward 1.0 over half-life [EVIDENCE: spec.md REQ-031 and plan.md 031 sandbox flag]
- [ ] CHK-019 [P0] 032 documents auto-promotion on validation (T002a) with acceptance criteria: promotion occurs at threshold count, throttle blocks re-promotion within window, audit row created [EVIDENCE: spec.md REQ-032 and plan.md 032 sandbox flag]
- [ ] CHK-020 [P0] 066 documents scoring and ranking corrections as a regression bundle with acceptance criteria: corrections produce expected rank ordering and no anomalous score values [EVIDENCE: spec.md REQ-066 and plan.md 066 row]
- [ ] CHK-021 [P0] 074 documents stage 3 effectiveScore fallback chain with acceptance criteria: fallback chain follows correct priority order and produces valid scores for all missing-field combinations [EVIDENCE: spec.md REQ-074 and plan.md 074 row]
- [ ] CHK-022 [P0] 079 documents scoring and fusion corrections (phase-017 bundle) with acceptance criteria: corrections produce mathematically correct results with proper normalization bounds [EVIDENCE: spec.md REQ-079 and plan.md 079 row]
- [ ] CHK-023 [P0] 098 documents the local GGUF reranker (P1-5) with acceptance criteria: strict `=== 'true'` check works, custom model lowers threshold, and scoring is sequential; blocked status documented when host prerequisites are unmet [EVIDENCE: spec.md REQ-098, open questions, and plan.md 098 row]
- [ ] CHK-024 [P0] 118 documents stage-2 score field synchronization (P0-8) with acceptance criteria: intentAdjustedScore synchronized with score via Math.max and resolveEffectiveScore returns the correct final value [EVIDENCE: spec.md REQ-118 and plan.md 118 row with `includeTrace:true` requirement]
- [ ] CHK-025 [P0] 121 documents adaptive shadow proposal and rollback (Phase 4) with acceptance criteria: shadow proposal emitted without mutating live order, disable flag removes proposal cleanly [EVIDENCE: spec.md REQ-121 and plan.md 121 sandbox flag]
- [ ] CHK-026 [P1] 098 blocked-host handling is addressed: either the phase documents a reranker-ready machine requirement or marks the scenario as `BLOCKED` with evidence when prerequisites are unmet [EVIDENCE: open questions in spec.md answered or escalated]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] All 10 non-destructive scenarios (023, 024, 027, 029, 030, 066, 074, 079, 098, 118) have been executed with raw output captured as evidence [EVIDENCE: execution logs attached per scenario]
- [ ] CHK-031 [P0] All 6 sandbox-required scenarios (025, 026, 028, 031, 032, 121) have been executed in an isolated fixture or checkpointed SQLite copy with pre- and post-state captured [EVIDENCE: sandbox execution logs and reset confirmation attached]
- [ ] CHK-032 [P0] Score output evidence for 023 confirms all normalized values are in [0,1] range with no out-of-bounds or division-by-zero results [EVIDENCE: score range output captured]
- [ ] CHK-033 [P0] Trace or telemetry evidence for 024 confirms novelty contribution is fixed to 0 and the hot-path code path is not active [EVIDENCE: trace or code inspection log attached]
- [ ] CHK-034 [P0] Score comparison evidence for 025 shows lower effective score on duplicate fixtures vs. non-duplicate fixtures [EVIDENCE: before/after score comparison attached]
- [ ] CHK-035 [P0] Score output for 026 includes one row per class+tier combination with each distinct multiplier value documented [EVIDENCE: multiplier matrix comparison attached]
- [ ] CHK-036 [P0] Search result evidence for 027 confirms folder-ranked results precede unranked results with the folder context visible [EVIDENCE: ranked result output captured]
- [ ] CHK-037 [P0] Cache timing evidence for 028 shows hit latency under 10ms, miss triggers embedding call, and hit updates the lastAccessed timestamp [EVIDENCE: cache timing log and timestamp comparison attached]
- [ ] CHK-038 [P0] Trace evidence for 029 confirms hybrid path skips stage-2 intent weighting and non-hybrid path applies it, with no double-weight case [EVIDENCE: trace capture for both paths attached]
- [ ] CHK-039 [P0] Sensitivity analysis for 030 includes output for at least two K values with per-K metrics and a documented optimal K recommendation [EVIDENCE: K-comparison output attached]
- [ ] CHK-040 [P0] Confidence multiplier evidence for 031 shows decreasing values with negatives, a floor boundary, and recovery toward 1.0 over the half-life window [EVIDENCE: multiplier progression log attached]
- [ ] CHK-041 [P0] Audit trail evidence for 032 includes a promotion event at the exact threshold count, no re-promotion within the throttle window, and an audit row in the sandbox [EVIDENCE: audit log attached]
- [ ] CHK-042 [P0] Rank ordering evidence for 066 confirms corrections produce expected rank order with no anomalous score values [EVIDENCE: before/after rank comparison attached]
- [ ] CHK-043 [P0] Fallback chain evidence for 074 includes output rows for each missing-field combination in the correct priority order [EVIDENCE: fallback trace attached]
- [ ] CHK-044 [P0] Normalization evidence for 079 shows mathematically correct output with all values within documented bounds [EVIDENCE: normalization output attached]
- [ ] CHK-045 [P0] Score field evidence for 118 confirms intentAdjustedScore equals Math.max(score, intentAdjustedScore) and resolveEffectiveScore returns the correct final value from `includeTrace` output [EVIDENCE: trace output attached]
- [ ] CHK-046 [P0] Shadow proposal evidence for 121 confirms live result order is unchanged under shadow mode and the proposal is absent after the disable flag is set [EVIDENCE: before/after order comparison and flag-reset confirmation attached]
- [ ] CHK-047 [P0] Each of the 16 scenarios has a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing the review protocol acceptance rules [EVIDENCE: verdict table or inline verdict notes present]
- [ ] CHK-048 [P1] Coverage summary reports 16/16 scenarios executed with no skipped test IDs [EVIDENCE: phase closeout note or implementation-summary.md]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-060 [P0] No secrets, API keys, or credentials appear in any Phase 011 document [EVIDENCE: doc-only content; no secret literals in spec.md, plan.md, tasks.md, checklist.md]
- [ ] CHK-061 [P1] Sandbox execution for destructive scenarios (025, 026, 028, 031, 032, 121) uses an isolated fixture or throwaway SQLite copy and no shared production state is mutated [EVIDENCE: sandbox isolation confirmed in execution notes]
- [ ] CHK-062 [P1] 121 adaptive signal mutations and feature flag toggles are fully reverted after the sandbox is reset; no residual adaptive-ranking changes persist in the shared environment [EVIDENCE: post-test state verification log attached]
- [ ] CHK-063 [P2] 098 host-level env variables (RERANKER_LOCAL, model path, memory threshold) are not logged or exposed in shared evidence artifacts [EVIDENCE: evidence artifacts reviewed for env variable exposure]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-070 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text [EVIDENCE: all content derived from playbook 023 through 121 rows and feature catalog]
- [ ] CHK-071 [P0] All four phase documents are synchronized: scenario names, prompts, and execution types are consistent across spec, plan, and checklist [EVIDENCE: cross-file consistency pass completed]
- [ ] CHK-072 [P0] The spec.md scope table includes all 16 test IDs with correct feature catalog relative paths under `../../feature_catalog/11--scoring-and-calibration/` [EVIDENCE: link audit passed]
- [ ] CHK-073 [P1] `implementation-summary.md` is created when execution and verification are complete [EVIDENCE: file present in `011-scoring-and-calibration/`]
- [ ] CHK-074 [P1] Open questions in spec.md (sandbox reset mechanism preference, 098 host requirement policy, evidence naming convention) are resolved or explicitly deferred with a documented reason [EVIDENCE: open questions section updated]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-080 [P1] Only the required phase documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) were created in `011-scoring-and-calibration/` [EVIDENCE: directory listing confirms exactly four files plus any approved additions]
- [ ] CHK-081 [P1] No unrelated files were added outside the `011-scoring-and-calibration/` folder as part of this phase packet creation [EVIDENCE: git status confirms scope]
- [ ] CHK-082 [P2] Memory save was triggered after phase packet creation to make scoring-and-calibration context available for future sessions [EVIDENCE: `/memory:save` run or deferred with documented reason]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 31 | 0/31 |
| P1 Items | 8 | 0/8 |
| P2 Items | 2 | 0/2 |

**Verification Date**: (pending execution)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
