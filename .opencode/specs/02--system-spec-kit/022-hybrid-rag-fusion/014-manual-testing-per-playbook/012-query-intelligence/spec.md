---
title: "Feature Specification: manual-testing-per-playbook query-intelligence phase [template:level_1/spec.md]"
description: "Phase 012 documents the query-intelligence manual test packet for the Spec Kit Memory system. It maps nine scenarios covering query complexity routing, RSF shadow mode, channel min-representation, confidence truncation, dynamic token budgets, query expansion, LLM reformulation, HyDE shadow, and query surrogates so testers can execute prompts, command sequences, evidence capture, and verdict criteria from one bounded folder."
trigger_phrases:
  - "query intelligence manual testing"
  - "phase 012 query intelligence"
  - "spec kit memory query intelligence tests"
  - "hybrid rag fusion query intelligence playbook"
  - "161 162 163"
  - "llm reformulation"
  - "hyde shadow"
  - "query surrogates"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook query-intelligence phase

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
| **Predecessor Phase** | `011-scoring-and-calibration` |
| **Successor Phase** | `013-memory-quality-and-indexing` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual query-intelligence scenarios for the Spec Kit Memory system currently live inside the central playbook and need a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated query-intelligence packet, Phase 012 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results. Wave 2-4 additions introduce LLM reformulation, HyDE shadow generation, and query surrogates.

### Purpose
Provide a single query-intelligence-focused specification that maps all nine Phase 012 test IDs (033 through 038, 161, 162, 163) to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Feature Catalog | Exact Prompt | Exact Command Sequence |
|---------|---------------|-----------------|--------------|------------------------|
| 033 | Query complexity router (R15) | [`../../feature_catalog/12--query-intelligence/01-query-complexity-router.md`](../../feature_catalog/12--query-intelligence/01-query-complexity-router.md) | `Verify query complexity router (R15).` | `1) Run simple/moderate/complex queries 2) Inspect selected channels 3) Disable flag fallback` |
| 034 | Relative score fusion in shadow mode (R14/N1) | [`../../feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md`](../../feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md) | `Check RSF shadow behavior post-cleanup.` | `1) Inspect branch conditions 2) Run queries 3) Confirm RRF live ranking` |
| 035 | Channel min-representation (R2) | [`../../feature_catalog/12--query-intelligence/03-channel-min-representation.md`](../../feature_catalog/12--query-intelligence/03-channel-min-representation.md) | `Validate channel min-representation (R2).` | `1) Run dominance query 2) Inspect pre/post representation 3) Verify quality floor` |
| 036 | Confidence-based result truncation (R15-ext) | [`../../feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md`](../../feature_catalog/12--query-intelligence/04-confidence-based-result-truncation.md) | `Verify confidence-based truncation (R15-ext).` | `1) Run long-tail query 2) Inspect cutoff math 3) Verify min-result guarantee` |
| 037 | Dynamic token budget allocation (FUT-7) | [`../../feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md`](../../feature_catalog/12--query-intelligence/05-dynamic-token-budget-allocation.md) | `Verify dynamic token budgets (FUT-7).` | `1) Run classed queries 2) Inspect budgets 3) Disable flag fallback` |
| 038 | Query expansion (R12) | [`../../feature_catalog/12--query-intelligence/06-query-expansion.md`](../../feature_catalog/12--query-intelligence/06-query-expansion.md) | `Validate query expansion (R12).` | `1) Complex query expansion 2) Parallel baseline+expanded 3) Dedup + simple-query skip` |
| 161 | LLM Reformulation | [`../../feature_catalog/12--query-intelligence/07-llm-reformulation.md`](../../feature_catalog/12--query-intelligence/07-llm-reformulation.md) | `Verify LLM reformulation in deep mode (SPECKIT_LLM_REFORMULATION).` | `1) Enable flag 2) Run deep-mode query 3) Inspect reformulated query in trace 4) Disable flag fallback` |
| 162 | HyDE Shadow | [`../../feature_catalog/12--query-intelligence/08-hyde-shadow.md`](../../feature_catalog/12--query-intelligence/08-hyde-shadow.md) | `Verify HyDE hypothetical document generation (SPECKIT_HYDE).` | `1) Enable flag 2) Run query 3) Inspect generated hypothetical doc 4) Confirm shadow-only (no live impact) 5) Disable flag fallback` |
| 163 | Query Surrogates | [`../../feature_catalog/12--query-intelligence/09-query-surrogates.md`](../../feature_catalog/12--query-intelligence/09-query-surrogates.md) | `Verify index-time query surrogate generation (SPECKIT_QUERY_SURROGATES).` | `1) Enable flag 2) Save a memory record 3) Inspect generated surrogates in index 4) Run retrieval using surrogate terms 5) Disable flag fallback` |

### Out of Scope
- Executing the nine query-intelligence scenarios and assigning final run verdicts.
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-query-intelligence phases from other `014-manual-testing-per-playbook/` sub-folders.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 012 query-intelligence requirements, test inventory, and acceptance criteria |
| `plan.md` | Create | Phase 012 query-intelligence execution plan and review workflow |
| `tasks.md` | Create | Phase 012 task tracker for setup, execution, and verification work |
| `checklist.md` | Create | Phase 012 Level 2 verification checklist |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document 033 query complexity router with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS: Channel count increases with complexity class; disabled flag uses default routing; FAIL: All queries use same channels or flag-disabled produces error |
| REQ-002 | Document 034 RSF shadow mode with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS: Live ranking uses RRF and no runtime RSF branch affects returned results; FAIL: RSF changes live ranking or a live RSF branch is still wired into returned results |
| REQ-003 | Document 035 channel min-representation with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS: All active channels have >=1 representative in top-k; quality floor prevents sub-threshold entries; FAIL: Channel missing from top-k or sub-threshold results injected |
| REQ-004 | Document 036 confidence-based result truncation with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS: Results cut at confidence cliff; >=min-count results always returned; threshold visible in trace; FAIL: No truncation or fewer than min-count results |
| REQ-005 | Document 037 dynamic token budget allocation with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS: Budget proportional to complexity tier; disabled flag uses default; total budget within system limits; FAIL: All tiers get same budget or flag-disabled produces error |
| REQ-006 | Document 038 query expansion with its exact playbook prompt, command sequence, evidence target, and feature link. | PASS: Complex query generates >=2 expansion variants; results deduplicated; simple queries bypass expansion; FAIL: No expansion or duplicate results in output |

