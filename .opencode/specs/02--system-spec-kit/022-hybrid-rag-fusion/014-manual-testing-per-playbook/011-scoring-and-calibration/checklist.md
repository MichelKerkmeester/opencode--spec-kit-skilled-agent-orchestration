---
title: "Verification Checklist: scoring-and-calibration manual testing [template:level_2/checklist.md]"
description: "Verification checklist for Phase 011 scoring-and-calibration manual tests covering all 22 scenarios: 023-032, 066, 074, 079, 098, 102, 118, 121, 159, 160, 170, 171, 172."
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

- [ ] CHK-001 [P0] Playbook loaded and all 22 Phase 011 scenario rows identified with exact prompts and command sequences
- [ ] CHK-002 [P0] Review protocol loaded and PASS/PARTIAL/FAIL criteria confirmed for all 22 scenarios
- [ ] CHK-003 [P0] MCP runtime available: `memory_search`, `memory_validate`, `checkpoint_create`, `checkpoint_restore` confirmed working
- [ ] CHK-004 [P0] Feature flag support confirmed for 159, 160, 170, 171, 172 in the active runtime
- [ ] CHK-005 [P0] Pre-execution global checkpoint created; checkpoint name/ID recorded
- [ ] CHK-006 [P1] Feature catalog links for all 22 test IDs verified against `11--scoring-and-calibration/` files
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] 023 (Score normalization) executed: all normalized scores confirmed in [0,1]; equal-score and single-result edge cases verified; evidence captured
- [ ] CHK-011 [P0] 024 (Cold-start novelty boost N4) executed: novelty contribution fixed to 0 in all results; no hot-path novelty computation observed; evidence captured
- [ ] CHK-012 [P0] 027 (Folder-level relevance scoring PI-A1) executed: folders ranked first; individual results ordered within folder context; evidence captured
- [ ] CHK-013 [P0] 029 (Double intent weighting G2) executed: hybrid queries skip stage-2 intent weighting; non-hybrid applies it; no double-weight case observed; evidence captured
- [ ] CHK-014 [P0] 030 (RRF K-value sensitivity analysis FUT-5) executed: K-value behavior documented; optimal K or future-capability status documented; evidence captured
- [ ] CHK-015 [P0] 066 (Scoring and ranking corrections) executed: corrections produce expected rank ordering; no anomalous score values; evidence captured
- [ ] CHK-016 [P0] 074 (Stage 3 effectiveScore fallback chain) executed: fallback chain follows correct priority order; valid scores produced for all missing-field combinations; evidence captured
- [ ] CHK-017 [P0] 079 (Scoring and fusion corrections) executed: mathematically correct results with proper normalization bounds; evidence captured
- [ ] CHK-018 [P0] 098 (Local GGUF reranker P1-5) executed or BLOCKED status documented with evidence of host prerequisites check
- [ ] CHK-019 [P0] 102 (node-llama-cpp optionalDependencies) executed: optional dependency installation and dynamic import fallback behavior verified; evidence captured
- [ ] CHK-020 [P0] 118 (Stage-2 score field synchronization P0-8) executed: intentAdjustedScore synchronized with score via Math.max; resolveEffectiveScore returns correct final value; evidence captured
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-030 [P0] Sandbox checkpoint created before destructive group; checkpoint ID recorded
- [ ] CHK-031 [P0] 025 (Interference scoring TM-01) executed: duplicates penalized with lower effective score; non-duplicates retain original scores; sandbox restored; evidence captured
- [ ] CHK-032 [P0] 026 (Classification-based decay TM-03) executed: each class+tier combination produces distinct documented multiplier; sandbox restored; evidence captured
- [ ] CHK-033 [P0] 028 (Embedding cache R18) executed: cache hit skips embedding call; hit updates lastAccessed timestamp; sandbox restored; evidence captured
- [ ] CHK-034 [P0] 031 (Negative feedback confidence signal A4) executed: multiplier decreases with negatives; floor boundary respected; sandbox restored; evidence captured
- [ ] CHK-035 [P0] 032 (Auto-promotion on validation T002a) executed: promotion at correct threshold; throttle blocks re-promotion; audit row created; sandbox restored; evidence captured
- [ ] CHK-036 [P0] 121 (Adaptive shadow proposal and rollback Phase 4) executed: shadow proposal emitted without mutating live order; disable flag removes proposal cleanly; sandbox restored; evidence captured

### Scenario Execution — Feature-Flag (5 scenarios)

- [ ] CHK-040 [P0] 159 (Learned Stage 2 Combiner): flag ON pass — shadow scoring output emitted alongside live combiner, live ranking unaffected; flag OFF pass — no shadow output; evidence captured
- [ ] CHK-041 [P0] 160 (Shadow Feedback Holdout): flag ON pass — holdout pipeline runs on configured percentage, logged separately from live results; flag OFF pass — no holdout runs; evidence captured
- [ ] CHK-042 [P0] 170 (Fusion Policy Shadow v2): flag ON pass — Fusion Lab runs all three policies in shadow, active policy result returned unchanged; flag OFF pass — no shadow policy comparison; evidence captured
- [ ] CHK-043 [P0] 171 (Calibrated Overlap Bonus): flag ON pass — calibrated bonus with beta=0.15 and 0.06 cap replaces flat bonus; flag OFF pass — prior behavior unchanged; evidence captured
- [ ] CHK-044 [P0] 172 (RRF K Experimental): flag ON pass — per-intent K sweep runs and winning K recorded with NDCG@10 evidence; flag OFF pass — no sweep runs; evidence captured
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-050 [P0] No secrets, API keys, or credentials appear in any Phase 011 document or evidence artifact
- [ ] CHK-051 [P1] Sandbox execution for destructive scenarios uses an isolated fixture or MCP checkpoint; no shared production state is mutated
- [ ] CHK-052 [P1] Feature flags for 159, 160, 170, 171, 172 are restored to default (OFF) after each flag-toggle test pass
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P0] All 22 scenarios have a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing review protocol acceptance rules
- [ ] CHK-061 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text
- [ ] CHK-062 [P0] `spec.md` scope table includes all 22 test IDs with correct feature catalog relative paths under `../../feature_catalog/11--scoring-and-calibration/`
- [ ] CHK-063 [P1] `implementation-summary.md` completed with verdict summary table after execution is done
- [ ] CHK-064 [P1] Evidence artifacts retained in `scratch/` for reviewer audit
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] Only required phase documents present in `011-scoring-and-calibration/`: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, `scratch/`
- [ ] CHK-071 [P2] Memory save triggered after phase execution to make scoring-and-calibration context available for future sessions
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 25 | 0/25 |
| P1 Items | 7 | 0/7 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not Started
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
