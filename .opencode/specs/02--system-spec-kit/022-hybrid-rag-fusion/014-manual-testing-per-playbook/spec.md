---
title: "Feature Specification: manual-testing-per-playbook [template:level_1/spec.md]"
description: "Umbrella parent packet for manual testing phases. This root spec tracks 19 feature-catalog categories against the current 229KB playbook inventory, including 195 top-level IDs and 211 exact scenario IDs once dedicated memory sub-scenarios are included."
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
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The manual testing playbook is no longer accurately represented by the original parent packet. The playbook still contains `195` top-level IDs (`EX-001..035`, `NEW-001..149`, `PHASE-001..005`, `M-001..008`), but the dedicated memory section now expands that inventory to `211` exact scenario IDs once suffixed sub-scenarios such as `M-005a..c`, `M-006a..c`, and `M-007a..j` are included. The current parent packet still treats the top-level cross-reference index as the authoritative coverage unit, which allows the packet to look complete while exact playbook scenarios remain undocumented.

### Purpose
Provide a canonical parent packet with phase linkage across 19 child folders, using the current exact-ID playbook inventory as the authoritative coverage unit and recording the real validator state for the packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Parent root documentation for this phased umbrella folder.
- Phase-link integrity support for child folders `001` through `019`.
- Per-phase spec.md and plan.md documenting test scenarios, prompts, pass/fail criteria, and execution pipelines.
- Exact-ID coverage: every active scenario ID from the current playbook, including the dedicated memory-section suffixed IDs, mapped to exactly one phase.
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
| `implementation-summary.md` | Modify | Parent summary updated to 211 exact IDs and the March 17 validator state |
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
| 001 | `001-retrieval/` | Retrieval behavior tests | 9 exact IDs (EX-001..005, NEW-086, NEW-109, NEW-142, NEW-143) | Draft |
| 002 | `002-mutation/` | Mutation behavior tests | 7 exact IDs (EX-006..010, NEW-085, NEW-110) | Draft |
| 003 | `003-discovery/` | Discovery behavior tests | 3 exact IDs (EX-011..013) | Draft |
| 004 | `004-maintenance/` | Maintenance behavior tests | 4 exact IDs (EX-014, EX-035, NEW-100, NEW-101) | Draft |
| 005 | `005-lifecycle/` | Lifecycle behavior tests | 9 exact IDs (EX-015..018, NEW-097, NEW-114, NEW-124, NEW-134, NEW-144) | Draft |
| 006 | `006-analysis/` | Analysis behavior tests | 7 exact IDs (EX-019..025) | Draft |
| 007 | `007-evaluation/` | Evaluation behavior tests | 2 exact IDs (EX-026, EX-027) | Draft |
| 008 | `008-bug-fixes-and-data-integrity/` | Integrity/fix tests | 11 exact IDs (NEW-001..004, NEW-065, NEW-068, NEW-075, NEW-083, NEW-084, NEW-116, NEW-117) | Draft |
| 009 | `009-evaluation-and-measurement/` | Measurement tests | 16 exact IDs (NEW-005..015, NEW-072, NEW-082, NEW-088, NEW-090, NEW-126) | Draft |
| 010 | `010-graph-signal-activation/` | Graph signal tests | 10 exact IDs (NEW-016..022, NEW-081, NEW-091, NEW-120) | Draft |
| 011 | `011-scoring-and-calibration/` | Scoring tests | 17 exact IDs (NEW-023..032, NEW-066, NEW-074, NEW-079, NEW-098, NEW-102, NEW-118, NEW-121) | Draft |
| 012 | `012-query-intelligence/` | Query intelligence tests | 6 exact IDs (NEW-033..038) | Draft |
| 013 | `013-memory-quality-and-indexing/` | Memory quality tests | 42 exact IDs (NEW-039..048, NEW-069, NEW-073, NEW-092, NEW-111, NEW-119, NEW-131..133, M-001..008, M-005a..c, M-006a..c, M-007a..j) | Draft |
| 014 | `014-pipeline-architecture/` | Pipeline architecture tests | 18 exact IDs (NEW-049..054, NEW-067, NEW-071, NEW-076, NEW-078, NEW-080, NEW-087, NEW-095, NEW-112, NEW-115, NEW-129, NEW-130, NEW-146) | Draft |
| 015 | `015-retrieval-enhancements/` | Retrieval enhancement tests | 11 exact IDs (NEW-055..060, NEW-077, NEW-093, NEW-094, NEW-096, NEW-145) | Draft |
| 016 | `016-tooling-and-scripts/` | Tooling/script tests | 21 exact IDs (NEW-061, NEW-062, NEW-070, NEW-089, NEW-099, NEW-108, NEW-113, NEW-127, NEW-128, NEW-135..139, NEW-147, NEW-149, PHASE-001..005) | Draft |
| 017 | `017-governance/` | Governance tests | 5 exact IDs (NEW-063, NEW-064, NEW-122, NEW-123, NEW-148) | Draft |
| 018 | `018-ux-hooks/` | UX hook tests | 5 exact IDs (NEW-103..107) | Draft |
| 019 | `019-feature-flag-reference/` | Feature-flag reference tests | 8 exact IDs (EX-028..034, NEW-125) | Draft |

### Cross-Cutting Test Assignments
- **PHASE-001..005** -> appended to `016-tooling-and-scripts/` as pipeline-tooling validation.
- **M-001..008** -> appended to `013-memory-quality-and-indexing/` as the top-level memory-maintenance scenarios.
- **M-005a..c`, `M-006a..c`, and `M-007a..j`** -> explicitly documented in `013-memory-quality-and-indexing/` as exact-ID sub-scenarios under the dedicated memory section.

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 19 phase folders contain spec.md and plan.md | `ls */spec.md */plan.md` returns 38 files |
| REQ-002 | Parent phase-map anchor exists and lists all 19 phases with current exact-ID counts | Phase Documentation Map table contains 19 rows with correct folder names and truthful counts |
| REQ-003 | Every active exact playbook scenario ID appears in exactly one phase spec.md | Exact-ID audit finds `0` missing IDs and `0` duplicate owners across `211` exact scenario IDs |
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

- **SC-001**: All `211` exact scenario IDs from the current playbook are documented across the 19 phase folders with exact-one ownership.
- **SC-002**: The retained `195` top-level ID count is preserved only as a historical/top-level inventory note and is not presented as the authoritative coverage measure.
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
