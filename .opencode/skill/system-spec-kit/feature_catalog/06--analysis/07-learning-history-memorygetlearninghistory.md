---
title: "Learning history (memory_get_learning_history)"
description: "Covers the learning history retrieval tool that aggregates Learning Index trends across completed tasks in a spec folder."
---

# Learning history (memory_get_learning_history)

## 1. OVERVIEW

Covers the learning history retrieval tool that aggregates Learning Index trends across completed tasks in a spec folder.

This shows you a report card of learning across all completed tasks in a project. You can see the average learning score, which tasks produced the biggest breakthroughs and whether your understanding is trending up or down over time. It is like a fitness tracker for knowledge growth.

---

## 2. CURRENT REALITY

Retrieves learning records for a spec folder with optional filtering by session ID and completion status. Each record shows the preflight scores, postflight scores, computed deltas and Learning Index.

The summary statistics are where this tool earns its keep. Across all completed tasks in a spec folder, you see the average Learning Index, maximum and minimum LI, average knowledge gain, average uncertainty reduction and average context improvement. Trend interpretation maps the average LI to a human-readable assessment: above 15 is a strong learning trend, above 7 is positive, above 0 is slight, exactly 0 is neutral and below zero is regression.

Pass `onlyComplete: true` to restrict results to tasks where both preflight and postflight were recorded. This gives you clean data for trend analysis without incomplete records skewing the averages. Summary statistics are included by default; pass `includeSummary: false` when you only want the raw learning history rows. Records are ordered by `updated_at` descending so the most recent learning cycles appear first.

Handler safety around the backing table is tighter now. Schema initialization is tracked per database instance with `WeakSet<Database>` instead of a process-global boolean, so swapping to a fresh DB connection still creates the `session_learning` table and index when needed. Score validation also rejects `NaN` via `Number.isFinite(...)`, closing the old loophole where `typeof NaN === 'number'` let malformed learning scores pass validation.

The runtime tool schema labels `memory_get_learning_history` as `[L7:Maintenance]`, even though this catalog groups it under Analysis. Treat the catalog placement as a documentation grouping rather than the handler's runtime layer classification.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/session-learning.ts` | Session learning handler: history retrieval, summary statistics, trend interpretation |
| `mcp_server/core/db-state.ts` | Database state management for `session_learning` table and WeakSet schema tracking |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for `memory_get_learning_history` arguments |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `memory_get_learning_history` (labeled `[L7:Maintenance]`) |
| `mcp_server/tools/lifecycle-tools.ts` | Lifecycle tool dispatcher for learning tools |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-session-learning.vitest.ts` | Session learning handler validation |
| `mcp_server/tests/integration-learning-history.vitest.ts` | Learning history integration |
| `mcp_server/tests/learning-stats-filters.vitest.ts` | Learning stats filter tests including `includeSummary` and `onlyComplete` |

---

## 4. MANUAL PLAYBOOK COVERAGE

| Scenario | Role |
|----------|------|
| `EX-025` | Direct manual validation for filtered/completed learning-history retrieval |

---

## 5. SOURCE METADATA

- Group: Analysis
- Source feature title: Learning history (memory_get_learning_history)
- Current reality source: FEATURE_CATALOG.md
