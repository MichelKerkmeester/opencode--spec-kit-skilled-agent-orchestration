---
title: "Spec: Live Handler Envelope Capture Seam"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Behavioral test that exercises handleMemorySearch end-to-end with seeded fixtures and proves SearchDecisionEnvelope + decision-audit + shadow JSONL emission from the live handler path. Closes the v1.0.3 stress test live-handler probe gap (now unblocked by 010-vestigial-embedding-readiness-gate-removal)."
trigger_phrases:
  - "023-live-handler-envelope-capture-seam"
  - "live handler envelope capture"
  - "handleMemorySearch behavioral test"
  - "search decision envelope test"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/023-live-handler-envelope-capture-seam"
    last_updated_at: "2026-04-29T08:55:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Completed live handler envelope/audit seam with green focused checks and strict validation"
    next_safe_action: "Phase K stress"
    blockers:
      - "memory_search does not currently pass degradedReadiness into buildSearchDecisionEnvelope"
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: Live Handler Envelope Capture Seam

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
| **Source** | Phase J research PP-1 (`../022-stress-test-results-deep-research/research/research-report.md`) |
| **Dependency** | `005-review-remediation/010-vestigial-embedding-readiness-gate-removal` (already merged on main; readiness gate gone) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The v1.0.3 stress test (Phase H) tried to capture full live-handler `SearchDecisionEnvelope` rows by importing `handleMemorySearch` directly and invoking it with corpus inputs. It failed with `Embedding model not ready after 30s timeout`. The root cause (vestigial readiness gate) is now fixed in commit `e91d2c7c2`. The gate is gone, but no behavioral test exists that proves the live handler path actually emits envelope + audit + shadow rows end-to-end.

Without that test, the v1.0.3 finding "live-handler envelope emission unproven" persists. The Phase K stress cycle v1.0.4 needs a deterministic capture path that doesn't depend on packet-local wrapper code.

### Purpose

Add a single behavioral vitest at `mcp_server/tests/handler-memory-search-live-envelope.vitest.ts` (or equivalent) that:

1. Calls `handleMemorySearch` directly with seeded DB/pipeline fixtures.
2. Reaches envelope construction and `recordSearchDecision` without any packet-local wrapper.
3. Asserts a `SearchDecisionEnvelope` is built with all contracted fields populated.
4. Asserts at least one decision-audit JSONL row is appended via `SPECKIT_SEARCH_DECISION_AUDIT_PATH` pointed at a temp file.
5. Asserts shadow JSONL row(s) appended via the advisor shadow sink (or documents that this path is exercised separately).
6. Documents whether `executePipeline` is real, seeded, or mocked — "live handler" claim must match that layer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New vitest file at `mcp_server/tests/handler-memory-search-live-envelope.vitest.ts`.
- Seed-fixture helpers if needed (kept inline in the test or in a sibling fixture file).
- Use `SPECKIT_SEARCH_DECISION_AUDIT_PATH` env var pointed at `os.tmpdir()` to assert audit emission.
- Read assertions on the test's own JSONL output; cleanup in `afterEach`.

### Out of Scope

- Changing `handleMemorySearch` itself.
- Changing `recordSearchDecision`, `buildSearchDecisionEnvelope`, or any production module.
- Changing the harness (`mcp_server/tests/search-quality/`) — that's PP-2 (`024-harness-telemetry-export-mode`).
- Multi-tenant or multi-corpus sweeps — those belong in v1.0.4 stress cycle.

### Files to Change/Create

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts` | Create | The behavioral test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (none)

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Behavioral test exists and runs green. | New vitest file present; `npx vitest run tests/handler-memory-search-live-envelope.vitest.ts` exits 0. |
| REQ-002 | Test reaches envelope construction. | Response payload contains `searchDecisionEnvelope` (camel) AND `search_decision_envelope` (snake), or the test asserts envelope was built via spy/return-value capture. |
| REQ-003 | Test writes a real decision-audit JSONL row. | Test sets `SPECKIT_SEARCH_DECISION_AUDIT_PATH` to a tmp file, runs the handler, reads the file, asserts ≥1 row matches the envelope JSON contract. |
| REQ-004 | Layer disclosure documented. | Test file's leading comment states whether `executePipeline` is real, seeded, or mocked, and which fields are deterministic vs derived. |
| REQ-005 | Strict validator on this packet exits 0. | `bash .opencode/skill/.../validate.sh <packet> --strict` passes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Test green.
- **SC-002**: Audit JSONL emitted by the handler — not by a packet-local wrapper.
- **SC-003**: Strict validator green.
- **SC-004**: A future v1.0.4 stress cycle can extend this test pattern across the corpus without re-discovering the seam.

### Acceptance Scenarios

1. **Given** `executePipeline` returns deterministic candidate rows and metadata, when the test calls `handleMemorySearch` with a representative query, then the MCP response data includes both `searchDecisionEnvelope` and `search_decision_envelope` with matching versioned envelope content.

2. **Given** `SPECKIT_SEARCH_DECISION_AUDIT_PATH` points to a temp file, when the test calls `handleMemorySearch`, then at least one JSONL row is appended and parses as a `SearchDecisionEnvelope`-compatible object with latency, trust-tree decision, and pipeline timing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Pipeline execution requires too much fixture setup for one test | Mock `executePipeline` if needed; document layer in test comment per REQ-004 |
| Risk | Audit path env-var has process-wide side effects | Use `vi.stubEnv` (or equivalent) and restore in `afterEach` |
| Dependency | `010-vestigial-embedding-readiness-gate-removal` already merged | Verified on main |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Q1: Should the test mock `executePipeline` or seed a real DB? **Default**: mock with deterministic candidates; the goal is envelope/audit emission, not retrieval correctness.
- Q2: Should the shadow JSONL path be exercised in this test or a sibling? **Default**: exercise here only if it's automatic from the handler call; otherwise note that advisor-recommend handler covers shadow emission separately.
<!-- /ANCHOR:questions -->
