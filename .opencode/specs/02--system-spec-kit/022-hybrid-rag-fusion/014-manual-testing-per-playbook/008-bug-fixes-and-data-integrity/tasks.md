---
title: "Tasks: Manual Testing — Bug Fixes and Data Integrity"
description: "Task Format: T### [P?] Description (scenario ID)"
trigger_phrases:
  - "bug fixes and data integrity tasks"
  - "manual testing tasks"
  - "scenario execution tasks"
importance_tier: "normal"
contextType: "general"
---
# Tasks: Manual Testing — Bug Fixes and Data Integrity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (scenario ID)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm MCP server is running — `memory_health` call succeeds
- [ ] T002 Create pre-test checkpoint — `checkpoint_create({ name: "pre-008-testing" })`
- [ ] T003 Verify DB has at least 5 existing memories
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Execute and record scenario 001 — Graph channel ID fix (G1)
- [ ] T005 Execute and record scenario 002 — Chunk collapse deduplication (G3)
- [ ] T006 Execute and record scenario 003 — Co-activation fan-effect divisor (R17)
- [ ] T007 Execute and record scenario 004 — SHA-256 content-hash deduplication (TM-02)
- [ ] T008 Execute and record scenario 065 — Database and schema safety
- [ ] T009 Execute and record scenario 068 — Guards and edge cases
- [ ] T010 Execute and record scenario 075 — Canonical ID dedup hardening
- [ ] T011 Execute and record scenario 083 — Math.max/min stack overflow elimination
- [ ] T012 Execute and record scenario 084 — Session-manager transaction gap fixes
- [ ] T013 Execute and record scenario 116 — Chunking safe swap atomicity (P0-6)
- [ ] T014 Execute and record scenario 117 — SQLite datetime session cleanup (P0-7)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T015 Confirm all 11 P0 checklist items checked with evidence
- [ ] T016 Fill in implementation-summary.md with overall results and date
- [ ] T017 Restore from checkpoint if DB was modified destructively
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001–T017 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All 11 scenarios have PASS or tracked FAIL in checklist.md
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Playbook source**: `.opencode/skill/system-spec-kit/manual_testing_playbook/08--bug-fixes-and-data-integrity/`
<!-- /ANCHOR:cross-refs -->
