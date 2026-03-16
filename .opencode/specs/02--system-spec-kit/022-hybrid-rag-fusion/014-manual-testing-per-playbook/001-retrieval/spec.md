---
title: "Feature Specification: manual-testing-per-playbook retrieval phase [template:level_1/spec.md]"
description: "Phase 001 documents the retrieval manual test packet for the Spec Kit Memory system. It breaks nine retrieval scenarios out of the central playbook so testers can execute prompts, command sequences, evidence capture, and verdict criteria from one bounded folder."
trigger_phrases:
  - "retrieval manual testing"
  - "phase 001 retrieval"
  - "spec kit memory retrieval tests"
  - "hybrid rag fusion retrieval playbook"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook retrieval phase

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [`../spec.md`](../spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual retrieval scenarios for the Spec Kit Memory system currently live inside the central playbook and need a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated retrieval packet, Phase 001 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results.

### Purpose
Provide a single retrieval-focused specification that maps all nine Phase 001 test IDs to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| EX-001 | Intent-aware context pull | [`../../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md`](../../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md) | `Use memory_context in auto mode for: fix flaky index scan retry logic` | `memory_match_triggers({ prompt:"fix flaky index scan retry logic", sessionId:"ex001" })` -> `memory_context({ mode:"auto", prompt:"fix flaky index scan retry logic", sessionId:"ex001" })` -> `memory_context({ mode:"focused", prompt:"fix flaky index scan retry logic", sessionId:"ex001" })` |
| EX-002 | Hybrid precision check | [`../../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md`](../../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md) | `Search for checkpoint restore clearExisting transaction rollback` | `memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20 })` -> `memory_search({ query:"checkpoint restore clearExisting transaction rollback", limit:20, bypassCache:true })` |
| EX-003 | Fast recall path | [`../../feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md`](../../feature_catalog/01--retrieval/03-trigger-phrase-matching-memorymatchtriggers.md) | `Run trigger matching for resume previous session blockers with cognitive=true` | `memory_match_triggers(prompt,include_cognitive:true,sessionId:ex003)` |
| EX-004 | Channel fusion sanity | [`../../feature_catalog/01--retrieval/04-hybrid-search-pipeline.md`](../../feature_catalog/01--retrieval/04-hybrid-search-pipeline.md) | `Validate graph search fallback tiers behavior` | `memory_search(query,limit:25)` -> `memory_search(bypassCache:true)` |
| EX-005 | Stage invariant verification | [`../../feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md`](../../feature_catalog/01--retrieval/05-4-stage-pipeline-architecture.md) | `Search Stage4Invariant score snapshot verifyScoreInvariant` | `memory_search(query,intent:understand)` |
| NEW-086 | Confirm trigger edit causes re-index | [`../../feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md`](../../feature_catalog/01--retrieval/06-bm25-trigger-phrase-re-index-gate.md) | `Validate BM25 trigger phrase re-index gate.` | `1) edit trigger phrases 2) verify re-index activity 3) query new trigger` |
| NEW-109 | Confirm 3-tier degradation chain triggers correctly | [`../../feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md`](../../feature_catalog/01--retrieval/08-quality-aware-3-tier-search-fallback.md) | `Validate SPECKIT_SEARCH_FALLBACK tiered degradation.` | `1) memory_search({query:"zzz_nonexistent_term_zzz", limit:20}) with default settings (Tier 1) 2) inspect _degradation property on result — if topScore < 0.02 AND relativeGap < 0.2, OR resultCount < 3, confirm Tier 2 triggered 3) verify Tier 2 uses minSimilarity=0.1 and forces all channels 4) if Tier 2 also fails quality check, confirm Tier 3 structural SQL fallback fires 5) verify Tier 3 scores capped at 50% of existing top score 6) set SPECKIT_SEARCH_FALLBACK=false and verify single-tier only` |
| NEW-142 | Verify `memory_context` emits trace-only session transitions with no non-trace leakage | [`../../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md`](../../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md) | `Validate Markovian session transition tracing for memory_context.` | `1) memory_context({ mode:"resume", prompt:"resume previous work on rollout hardening", sessionId:"markovian-142", includeTrace:true }) 2) Verify each result exposes trace.sessionTransition.previousState, currentState, confidence, and ordered signalSources 3) Repeat without includeTrace and verify sessionTransition is absent 4) Confirm the non-trace response does not expose transition data in top-level metadata` |
| NEW-143 | Verify `SPECKIT_GRAPH_WALK_ROLLOUT` changes diagnostics and bounded bonus behavior without destabilizing ordering | [`../../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md`](../../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md) | `Validate bounded graph-walk rollout states and trace diagnostics.` | `1) Prepare a graph-connected sandbox corpus 2) Start runtime with SPECKIT_GRAPH_WALK_ROLLOUT=trace_only and run memory_search({ query:"graph rollout trace check", includeTrace:true, limit:10 }) 3) Verify trace.graphContribution.rolloutState is trace_only and appliedBonus remains 0 while raw/normalized are still visible 4) Restart with SPECKIT_GRAPH_WALK_ROLLOUT=bounded_runtime and repeat 5) Verify appliedBonus is present, bounded at <= 0.03, and capApplied flips to true when the bounded runtime bonus saturates at the Stage 2 cap 6) Restart with SPECKIT_GRAPH_WALK_ROLLOUT=off and verify the graph-walk bonus disappears while the broader graph-signal path stays governed by SPECKIT_GRAPH_SIGNALS and repeated identical runs keep the same ordering` |

### Out of Scope
- Executing the nine retrieval scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-retrieval phases from `002-mutation/` through `019-feature-flag-reference/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 001 retrieval requirements, test inventory, and acceptance criteria |
| `plan.md` | Create | Phase 001 retrieval execution plan and review workflow |
| `tasks.md` | Create | Phase 001 task tracker for setup, execution, and verification work |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document EX-001 intent-aware context pull with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS if relevant context returned in both calls |
| REQ-002 | Document EX-002 hybrid precision check with its exact search prompt, dual-run command sequence, evidence target, and feature link. | PASS if top results match query intent |
| REQ-003 | Document EX-003 fast recall path with its exact trigger-matching prompt, cognitive command sequence, evidence target, and feature link. | PASS if matched triggers returned with cognitive fields |
| REQ-004 | Document EX-004 channel fusion sanity scenario with its exact fallback prompt, command sequence, evidence target, and feature link. | PASS if channels contribute and no empty tail |
| REQ-005 | Document EX-005 Stage 4 invariant verification with its exact prompt, command sequence, evidence target, and feature link. | PASS if no score-mutation symptoms |
| REQ-006 | Document NEW-086 BM25 trigger phrase re-index gate with its exact prompt, mutation sequence, evidence target, and feature link. | PASS if editing trigger phrases causes automatic BM25 re-index and new triggers are immediately searchable |
| REQ-007 | Document NEW-109 quality-aware 3-tier fallback with its exact prompt, degradation-check sequence, evidence target, and feature link. | PASS if all 3 tiers trigger in correct order based on quality thresholds and disabling fallback produces single-tier behavior |
| REQ-008 | Document NEW-142 session transition trace contract with its exact prompt, traced/untraced command sequence, evidence target, and feature link. | PASS if trace-only gating holds and the contract fields are present only in the traced call |
| REQ-009 | Document NEW-143 bounded graph-walk rollout diagnostics with its exact prompt, rollout-state sequence, evidence target, and feature link. | PASS if rollout state, bounded bonus, cap saturation signaling, and ordering guarantees all match the documented ladder |

No P1 items are defined for this phase; all nine retrieval scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 retrieval tests are documented with exact prompts, exact command sequences, linked feature catalog entries, and playbook-derived pass criteria.
- **SC-002**: `plan.md` defines how evidence, verdicts, and coverage for EX-001, EX-002, EX-003, EX-004, EX-005, NEW-086, NEW-109, NEW-142, and NEW-143 will be collected.
- **SC-003**: Reviewers can audit every Phase 001 scenario using this folder plus the linked playbook (`../../manual_testing_playbook/manual_testing_playbook.md`) and review protocol (`../../manual_testing_playbook/review_protocol.md`).
- **SC-004**: The phase packet contains no placeholder or template text and is ready for manual execution planning.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for exact prompts, commands, evidence targets, and pass/fail criteria | Treat the playbook as source of truth and update this phase packet only from that document |
| Dependency | [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review and do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/01--retrieval/`](../../feature_catalog/01--retrieval/) | Supplies feature context for each retrieval scenario | Keep every test row linked to its mapped retrieval feature file |
| Dependency | MCP runtime plus retrieval sandbox corpus | Required to execute `memory_context`, `memory_search`, and `memory_match_triggers` scenarios safely | Run stateful tests in an isolated sandbox and preserve restart/checkpoint instructions in the plan |
| Risk | NEW-086 mutates trigger phrases and can pollute shared search indexes | High | Restrict trigger edits to disposable sandbox data and record rollback steps before execution |
| Risk | NEW-109 and NEW-143 depend on feature flags and runtime restarts that can skew comparison evidence | Medium | Capture baseline env state, isolate runs per rollout state, and restore defaults before the next scenario |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which sandbox fixture or disposable memory record should be treated as the canonical target for NEW-086 trigger-phrase edits?
- Which graph-connected sandbox corpus should Phase 001 reviewers use for NEW-143 so repeated ordering checks stay reproducible across machines?
<!-- /ANCHOR:questions -->

---
