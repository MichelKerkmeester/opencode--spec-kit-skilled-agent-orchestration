---
title: "Feature Specification: manual-testing-per-playbook retrieval-enhancements phase [template:level_1/spec.md]"
description: "Phase 015 documents the retrieval-enhancements manual test packet for the Spec Kit Memory system. It maps eleven retrieval-enhancements scenarios out of the central playbook so testers can execute prompts, command sequences, evidence capture, and verdict criteria from one bounded folder."
trigger_phrases:
  - "retrieval enhancements manual testing"
  - "phase 015 retrieval enhancements"
  - "spec kit memory retrieval enhancements tests"
  - "hybrid rag retrieval enhancements playbook"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook retrieval-enhancements phase

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
| **Predecessor Phase** | `014-pipeline-architecture` |
| **Successor Phase** | `016-tooling-and-scripts` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual retrieval-enhancements scenarios for the Spec Kit Memory system currently live inside the central playbook and need a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated retrieval-enhancements packet, Phase 015 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results.

### Purpose
Provide a single retrieval-enhancements specification that maps all eleven Phase 015 test IDs to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| NEW-055 | Dual-scope memory auto-surface | [`../../feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md`](../../feature_catalog/15--retrieval-enhancements/01-dual-scope-memory-auto-surface.md) | `Validate dual-scope auto-surface (TM-05).` | 1) invoke non-memory-aware tool path 2) trigger compaction 3) verify surfaced memories |
| NEW-056 | Constitutional memory as expert knowledge injection | [`../../feature_catalog/15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md`](../../feature_catalog/15--retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md) | `Verify constitutional memory directive injection (PI-A4).` | 1) save constitutional directive 2) run retrieval 3) inspect directive metadata |
| NEW-057 | Spec folder hierarchy as retrieval structure | [`../../feature_catalog/15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md`](../../feature_catalog/15--retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md) | `Validate spec-folder hierarchy retrieval (S4).` | 1) create nested hierarchy 2) query 3) verify self/parent/sibling scoring |
| NEW-058 | Lightweight consolidation | [`../../feature_catalog/15--retrieval-enhancements/04-lightweight-consolidation.md`](../../feature_catalog/15--retrieval-enhancements/04-lightweight-consolidation.md) | `Run lightweight consolidation cycle (N3-lite).` | 1) trigger cycle 2) inspect contradiction/hebbian/staleness outputs 3) verify logs |
| NEW-059 | Memory summary search channel | [`../../feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md`](../../feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md) | `Verify memory summary search channel (R8).` | 1) check corpus size threshold 2) run stage-1 3) verify channel activation rules |
| NEW-060 | Cross-document entity linking | [`../../feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md`](../../feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md) | `Validate cross-document entity linking (S5).` | 1) ensure shared entities across docs 2) run linker 3) verify density guards |
| NEW-077 | Tier-2 fallback channel forcing | [`../../feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md`](../../feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-channel-forcing.md) | `Validate tier-2 fallback channel forcing.` | 1) trigger tier-2 fallback 2) inspect options 3) confirm all channels forced |
| NEW-093 | Implemented: memory summary generation (R8) | [`../../feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md`](../../feature_catalog/15--retrieval-enhancements/05-memory-summary-search-channel.md) | `Verify R8 implemented and gated.` | 1) save long memory 2) inspect summary persistence 3) verify scale-gated usage |
| NEW-094 | Implemented: cross-document entity linking (S5) | [`../../feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md`](../../feature_catalog/15--retrieval-enhancements/06-cross-document-entity-linking.md) | `Verify S5 implemented and guarded.` | 1) run entity linker 2) inspect supports edges 3) verify density guards |
| NEW-096 | Provenance-rich response envelopes | [`../../feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md`](../../feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md) | `Validate SPECKIT_RESPONSE_TRACE includeTrace behavior.` | **Precondition:** ensure `SPECKIT_RESPONSE_TRACE` is unset or `false` before the "absent" assertion. 1) `memory_search({query:"test", includeTrace:true})` → verify `scores`, `source`, `trace` objects 2) `memory_search({query:"test"})` (no includeTrace, env unset) → verify objects absent 3) set `SPECKIT_RESPONSE_TRACE=true` and repeat without arg → verify trace objects appear via env override 4) inspect score fields: semantic, lexical, fusion, intentAdjusted, composite, rerank, attention |
| NEW-145 | Contextual tree injection | [`../../feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md`](../../feature_catalog/15--retrieval-enhancements/09-contextual-tree-injection.md) | `Validate contextual tree injection header format and flag toggle.` | 1) `memory_search({ query:"spec folder context headers", includeContent:true, includeTrace:true, limit:5 })` with `SPECKIT_CONTEXT_HEADERS=true` (default) 2) verify results with spec-folder file paths have `[parent > child — desc]` header prepended 3) verify header truncated at 100 characters 4) restart with `SPECKIT_CONTEXT_HEADERS=false` and repeat 5) verify no contextual headers prepended |

