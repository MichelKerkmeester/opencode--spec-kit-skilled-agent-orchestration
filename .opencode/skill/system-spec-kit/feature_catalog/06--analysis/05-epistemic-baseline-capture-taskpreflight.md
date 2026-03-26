---
title: "Epistemic baseline capture (task_preflight)"
description: "Covers the preflight tool that records knowledge, uncertainty and context completeness baselines before task execution."
---

# Epistemic baseline capture (task_preflight)

## 1. OVERVIEW

Covers the preflight tool that records knowledge, uncertainty and context completeness baselines before task execution.

Before starting a task, this tool records how much you know, how uncertain you are and how complete your context is. It is like taking a "before" photo at the start of a home renovation. Later, you can compare against the "after" to measure how much progress you made and what you learned along the way.

---

## 2. CURRENT REALITY

Before starting implementation work, this tool records how much the agent knows, how uncertain it is and how complete the context is. All three scores are on a 0-100 scale. You can optionally list identified knowledge gaps as an array of strings.

Records are stored in the `session_learning` table with a `UNIQUE` constraint on `(spec_folder, task_id)`. If a preflight record already exists for the same combination and is still in the "preflight" phase, calling preflight again updates the existing record rather than creating a duplicate. Completed records (where postflight has already run) cannot be overwritten. That guard prevents accidental resets of finished learning cycles.

The purpose of preflight is establishing a baseline for learning measurement. Without knowing where you started, you cannot measure how much you learned. The postflight tool completes the measurement.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/session-learning.ts` | Session learning handler: preflight baseline capture, UNIQUE constraint on (spec_folder, task_id) |
| `mcp_server/core/db-state.ts` | Database state management for `session_learning` table |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for `task_preflight` arguments |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `task_preflight` |
| `mcp_server/tools/lifecycle-tools.ts` | Lifecycle tool dispatcher for learning tools |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-session-learning.vitest.ts` | Session learning handler validation |
| `mcp_server/tests/integration-learning-history.vitest.ts` | Learning history integration |
| `mcp_server/tests/learning-stats-filters.vitest.ts` | Learning stats filter tests |

---

## 4. MANUAL PLAYBOOK COVERAGE

| Scenario | Role |
|----------|------|
| `EX-023` | Direct manual validation for creating the task preflight baseline |

---

## 5. SOURCE METADATA

- Group: Analysis
- Source feature title: Epistemic baseline capture (task_preflight)
- Current reality source: FEATURE_CATALOG.md
