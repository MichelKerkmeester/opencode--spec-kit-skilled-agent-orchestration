---
title: "Verification Checklist: manual-testing-per-playbook retrieval phase [template:level_2/checklist.md]"
description: "Verification checklist for Phase 001 retrieval manual tests covering EX-001, EX-002, EX-003, EX-004, EX-005 (baseline retrieval), NEW-086 (BM25 re-index gate), NEW-109 (3-tier fallback), NEW-142 (session trace contract), and NEW-143 (bounded graph-walk rollout)."
trigger_phrases:
  - "retrieval checklist"
  - "phase 001 verification"
  - "manual retrieval checklist"
  - "EX-001 EX-002 EX-003 EX-004 EX-005 NEW-086 NEW-109 NEW-142 NEW-143 verification"
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

- [x] CHK-001 [P0] Scope is locked to nine retrieval tests (EX-001, EX-002, EX-003, EX-004, EX-005, NEW-086, NEW-109, NEW-142, NEW-143) with no non-retrieval scenarios included [EVIDENCE: scope table in `spec.md` lists exactly nine rows]
- [x] CHK-002 [P0] Exact prompts, command sequences, and pass criteria were extracted verbatim from `../../manual_testing_playbook/manual_testing_playbook.md` [EVIDENCE: scope table in `spec.md` matches playbook rows for all nine retrieval test IDs]
- [x] CHK-003 [P0] Feature catalog links for all nine tests point to the correct `01--retrieval/` files [EVIDENCE: spec.md links `01-unified-context-retrieval-memorycontext.md`, `02-semantic-and-lexical-search-memorysearch.md`, `03-trigger-phrase-matching-memorymatchtriggers.md`, `04-hybrid-search-pipeline.md`, `05-4-stage-pipeline-architecture.md`, `06-bm25-trigger-phrase-re-index-gate.md`, `08-quality-aware-3-tier-search-fallback.md` (for NEW-109 and NEW-143)]
- [ ] CHK-004 [P1] Level 1 template anchors and metadata blocks are intact across all four phase documents [EVIDENCE: `SPECKIT_LEVEL` and anchor sections verified in spec.md, plan.md, tasks.md, checklist.md]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] EX-001 documents `memory_match_triggers` plus dual `memory_context` (auto then focused) with expected context relevance in both calls [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-011 [P0] EX-002 documents dual `memory_search` sequence (default then `bypassCache:true`) and expected top-result relevance to the query [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-012 [P0] EX-003 documents `memory_match_triggers` with `include_cognitive:true` and expected matched-trigger fields including cognitive signals [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-013 [P0] EX-004 documents the fallback-tier inspection sequence (`memory_search` default then `bypassCache:true`) and expected channel contributions with no empty tail [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-014 [P0] EX-005 documents `memory_search` with `intent:understand` and expected absence of score-mutation symptoms (Stage 4 invariant) [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-015 [P0] NEW-086 documents the three-step mutation sequence (edit triggers → verify re-index activity → query new trigger) and expected immediate BM25 searchability after edit [EVIDENCE: spec.md scope table and plan.md Phase 3 step]
- [x] CHK-016 [P0] NEW-109 documents the full six-step degradation chain (Tier 1 quality check → Tier 2 broadened search → Tier 3 structural SQL fallback → `SPECKIT_SEARCH_FALLBACK=false` single-tier comparison) with quality thresholds (`topScore < 0.02`, `relativeGap < 0.2`, `resultCount < 3`) and Tier 3 cap at 50% of existing top score [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-017 [P0] NEW-142 documents the trace/non-trace `memory_context` call pair with expected presence of `trace.sessionTransition` fields (previousState, currentState, confidence, signalSources) in the traced call and confirmed absence of transition data in the non-trace response [EVIDENCE: spec.md scope table and plan.md Phase 2 step]
- [x] CHK-018 [P0] NEW-143 documents the three-rollout-state sequence (`trace_only` → `bounded_runtime` → `off`) with restart boundaries, expected `appliedBonus=0` in trace_only, bounded appliedBonus ≤ 0.03 in bounded_runtime, `capApplied` flip on saturation, and ordering stability [EVIDENCE: spec.md scope table and plan.md Phase 3 step]
- [x] CHK-019 [P1] NEW-086 and NEW-143 sandbox safety posture is documented: NEW-086 edits target only disposable sandbox data with checkpoint recorded before mutation, NEW-143 runs each rollout state in an isolated runtime with flag restoration after capture [EVIDENCE: spec.md risks table and plan.md Phase 3 "destructive tests" preconditions]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] EX-001 has been executed and evidence captures context relevance from both `auto` and `focused` `memory_context` calls for the `fix flaky index scan retry logic` prompt [EVIDENCE: execution log attached]
- [ ] CHK-021 [P0] EX-002 has been executed and evidence captures top-result relevance from both default and `bypassCache:true` `memory_search` runs for the `checkpoint restore clearExisting transaction rollback` query [EVIDENCE: execution log attached]
- [ ] CHK-022 [P0] EX-003 has been executed and evidence captures matched triggers including cognitive fields from `memory_match_triggers` with `include_cognitive:true` for the `resume previous session blockers` prompt [EVIDENCE: execution log attached]
- [ ] CHK-023 [P0] EX-004 has been executed and evidence captures channel contribution and non-empty tail from both `memory_search` runs for the `graph search fallback tiers behavior` prompt [EVIDENCE: execution log attached]
- [ ] CHK-024 [P0] EX-005 has been executed and evidence confirms absence of score-mutation symptoms from `memory_search` with `intent:understand` for the `Stage4Invariant score snapshot verifyScoreInvariant` prompt [EVIDENCE: execution log attached]
- [ ] CHK-025 [P0] NEW-086 has been executed against disposable sandbox data and evidence captures re-index activity and query confirmation for the edited trigger phrase [EVIDENCE: sandbox checkpoint, mutation log, and post-edit search output attached]
- [ ] CHK-026 [P0] NEW-109 has been executed and evidence captures degradation properties for all three fallback tiers plus the single-tier comparison with `SPECKIT_SEARCH_FALLBACK=false` [EVIDENCE: execution logs for all four steps attached]
- [ ] CHK-027 [P0] NEW-142 has been executed and evidence captures `trace.sessionTransition` field presence in the traced call and confirmed absence in the non-trace call [EVIDENCE: both execution logs attached with field-level diff]
- [ ] CHK-028 [P0] NEW-143 has been executed across all three rollout states with restart evidence and evidence captures `rolloutState`, `appliedBonus`, `capApplied`, and ordering comparison for each state [EVIDENCE: three execution logs and post-restore flag verification attached]
- [ ] CHK-029 [P0] Each of the nine scenarios has a verdict (PASS, PARTIAL, or FAIL) with explicit rationale referencing the review protocol acceptance rules (preconditions satisfied, prompt/commands as written, expected signals present, evidence readable, outcome rationale explicit) [EVIDENCE: verdict table or inline verdict notes]
- [ ] CHK-029b [P1] Coverage summary reports 9/9 scenarios executed with no skipped test IDs [EVIDENCE: phase closeout note or implementation-summary.md]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials were added to retrieval phase documents [EVIDENCE: doc-only content, no secret literals in any of the four files]
- [x] CHK-031 [P0] NEW-086 mutation sequence targets only disposable sandbox trigger phrases and does not reference shared production memory records [EVIDENCE: spec.md risks table explicitly restricts edits to disposable sandbox data]
- [ ] CHK-032 [P1] NEW-143 rollout flag changes (`SPECKIT_GRAPH_WALK_ROLLOUT`) are restored to their default value after evidence capture, and this restoration is confirmed before any subsequent scenario runs [EVIDENCE: post-NEW-143 environment snapshot showing default flag restored]
- [ ] CHK-033 [P2] Open questions about the canonical sandbox fixture for NEW-086 trigger edits and the graph-connected corpus for NEW-143 ordering checks are resolved or explicitly deferred before execution in a shared environment [EVIDENCE: open questions in spec.md addressed or deferred with documented reason]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` contain no template placeholder text [EVIDENCE: all content is derived from playbook rows for EX-001 through NEW-143 and linked retrieval feature catalog files]
- [ ] CHK-041 [P0] All four phase documents are synchronized: scenario names, prompts, and command sequences are consistent across spec, plan, and checklist [EVIDENCE: cross-file consistency pass completed]
- [ ] CHK-042 [P1] `implementation-summary.md` is created when execution and verification are complete [EVIDENCE: file present in `001-retrieval/`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the four phase documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`) were created in `001-retrieval/` [EVIDENCE: directory listing confirms four files]
- [ ] CHK-051 [P1] No unrelated files were added outside the `001-retrieval/` folder as part of this phase packet creation [EVIDENCE: git status confirms scope]
- [ ] CHK-052 [P2] Memory save was triggered after phase packet creation to make retrieval context available for future sessions [EVIDENCE: `/memory:save` run or deferred with documented reason]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 26 | 15/26 |
| P1 Items | 7 | 1/7 |
| P2 Items | 2 | 0/2 |

**Verification Date**: (pending execution)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
