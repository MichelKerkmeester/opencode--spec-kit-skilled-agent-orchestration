---
title: "Feature Specification: manual-testing-per-playbook discovery phase"
description: "Phase 003 documents the discovery manual test packet. Execute scenarios EX-011, EX-012, and EX-013 against the Spec Kit Memory system to verify memory_list, memory_stats, and memory_health."
trigger_phrases:
  - "discovery manual testing"
  - "phase 003 discovery"
  - "EX-011 EX-012 EX-013"
  - "memory_list memory_stats memory_health test"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: manual-testing-per-playbook discovery phase

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
| **Predecessor** | [002-mutation](../002-mutation/spec.md) |
| **Successor** | [004-maintenance](../004-maintenance/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 003 discovery scenarios must be executed from scratch. All prior results are invalidated. The three discovery scenarios (EX-011, EX-012, EX-013) require fresh manual execution to verify that memory_list, memory_stats, and memory_health behave as specified by the canonical playbook.

### Purpose
Execute all three Phase 003 discovery scenarios, record verdicts and evidence, and mark this phase complete only when all P0 checklist items pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

| Test ID | Scenario Name | Playbook File |
|---------|---------------|---------------|
| EX-011 | Memory browser (memory_list) | `../../manual_testing_playbook/03--discovery/011-memory-browser-memory-list.md` |
| EX-012 | System statistics (memory_stats) | `../../manual_testing_playbook/03--discovery/012-system-statistics-memory-stats.md` |
| EX-013 | Health diagnostics (memory_health) | `../../manual_testing_playbook/03--discovery/013-health-diagnostics-memory-health.md` |

### Out of Scope
- Scenarios from other phases (retrieval, mutation, maintenance, lifecycle, etc.)
- Modifying the playbook or feature catalog source files
- Automated test harnesses — this phase is manual execution only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Rewrite | Phase 003 clean-slate specification |
| `plan.md` | Rewrite | Execution plan for Phase 003 |
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
| REQ-001 | Execute EX-011: invoke `memory_list` with `specFolder`, `limit`, and `offset` parameters | PASS if paginated list returns with memory items and total count |
| REQ-002 | Execute EX-012: invoke `memory_stats` with `folderRanking: "composite"` and `includeScores: true` | PASS if dashboard fields populate including counts, tiers, and folder ranking |
| REQ-003 | Execute EX-013: invoke `memory_health(reportMode: "full")` then `memory_health(reportMode: "divergent_aliases")` | PASS if both report modes complete with status and diagnostic output |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Capture evidence for each scenario (tool output or screenshot) | Evidence file or inline output recorded in implementation-summary.md |
| REQ-005 | Mark final verdict (PASS / PARTIAL / FAIL) per scenario following the review protocol | Verdict recorded against EX-011, EX-012, EX-013 in implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: EX-011 returns a paginated memory list with valid item count
- **SC-002**: EX-012 returns a stats dashboard with composite folder ranking and scores
- **SC-003**: EX-013 completes both report modes without error and returns a health status
- **SC-004**: All three verdicts are recorded and all P0 checklist items are checked
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Canonical playbook: `../scratch/context-playbook.md` §03--discovery | Source of truth for exact prompts and pass criteria | Treat as read-only; do not invent alternate criteria |
| Dependency | Feature catalog: `../scratch/context-feature-catalog.md` §03--discovery | Feature context for each scenario | Read before execution for background |
| Dependency | MCP runtime with indexed memory corpus | Required for all three tool invocations | Verify MCP server is running before starting |
| Risk | EX-013 `autoRepair: true` can mutate index state | Medium | Never pass `autoRepair: true` or `confirmed: true` during verification runs |
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
- **NFR-P01**: Each tool call must complete within the MCP server's default timeout
- **NFR-P02**: No scenario requires more than one retry to obtain a valid response

### Security
- **NFR-S01**: Run against a non-production indexed corpus; do not expose live user data
- **NFR-S02**: Do not trigger autoRepair operations during read-only discovery execution

### Reliability
- **NFR-R01**: All three scenarios must complete to claim phase done
- **NFR-R02**: Partial execution (only 1 or 2 scenarios) is not acceptable for phase closure
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty corpus: if `memory_list` returns 0 items, record as PARTIAL and note corpus state
- Zero divergent aliases: `groups: []` from EX-013 divergent_aliases mode is a valid PASS
- Stats with no folders: if `memory_stats` returns empty folder list, record as PARTIAL

### Error Scenarios
- MCP server not running: stop, start server, then retry
- Tool call timeout: retry once; if still failing, record as FAIL with error text
- `memory_health` FTS mismatch detected: record PARTIAL with exact error; do not repair

### State Transitions
- EX-013 full mode then divergent_aliases mode must both run in sequence before verdict
- Do not run scenarios in parallel; execute EX-011, EX-012, EX-013 in order
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | 3 read-only tool calls, no file changes |
| Risk | 5/25 | autoRepair risk mitigated by protocol |
| Research | 3/20 | Playbook provides all needed context |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
