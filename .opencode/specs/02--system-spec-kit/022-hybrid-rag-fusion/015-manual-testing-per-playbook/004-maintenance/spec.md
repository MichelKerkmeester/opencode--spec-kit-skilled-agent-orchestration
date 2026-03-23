---
title: "Feature Specification: manual-testing-per-playbook maintenance phase"
description: "Phase 004 documents the maintenance manual test packet. Execute scenarios EX-014 and EX-035 against the Spec Kit Memory system to verify memory_index_scan and startup runtime compatibility guards."
trigger_phrases:
  - "maintenance manual testing"
  - "phase 004 maintenance"
  - "EX-014 EX-035"
  - "memory_index_scan startup guards test"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook maintenance phase

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
| **Predecessor** | [003-discovery](../003-discovery/spec.md) |
| **Successor** | [005-lifecycle](../005-lifecycle/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 004 maintenance scenarios must be executed from scratch. All prior results are invalidated. The two maintenance scenarios (EX-014, EX-035) require fresh manual execution to verify that memory_index_scan and the startup runtime compatibility guards behave as specified by the canonical playbook.

### Purpose
Execute both Phase 004 maintenance scenarios, record verdicts and evidence, and mark this phase complete only when all P0 checklist items pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Playbook File |
|---------|---------------|---------------|
| EX-014 | Workspace scanning and indexing (memory_index_scan) | `../../manual_testing_playbook/04--maintenance/014-workspace-scanning-and-indexing-memory-index-scan.md` |
| EX-035 | Startup runtime compatibility guards | `../../manual_testing_playbook/04--maintenance/035-startup-runtime-compatibility-guards.md` |

### Out of Scope
- Scenarios from other phases (retrieval, mutation, discovery, lifecycle, etc.)
- Modifying the playbook or feature catalog source files
- Automated test harnesses — this phase is manual execution only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Rewrite | Phase 004 clean-slate specification |
| `plan.md` | Rewrite | Execution plan for Phase 004 |
| `tasks.md` | Rewrite | One task per scenario, all pending |
| `checklist.md` | Rewrite | P0/P1 items, all unchecked |
| `implementation-summary.md` | Rewrite | Blank — to be filled after execution |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Execute EX-014: invoke `memory_index_scan` (incremental mode) against a target spec folder | PASS if scan completes, reports indexed/skipped counts, and new files are visible to search |
| REQ-002 | Execute EX-035: verify startup runtime compatibility guards fire correctly on version mismatch or missing dependency | PASS if guard blocks incompatible startup and emits a clear diagnostic message |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Capture evidence for each scenario (tool output or screenshot) | Evidence recorded in implementation-summary.md |
| REQ-004 | Mark final verdict (PASS / PARTIAL / FAIL) per scenario following the review protocol | Verdict recorded against EX-014 and EX-035 in implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: EX-014 completes with a scan report showing indexed and skipped counts
- **SC-002**: EX-035 demonstrates that incompatible runtime conditions are caught at startup
- **SC-003**: Both verdicts are recorded and all P0 checklist items are checked
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Canonical playbook: `../scratch/context-playbook.md` §04--maintenance | Source of truth for exact prompts and pass criteria | Treat as read-only; do not invent alternate criteria |
| Dependency | Feature catalog: `../scratch/context-feature-catalog.md` §04--maintenance | Feature context for each scenario | Read before execution |
| Dependency | MCP runtime with indexed memory corpus | Required for EX-014 tool invocation | Verify MCP server is running before starting |
| Risk | EX-014 `force: true` re-indexes all files and may be slow on large corpora | Low | Use incremental (default) mode unless the playbook explicitly requires force mode |
| Risk | EX-035 may require a controlled environment to simulate version mismatch | Medium | Follow playbook instructions exactly; do not skip guard simulation steps |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None at start. Record any blockers discovered during execution here.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: EX-014 scan must complete within the MCP server's default timeout
- **NFR-P02**: No scenario requires more than one retry to obtain a valid response

### Security
- **NFR-S01**: Run EX-014 against a non-production spec folder; do not scan sensitive paths
- **NFR-S02**: EX-035 simulation must not leave the system in an incompatible state

### Reliability
- **NFR-R01**: Both scenarios must complete to claim phase done
- **NFR-R02**: Partial execution (only 1 scenario) is not acceptable for phase closure
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty folder: if `memory_index_scan` targets a folder with no markdown files, record as PARTIAL
- No files changed since last scan: incremental scan should report 0 indexed, all skipped — valid PASS
- Guard not triggered: if EX-035 environment already meets requirements, record as PASS with note

### Error Scenarios
- MCP server not running: stop, start server, then retry
- `memory_index_scan` timeout on large corpus: retry with a smaller scoped `specFolder`
- EX-035 environment cannot simulate mismatch: record as PARTIAL and note environment constraint

### State Transitions
- Run EX-014 before EX-035 (indexed state may be relevant to startup guard check)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | 2 scenarios, one MCP call + one startup check |
| Risk | 8/25 | EX-035 requires controlled environment simulation |
| Research | 3/20 | Playbook provides all needed context |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
