---
title: "Spec: memory_search degradedReadiness Wiring"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Wire degradedReadiness into SearchDecisionEnvelope from memory_search via getGraphReadinessSnapshot + shared mapper helper. Closes PP-1 TC-3 expected_fail and the v1.0.3 stress test envelope completeness gap."
trigger_phrases:
  - "025-memory-search-degraded-readiness-wiring"
  - "memory_search degradedReadiness"
  - "graph readiness snapshot envelope"
  - "DegradedReadinessTelemetry mapper"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring"
    last_updated_at: "2026-04-29T09:58:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Implemented memory_search degradedReadiness wiring via handler-side snapshot and shared mapper"
    next_safe_action: "Resolve out-of-scope core/index export drift, then rerun npx tsc --noEmit"
    blockers:
      - "npx tsc --noEmit fails on missing core/index exports outside the 025 target authority"
    completion_pct: 90
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: memory_search degradedReadiness Wiring

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented, typecheck blocked |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `011-mcp-runtime-stress-remediation` |
| **Source** | PP-1 TC-3 expected_fail (`023-live-handler-envelope-capture-seam`) + design recommendation from gpt-5.5 xhigh corrected by direct code inspection |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`SearchDecisionEnvelope.degradedReadiness` (defined in `mcp_server/lib/search/search-decision-envelope.ts:31-42`) is currently always undefined when emitted by `memory_search`. The handler's envelope construction at `mcp_server/handlers/memory-search.ts:1161-1182` passes `queryPlan`, `trustTreeInput`, `rerankGateDecision`, `cocoindexCalibration`, `pipelineTiming`, but no `degradedReadiness`.

PP-1's behavioral test TC-3 is encoded as `expected_fail` to document this gap (`mcp_server/tests/handler-memory-search-live-envelope.vitest.ts`). The W10 integration test already demonstrates the canonical mapping from a graph readiness payload to `DegradedReadinessTelemetry` (`mcp_server/tests/search-quality/w10-degraded-readiness-integration.vitest.ts:46-66`).

### Architectural correction (vs initial gpt-5.5 xhigh recommendation)

Initial recommendation assumed the search pipeline calls `handleCodeGraphQuery`. Direct code inspection shows it does NOT — `handleCodeGraphQuery` is only invoked from the standalone MCP tool wrapper (`code_graph/tools/code-graph-tools.ts`) and code-graph self-tests. The search pipeline reads graph topology only as scoring boosts (`stage2-fusion.ts:88-93`: `applyCommunityBoost`, `applyGraphSignals`, `computeUsageBoost`), never invoking `handleCodeGraphQuery`.

This means **Option A (pipeline carries channel response upward) is not applicable** — there is no graph channel to surface. The corrected design is **Option C (handler-side snapshot)**: handler calls the non-mutating `getGraphReadinessSnapshot()` (`mcp_server/code_graph/lib/ensure-ready.ts:508-524`) post-pipeline, maps to `DegradedReadinessTelemetry` via a shared helper, threads into envelope build.

The "drift" concern that disqualified snapshot-based approaches in the initial reasoning does not apply here: the search pipeline never mutates graph state, so a non-mutating snapshot returns exactly what the pipeline's graph-boost stages saw.

### Purpose

Add a shared `mapGraphReadinessToTelemetry()` helper that consumes a `GraphReadinessSnapshot` and returns `DegradedReadinessTelemetry`. Wire `getGraphReadinessSnapshot()` into the `memory_search` handler post-pipeline. Pass mapped telemetry into `buildSearchDecisionEnvelope`. Refactor W10 + PP-1 TC-3 to use the shared helper. PP-1 TC-3 flips from `expected_fail` to passing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create shared mapper `mapGraphReadinessToTelemetry()` somewhere appropriate (e.g., `mcp_server/lib/search/graph-readiness-mapper.ts` OR co-located with the snapshot in `code_graph/lib/`). Implementer chooses; spec.md notes the choice.
- Mapper input: `GraphReadinessSnapshot` (`code_graph/lib/ensure-ready.ts:489-493`, fields: `freshness`, `action`, `reason`).
- Mapper output: `DegradedReadinessTelemetry` (`mcp_server/lib/search/search-decision-envelope.ts:31-42`, populated fields: `freshness`, `action`, `reason`, plus `degraded` derived from non-`fresh` freshness; other fields left undefined since they require richer producer-side context not available from a snapshot).
- Handler wiring: `mcp_server/handlers/memory-search.ts` calls `getGraphReadinessSnapshot(rootDir)` before building the envelope; passes mapped telemetry into `buildSearchDecisionEnvelope({ degradedReadiness })`.
- Refactor: W10 (`tests/search-quality/w10-degraded-readiness-integration.vitest.ts`) inline mapping is replaced by a call to the shared helper for the snapshot path. The `handleCodeGraphQuery`-derived path stays as-is since it produces the richer payload.
- Refactor: PP-1 TC-3 (`tests/handler-memory-search-live-envelope.vitest.ts`) flips from `expected_fail` to `expected_pass` and asserts envelope's `degradedReadiness` matches the snapshot.
- New focused vitest for the mapper.
- Strict validator green on this packet.

