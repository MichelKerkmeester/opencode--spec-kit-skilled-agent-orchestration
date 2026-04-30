---
title: "Implementation Plan: memory_search degradedReadiness Wiring"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Wire memory_search SearchDecisionEnvelope degradedReadiness using a handler-side graph readiness snapshot and shared mapper. The implementation keeps snapshot-derived telemetry minimal while allowing the helper to map richer code_graph_query payloads when explicitly provided."
trigger_phrases:
  - "025-memory-search-degraded-readiness-wiring"
  - "memory_search degradedReadiness plan"
  - "graph readiness telemetry mapper"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/025-memory-search-degraded-readiness-wiring"
    last_updated_at: "2026-04-29T09:45:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Authored Level 1 implementation plan"
    next_safe_action: "Create tasks.md, then implement mapper and handler wiring"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/graph-readiness-mapper.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/graph-readiness-mapper.vitest.ts"
    session_dedup:
      fingerprint: "sha256:025-memory-search-degraded-readiness-wiring-plan"
      session_id: "025-memory-search-degraded-readiness-wiring"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions:
      - "Mapper location: use mcp_server/lib/search/graph-readiness-mapper.ts because the consumer contract is SearchDecisionEnvelope telemetry."
      - "Root resolution: use process.cwd(), matching code_graph_status snapshot usage."
      - "Q2 default: helper supports both GraphReadinessSnapshot and the richer code_graph_query degraded payload, without fabricating fields."
---
# Implementation Plan: memory_search degradedReadiness Wiring

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, NodeNext ESM |
| **Framework** | MCP server handlers and Vitest |
| **Storage** | Existing code graph DB readiness state, read-only snapshot |
| **Testing** | `tsc --noEmit`, focused Vitest suites, strict spec validator |

### Overview

`memory_search` already builds a `SearchDecisionEnvelope`, but it omits `degradedReadiness`. The implementation adds a search-owned mapper helper, calls `getGraphReadinessSnapshot(process.cwd())` in the handler after the pipeline, and threads mapped telemetry into `buildSearchDecisionEnvelope`.

Snapshot-derived telemetry intentionally carries only `freshness`, `action`, `reason`, and derived `degraded`. The helper also accepts the richer `code_graph_query` payload shape for W10 reuse, but only copies fields already present in that payload.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable via REQ-001 through REQ-005
- [x] Dependencies identified: `getGraphReadinessSnapshot`, `SearchDecisionEnvelope`, PP-1 TC-3, W10 integration test

### Definition of Done
- [ ] REQ-001 shared mapper helper implemented and unit tested
- [ ] REQ-002 handler snapshot call and envelope threading implemented
- [ ] REQ-003 PP-1 TC-3 flipped from expected failure to passing assertion
- [ ] REQ-004 focused back-compat test command passes
- [ ] REQ-005 strict validator exits 0 for this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Handler-side telemetry adapter.

### Key Components
- **Graph readiness snapshot**: `getGraphReadinessSnapshot(process.cwd())` reads graph freshness without mutation.
- **Search telemetry mapper**: `mcp_server/lib/search/graph-readiness-mapper.ts` maps graph readiness data into the envelope telemetry contract.
- **Memory search handler**: `memory-search.ts` passes `degradedReadiness` into `buildSearchDecisionEnvelope`.
- **Tests**: PP-1 validates the live handler seam, W10 reuses the mapper, and a focused mapper test validates freshness-to-degraded derivation.

### Data Flow

`handleMemorySearch` executes the search pipeline, computes the existing query-plan and calibration telemetry, reads a graph readiness snapshot, maps it to `DegradedReadinessTelemetry`, and includes it in the search decision envelope. The mapper does not call runtime graph APIs and does not mutate graph state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Documentation Setup
- [x] Read `spec.md`, target runtime files, target tests, and Level 1 templates
- [x] Author `plan.md`
- [x] Author `tasks.md`

### Phase 2: Core Implementation
- [ ] Create `mcp_server/lib/search/graph-readiness-mapper.ts`
- [ ] Import `getGraphReadinessSnapshot` and mapper in `memory-search.ts`
- [ ] Thread mapped telemetry into `buildSearchDecisionEnvelope`
- [ ] Refactor W10 mapping to use the shared helper
- [ ] Flip PP-1 TC-3 to a passing test with deterministic snapshot mock
- [ ] Add focused mapper unit tests

### Phase 3: Verification
- [ ] Run `npx tsc --noEmit`
- [ ] Run focused Vitest command for handler, search-quality, and mapper suites
- [ ] Run strict validator on this packet
- [ ] Author `implementation-summary.md`
- [ ] Update `spec.md` continuity frontmatter
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Snapshot freshness mapping for fresh, stale, empty, error | Vitest |
| Handler seam | `handleMemorySearch` emits `degradedReadiness` in response and audit envelope | Vitest |
| Integration | Existing W10 degraded-readiness envelope behavior | Vitest |
| Static | Type safety across new helper and imports | `npx tsc --noEmit` |
| Documentation | Template and packet compliance | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `getGraphReadinessSnapshot(rootDir)` | Internal runtime API | Green | Handler cannot emit snapshot-derived readiness telemetry |
| `SearchDecisionEnvelope.degradedReadiness` input | Internal telemetry contract | Green | Builder signature would need change, which is out of scope |
| PP-1 live handler envelope seam | Test fixture | Green | TC-3 cannot prove the handler path |
| W10 degraded readiness test | Test fixture | Green | Shared mapper reuse cannot be validated against existing pattern |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Typecheck failure, focused tests failing after attempted fix, or strict validator failure that cannot be resolved within packet scope.
- **Procedure**: Revert the mapper file, handler imports/threading, and related test/doc changes from this packet. No code-graph runtime files are modified, so rollback is limited to search handler/test surfaces and packet docs.
<!-- /ANCHOR:rollback -->