### Out of Scope
- Executing the nine retrieval-enhancements scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-retrieval-enhancements phases from `001-retrieval/` through `014-manual-testing-per-playbook/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 015 retrieval-enhancements requirements, test inventory, and acceptance criteria |
| `plan.md` | Create | Phase 015 retrieval-enhancements execution plan and review workflow |
| `tasks.md` | Create | Phase 015 task tracker for setup, execution, and verification work |
| `checklist.md` | Create | Phase 015 L2 verification checklist |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document NEW-055 dual-scope memory auto-surface with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS if auto-surface hook fires on non-memory-aware tool path and compaction event surfaces context-relevant memories |
| REQ-002 | Document NEW-056 constitutional memory directive injection with its exact prompt, retrieval sequence, evidence target, and feature link. | PASS if constitutional directives are injected into retrieval results with correct metadata and tier classification |
| REQ-003 | Document NEW-057 spec-folder hierarchy retrieval with its exact prompt, nested-hierarchy sequence, evidence target, and feature link. | PASS if retrieval respects folder hierarchy with self > parent > sibling ordering |
| REQ-004 | Document NEW-058 lightweight consolidation cycle with its exact prompt, cycle-trigger sequence, evidence target, and feature link. | PASS if all three consolidation sub-processes (contradiction, Hebbian, staleness) execute and produce expected outputs without errors |
| REQ-005 | Document NEW-059 memory summary search channel with its exact prompt, stage-1 channel activation sequence, evidence target, and feature link. | PASS if summary channel activates above corpus size threshold and remains inert below it |
| REQ-006 | Document NEW-060 cross-document entity linking with its exact prompt, linker run sequence, evidence target, and feature link. | PASS if supports-edges are created for shared entities and density guards cap edge count appropriately |
| REQ-007 | Document NEW-077 tier-2 fallback channel forcing with its exact prompt, fallback trigger sequence, evidence target, and feature link. | PASS if tier-2 fallback forces all channels active and results show multi-channel contribution |
| REQ-008 | Document NEW-096 provenance-rich response envelopes with its exact prompt, includeTrace toggle sequence, evidence target, and feature link. | PASS if trace objects present when opt-in or env-forced and absent when neither is set; all 7 score sub-fields verified |
| REQ-009 | Document NEW-093 implemented memory-summary-generation status with its exact prompt, command sequence, evidence target, and feature link. | PASS if summaries are generated and persisted for long memories and scale gate correctly controls activation |
| REQ-010 | Document NEW-094 implemented cross-document-entity-linking status with its exact prompt, command sequence, evidence target, and feature link. | PASS if entity linker produces correctly typed supports edges and density guards enforce limits |
| REQ-011 | Document NEW-145 contextual tree injection with its exact prompt, flag-toggle sequence, evidence target, and feature link. | PASS if enabled mode injects correctly formatted `[parent > child — description]` headers truncated at 100 chars and disabled mode skips injection entirely |

No P1 items are defined for this phase; all eleven retrieval-enhancements scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 11 retrieval-enhancements tests are documented with exact prompts, exact command sequences, linked feature catalog entries, and playbook-derived pass criteria.
- **SC-002**: `plan.md` defines how evidence, verdicts, and coverage for NEW-055, NEW-056, NEW-057, NEW-058, NEW-059, NEW-060, NEW-077, NEW-093, NEW-094, NEW-096, and NEW-145 will be collected.
- **SC-003**: Reviewers can audit every Phase 015 scenario using this folder plus the linked playbook (`../../manual_testing_playbook/manual_testing_playbook.md`) and review protocol (`../../manual_testing_playbook/review_protocol.md`).
- **SC-004**: The phase packet contains no placeholder or template text and is ready for manual execution planning.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for exact prompts, commands, evidence targets, and pass/fail criteria | Treat the playbook as source of truth and update this phase packet only from that document |
| Dependency | [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review and do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/15--retrieval-enhancements/`](../../feature_catalog/15--retrieval-enhancements/) | Supplies feature context for each retrieval-enhancements scenario | Keep every test row linked to its mapped retrieval-enhancements feature file |
| Dependency | MCP runtime plus retrieval sandbox corpus | Required to execute `memory_search`, `memory_context`, and consolidation/linker scenarios safely | Run stateful tests in an isolated sandbox and preserve restart/checkpoint instructions in the plan |
| Risk | NEW-058 triggers the N3-lite consolidation cycle which mutates edge weights in the graph database | Medium | Run only against sandbox/disposable corpus and record baseline edge state before triggering the cycle |
| Risk | NEW-059 and NEW-060 depend on corpus size thresholds and entity density guards that may behave differently across environments | Medium | Capture corpus size count and density metrics before execution; document actual threshold values encountered |
| Risk | NEW-096 depends on `SPECKIT_RESPONSE_TRACE` env var state; shared environments may have the flag set globally | Medium | Record env var state before testing, restore defaults after, and confirm trace-absent assertion against a clean env |
| Risk | NEW-145 requires a runtime restart to toggle `SPECKIT_CONTEXT_HEADERS`; restart can skew comparison evidence if corpus changes between runs | Low | Use a stable read-only sandbox corpus and capture header-on and header-off outputs within the same session where possible |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which sandbox corpus or disposable memory fixtures should Phase 015 reviewers use for NEW-058 consolidation and NEW-060 entity linking so edge-mutation evidence stays reproducible across machines?
- Which minimum corpus size should be pre-populated for NEW-059 to push the corpus above the 5,000-memory threshold needed to activate the summary channel?
<!-- /ANCHOR:questions -->

---
