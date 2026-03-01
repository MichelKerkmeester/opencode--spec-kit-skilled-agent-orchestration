---
title: "Tasks: Memory Command Consolidation [083-memory-command-consolidation/tasks]"
description: "Spec ID: 083-memory-command-consolidation"
trigger_phrases:
  - "tasks"
  - "memory"
  - "command"
  - "consolidation"
  - "083"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Memory Command Consolidation

**Spec ID:** 083-memory-command-consolidation
**Created:** 2025-02-02
**Updated:** 2025-02-03
**Status:** COMPLETE

---

## Task Overview

| ID | Task | Phase | Priority | Status |
|----|------|-------|----------|--------|
| T1 | Audit search.md patterns | P1 | P0 | ✅ complete |
| T2 | Add deprecation to search.md | P1 | P0 | ✅ complete |
| T3 | Create temporary search→context alias | P1 | P0 | ✅ complete |
| T4 | Create manage.md from database.md | P2 | P0 | ✅ complete |
| T5 | Add checkpoint subcommands to manage | P2 | P0 | ✅ complete |
| T6 | Deprecate database.md and checkpoint.md | P2 | P0 | ✅ complete |
| T7 | Add subcommand routing to learn.md | P3 | P1 | ✅ complete |
| T8 | Implement learn correct subcommand | P3 | P1 | ✅ complete |
| T9 | Implement learn undo/history subcommands | P3 | P1 | ✅ complete |
| T10 | Deprecate correct.md | P3 | P1 | ✅ complete |
| T11 | Delete /memory:why command file | P4 | P1 | ✅ complete |
| T12 | Update spec_kit references to why | P4 | P1 | ✅ complete |
| T13 | Clean up MCP dependencies | P4 | P1 | ✅ complete |
| T14 | Remove all deprecated files | P5 | P2 | ✅ complete |
| T15 | Final documentation update | P5 | P2 | ✅ complete |

---

## Phase 1: Search → Context (P0)  COMPLETE

### T1: Audit search.md patterns ✅
**Priority:** P0 | **Effort:** 1 hour | **Completed:** 2025-02-02

**Results:**
- ✅ Dashboard mode verified in context.md
- ✅ Direct load by ID verified
- ✅ Semantic search verified
- ✅ Folder browse verified
- ✅ Anchor extraction verified
- ✅ Triggers view verified

All patterns supported by `/memory:context`.

---

### T2: Add deprecation to search.md ✅
**Priority:** P0 | **Effort:** 30 min | **Completed:** 2025-02-02

**Results:**
- ✅ search.md file DELETED (not just deprecated)
- ✅ `/memory:search` now absorbed by `/memory:context`
- ✅ All documentation references updated

---

### T3: Create temporary search→context alias ✅
**Priority:** P0 | **Effort:** 1 hour | **Completed:** 2025-02-02

**Results:**
- ✅ Alias not needed - direct deletion chosen
- ✅ context.md handles all search patterns natively

---

## Phase 2: Database/Checkpoint → Manage (P0)  COMPLETE

### T4: Create manage.md from database.md ✅
**Priority:** P0 | **Effort:** 2 hours | **Completed:** 2025-02-02

**Results:**
- ✅ manage.md created at `.opencode/command/memory/manage.md`
- ✅ All database functionality preserved
- ✅ MCP tools verified (L3-L5 tools working)

---

### T5: Add checkpoint subcommands to manage ✅
**Priority:** P0 | **Effort:** 3 hours | **Completed:** 2025-02-02

**Implemented subcommands:**
```
/memory:manage checkpoint create <name>
/memory:manage checkpoint restore <name>
/memory:manage checkpoint list
/memory:manage checkpoint delete <name>
```

**Results:**
- ✅ All 4 checkpoint operations working
- ✅ Added checkpoint validation before delete (H4 bug fix)
- ✅ Added rollback mechanism for restore (H5 bug fix)

---

### T6: Deprecate database.md and checkpoint.md ✅
**Priority:** P0 | **Effort:** 1 hour | **Completed:** 2025-02-02

**Results:**
- ✅ database.md DELETED (absorbed by manage.md)
- ✅ checkpoint.md DELETED (absorbed by manage.md)

---

## Phase 3: Correct → Learn (P1)  COMPLETE