| REQ-007 | Document 161 (LLM Reformulation) with its exact prompt, execution sequence, evidence target, and feature link. Feature flag: `SPECKIT_LLM_REFORMULATION` (default: OFF). | PASS when flag ON: deep-mode queries produce a reformulated query visible in trace output, reformulation improves retrieval relevance or at minimum does not degrade it, and non-deep queries bypass reformulation; PASS when flag OFF: no reformulation occurs and queries execute unchanged. FAIL when reformulation runs outside deep mode, when disabling the flag still produces reformulated queries, or when reformulation degrades retrieval quality below baseline. |
| REQ-008 | Document 162 (HyDE Shadow) with its exact prompt, execution sequence, evidence target, and feature link. Feature flag: `SPECKIT_HYDE` (default: OFF). | PASS when flag ON: a hypothetical document is generated from the query and logged in shadow output, the hypothetical document is used only for embedding similarity (not returned to the user), and live ranking is not affected by the shadow path; PASS when flag OFF: no hypothetical document generation occurs. FAIL when the hypothetical document affects live ranking, is returned as a result, or generation occurs when the flag is disabled. |
| REQ-009 | Document 163 (Query Surrogates) with its exact prompt, execution sequence, evidence target, and feature link. Feature flag: `SPECKIT_QUERY_SURROGATES` (default: OFF). | PASS when flag ON: saving a memory record generates query surrogates stored in the index, retrieval using surrogate-matching terms returns the record, and surrogates are regenerated on content update; PASS when flag OFF: no surrogates are generated at index time and retrieval uses only the original content. FAIL when surrogates are generated with the flag disabled, when surrogates are stale after content update, or when surrogate-based retrieval returns incorrect records. |

No P1 items are defined for this phase; all nine query-intelligence scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 9 query-intelligence tests are documented with exact prompts, exact command sequences, linked feature catalog entries, and playbook-derived pass criteria.
- **SC-002**: `plan.md` defines how evidence, verdicts, and coverage for 033, 034, 035, 036, 037, 038, 161, 162, and 163 will be collected.
- **SC-003**: Reviewers can audit every Phase 012 scenario using this folder plus the linked playbook (`../../manual_testing_playbook/manual_testing_playbook.md`) and review protocol (`../../manual_testing_playbook/review_protocol.md`).
- **SC-004**: The phase packet contains no placeholder or template text and is ready for manual execution planning.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/manual_testing_playbook.md`](../../manual_testing_playbook/manual_testing_playbook.md) | Canonical source for exact prompts, commands, evidence targets, and pass criteria | Treat the playbook as source of truth and update this phase packet only from that document |
| Dependency | [`../../manual_testing_playbook/review_protocol.md`](../../manual_testing_playbook/review_protocol.md) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review and do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/12--query-intelligence/`](../../feature_catalog/12--query-intelligence/) | Supplies feature context for each query-intelligence scenario | Keep every test row linked to its mapped query-intelligence feature file |
| Dependency | MCP runtime plus retrieval sandbox corpus | Required to execute `memory_search` scenarios safely | Run stateful tests in an isolated sandbox and preserve restart/checkpoint instructions in the plan |
| Risk | 033 and 037 require disabling feature flags to test fallback paths; flag changes can affect other concurrent test runs | Medium | Isolate flag-toggle tests to a dedicated runtime instance; restore default flag values before the next scenario |
| Dependency | `SPECKIT_LLM_REFORMULATION` feature flag | Required for 161; controls LLM-based query reformulation in deep mode | Confirm flag support in the runtime before running 161; default OFF preserves existing query behavior |
| Dependency | `SPECKIT_HYDE` feature flag | Required for 162; controls hypothetical document embedding generation | Confirm flag support before running 162; default OFF disables HyDE shadow path |
| Dependency | `SPECKIT_QUERY_SURROGATES` feature flag | Required for 163; controls index-time surrogate query generation | Confirm flag support before running 163; default OFF disables surrogate generation |
| Risk | 038 parallel expansion may produce non-deterministic dedup ordering across runs | Low | Use a fixed seed corpus for expansion tests and capture raw dedup counts rather than ordering-sensitive comparisons |
| Risk | 161 LLM reformulation depends on external LLM availability; network or rate-limit issues may block the scenario | Medium | Provide a mock or local model fallback for testing; capture the reformulated query from trace output regardless of model source |
| Risk | 162 HyDE shadow generation may consume significant compute for hypothetical document creation | Low | Monitor latency impact during shadow runs and confirm the live path is not blocked |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which sandbox fixture or disposable memory record should be used for 035 channel dominance tests to produce a reliably skewed channel distribution?
- For 038 query expansion, which corpus size threshold reliably triggers the complex-query expansion path to confirm the simple-query suppression comparison?
<!-- /ANCHOR:questions -->

---
