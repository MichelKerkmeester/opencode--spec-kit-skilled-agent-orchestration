# Agent consumption instrumentation

## Current Reality

Instrumentation wiring remains present in retrieval handlers (`memory_search`, `memory_context`, `memory_match_triggers`), but the runtime logger is currently inert/deprecated (`isConsumptionLogEnabled()` hardcoded `false`). Calls remain fail-safe no-ops for compatibility while telemetry paths stay structurally available.

The earlier pattern-analysis outcome from this workstream still informed ground-truth design, but current production runtime does not actively write new consumption-log rows unless instrumentation is reactivated.

## Source Metadata

- Group: Evaluation and measurement
- Source feature title: Agent consumption instrumentation
- Current reality source: feature_catalog.md
