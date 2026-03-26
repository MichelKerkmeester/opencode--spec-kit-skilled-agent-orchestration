---
title: "Feature Specification: query-intelligence manual testing [template:level_2/spec.md]"
description: "Phase 012 documents the 10 manual testing scenarios for query intelligence features in the Spec Kit Memory system. Maps each playbook scenario to the matching feature catalog entry and preserves the required acceptance language for verdict review."
trigger_phrases:
  - "query intelligence manual testing"
  - "phase 012 query intelligence"
  - "query intelligence test scenarios"
  - "033 034 035 036 037 038"
  - "161 162 163 173"
  - "llm reformulation"
  - "hyde shadow"
  - "query surrogates"
  - "query decomposition"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: query-intelligence manual testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Not Started |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [011-scoring-and-calibration](../011-scoring-and-calibration/spec.md) |
| **Successor** | [013-memory-quality-and-indexing](../013-memory-quality-and-indexing/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual query-intelligence scenarios for the Spec Kit Memory system live inside the central playbook and need a phase-specific document that preserves exact prompts, command sequences, evidence expectations, and verdict criteria. Without a dedicated query-intelligence packet, Phase 012 testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or review results. Wave 2-5 additions introduce LLM reformulation, HyDE shadow generation, query surrogates, and query decomposition.

### Purpose
Provide a single query-intelligence-focused specification that maps all 10 Phase 012 test IDs (033 through 038, 161, 162, 163, 173) to their feature context and acceptance criteria so manual execution and review remain consistent with the canonical playbook.
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
| 161 | LLM Reformulation (SPECKIT_LLM_REFORMULATION) | [`../../feature_catalog/12--query-intelligence/07-llm-query-reformulation.md`](../../feature_catalog/12--query-intelligence/07-llm-query-reformulation.md) | `Verify LLM reformulation in deep mode (SPECKIT_LLM_REFORMULATION).` | `1) Enable flag 2) Run deep-mode query 3) Inspect reformulated query in trace 4) Disable flag fallback` |
| 162 | HyDE Shadow (SPECKIT_HYDE) | [`../../feature_catalog/12--query-intelligence/08-hyde-hypothetical-document-embeddings.md`](../../feature_catalog/12--query-intelligence/08-hyde-hypothetical-document-embeddings.md) | `Verify HyDE hypothetical document generation (SPECKIT_HYDE).` | `1) Enable flag 2) Run query 3) Inspect generated hypothetical doc 4) Confirm shadow-only (no live impact) 5) Disable flag fallback` |
| 163 | Query Surrogates (SPECKIT_QUERY_SURROGATES) | [`../../feature_catalog/12--query-intelligence/09-index-time-query-surrogates.md`](../../feature_catalog/12--query-intelligence/09-index-time-query-surrogates.md) | `Verify index-time query surrogate generation (SPECKIT_QUERY_SURROGATES).` | `1) Enable flag 2) Save a memory record 3) Inspect generated surrogates in index 4) Run retrieval using surrogate terms 5) Disable flag fallback` |
| 173 | Query Decomposition (SPECKIT_QUERY_DECOMPOSITION) | [`../../feature_catalog/12--query-intelligence/10-query-decomposition.md`](../../feature_catalog/12--query-intelligence/10-query-decomposition.md) | `Verify bounded facet detection decomposes multi-faceted queries into max 3 sub-queries using rule-based heuristics in deep mode.` | `1) Enable flag 2) Run a multi-faceted deep-mode query 3) Inspect bounded facet detection output 4) Verify decomposition produces at most 3 rule-based sub-queries 5) Disable flag fallback` |

### Out of Scope
- Executing the 10 query-intelligence scenarios and assigning final run verdicts (this is what the phase packet enables).
- Modifying the playbook or feature catalog content linked from this packet.
- Documenting non-query-intelligence phases from other `015-manual-testing-per-playbook/` sub-folders.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Rewrite | Phase 012 query-intelligence requirements, 10-scenario test inventory, and acceptance criteria |
| `plan.md` | Rewrite | Phase 012 query-intelligence execution plan and review workflow |
| `tasks.md` | Rewrite | Phase 012 task tracker — one task per scenario, all pending |
| `checklist.md` | Rewrite | Phase 012 Level 2 verification checklist — all items unchecked |
| `implementation-summary.md` | Rewrite | Blank template awaiting execution completion |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute 033 (Query complexity router R15) with exact playbook prompt, command sequence, evidence capture, and feature link. | PASS: Channel count increases with complexity class; disabled flag uses default routing; FAIL: All queries use same channels or flag-disabled produces error |
| REQ-002 | Execute 034 (RSF shadow mode R14/N1) with exact playbook prompt, command sequence, evidence capture, and feature link. | PASS: Live ranking uses RRF and no runtime RSF branch affects returned results; FAIL: RSF changes live ranking or a live RSF branch is still wired into returned results |
| REQ-003 | Execute 035 (Channel min-representation R2) with exact playbook prompt, command sequence, evidence capture, and feature link. | PASS: All active channels have >=1 representative in top-k; quality floor prevents sub-threshold entries; FAIL: Channel missing from top-k or sub-threshold results injected |
| REQ-004 | Execute 036 (Confidence-based result truncation R15-ext) with exact playbook prompt, command sequence, evidence capture, and feature link. | PASS: Results cut at confidence cliff; >=min-count results always returned; threshold visible in trace; FAIL: No truncation or fewer than min-count results |
| REQ-005 | Execute 037 (Dynamic token budget allocation FUT-7) with exact playbook prompt, command sequence, evidence capture, and feature link. | PASS: Budget proportional to complexity tier; disabled flag uses default; total budget within system limits; FAIL: All tiers get same budget or flag-disabled produces error |
| REQ-006 | Execute 038 (Query expansion R12) with exact playbook prompt, command sequence, evidence capture, and feature link. | PASS: Complex query generates >=2 expansion variants; results deduplicated; simple queries bypass expansion; FAIL: No expansion or duplicate results in output |
| REQ-007 | Execute 161 (LLM Reformulation) with exact prompt, execution sequence, evidence capture, and feature link. Feature flag: `SPECKIT_LLM_REFORMULATION` (default: OFF). | PASS when flag ON: deep-mode queries produce a reformulated query visible in trace, reformulation does not degrade retrieval below baseline, non-deep queries bypass; PASS when flag OFF: no reformulation occurs. FAIL when reformulation runs outside deep mode or when disabling the flag still produces reformulated queries |
| REQ-008 | Execute 162 (HyDE Shadow) with exact prompt, execution sequence, evidence capture, and feature link. Feature flag: `SPECKIT_HYDE` (default: OFF). | PASS when flag ON: hypothetical document generated and logged in shadow output, used only for embedding similarity, live ranking unaffected; PASS when flag OFF: no hypothetical document generation. FAIL when hypothetical document affects live ranking or generation occurs when flag is disabled |
| REQ-009 | Execute 163 (Query Surrogates) with exact prompt, execution sequence, evidence capture, and feature link. Feature flag: `SPECKIT_QUERY_SURROGATES` (default: OFF). | PASS when flag ON: saving a memory record generates surrogates stored in the index, retrieval using surrogate terms returns the record, surrogates regenerated on content update; PASS when flag OFF: no surrogates generated. FAIL when surrogates generated with flag disabled or surrogate-based retrieval returns incorrect records |
| REQ-010 | Execute 173 (Query Decomposition) with exact prompt, execution sequence, evidence capture, and feature link. Feature flag: `SPECKIT_QUERY_DECOMPOSITION` (default: OFF). | PASS when flag ON: deep-mode multi-faceted queries decomposed into bounded sub-queries using rule-based facet detection, capped at 3 sub-queries, trace shows derived sub-queries without mutating original user query; PASS when flag OFF: no decomposition. FAIL when decomposition runs outside deep mode or more than 3 sub-queries are produced |

No P1 items defined for this phase; all 10 query-intelligence scenarios are mandatory for coverage.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 10 query-intelligence tests are executed with exact prompts, exact command sequences, linked feature catalog entries, and playbook-derived pass criteria.
- **SC-002**: `plan.md` defines how evidence, verdicts, and coverage for 033, 034, 035, 036, 037, 038, 161, 162, 163, and 173 will be collected.
- **SC-003**: Reviewers can audit every Phase 012 scenario using this folder plus the linked playbook and review protocol.
- **SC-004**: The phase packet contains no placeholder or template text and is ready for manual execution.
### Acceptance Scenarios

**Given** the `012-query-intelligence` phase packet, **when** a reviewer opens the scenario mapping, **then** every scenario listed for the phase has a bounded execution target and a documented acceptance rule.

**Given** the `012-query-intelligence` phase packet, **when** execution evidence is reviewed, **then** verdict notes can be traced through `tasks.md`, `checklist.md`, and `implementation-summary.md`.

**Given** the `012-query-intelligence` phase packet, **when** a reviewer checks neighboring navigation, **then** the packet points back to the parent and to the adjacent numbered phase where one exists.

**Given** strict validation runs on the `012-query-intelligence` phase packet, **when** the validator checks structure, **then** the packet satisfies Level 2 requirement and acceptance-scenario minimums.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [`../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`](../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md) | Canonical source for exact prompts, commands, evidence targets, and pass criteria | Treat the playbook as source of truth; update this phase packet only from that document |
| Dependency | [`../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md`](../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md) | Verdict rules determine PASS, PARTIAL, FAIL, and coverage requirements | Apply the protocol during evidence review; do not invent alternate verdict logic |
| Dependency | [`../../feature_catalog/12--query-intelligence/`](../../feature_catalog/12--query-intelligence/) | Supplies feature context for each query-intelligence scenario | Keep every test row linked to its mapped query-intelligence feature file |
| Dependency | MCP runtime plus retrieval sandbox corpus | Required to execute `memory_search` scenarios safely | Run stateful tests in an isolated sandbox; preserve restart/checkpoint instructions in the plan |
| Risk | 033 and 037 require disabling feature flags to test fallback paths; flag changes can affect other concurrent test runs | Medium | Isolate flag-toggle tests to a dedicated runtime instance; restore default flag values before the next scenario |
| Dependency | `SPECKIT_LLM_REFORMULATION` feature flag | Required for 161; controls LLM-based query reformulation in deep mode | Confirm flag support in the runtime before running 161; default OFF preserves existing query behavior |
| Dependency | `SPECKIT_HYDE` feature flag | Required for 162; controls hypothetical document embedding generation | Confirm flag support before running 162; default OFF disables HyDE shadow path |
| Dependency | `SPECKIT_QUERY_SURROGATES` feature flag | Required for 163; controls index-time surrogate query generation | Confirm flag support before running 163; default OFF disables surrogate generation |
| Dependency | `SPECKIT_QUERY_DECOMPOSITION` feature flag | Required for 173; controls bounded facet decomposition in deep mode | Confirm flag support before running 173; default OFF disables query decomposition |
| Risk | 038 parallel expansion may produce non-deterministic dedup ordering across runs | Low | Use a fixed seed corpus for expansion tests; capture raw dedup counts rather than ordering-sensitive comparisons |
| Risk | 161 LLM reformulation depends on external LLM availability; network or rate-limit issues may block the scenario | Medium | Provide a mock or local model fallback; capture the reformulated query from trace output regardless of model source |
| Risk | 163 surrogate generation mutates the index; requires sandbox isolation | Medium | Use a disposable memory record for the save-and-inspect step; clean up after the test |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which sandbox fixture or disposable memory record should be used for 035 channel dominance tests to produce a reliably skewed channel distribution?
- For 038 query expansion, which corpus size threshold reliably triggers the complex-query expansion path to confirm the simple-query suppression comparison?
- For 163 surrogate generation, should the test memory record be deleted after the scenario or left in place for coverage audit?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Non-destructive MCP scenarios must complete within normal tool call latency bounds.
- **NFR-P02**: Feature-flag toggle and restore must complete before the next scenario begins.

### Reliability
- **NFR-R01**: All 10 scenarios must produce a verdict (PASS, PARTIAL, or FAIL) — no scenario may be left without a result.
- **NFR-R02**: Evidence artifacts must be retained in `scratch/` for reviewer audit.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Feature flag toggling: all flag-dependent scenarios (033, 037, 161, 162, 163, 173) require explicit ON/OFF verification passes.
- Simple-query bypass: 038 requires both a complex-query pass and a simple-query pass to confirm expansion suppression.
- Surrogate mutation: 163 writes to the index; use a disposable test memory record.

### Error Scenarios
- Flag not supported: if a feature flag is absent from the runtime, mark the dependent scenario as BLOCKED and document the runtime version.
- LLM unavailable: if the LLM service is unreachable for 161, document BLOCKED with error evidence; do not skip.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 10 scenarios; all non-destructive except 163 (index write) |
| Risk | 12/25 | Feature-flag scenarios require confirmed runtime support; LLM-dependent 161 may be network-blocked |
| Research | 6/20 | Acceptance criteria defined in playbook; feature catalog provides implementation context |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---
