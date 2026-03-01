---
title: "Tasks: Memory Plugin Dashboard Optimization [002-memory-plugin/tasks]"
description: "Task breakdown by user story for the Memory Plugin Dashboard Optimization feature."
trigger_phrases:
  - "tasks"
  - "memory"
  - "plugin"
  - "dashboard"
  - "optimization"
  - "002"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: Memory Plugin Dashboard Optimization

Task breakdown by user story for the Memory Plugin Dashboard Optimization feature.

<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v1.0 -->

---

## Task Status Summary

| Status | Count |
|--------|-------|
| ✅ Complete | 12 |
| ⏸️ Deferred | 0 |
| ❌ Blocked | 0 |
| 📋 Not Started | 0 |
| **Total** | **12** |

---

## User Story 1: Compact Context Injection (P0)

> As an AI agent, I need a compact memory dashboard injected at session start so that I can see available context without consuming excessive tokens.

### Tasks

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| T-001-1 | Update configuration constants | P0 | ✅ Complete | MAX_INDEX_TOKENS, MAX_CONSTITUTIONAL, etc. |
| T-001-2 | Implement getMemoryIndex() query function | P0 | ✅ Complete | UNION ALL with subqueries |
| T-001-3 | Implement formatMemoryDashboard() formatter | P0 | ✅ Complete | ASCII dashboard with tier sections |
| T-001-4 | Update transform hook integration | P0 | ✅ Complete | Uses getCachedMemoryIndex() |

---

## User Story 2: Memory ID Discovery (P0)

> As an AI agent, I need to see memory IDs in the dashboard so that I can load specific memories on-demand using `memory_load({ memoryId: # })`.

### Tasks

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| T-002-1 | Display memory IDs in dashboard entries | P0 | ✅ Complete | Format: `#39 │ Title` |
| T-002-2 | Add footer with command syntax | P0 | ✅ Complete | LOAD and SEARCH commands |

---

## User Story 3: Token Budget Compliance (P1)

> As a system administrator, I need the dashboard to stay within 500-1,000 tokens so that context injection doesn't impact agent performance.

### Tasks

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| T-003-1 | Implement formatTimeAgo() helper | P1 | ✅ Complete | "1h ago", "2d ago" format |
| T-003-2 | Implement truncateTriggers() helper | P1 | ✅ Complete | Limits to 3 triggers |
| T-003-3 | Implement formatMemoryEntry() | P1 | ✅ Complete | Title truncation, padding |
| T-003-4 | Verify token count < 1,000 | P1 | ✅ Complete | ~487 tokens measured |

---

## Verification Tasks

| ID | Task | Priority | Status | Notes |
|----|------|----------|--------|-------|
| T-VER-1 | Syntax check (node --check) | P0 | ✅ Complete | Passed |
| T-VER-2 | SQL query execution test | P0 | ✅ Complete | Fixed UNION ALL syntax |

---

## Completion Evidence

- **Syntax Check:** `node --check index.js` - PASSED
- **Token Count:** ~487 tokens (within 1,000 budget)
- **SQL Query:** Fixed to use subqueries with UNION ALL
- **Dashboard Format:** Matches approved spec design

---

## References

- **Spec:** `spec.md` - Requirements and user stories
- **Plan:** `plan.md` - Implementation phases
- **Memory:** `memory/implementation-complete.md` - Implementation record
