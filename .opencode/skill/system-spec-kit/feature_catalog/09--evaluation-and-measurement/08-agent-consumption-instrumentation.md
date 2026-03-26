---
title: "Agent consumption instrumentation"
description: "Describes the active retrieval handler instrumentation wiring for agent consumption logging, gated by SPECKIT_CONSUMPTION_LOG and graduated default ON."
---

# Agent consumption instrumentation

## 1. OVERVIEW

Describes the active retrieval handler instrumentation wiring for agent consumption logging, gated by `SPECKIT_CONSUMPTION_LOG` and graduated default ON.

This is the wiring that lets the system record how AI agents actually use search results in practice. The logger is now active through the graduated `SPECKIT_CONSUMPTION_LOG` feature flag, which defaults to enabled unless explicitly set to `false` or `0`.

---

## 2. CURRENT REALITY

Instrumentation wiring is present in the retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), and the runtime logger is active through `isConsumptionLogEnabled()`, which delegates to `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`.

Calls remain fail-safe so instrumentation errors never break the handlers, while production runtime can actively write new `consumption_log` rows whenever the flag remains enabled.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/telemetry/consumption-logger.ts` | Lib | Agent consumption logging |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/consumption-logger.vitest.ts` | Consumption logger tests |

---

## 4. SOURCE METADATA

- Group: Evaluation and measurement
- Source feature title: Agent consumption instrumentation
- Current reality source: FEATURE_CATALOG.md

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 012
