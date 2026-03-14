# Agent consumption instrumentation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)
- [6. PLAYBOOK COVERAGE](#6--playbook-coverage)

## 1. OVERVIEW
Describes the retrieval handler instrumentation wiring for agent consumption logging, currently inert but structurally preserved for reactivation.

## 2. CURRENT REALITY
Instrumentation wiring remains present in retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), but the runtime logger is currently inert/deprecated (`isConsumptionLogEnabled()` hardcoded `false`). Calls remain fail-safe no-ops for compatibility while telemetry paths stay structurally available.

The earlier pattern-analysis outcome from this workstream still informed ground-truth design, but current production runtime does not actively write new consumption-log rows unless instrumentation is reactivated.

## 3. IN SIMPLE TERMS
This is the wiring that lets the system record how AI agents actually use search results in practice. It is currently turned off but kept in place so it can be switched back on later. The earlier data it collected helped shape better test questions by showing real usage patterns instead of guessed ones.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/telemetry/consumption-logger.ts` | Lib | Agent consumption logging |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/consumption-logger.vitest.ts` | Consumption logger tests |

## 5. SOURCE METADATA
- Group: Evaluation and measurement
- Source feature title: Agent consumption instrumentation
- Current reality source: feature_catalog.md

## 6. PLAYBOOK COVERAGE
- Mapped to manual testing playbook scenario NEW-012

