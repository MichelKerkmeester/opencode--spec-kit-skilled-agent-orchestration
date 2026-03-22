---
title: "Feature Specification: manual-testing-per-playbook [template:level_1/spec.md]"
description: "Umbrella parent packet for manual testing phases. This root spec tracks 19 feature-catalog categories against the current playbook inventory, including 195 top-level IDs and 252 exact scenario IDs once dedicated memory sub-scenarios and Wave 2-5 additions (156-180) are included."
trigger_phrases:
  - "manual testing"
  - "testing playbook"
  - "phase parent"
  - "umbrella spec"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../013-agents-md-alignment/spec.md |
| **Successor** | ../015-rewrite-memory-mcp-readme/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The manual testing playbook is no longer accurately represented by the original parent packet. The playbook still contains `195` top-level IDs (`EX-001..035`, `001..155`, `PHASE-001..005`, `M-001..008`), but the dedicated memory section now expands that inventory to `252` exact scenario IDs once suffixed sub-scenarios such as `M-005a..c`, `M-006a..c`, `M-007a..j`, `153-A..L`, `155-F`, and Wave 2-5 additions `156..180` are included. The current parent packet still treats the top-level cross-reference index as the authoritative coverage unit, which allows the packet to look complete while exact playbook scenarios remain undocumented.

### Purpose
Provide a canonical parent packet with phase linkage across 19 child folders, using the current exact-ID playbook inventory (252 exact IDs) as the authoritative coverage unit and recording the real validator state for the packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Parent root documentation for this phased umbrella folder.
- Phase-link integrity support for child folders `001` through `019`.
- Per-phase spec.md and plan.md documenting test scenarios, prompts, pass/fail criteria, and execution pipelines.
- Exact-ID coverage: every active scenario ID from the current playbook, including the dedicated memory-section suffixed IDs and Wave 2-5 additions (156-180), mapped to exactly one phase.
- Truthful packet-level validation reporting, including the current recursive-validation result of `0` errors and `19` warnings on March 17, 2026.

### Out of Scope
- Actual test execution; this packet documents the testing plan, not run results.
- Runtime code changes outside this umbrella spec folder.
- Behavioral edits to the feature catalog unless a broken link is discovered during packet alignment.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Parent requirements and phase map updated to the exact-ID model |
| `plan.md` | Modify | Parent implementation and verification plan updated to the alignment pass |
| `tasks.md` | Modify | Parent task tracker updated to the exact-ID audit and validation reruns |
| `checklist.md` | Modify | Parent checklist updated to the current validator truth and exact-ID coverage model |
| `implementation-summary.md` | Modify | Parent summary updated to 252 exact IDs and the March 17 validator state |
| `013-memory-quality-and-indexing/spec.md` | Modify | Expand Phase 013 to explicit exact-ID coverage for the dedicated memory scenarios |
| `013-memory-quality-and-indexing/plan.md` | Modify | Align Phase 013 execution plan to the exact-ID model |
| `013-memory-quality-and-indexing/tasks.md` | Modify | Align Phase 013 tasks to the exact-ID model |
| `013-memory-quality-and-indexing/checklist.md` | Modify | Align Phase 013 QA to the exact-ID model |
| `013-memory-quality-and-indexing/implementation-summary.md` | Modify | Update Phase 013 summary to reflect exact-ID coverage and current draft state |
<!-- /ANCHOR:scope -->

---

## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Tests | Status |
|-------|--------|-------|-------|--------|
| 001 | `001-retrieval/` | Retrieval behavior tests | 9 exact IDs (EX-001..005, 086, 109, 142, 143) | Draft |
| 002 | `002-mutation/` | Mutation behavior tests | 7 exact IDs (EX-006..010, 085, 110) | Draft |
| 003 | `003-discovery/` | Discovery behavior tests | 3 exact IDs (EX-011..013) | Draft |
| 004 | `004-maintenance/` | Maintenance behavior tests | 4 exact IDs (EX-014, EX-035, 100, 101) | Draft |
| 005 | `005-lifecycle/` | Lifecycle behavior tests | 9 exact IDs (EX-015..018, 097, 114, 124, 134, 144) | Draft |
| 006 | `006-analysis/` | Analysis behavior tests | 7 exact IDs (EX-019..025) | Draft |
| 007 | `007-evaluation/` | Evaluation behavior tests | 2 exact IDs (EX-026, EX-027) | Draft |
| 008 | `008-bug-fixes-and-data-integrity/` | Integrity/fix tests | 11 exact IDs (001..004, 065, 068, 075, 083, 084, 116, 117) | Draft |
| 009 | `009-evaluation-and-measurement/` | Measurement tests | 16 exact IDs (005..015, 072, 082, 088, 090, 126) | Draft |
| 010 | `010-graph-signal-activation/` | Graph signal tests | 15 exact IDs (016..022, 081, 091, 120, 156, 157, 158, 174, 175) | Draft |
| 011 | `011-scoring-and-calibration/` | Scoring tests | 22 exact IDs (023..032, 066, 074, 079, 098, 102, 118, 121, 159, 160, 170, 171, 172) | Draft |
| 012 | `012-query-intelligence/` | Query intelligence tests | 10 exact IDs (033..038, 161, 162, 163, 173) | Draft |
| 013 | `013-memory-quality-and-indexing/` | Memory quality tests | 49 exact IDs (039..048, 069, 073, 092, 111, 119, 131..133, M-001..008, M-005a..c, M-006a..c, M-007a..j, 155, 155-F, 164, 165, 176, 177, 178) | Draft |
| 014 | `014-pipeline-architecture/` | Pipeline architecture tests | 18 exact IDs (049..054, 067, 071, 076, 078, 080, 087, 095, 112, 115, 129, 130, 146) | Draft |
| 015 | `015-retrieval-enhancements/` | Retrieval enhancement tests | 11 exact IDs (055..060, 077, 093, 094, 096, 145) | Draft |
| 016 | `016-tooling-and-scripts/` | Tooling/script tests | 35 exact IDs (061, 062, 070, 089, 099, 108, 113, 127, 128, 135..139, 147, 149, 153, 153-A..L, 154, PHASE-001..005) | Draft |

> **Note (2026-03-21):** Scenario 154 updated to reflect JSON-only contract after full removal of recovery mode (`--recovery` flag) in commit `705ac0fa6`.
| 017 | `017-governance/` | Governance tests | 5 exact IDs (063, 064, 122, 123, 148) | Draft |
| 018 | `018-ux-hooks/` | UX hook tests | 11 exact IDs (103..107, 166, 167, 168, 169, 179, 180) | Draft |
| 019 | `019-feature-flag-reference/` | Feature-flag reference tests | 8 exact IDs (EX-028..034, 125) | Draft |