### T7: Add subcommand routing to learn.md ✅
**Priority:** P1 | **Effort:** 2 hours | **Completed:** 2025-02-02

**Results:**
- ✅ Subcommand detection logic added
- ✅ Default mode unchanged (captures new learning)
- ✅ Help text updated with new subcommands

---

### T8: Implement learn correct subcommand ✅
**Priority:** P1 | **Effort:** 3 hours | **Completed:** 2025-02-02

**Results:**
- ✅ `/memory:learn correct <id> [type]` working
- ✅ All correction types supported (deprecated, superseded, inaccurate, outdated, merged)
- ✅ Penalty/boost system working
- ✅ Constitutional tier protection working

---

### T9: Implement learn undo/history subcommands ✅
**Priority:** P1 | **Effort:** 2 hours | **Completed:** 2025-02-02

**Results:**
- ✅ `/memory:learn undo <id>` working
- ✅ `/memory:learn history` working

---

### T10: Deprecate correct.md ✅
**Priority:** P1 | **Effort:** 30 min | **Completed:** 2025-02-02

**Results:**
- ✅ correct.md DELETED (absorbed by learn.md)

---

## Phase 4: Delete Why (P1)  COMPLETE

### T11: Delete why.md ✅
**Priority:** P1 | **Effort:** 30 min | **Completed:** 2025-02-02

**Results:**
- ✅ why.md deleted from `.opencode/command/memory/`
- ✅ No orphaned references in memory folder

---

### T12: Update spec_kit references ✅
**Priority:** P1 | **Effort:** 2 hours | **Completed:** 2025-02-02

**Results:**
- ✅ All references to `/memory:why` removed from documentation
- ✅ SKILL.md updated - removed row for /memory:why
- ✅ README.md updated - command count 9→5
- ✅ CHANGELOG.md updated - v1.2.1.0 entry added
- ✅ mcp_server/README.md updated - tool references fixed

---

### T13: Clean up MCP dependencies ✅
**Priority:** P1 | **Effort:** 1 hour | **Completed:** 2025-02-02

**Results:**
- ✅ Fixed `memory_drift_context` → `memory_context` (everywhere)
- ✅ Removed `memory_drift_learn` references (doesn't exist)
- ✅ Tool count corrected: 23→22 registered tools
- ✅ `memory_causal_why` kept (still used by causal graph features)

---

## Phase 5: Cleanup (P2)  COMPLETE

### T14: Remove all deprecated files ✅
**Priority:** P2 | **Effort:** 1 hour | **Completed:** 2025-02-02

**Files removed:**
- ✅ search.md - deleted
- ✅ database.md - deleted
- ✅ checkpoint.md - deleted
- ✅ correct.md - deleted
- ✅ why.md - deleted

**Remaining files (5):**
```
.opencode/command/memory/
├── context.md     ✅
├── continue.md    ✅
├── learn.md       ✅
├── manage.md      ✅
└── save.md        ✅
```

---

### T15: Final documentation update ✅
**Priority:** P2 | **Effort:** 1 hour | **Completed:** 2025-02-03

**Results:**
- ✅ All command references updated (35+ occurrences)
- ✅ Template alignment fixes (87 total changes)
- ✅ Logic bugs fixed (7 bugs: 2 high, 5 medium severity)
- ✅ 31 reference files verified clean
- ✅ Final legacy reference fixed: `templates/memory/README.md` line 119

---

## Progress Tracking

```
Phase 1: ██████████ 100% (3 tasks) ✅
Phase 2: ██████████ 100% (3 tasks) ✅
Phase 3: ██████████ 100% (4 tasks) ✅
Phase 4: ██████████ 100% (3 tasks) ✅
Phase 5: ██████████ 100% (2 tasks) ✅
─────────────────────────────────
Overall:  ██████████ 100% (15 tasks) ✅ COMPLETE
```

---

## Completion Summary

| Metric | Value |
|--------|-------|
| Tasks completed | 15/15 (100%) |
| Commands consolidated | 9 → 5 (44% reduction) |
| Files deleted | 5 command files |
| Logic bugs fixed | 7 |
| Deprecated refs fixed | 35+ |
| Template alignment fixes | 87 |
| Reference files verified | 31 |
| Completion date | 2025-02-03 |
