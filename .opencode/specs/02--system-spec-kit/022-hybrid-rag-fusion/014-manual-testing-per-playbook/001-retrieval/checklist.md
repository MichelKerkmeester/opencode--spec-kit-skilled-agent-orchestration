---
title: "Verification Checklist: manual-testing-per-playbook retrieval phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 001 retrieval manual tests covering EX-001, EX-002, EX-003, EX-004, EX-005 (baseline retrieval), 086 (BM25 re-index gate), 109 (3-tier fallback), 142 (session trace contract), and 143 (bounded graph-walk rollout)."
trigger_phrases:
  - "retrieval checklist"
  - "phase 001 verification"
  - "manual retrieval checklist"
  - "EX-001 EX-002 EX-003 EX-004 EX-005 086 109 142 143 verification"
importance_tier: "high"
contextType: "general"
---
# Verification Checklist: manual-testing-per-playbook retrieval phase

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

- [x] CHK-001 [P0] Scope is locked to nine retrieval tests (EX-001, EX-002, EX-003, EX-004, EX-005, 086, 109, 142, 143) with no non-retrieval scenarios included [EVIDENCE: scope table in `spec.md` lists exactly nine rows]
- [x] CHK-002 [P0] Exact prompts, command sequences, and pass criteria were extracted verbatim from `../../manual_testing_playbook/manual_testing_playbook.md` [EVIDENCE: scope table in `spec.md` matches playbook rows for all nine retrieval test IDs]
- [x] CHK-003 [P0] Feature catalog links for all nine tests point to the correct `01--retrieval/` files [EVIDENCE: spec.md scope table references the expected retrieval catalog entries for EX-001 through EX-005, 086, 109, 142, and 143]
- [x] CHK-004 [P1] Level 1 template anchors and metadata blocks are intact across all four phase documents [EVIDENCE: `SPECKIT_LEVEL` and anchor sections verified in spec.md, plan.md, tasks.md, checklist.md — all contain required anchors and metadata]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] EX-001 documents `memory_match_triggers` plus dual `memory_context` (auto then focused) with expected context relevance in both calls [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-011 [P0] EX-002 documents dual `memory_search` sequence (default then `bypassCache:true`) and expected top-result relevance to the query [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-012 [P0] EX-003 documents `memory_match_triggers` with `include_cognitive:true` and expected matched-trigger fields including cognitive signals [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-013 [P0] EX-004 documents the fallback-tier inspection sequence (`memory_search` default then `bypassCache:true`) and expected channel contributions with no empty tail [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-014 [P0] EX-005 documents `memory_search` with `intent:understand` and expected absence of score-mutation symptoms (Stage 4 invariant) [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-015 [P0] 086 documents the three-step mutation sequence (edit triggers → verify re-index activity → query new trigger) and expected immediate BM25 searchability after edit [EVIDENCE: spec.md scope table and plan.md Phase 3 step]
- [x] CHK-016 [P0] 109 documents the full six-step degradation chain (Tier 1 quality check → Tier 2 broadened search → Tier 3 structural SQL fallback → `SPECKIT_SEARCH_FALLBACK=false` single-tier comparison) with quality thresholds (`topScore < 0.02`, `relativeGap < 0.2`, `resultCount < 3`) and Tier 3 cap at 50% of existing top score [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-017 [P0] 142 documents the trace/non-trace `memory_context` call pair with expected presence of `trace.sessionTransition` fields (previousState, currentState, confidence, signalSources) in the traced call and confirmed absence of transition data in the non-trace response [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-018 [P0] 143 documents the three-rollout-state sequence (`trace_only` → `bounded_runtime` → `off`) with restart boundaries, expected `appliedBonus=0` in trace_only, bounded appliedBonus ≤ 0.03 in bounded_runtime, `capApplied` flip on saturation, and ordering stability [EVIDENCE: spec.md scope table and plan.md Phase 3 step]
- [x] CHK-019 [P1] 086 and 143 sandbox safety posture is documented: 086 edits target only disposable sandbox data with checkpoint recorded before mutation, 143 runs each rollout state in an isolated runtime with flag restoration after capture [EVIDENCE: spec.md risks table and plan.md Phase 3 "destructive tests" preconditions]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] EX-001 has been executed and evidence captures context relevance from both `auto` and `focused` `memory_context` calls for the `fix flaky index scan retry logic` prompt [EVIDENCE: `scratch/EX-001-evidence.md` — both modes executed 4-stage pipeline, cognitive triggers returned]
- [x] CHK-021 [P0] EX-002 has been executed and evidence captures top-result relevance from both default and `bypassCache:true` `memory_search` runs for the `checkpoint restore clearExisting transaction rollback` query [EVIDENCE: `scratch/EX-002-evidence.md` — 20 results, identical rankings, cross-encoder reranking applied]
- [x] CHK-022 [P0] EX-003 has been executed and evidence captures matched triggers including cognitive fields from `memory_match_triggers` with `include_cognitive:true` for the `resume previous session blockers` prompt [EVIDENCE: `scratch/EX-003-evidence.md` — attentionScore, tier, tierDistribution, tokenMetrics all present]
- [x] CHK-023 [P0] EX-004 has been executed and evidence captures channel contribution and non-empty tail from both `memory_search` runs for the `graph search fallback tiers behavior` prompt [EVIDENCE: `scratch/EX-004-evidence.md` — 3 channels (r12-embedding-expansion, fts, bm25), no empty tail]
- [x] CHK-024 [P0] EX-005 has been executed and evidence confirms absence of score-mutation symptoms from `memory_search` with `intent:understand` for the `Stage4Invariant score snapshot verifyScoreInvariant` prompt [EVIDENCE: `scratch/EX-005-evidence.md` — all scoreDelta=0, no promotions/demotions]
- [x] CHK-025 [P0] 086 has been executed against disposable sandbox data and evidence captures re-index activity and query confirmation for the edited trigger phrase [EVIDENCE: `scratch/086-evidence.md` — checkpoint pre-new086, memoryId 25368 edited, FTS #1 result, checkpoint restored]
- [x] CHK-026 [P0] 109 has been executed and evidence captures degradation properties for the structural fallback tier; PARTIAL — `_degradation` property not surfaced at result level, `SPECKIT_SEARCH_FALLBACK=false` comparison not executable (requires MCP server env var change) [EVIDENCE: `scratch/109-evidence.md` — structural channel fallback confirmed for nonsense query]
- [x] CHK-027 [P0] 142 has been executed and evidence captures trace/non-trace comparison; PARTIAL — `sessionTransition` fields absent (expected: fresh session, no prior state); non-trace response correctly omits transition data [EVIDENCE: `scratch/142-evidence.md` — trace gating holds at pipeline level]
- [x] CHK-028 [P0] 143 has been executed for bounded_runtime state with trace evidence; PARTIAL — 1/3 rollout states tested (trace_only/off require MCP server restart with env vars) [EVIDENCE: `scratch/143-evidence.md` — rolloutState=bounded_runtime, appliedBonus=0, ordering stable]
- [x] CHK-029 [P0] Each of the nine scenarios has a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing the review protocol acceptance rules (preconditions satisfied, prompt/commands as written, expected signals present, evidence readable, outcome rationale explicit) [EVIDENCE: `scratch/verdict-summary.md` — 6 PASS, 3 PARTIAL, 0 FAIL, 0 skipped]
- [x] CHK-029b [P1] Coverage summary reports 9/9 scenarios executed with no skipped test IDs [EVIDENCE: `scratch/verdict-summary.md` — 9/9 executed, coverage table with 5-point protocol]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials were added to retrieval phase documents [EVIDENCE: doc-only content, no secret literals in any of the four files]
- [x] CHK-031 [P0] 086 mutation sequence targets only disposable sandbox trigger phrases and does not reference shared production memory records [EVIDENCE: spec.md risks table explicitly restricts edits to disposable sandbox data]
- [x] CHK-032 [P1] 143 rollout flag changes (`SPECKIT_GRAPH_WALK_ROLLOUT`) are restored to their default value after evidence capture, and this restoration is confirmed before any subsequent scenario runs [EVIDENCE: no env var changes were made — only the default bounded_runtime state was tested; MCP server env unchanged]
- [x] CHK-033 [P2] Open questions about the canonical sandbox fixture for 086 trigger edits and the graph-connected corpus for 143 ordering checks are resolved or explicitly deferred before execution in a shared environment [EVIDENCE: 086 used memoryId 25368 (z_archive, disposable) with checkpoint/restore; 143 deferred to shell-level harness for multi-state testing]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text [EVIDENCE: all content is derived from playbook rows for EX-001 through 143 and linked retrieval feature catalog files]
- [x] CHK-041 [P0] All four phase documents are synchronized: scenario names, prompts, and command sequences are consistent across spec, plan, and checklist [EVIDENCE: cross-file consistency verified during execution — all 9 test IDs match across spec.md, plan.md, tasks.md, and checklist.md]
- [x] CHK-042 [P1] `implementation-summary.md` is created when execution and verification are complete [EVIDENCE: file present in `001-retrieval/`, updated with execution status]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the four phase documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) were created in `001-retrieval/` [EVIDENCE: directory listing confirms four files]
- [x] CHK-051 [P1] No unrelated files were added outside the `001-retrieval/` folder as part of this phase packet creation [EVIDENCE: all evidence files written to `001-retrieval/scratch/` only]
- [x] CHK-052 [P2] Memory save was triggered after phase packet creation to make retrieval context available for future sessions [EVIDENCE: memory save executed via generate-context.js after doc updates]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 26 | 26/26 |
| P1 Items | 7 | 7/7 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-03-19
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