### Cross-Cutting Test Assignments
- **PHASE-001..005** -> appended to `016-tooling-and-scripts/` as pipeline-tooling validation.
- **M-001..008** -> appended to `013-memory-quality-and-indexing/` as the top-level memory-maintenance scenarios.
- **`M-005a..c`, `M-006a..c`, and `M-007a..j`** -> explicitly documented in `013-memory-quality-and-indexing/` as exact-ID sub-scenarios under the dedicated memory section.
- **`153-A..L`** -> explicitly documented in `016-tooling-and-scripts/` as exact-ID sub-scenarios covering JSON mode hybrid enrichment behaviors.
- **`155` and `155-F`** -> explicitly documented in `013-memory-quality-and-indexing/` as post-save quality review scenarios.
- **Normalization carried forward** -> the packet now uses bare numeric `NNN` IDs instead of provisional `NEW-NNN` markers, and Phase `016` includes scenarios `153` through `153-L` and `154`, while Phase `013` includes `155` and `155-F`, bringing the base exact-ID total to `227`.
- **Wave 2-4 additions (156-169)** -> 14 new scenario IDs distributed across 5 phases: `156..158` in Phase `010` (graph refresh mode, LLM graph backfill, graph calibration profile), `159..160` in Phase `011` (learned Stage 2 combiner, shadow feedback holdout), `161..163` in Phase `012` (LLM reformulation, HyDE shadow, query surrogates), `164..165` in Phase `013` (batch learned feedback, assistive reconsolidation), and `166..169` in Phase `018` (result explainability, response profiles, progressive disclosure, session retrieval state), bringing the exact-ID total to `241`.
- **Wave 5 additions (170-180)** -> 11 new scenario IDs distributed across 5 phases: `170..172` in Phase `011`, `173` in Phase `012`, `174..175` in Phase `010`, `176..178` in Phase `013`, and `179..180` in Phase `018`, bringing the exact-ID total to `252`.

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 19 phase folders contain spec.md and plan.md | `ls */spec.md */plan.md` returns 38 files |
| REQ-002 | Parent phase-map anchor exists and lists all 19 phases with current exact-ID counts | Phase Documentation Map table contains 19 rows with correct folder names and truthful counts |
| REQ-003 | Every active exact playbook scenario ID appears in exactly one phase spec.md | Exact-ID audit finds `0` missing IDs and `0` duplicate owners across `252` exact scenario IDs |
| REQ-004 | Recursive validation state is rerun and recorded truthfully | `validate.sh --recursive` rerun completes with `0` errors and the parent packet records the current `19` warning state instead of claiming a clean warning-free pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Each phase spec.md links test IDs to feature catalog files | Every test ID row includes a relative path to its feature catalog entry |
| REQ-006 | Phase 013 explicitly documents the dedicated memory sub-scenarios | `013-memory-quality-and-indexing/spec.md` includes literal coverage for `M-005a..c`, `M-006a..c`, and `M-007a..j` |
| REQ-007 | Cross-cutting test assignments remain documented in the intended phases | Phase `016` includes `PHASE-001..005`; Phase `013` includes `M-001..008` plus the active dedicated-memory sub-scenarios |
| REQ-008 | Packet-level validation claims match current validator output | Parent tasks, checklist, and summary no longer claim unrun or unmet recursive validation work once the rerun has been captured |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All `252` exact scenario IDs from the current playbook are documented across the 19 phase folders with exact-one ownership.
- **SC-002**: The retained `195` top-level ID count (plus `14` Wave 2-4 additions) is preserved only as a historical/top-level inventory note and is not presented as the authoritative coverage measure.
- **SC-003**: `013-memory-quality-and-indexing/spec.md` explicitly names `M-005a..c`, `M-006a..c`, and `M-007a..j` rather than relying on shorthand range language.
- **SC-004**: `validate.sh --recursive` has been rerun on the `014-manual-testing-per-playbook/` tree and the current result is documented truthfully as `0` errors and `19` warnings on March 17, 2026.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Manual testing playbook (229KB) | Source of all scenario IDs, prompts, commands, and evidence rules | Treat the current playbook text, including the dedicated memory section, as the source of truth |
| Dependency | Feature catalog (19 categories) | Provides category-to-test mapping and feature context | Keep feature mappings intact unless a broken link is discovered |
| Risk | Exact-ID coverage drift | High | Audit exact scenario IDs, not only top-level cross-reference IDs |
| Risk | Validation claims outrun validator truth | High | Record the current recursive-validation result exactly as rerun |
| Risk | Historical generation language remains in parent docs | Medium | Rewrite parent tracking docs around the alignment pass rather than the original generation wave |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None - the alignment pass uses the current playbook text and current validator output as its authoritative inputs.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

## Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../013-agents-md-alignment/spec.md |
| **Next Phase** | ../015-rewrite-memory-mcp-readme/spec.md |
