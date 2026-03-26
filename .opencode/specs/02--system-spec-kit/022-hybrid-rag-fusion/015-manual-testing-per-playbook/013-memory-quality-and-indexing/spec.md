---
title: "Feature Specification: manual-testing-per-playbook memory quality and indexing phase [template:level_2/spec.md]"
description: "Test specification for the memory quality and indexing category: 27 playbook scenario files covering 34 exact IDs including sub-scenarios M-005a/b/c, M-006a/b/c, and 155-F."
trigger_phrases:
  - "memory quality manual testing"
  - "phase 013 memory quality"
  - "spec kit memory quality indexing tests"
  - "hybrid rag fusion memory quality playbook"
importance_tier: "normal"
contextType: "implementation"
---
# Feature Specification: manual-testing-per-playbook memory quality and indexing phase

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
| **Parent Spec** | [../spec.md](../spec.md) |
| **Phase** | 013-memory-quality-and-indexing |
| **Predecessor** | [012-query-intelligence](../012-query-intelligence/spec.md) |
| **Successor** | [014-pipeline-architecture](../014-pipeline-architecture/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The memory quality and indexing feature category is the largest single phase in the hybrid-RAG-fusion manual testing playbook, spanning 27 scenario files that expand to 34 exact IDs through sub-scenario decomposition (M-005 expands to M-005a/b/c, M-006 expands to M-006a/b/c, 155 expands to 155-F). These scenarios cover the verify-fix-verify loop, signal vocabulary, quality gates, reconsolidation, entity extraction, outsourced agent capture, session enrichment, post-save review, and deferred indexing among other features. Without a dedicated phase packet, testers must reassemble requirements across the playbook, review protocol, and feature catalog before they can execute or record results.

### Purpose

Execute every memory-quality-and-indexing playbook scenario, record a PASS/FAIL/PARTIAL verdict for each of the 34 exact IDs, and capture supporting evidence so the memory quality and indexing layer of the system-spec-kit memory system is fully verified.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Executing all 34 exact scenario IDs listed in Section 4
- Recording PASS/FAIL/PARTIAL verdicts with evidence for each scenario ID (including all sub-scenarios)
- Cross-referencing each scenario against the feature catalog (13--memory-quality-and-indexing)
- Updating checklist.md and tasks.md as execution proceeds

### Out of Scope

- Retrieval scenarios (covered in 001-retrieval)
- Mutation scenarios (covered in 002-mutation)
- Pipeline architecture scenarios (covered in 014-pipeline-architecture)
- Tooling and scripts scenarios (covered in 016-tooling-and-scripts)
- Code changes or bug fixes discovered during testing (tracked separately)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `tasks.md` | Modify | Update task status as scenarios are executed |
| `checklist.md` | Modify | Mark items complete with evidence references |
| `implementation-summary.md` | Modify | Complete after all scenarios are verdicted |

### Scenario Registry

| # | Scenario ID | Scenario Name | Feature Catalog Ref |
|---|-------------|---------------|---------------------|
| 1 | 013 | Audit phase scenarios | See parent spec |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 -- Scenarios to Execute

All 34 exact IDs below are P0. Each must receive a PASS, FAIL, or PARTIAL verdict before this phase is considered complete.

#### Group 1: Core Pipeline Scenarios (M-003, M-005 family, M-006 family)

| Scenario ID | Scenario Name | Playbook File | Feature Catalog Reference |
|-------------|---------------|---------------|--------------------------|
| M-003 | Context Save + Index Update | `../../manual_testing_playbook/13--memory-quality-and-indexing/003-context-save-index-update.md` | 13--memory-quality-and-indexing / 01-verify-fix-verify-memory-quality-loop.md |
| M-005 | Outsourced Agent Memory Capture Round-Trip | `../../manual_testing_playbook/13--memory-quality-and-indexing/005-outsourced-agent-memory-capture-round-trip.md` | 13--memory-quality-and-indexing / 17-outsourced-agent-memory-capture.md |
| M-005a | JSON-mode hard-fail | (sub-scenario of M-005) | 13--memory-quality-and-indexing / 17-outsourced-agent-memory-capture.md |
| M-005b | nextSteps persistence | (sub-scenario of M-005) | 13--memory-quality-and-indexing / 17-outsourced-agent-memory-capture.md |
| M-005c | Verification freshness | (sub-scenario of M-005) | 13--memory-quality-and-indexing / 17-outsourced-agent-memory-capture.md |
| M-006 | Session Enrichment and Alignment Guardrails | `../../manual_testing_playbook/13--memory-quality-and-indexing/006-session-enrichment-and-alignment-guardrails.md` | 13--memory-quality-and-indexing / 18-session-enrichment-and-alignment-guards.md |
| M-006a | Unborn-HEAD and dirty snapshot fallback | (sub-scenario of M-006) | 13--memory-quality-and-indexing / 18-session-enrichment-and-alignment-guards.md |
| M-006b | Detached-HEAD snapshot preservation | (sub-scenario of M-006) | 13--memory-quality-and-indexing / 18-session-enrichment-and-alignment-guards.md |
| M-006c | Similar-folder boundary protection | (sub-scenario of M-006) | 13--memory-quality-and-indexing / 18-session-enrichment-and-alignment-guards.md |

#### Group 2: Quality Loop and Signal Scenarios (039-048)

| Scenario ID | Scenario Name | Playbook File | Feature Catalog Reference |
|-------------|---------------|---------------|--------------------------|
| 039 | Verify-fix-verify memory quality loop (PI-A5) | `../../manual_testing_playbook/13--memory-quality-and-indexing/039-verify-fix-verify-memory-quality-loop-pi-a5.md` | 13--memory-quality-and-indexing / 01-verify-fix-verify-memory-quality-loop.md |
| 040 | Signal vocabulary expansion (TM-08) | `../../manual_testing_playbook/13--memory-quality-and-indexing/040-signal-vocabulary-expansion-tm-08.md` | 13--memory-quality-and-indexing / 02-signal-vocabulary-expansion.md |
| 041 | Pre-flight token budget validation (PI-A3) | `../../manual_testing_playbook/13--memory-quality-and-indexing/041-pre-flight-token-budget-validation-pi-a3.md` | 13--memory-quality-and-indexing / 03-pre-flight-token-budget-validation.md |
| 042 | Spec folder description discovery (PI-B3) | `../../manual_testing_playbook/13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md` | 13--memory-quality-and-indexing / 04-spec-folder-description-discovery.md |
| 043 | Pre-storage quality gate (TM-04) | `../../manual_testing_playbook/13--memory-quality-and-indexing/043-pre-storage-quality-gate-tm-04.md` | 13--memory-quality-and-indexing / 05-pre-storage-quality-gate.md |
| 044 | Reconsolidation-on-save (TM-06) | `../../manual_testing_playbook/13--memory-quality-and-indexing/044-reconsolidation-on-save-tm-06.md` | 13--memory-quality-and-indexing / 06-reconsolidation-on-save.md |
| 045 | Smarter memory content generation (S1) | `../../manual_testing_playbook/13--memory-quality-and-indexing/045-smarter-memory-content-generation-s1.md` | 13--memory-quality-and-indexing / 07-smarter-memory-content-generation.md |
| 046 | Anchor-aware chunk thinning (R7) | `../../manual_testing_playbook/13--memory-quality-and-indexing/046-anchor-aware-chunk-thinning-r7.md` | 13--memory-quality-and-indexing / 08-anchor-aware-chunk-thinning.md |
| 047 | Encoding-intent capture at index time (R16) | `../../manual_testing_playbook/13--memory-quality-and-indexing/047-encoding-intent-capture-at-index-time-r16.md` | 13--memory-quality-and-indexing / 09-encoding-intent-capture-at-index-time.md |
| 048 | Auto entity extraction (R10) | `../../manual_testing_playbook/13--memory-quality-and-indexing/048-auto-entity-extraction-r10.md` | 13--memory-quality-and-indexing / 10-auto-entity-extraction.md |

#### Group 3: Consolidation and Persistence Scenarios (069, 073, 092, 111, 119)

| Scenario ID | Scenario Name | Playbook File | Feature Catalog Reference |
|-------------|---------------|---------------|--------------------------|
| 069 | Entity normalization consolidation | `../../manual_testing_playbook/13--memory-quality-and-indexing/069-entity-normalization-consolidation.md` | 13--memory-quality-and-indexing / 13-entity-normalization-consolidation.md |
| 073 | Quality gate timer persistence | `../../manual_testing_playbook/13--memory-quality-and-indexing/073-quality-gate-timer-persistence.md` | 13--memory-quality-and-indexing / 14-quality-gate-timer-persistence.md |
| 092 | Implemented: auto entity extraction (R10) | `../../manual_testing_playbook/13--memory-quality-and-indexing/092-implemented-auto-entity-extraction-r10.md` | 13--memory-quality-and-indexing / 10-auto-entity-extraction.md |
| 111 | Deferred lexical-only indexing | `../../manual_testing_playbook/13--memory-quality-and-indexing/111-deferred-lexical-only-indexing.md` | 13--memory-quality-and-indexing / 15-deferred-lexical-only-indexing.md |
| 119 | Memory filename uniqueness (ensureUniqueMemoryFilename) | `../../manual_testing_playbook/13--memory-quality-and-indexing/119-memory-filename-uniqueness-ensureuniquememoryfilename.md` | 13--memory-quality-and-indexing / 11-content-aware-memory-filename-generation.md |

#### Group 4: Validation and Preflight Scenarios (131, 132, 133)

| Scenario ID | Scenario Name | Playbook File | Feature Catalog Reference |
|-------------|---------------|---------------|--------------------------|
| 131 | Description.json batch backfill validation (PI-B3) | `../../manual_testing_playbook/13--memory-quality-and-indexing/131-description-json-batch-backfill-validation-pi-b3.md` | 13--memory-quality-and-indexing / 04-spec-folder-description-discovery.md |
| 132 | description.json schema field validation | `../../manual_testing_playbook/13--memory-quality-and-indexing/132-description-json-schema-field-validation.md` | 13--memory-quality-and-indexing / 04-spec-folder-description-discovery.md |
| 133 | Dry-run preflight for memory_save | `../../manual_testing_playbook/13--memory-quality-and-indexing/133-dry-run-preflight-for-memory-save.md` | 13--memory-quality-and-indexing / 16-dry-run-preflight-for-memory-save.md |

#### Group 5: Post-Save and Review Scenarios (155, 155-F)

| Scenario ID | Scenario Name | Playbook File | Feature Catalog Reference |
|-------------|---------------|---------------|--------------------------|
| 155 | Post-save quality review | `../../manual_testing_playbook/13--memory-quality-and-indexing/155-post-save-quality-review.md` | 13--memory-quality-and-indexing / 19-post-save-quality-review.md |
| 155-F | Score penalty advisory logging | (sub-scenario of 155) | 13--memory-quality-and-indexing / 19-post-save-quality-review.md |

#### Group 6: Advanced Quality Features (164, 165, 176, 177, 178)

| Scenario ID | Scenario Name | Playbook File | Feature Catalog Reference |
|-------------|---------------|---------------|--------------------------|
| 164 | Batch learned feedback (SPECKIT_BATCH_LEARNED_FEEDBACK) | `../../manual_testing_playbook/13--memory-quality-and-indexing/164-batch-learned-feedback-speckit-batch-learned-feedback.md` | 13--memory-quality-and-indexing / 20-weekly-batch-feedback-learning.md |
| 165 | Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION) | `../../manual_testing_playbook/13--memory-quality-and-indexing/165-assistive-reconsolidation-speckit-assistive-reconsolidation.md` | 13--memory-quality-and-indexing / 21-assistive-reconsolidation.md |
| 176 | Implicit feedback log (SPECKIT_IMPLICIT_FEEDBACK_LOG) | `../../manual_testing_playbook/13--memory-quality-and-indexing/176-implicit-feedback-log-speckit-implicit-feedback-log.md` | 13--memory-quality-and-indexing / 22-implicit-feedback-log.md |
| 177 | Hybrid decay policy (SPECKIT_HYBRID_DECAY_POLICY) | `../../manual_testing_playbook/13--memory-quality-and-indexing/177-hybrid-decay-policy-speckit-hybrid-decay-policy.md` | 13--memory-quality-and-indexing / 23-hybrid-decay-policy.md |
| 178 | Save quality gate exceptions (SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS) | `../../manual_testing_playbook/13--memory-quality-and-indexing/178-save-quality-gate-exceptions-speckit-save-quality-gate-exceptions.md` | 13--memory-quality-and-indexing / 24-save-quality-gate-exceptions.md |

