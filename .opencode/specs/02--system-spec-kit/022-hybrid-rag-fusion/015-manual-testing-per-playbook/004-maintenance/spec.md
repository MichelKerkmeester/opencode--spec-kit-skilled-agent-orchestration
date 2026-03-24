---
title: "Feature Specification: manual-testing-per-playbook maintenance phase"
description: "Phase 004 documents the maintenance manual test packet. Execute scenarios EX-014, EX-035, EX-041, EX-042, EX-043, EX-044, and EX-045 against the Spec Kit Memory system to verify memory_index_scan, startup runtime compatibility guards, memory_update, memory_delete, bulk delete, health check diagnostics, and index scan and repair."
trigger_phrases:
  - "maintenance manual testing"
  - "phase 004 maintenance"
  - "EX-014 EX-035 EX-041 EX-042 EX-043 EX-044 EX-045"
  - "memory_index_scan startup guards test"
  - "memory_update memory_delete test"
  - "bulk delete health check index repair"
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
Phase 004 maintenance scenarios must be executed from scratch. All prior results are invalidated. The seven maintenance scenarios (EX-014, EX-035, EX-041, EX-042, EX-043, EX-044, EX-045) require fresh manual execution to verify that memory_index_scan, startup runtime compatibility guards, memory_update, memory_delete, bulk delete, health check diagnostics, and index scan and repair behave as specified by the canonical playbook. The five new scenarios (EX-041 through EX-045) expand coverage to state-mutating maintenance operations and diagnostic repair workflows.

### Purpose
Execute all seven Phase 004 maintenance scenarios, record verdicts and evidence, and mark this phase complete only when all P0 checklist items pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Playbook File |
|---------|---------------|---------------|
| EX-014 | Workspace scanning and indexing (memory_index_scan) | `.opencode/skill/system-spec-kit/manual_testing_playbook/04--maintenance/014-workspace-scanning-and-indexing-memory-index-scan.md` |
| EX-035 | Startup runtime compatibility guards | `.opencode/skill/system-spec-kit/manual_testing_playbook/04--maintenance/035-startup-runtime-compatibility-guards.md` |
| EX-041 | Memory content update via memory_update | `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/041-pre-flight-token-budget-validation-pi-a3.md` |
| EX-042 | Memory deletion via memory_delete | `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/042-spec-folder-description-discovery-pi-b3.md` |
| EX-043 | Bulk delete with filter criteria | `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/043-pre-storage-quality-gate-tm-04.md` |
| EX-044 | Health check diagnostics | `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/044-reconsolidation-on-save-tm-06.md` |
| EX-045 | Index scan and repair | `.opencode/skill/system-spec-kit/manual_testing_playbook/13--memory-quality-and-indexing/045-smarter-memory-content-generation-s1.md` |

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
| REQ-005 | Execute EX-041: invoke `memory_update` on an existing memory to modify its content, title, or importance tier | PASS if the memory is updated and subsequent retrieval reflects the new values; `updated_at` timestamp is refreshed. FAIL if update silently fails or old values persist after update |
| REQ-006 | Execute EX-042: invoke `memory_delete` on a known memory ID | PASS if the memory is removed and subsequent `memory_list` or `memory_search` no longer returns it; deletion is confirmed in response. FAIL if memory persists after delete or delete returns an error for a valid ID |
| REQ-007 | Execute EX-043: invoke `memory_bulk_delete` with a filter (e.g., by `specFolder` or `importanceTier`) targeting multiple memories in a sandbox | PASS if all matching memories are deleted; response reports the count of deleted items; non-matching memories are unaffected. FAIL if partial deletion occurs without error or non-matching memories are deleted |
| REQ-008 | Execute EX-044: invoke `memory_health(reportMode: "full")` and inspect the diagnostic output for database connectivity, embedding provider status, FTS integrity, and alias conflicts | PASS if health report returns a structured diagnostic with status fields for each subsystem (database, embedding, FTS, aliases); any detected issues are clearly flagged. FAIL if health check omits subsystem status or returns an unstructured error |
| REQ-009 | Execute EX-045: invoke `memory_index_scan` with `force: true` to trigger a full re-index, then invoke `memory_health` to verify index integrity post-repair | PASS if force scan completes with indexed/updated/failed counts; subsequent health check shows clean index state with no FTS mismatches. FAIL if force scan fails or health check reveals index corruption after scan |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Capture evidence for each scenario (tool output or screenshot) | Evidence recorded in implementation-summary.md |
| REQ-011 | Mark final verdict (PASS / PARTIAL / FAIL) per scenario following the review protocol | Verdict recorded against all 7 scenarios (EX-014, EX-035, EX-041 through EX-045) in implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: EX-014 completes with a scan report showing indexed and skipped counts
- **SC-002**: EX-035 demonstrates that incompatible runtime conditions are caught at startup
- **SC-003**: EX-041 updates a memory and subsequent retrieval confirms the new values
- **SC-004**: EX-042 deletes a memory and subsequent search confirms its absence
- **SC-005**: EX-043 bulk-deletes matching memories and reports the deletion count
- **SC-006**: EX-044 returns a structured health diagnostic covering all subsystems
- **SC-007**: EX-045 completes a force re-index and subsequent health check shows clean state
- **SC-008**: All seven verdicts are recorded and all P0 checklist items are checked
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Canonical playbook: `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` §04--maintenance | Source of truth for exact prompts and pass criteria | Treat as read-only; do not invent alternate criteria |
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
| Scope | 12/25 | 7 scenarios across read-only diagnostics and state-mutating operations |
| Risk | 14/25 | EX-035 requires controlled environment; EX-041/042/043 mutate state and require sandbox isolation; EX-045 force re-index can be slow |
| Research | 4/20 | Playbook provides context; new scenarios require sandbox setup knowledge |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
