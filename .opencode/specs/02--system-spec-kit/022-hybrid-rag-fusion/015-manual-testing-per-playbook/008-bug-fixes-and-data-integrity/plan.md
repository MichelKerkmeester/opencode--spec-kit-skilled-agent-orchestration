---
title: "Implem [02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/008-bug-fixes-and-data-integrity/plan]"
description: "Execution plan for running all 11 bug-fixes-and-data-integrity manual test scenarios from the hybrid-rag-fusion playbook."
trigger_phrases:
  - "manual testing plan"
  - "bug fixes and data integrity"
  - "playbook execution"
  - "test execution plan"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Manual Testing — Bug Fixes and Data Integrity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript / Node.js MCP server |
| **Framework** | spec-kit-memory MCP, SQLite via better-sqlite3 |
| **Storage** | SQLite (memory_index.db) |
| **Testing** | Manual execution via MCP tool calls |

### Overview

This plan covers sequential manual execution of 11 playbook scenarios that verify bug fixes and data integrity in the hybrid-rag-fusion memory system. Scenarios are run in playbook ID order. Each scenario is executed, observed, and the result is recorded in checklist.md and tasks.md. No code changes are expected — this is a verification-only phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] MCP server is running and responding to tool calls
- [ ] SQLite DB has at least 5 existing memories for read scenarios
- [ ] Tester has read the playbook file for each scenario before starting
- [ ] A checkpoint exists or can be created before destructive tests

### Definition of Done

- [ ] All 11 scenario tasks marked complete in tasks.md
- [ ] All 11 P0 checklist items checked with evidence in checklist.md
- [ ] implementation-summary.md filled in with overall result and date
- [ ] No unresolved FAIL findings without a tracked follow-up
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Manual test execution — sequential scenario runner

### Key Components

- **Playbook files**: Source of truth for each scenario's steps and expected outcomes. Located in `.opencode/skill/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/`
- **MCP tool chain**: All scenario steps are executed via `mcp__spec_kit_memory__*` tools
- **SQLite DB**: State store under test; read before and after each mutating scenario
- **checklist.md**: Evidence log — one P0 item per scenario, updated as runs complete
- **tasks.md**: Progress tracker — one task per scenario, marked complete on pass

### Data Flow

Tester reads playbook scenario → executes MCP calls → observes response → compares to expected outcome → records PASS/FAIL in checklist and tasks
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Environment Setup

- [ ] Confirm MCP server is running (`memory_health` call succeeds)
- [ ] Create a named checkpoint: `checkpoint_create({ name: "pre-008-testing" })`
- [ ] Verify DB has sufficient seed data (at least 5 memories exist)
- [ ] Read scenario files 001–004 from the playbook before starting

### Phase 2: Core Data Integrity Scenarios (001–004)

- [ ] Execute scenario 001 — Graph channel ID fix (G1)
- [ ] Execute scenario 002 — Chunk collapse deduplication (G3)
- [ ] Execute scenario 003 — Co-activation fan-effect divisor (R17)
- [ ] Execute scenario 004 — SHA-256 content-hash deduplication (TM-02)
- [ ] Record PASS/FAIL with evidence for each in checklist.md

### Phase 3: Database and Safety Scenarios (065, 068, 075)

- [ ] Execute scenario 065 — Database and schema safety
- [ ] Execute scenario 068 — Guards and edge cases
- [ ] Execute scenario 075 — Canonical ID dedup hardening
- [ ] Record PASS/FAIL with evidence for each in checklist.md

### Phase 4: Runtime and Concurrency Scenarios (083, 084, 116, 117)

- [ ] Execute scenario 083 — Math.max/min stack overflow elimination
- [ ] Execute scenario 084 — Session-manager transaction gap fixes
- [ ] Execute scenario 116 — Chunking safe swap atomicity (P0-6)
- [ ] Execute scenario 117 — SQLite datetime session cleanup (P0-7)
- [ ] Record PASS/FAIL with evidence for each in checklist.md

### Phase 5: Wrap-Up

- [ ] Confirm all 11 tasks complete in tasks.md
- [ ] Confirm all 11 P0 checklist items checked
- [ ] Fill in implementation-summary.md
- [ ] Restore from checkpoint if DB state was modified destructively
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Each of the 11 bug-fix scenarios | MCP tool calls |
| Verification | Response structure and data integrity | Visual inspection of tool output |
| Evidence | Capture tool responses | Copy/paste tool output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| MCP server | Internal | Green | Cannot execute any scenarios |
| SQLite DB with test data | Internal | Green | Some scenarios require existing records |
| Pre-test checkpoint | Internal | Green | Destructive scenarios need rollback capability |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: DB mutation in scenario 084 leaves dirty state or scenario 116 atomicity test corrupts subsequent scenarios
- **Procedure**: Restore from checkpoint created in Phase 1; verify graph integrity; rerun only the affected scenario

### Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Server not running at test start | Medium | Blocks all scenarios | Run `memory_health` as first step; restart server if needed |
| Scenario 116 race window too narrow to observe | Medium | Inconclusive result | Run 3 times; document environment concurrency level |
| DB mutation in scenario 084 leaves dirty state | Low | Corrupts subsequent scenarios | Restore from checkpoint created in Phase 1 |
| Schema version mismatch in scenario 065 | Low | False positive fail | Document DB schema version in evidence note |
<!-- /ANCHOR:rollback -->