### Out of Scope

- Changing `handleCodeGraphQuery`, `ensureCodeGraphReady`, or any code-graph runtime.
- Changing `buildSearchDecisionEnvelope` signature (already accepts `degradedReadiness`).
- Adding richer producer-side fields (`blocked`, `fallbackDecision`, `requiredAction`, etc.) to the snapshot path. Those fields are populated only via the `handleCodeGraphQuery`-derived path (W10 pattern). Snapshot-derived telemetry is intentionally minimal.
- Wiring memory_context to call code_graph_query as a structural retrieval channel — that is `027-memory-context-structural-channel-research`.
- Deprecating the embedding-readiness scaffolding — that is `026-readiness-scaffolding-cleanup`.

### Files to Change/Create

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-readiness-mapper.ts` (or equivalent) | Create | Shared mapper helper |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Edit | Wire snapshot + mapper into envelope build |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts` | Edit | Flip TC-3 from expected_fail to expected_pass |
| `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/w10-degraded-readiness-integration.vitest.ts` | Edit (minor) | Use shared helper where the inputs are a snapshot |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-readiness-mapper.vitest.ts` (or equivalent) | Create | Focused mapper unit test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Shared mapper helper exists. | New file exports `mapGraphReadinessToTelemetry(snapshot: GraphReadinessSnapshot): DegradedReadinessTelemetry`; mapper unit test exits 0. |
| REQ-002 | Handler invokes snapshot + maps + threads. | `memory-search.ts` builds envelope with `degradedReadiness` populated from `getGraphReadinessSnapshot(rootDir)` mapped via the helper. |
| REQ-003 | PP-1 TC-3 flips. | `expected_fail` removed; assertion proves `envelope.degradedReadiness.freshness` matches the snapshot's freshness in TC-3. |
| REQ-004 | Back-compat. | All existing `handler-memory-search*`, `search-quality/*`, and `memory-search-integration` vitest suites pass unchanged (or with documented minor adjustments for the new field's presence). |
| REQ-005 | Strict validator on this packet exits 0. | `validate.sh <packet> --strict` passes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Mapper unit test green; handler test (PP-1) green; back-compat green.
- **SC-002**: PP-1 TC-3 expected_fail removed.
- **SC-003**: Strict validator green.
- **SC-004**: Future stress cycles see `degradedReadiness` populated on envelopes from `memory_search` calls.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
### Acceptance Scenarios

**Given** `memory_search` completes a pipeline run, **when** the handler builds `SearchDecisionEnvelope`, **then** the envelope includes snapshot-derived `degradedReadiness` with `freshness`, `action`, `reason`, and derived `degraded`.

**Given** PP-1 TC-3 mocks the readiness snapshot as `empty`, **when** the live handler seam test calls `memory_search`, **then** TC-3 passes without `it.fails` and asserts the envelope freshness is defined.

## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | `getGraphReadinessSnapshot` requires a `rootDir` argument; handler may not have it readily | Handler can use `process.cwd()` or an existing resolved root; verify against the W10 test's pattern (`vi.spyOn(process, 'cwd').mockReturnValue(tempDir)`) |
| Risk | Snapshot-derived telemetry is minimal (only freshness/action/reason); consumers may expect richer fields | Spec OUT-OF-SCOPE clarifies this; richer fields require the `handleCodeGraphQuery`-path which is not invoked by memory_search |
| Dependency | `010-vestigial-embedding-readiness-gate-removal` shipped (e91d2c7c2) — not directly related but unblocked the PP-1 test that surfaces this | Already on main |
| Dependency | `023-live-handler-envelope-capture-seam` shipped (af22aa045) — TC-3 expected_fail will flip | Already on main |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1: Where to locate the mapper helper — `lib/search/` (consumer-side) or `code_graph/lib/` (producer-side)? **Default**: `lib/search/graph-readiness-mapper.ts` since the consumer is the search envelope; producer-side stays purely about graph readiness.
- Q2: Should the mapper accept richer payloads (the `handleCodeGraphQuery` response shape from W10) too, returning the richer telemetry? **Default**: yes — single helper with two overloads or a discriminated union input. W10 + memory_search both call the same helper.
<!-- /ANCHOR:questions -->
