---
title: "Implementation Summary: memory_search degradedReadiness Wiring"
template_source: "SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2"
description: "memory_search now emits SearchDecisionEnvelope.degradedReadiness from a read-only code graph readiness snapshot. PP-1 TC-3 is flipped from expected failure to a passing handler assertion."
trigger_phrases:
  - "025-memory-search-degraded-readiness-wiring"
  - "memory_search degradedReadiness implementation"
  - "SearchDecisionEnvelope degradedReadiness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring"
    last_updated_at: "2026-04-29T09:55:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Implemented handler-side degradedReadiness wiring and focused tests"
    next_safe_action: "Resolve out-of-scope core/index typecheck export errors, then rerun npx tsc --noEmit"
    blockers:
      - "npx tsc --noEmit fails before packet-specific errors on missing core/index exports: isEmbeddingModelReady, setEmbeddingModelReady, waitForEmbeddingModel"
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/graph-readiness-mapper.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/graph-readiness-mapper.vitest.ts"
    session_dedup:
      fingerprint: "sha256:025-memory-search-degraded-readiness-wiring-implementation"
      session_id: "025-memory-search-degraded-readiness-wiring"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Should the separate core/index export drift be handled in a follow-up packet so full typecheck can pass?"
    answered_questions:
      - "Snapshot-derived telemetry stays minimal: freshness, action, reason, degraded."
      - "Richer code_graph_query payload mapping copies only fields present in the payload."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 025-memory-search-degraded-readiness-wiring |
| **Completed** | 2026-04-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`memory_search` now attaches graph readiness telemetry to every emitted `SearchDecisionEnvelope`. The handler reads the non-mutating code graph readiness snapshot after the search pipeline, maps it into the envelope contract, and passes it through the existing builder input without changing code-graph runtime behavior.

### Shared Readiness Mapper

The new `mapGraphReadinessToTelemetry()` helper lives in `mcp_server/lib/search/graph-readiness-mapper.ts` because the mapping is owned by the search envelope contract. Snapshot inputs emit only `freshness`, `action`, `reason`, and derived `degraded`; richer `code_graph_query` payload inputs copy canonical readiness, trust state, blocked state, omitted-answer state, required action, and fallback decision only when those fields already exist.

### Handler Wiring

`handleMemorySearch` now calls `getGraphReadinessSnapshot(process.cwd())`, maps the snapshot, and supplies `degradedReadiness` to `buildSearchDecisionEnvelope`. This closes PP-1 TC-3 without routing memory search through `handleCodeGraphQuery` and without mutating graph readiness state.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-readiness-mapper.ts` | Created | Shared mapper for snapshot and richer code graph readiness payloads |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modified | Calls readiness snapshot and threads mapped telemetry into `SearchDecisionEnvelope` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts` | Modified | Removes TC-3 expected failure and asserts deterministic snapshot-derived readiness |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts` | Modified | Replaces inline richer-payload mapping with the shared helper |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-readiness-mapper.vitest.ts` | Created | Covers fresh, stale, empty, and error snapshot mapping |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring/plan.md` | Created | Records architecture, phases, verification plan, and mapper location decision |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring/tasks.md` | Created | Tracks setup, implementation, verification, and completion criteria |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring/spec.md` | Modified | Updates continuity and packet status |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The change was delivered through a handler-local snapshot call and a pure mapper helper, then verified with the live handler seam, existing search-quality degraded-readiness coverage, and focused mapper unit tests.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Locate the mapper in `lib/search` | The output contract is `SearchDecisionEnvelope.degradedReadiness`, so the adapter belongs with search telemetry rather than code-graph readiness internals. |
| Use `process.cwd()` for `rootDir` | `code_graph_status` uses the same snapshot helper with `process.cwd()`, and `memory-search.ts` has no narrower resolved root pattern. |
| Keep snapshot telemetry minimal | `getGraphReadinessSnapshot` only owns `freshness`, `action`, and `reason`; blocked state and fallback decisions require richer handler payloads. |
| Support richer payloads without fabricating fields | W10 already maps the `handleCodeGraphQuery` response shape; the helper now centralizes that copy logic while preserving producer-owned semantics. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/handler-memory-search-live-envelope.vitest.ts stress_test/search-quality/ tests/graph-readiness-mapper.vitest.ts` | PASS: 17 test files, 34 tests |
| `npx tsc --noEmit` | FAIL: existing out-of-scope missing exports from `../core/index.js` and `../../core/index.js` for `isEmbeddingModelReady`, `setEmbeddingModelReady`, and `waitForEmbeddingModel` |
| Strict validator on packet | PASS: strict validator exited 0 after adding acceptance scenarios and fixing `Spec Folder` metadata |

### Requirement Disposition

| Requirement | Disposition |
|-------------|-------------|
| REQ-001 | Met: shared mapper exists with focused unit coverage |
| REQ-002 | Met: handler invokes snapshot, maps telemetry, and passes `degradedReadiness` |
| REQ-003 | Met: PP-1 TC-3 is no longer `it.fails` and asserts snapshot freshness |
| REQ-004 | Met for focused Vitest coverage; full typecheck is blocked by out-of-scope export drift |
| REQ-005 | Met: strict validator exits 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full typecheck is blocked outside this packet.** `npx tsc --noEmit` currently fails on missing `core/index.js` exports used by `memory-crud*` and `shadow-evaluation-runtime`; those files are outside the 025 target authority.
2. **Snapshot telemetry is intentionally sparse.** `memory_search` does not emit `blocked`, `graphAnswersOmitted`, `requiredAction`, or `fallbackDecision` from the snapshot path because `getGraphReadinessSnapshot` does not provide those semantics.
<!-- /ANCHOR:limitations -->