### P1 -- Supporting Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-M01 | Evidence captured per scenario | Each executed scenario has a recorded observation or output excerpt |
| REQ-M02 | Feature catalog cross-reference verified | Each scenario's catalog reference confirmed present and accurate |
| REQ-M03 | Sub-scenario results tracked independently | M-005a/b/c, M-006a/b/c, and 155-F each have individual verdicts |

### P1 - Packet Governance Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-901 | 013-memory-quality-and-indexing packet keeps execution evidence and verdict documentation synchronized | `tasks.md`, `checklist.md`, and `implementation-summary.md` stay aligned for 013-memory-quality-and-indexing |
| REQ-902 | 013-memory-quality-and-indexing packet keeps execution evidence and verdict documentation synchronized | `tasks.md`, `checklist.md`, and `implementation-summary.md` stay aligned for 013-memory-quality-and-indexing |
| REQ-903 | 013-memory-quality-and-indexing packet keeps execution evidence and verdict documentation synchronized | `tasks.md`, `checklist.md`, and `implementation-summary.md` stay aligned for 013-memory-quality-and-indexing |
| REQ-904 | 013-memory-quality-and-indexing packet keeps execution evidence and verdict documentation synchronized | `tasks.md`, `checklist.md`, and `implementation-summary.md` stay aligned for 013-memory-quality-and-indexing |
| REQ-905 | 013-memory-quality-and-indexing packet keeps execution evidence and verdict documentation synchronized | `tasks.md`, `checklist.md`, and `implementation-summary.md` stay aligned for 013-memory-quality-and-indexing |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 34 exact IDs executed and verdicted (PASS, FAIL, or PARTIAL)
- **SC-002**: All P0 checklist items marked with evidence
- **SC-003**: tasks.md reflects final execution status for every scenario task including sub-scenarios
- **SC-004**: implementation-summary.md completed with aggregate results
- **SC-005**: Sub-scenario results (M-005a/b/c, M-006a/b/c, 155-F) individually tracked and verdicted
### Acceptance Scenarios

