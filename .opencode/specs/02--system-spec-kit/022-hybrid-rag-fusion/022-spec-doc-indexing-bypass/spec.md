---
title: "Feature Specification: Spec Doc Indexing Bypass"
description: "Spec documents (spec.md, plan.md, tasks.md, etc.) are rejected by 3 upstream quality gates during memory_index_scan despite the v3.0.0.1 warn-only bypass, which only covers the 4th gate."
trigger_phrases:
  - "spec doc indexing rejected"
  - "quality gate bypass incomplete"
  - "warn-only not working"
  - "1807 spec docs rejected"
  - "processPreparedMemory rejection gates"
importance_tier: "critical"
contextType: "bug-fix"
---
# Feature Specification: Spec Doc Indexing Bypass

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-03-27 |
| **Branch** | `main` |
| **Parent** | 022-hybrid-rag-fusion |
| **Predecessor** | v3.0.0.1 (spec doc quality gate bypass — incomplete fix) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`memory_index_scan({ force: true })` rejects 1,807 out of 1,807 spec documents (spec.md, plan.md, tasks.md, checklist.md, etc.) with status `rejected` and no reason field. Release v3.0.0.1 added `qualityGateMode: 'warn-only'` for spec docs, but it only bypasses 1 of 4 sequential rejection gates in `processPreparedMemory()`. The upstream 3 gates (V-rule, sufficiency, template contract) reject spec docs before the bypass ever runs.

### Purpose
All spec documents should index successfully during `memory_index_scan`, with quality warnings logged instead of hard rejections.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Propagate `qualityGateMode: 'warn-only'` to bypass Gates 1-3 in `processPreparedMemory()`
- Log warnings (not errors) when spec docs would have been rejected
- Build and verify

### Out of Scope
- Changing `prepareParsedMemoryForIndexing()` logic — it should still compute all quality results
- Modifying `memory-index.ts` — it already correctly passes `qualityGateMode`
- Changing `indexMemoryFile()` function signature
- Modifying memory file indexing behavior (only spec docs affected)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/handlers/memory-save.ts` | Modify | Add `qualityGateMode` checks to Gates 1-3 in `processPreparedMemory()` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Gate 1 (V-rule, line 333): when `qualityGateMode === 'warn-only'`, log warning and continue instead of returning rejected | Spec docs pass V-rule gate |
| REQ-002 | Gate 2 (sufficiency, line 350): when `qualityGateMode === 'warn-only'`, log warning and continue instead of returning rejected | Spec docs pass sufficiency gate |
| REQ-003 | Gate 3 (template contract, line 354): when `qualityGateMode === 'warn-only'`, log warning and continue instead of returning rejected | Spec docs pass template contract gate |
| REQ-004 | `npm run build` succeeds with no new errors | Clean build |
| REQ-005 | `memory_index_scan({ force: true })` indexes spec docs instead of rejecting | 0 rejected spec docs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Memory files (qualityGateMode='enforce') still rejected when failing gates | No behavior change for memory files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `memory_index_scan({ force: true })` — 0 rejected spec docs (was 1,807)
- **SC-002**: Memory files still subject to all 4 quality gates (no regression)
- **SC-003**: Warnings appear in stderr for spec docs that would have been rejected
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Low-quality spec docs enter index | Low | warn-only still logs all issues for review |
| Dependency | v3.0.0.1 build already compiled | None | Build step included in tasks |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — root cause fully diagnosed
<!-- /ANCHOR:questions -->
