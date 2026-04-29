---
title: "Spec: Harness Telemetry Export Mode"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Extend search-quality harness to natively carry SearchDecisionEnvelope + decision-audit + shadow telemetry on result types. Retires the packet-local wrapper pattern that v1.0.3 stress test had to use."
trigger_phrases:
  - "024-harness-telemetry-export-mode"
  - "harness telemetry export"
  - "search quality telemetry mode"
  - "harness envelope output"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/024-harness-telemetry-export-mode"
    last_updated_at: "2026-04-29T09:35:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Completed harness telemetry export mode"
    next_safe_action: "Use the native harness telemetry path in future stress packets instead of packet-local wrappers"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: Harness Telemetry Export Mode

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `011-mcp-runtime-stress-remediation` |
| **Source** | Phase J research PP-2 (`../022-stress-test-results-deep-research/research/research-report.md`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The search-quality harness at `mcp_server/stress_test/search-quality/` is intentionally database-agnostic and result-oriented:

- `SearchQualityChannelOutput` (harness.ts:29) holds candidates, refusal, citations, final answer, latency.
- `SearchQualityCaseResult` (harness.ts:46) records candidate maps, captures, relevance, citation/refusal policy, latency.

There is no native slot for `SearchDecisionEnvelope`, decision-audit rows, or shadow rows. The v1.0.3 stress test had to compose a packet-local wrapper that imported production builders directly to produce envelope/audit/shadow samples. This duplicates code, masks differences between harness and runtime emission, and is the source of the v1.0.3 "telemetry samples are packet-local, not native harness output" caveat.

### Purpose

Extend the harness so a runner can return optional telemetry fields, the result types preserve them per case, and an export option writes JSONL without a packet-local wrapper. Existing fixture-only tests must not regress.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add optional telemetry fields to `SearchQualityChannelOutput`:
  - `telemetry?: { envelope?: SearchDecisionEnvelope; auditRows?: SearchDecisionEnvelope[]; shadowRows?: ShadowDeltaRecord[] }`
- Preserve those fields through `SearchQualityChannelCapture` and `SearchQualityCaseResult`.
- Add an optional harness option `options.telemetryExportPath?: string` that appends per-case telemetry to a JSONL file (or three sibling JSONL files, one per record type).
- Baseline test: existing search-quality tests still pass with no telemetry (back-compat).
- New telemetry-mode test: a runner returns an envelope + audit row + shadow row; harness preserves them in the result and writes them to the export path.

### Out of Scope

- Modifying the corpus contract (`corpus.ts`).
- Changing production runtime modules (`search-decision-envelope.ts`, `decision-audit.ts`, `shadow-sink.ts`).
- Wiring the harness into the live `handleMemorySearch` path — that's PP-1 (`023`).
- Multi-corpus or multi-tenant export — out of scope; v1.0.4 stress cycle handles corpus extension.

### Files to Change/Create

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness.ts` | Edit | Extend types + add export-path option |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/harness-telemetry-export.vitest.ts` | Create | New telemetry-mode test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Telemetry fields added to harness types. | `SearchQualityChannelOutput.telemetry?` exists and propagates through `SearchQualityChannelCapture` and `SearchQualityCaseResult`. |
| REQ-002 | Optional `telemetryExportPath` option. | Setting the option writes JSONL appendable rows for envelope + audit + shadow per case. |
| REQ-003 | Baseline back-compat. | All existing `stress_test/search-quality/*.vitest.ts` pass unchanged. |
| REQ-004 | New telemetry-mode test green. | `harness-telemetry-export.vitest.ts` exits 0 with assertions on result-type preservation and JSONL export shape. |
| REQ-005 | Strict validator on this packet exits 0. | `validate.sh <packet> --strict` passes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Harness types carry telemetry as opt-in.
- **SC-002**: JSONL export path works without a packet-local wrapper.
- **SC-003**: All existing search-quality tests pass.
- **SC-004**: Strict validator green.

### Acceptance Scenarios

- **SCN-001**: **Given** a runner returns envelope, audit, and shadow telemetry, **When** the harness completes the case, **Then** the case result exposes the telemetry in memory.
- **SCN-002**: **Given** `telemetryExportPath` is set, **When** the harness completes telemetry-bearing cases, **Then** the sibling envelope, audit, and shadow JSONL files contain the expected rows.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Type changes break consumers outside stress_test/search-quality | Telemetry field is optional; baseline back-compat REQ-003 enforces this |
| Risk | JSONL export collides between concurrent test runs | Use unique tmp file paths per test (e.g., includes pid + iso timestamp + random) |
| Dependency | None (independent of 023) | This packet does NOT block PP-1; both can ship in parallel |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1: Should export be one JSONL file with discriminator field, or three sibling files (envelope, audit, shadow)? **Default**: three sibling files mirroring v1.0.3 measurement layout.
- Q2: Should the telemetry builder be a separate `options.telemetryBuilder` callback, or fields directly in the runner output? **Default**: fields directly in runner output for simplicity; callback can be added later.
<!-- /ANCHOR:questions -->