**Given** the `013-memory-quality-and-indexing` phase packet, **when** a reviewer opens the scenario mapping, **then** every scenario listed for the phase has a bounded execution target and a documented acceptance rule.

**Given** the `013-memory-quality-and-indexing` phase packet, **when** execution evidence is reviewed, **then** verdict notes can be traced through `tasks.md`, `checklist.md`, and `implementation-summary.md`.

**Given** the `013-memory-quality-and-indexing` phase packet, **when** a reviewer checks neighboring navigation, **then** the packet points back to the parent and to the adjacent numbered phase where one exists.

**Given** strict validation runs on the `013-memory-quality-and-indexing` phase packet, **when** the validator checks structure, **then** the packet satisfies Level 2 requirement and acceptance-scenario minimums.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Parent plan `../plan.md` | Execution order and environment setup | Read parent plan before starting |
| Dependency | Playbook folder `../../manual_testing_playbook/13--memory-quality-and-indexing/` | Scenario steps not available | Confirm playbook files accessible before execution |
| Dependency | Feature catalog `../../feature_catalog/13--memory-quality-and-indexing/` | Cross-reference cannot be verified | Confirm catalog files accessible before execution |
| Dependency | MCP runtime for `memory_save`, `memory_index_scan`, quality gate pipeline | Memory quality scenarios cannot be executed | Verify MCP runtime healthy before starting |
| Risk | M-005 outsourced agent capture requires multi-agent simulation | High | Use minimal JSON payload approach; test structured input paths independently |
| Risk | M-006 session enrichment scenarios require git state manipulation (unborn HEAD, detached HEAD) | High | Create temporary git repos for controlled state; restore afterward |
| Risk | 043 quality gate can reject saves, affecting subsequent scenarios | Medium | Test quality gate rejection in isolation with known-bad input first |
| Risk | 044 reconsolidation merges memories, which is destructive | High | Use sandbox data with checkpoint; verify merge targets are disposable |
| Risk | 164/165/176/177/178 depend on feature flags that may not be enabled | Medium | Document required flag state per scenario; set and restore flags explicitly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

## 10. OPEN QUESTIONS

- None at time of writing. Questions discovered during execution should be noted in scratch/ and tracked here.
<!-- /ANCHOR:questions -->
