---
title: "Implementation Plan: Live Handler Envelope Capture Seam"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
description: "Create a focused Vitest behavioral seam for handleMemorySearch that proves SearchDecisionEnvelope response attachment and decision-audit JSONL emission with deterministic pipeline fixtures. The test keeps runtime and harness code untouched and documents the exact mock layer used."
trigger_phrases:
  - "023-live-handler-envelope-capture-seam"
  - "live handler envelope capture"
  - "handleMemorySearch behavioral test"
  - "search decision envelope audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/023-live-handler-envelope-capture-seam"
    last_updated_at: "2026-04-29T08:55:00Z"
    last_updated_by: "codex-gpt-5.5"
    recent_action: "Completed handler envelope/audit seam and strict packet validation"
    next_safe_action: "Phase K stress"
    blockers:
      - "Current memory_search handler does not pass degradedReadiness into buildSearchDecisionEnvelope"
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search-live-envelope.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/search/decision-audit.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-k-pp-1"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should degradedReadiness be wired into memory_search in a later runtime packet?"
    answered_questions:
      - "executePipeline may be mocked for deterministic live-handler envelope/audit coverage"
---
# Implementation Plan: Live Handler Envelope Capture Seam

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | Vitest, MCP handler modules |
| **Storage** | Temp JSONL audit file via `SPECKIT_SEARCH_DECISION_AUDIT_PATH`; database calls mocked only where needed |
| **Testing** | `npx vitest run tests/handler-memory-search-live-envelope.vitest.ts`, `npx tsc --noEmit` |

### Overview
Add a narrow behavioral test that imports `handleMemorySearch`, mocks the four-stage `executePipeline` boundary with deterministic candidate rows, and asserts the handler attaches the built `SearchDecisionEnvelope` to both camelCase and snake_case response keys. The same handler call must append at least one JSONL row through the real `recordSearchDecision` sink pointed at a temp audit path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable through handler response and audit JSONL assertions
- [x] Dependencies identified: gate-removal commit complete; no runtime/harness edits allowed

### Definition of Done
- [x] New behavioral Vitest exists under `mcp_server/tests/`
- [x] Test discloses mocked/real layers in a leading comment
- [x] Focused Vitest exits 0
- [x] `npx tsc --noEmit` exits 0
- [x] Strict packet validator exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Behavioral handler seam with deterministic boundary mocking.

### Key Components
- **`handleMemorySearch`**: Real handler entry under test.
- **`executePipeline` mock**: Deterministic retrieval boundary returning candidate rows and pipeline metadata.
- **Decision-audit sink**: Real `recordSearchDecision` path using a temp `SPECKIT_SEARCH_DECISION_AUDIT_PATH`.
- **Response parser**: Test helper that unwraps the MCP response envelope and reads `data`.

### Data Flow
The test calls `handleMemorySearch` with a representative query and scoped tenant identity. The mocked pipeline returns deterministic rows and timing metadata; the real handler formats results, builds the envelope, attaches it to response data, and records the envelope to the temp audit JSONL path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read packet contract, handler envelope path, envelope builder, audit sink, nearby tests, and Phase H findings
- [x] Confirm test-only scope and no runtime/harness write boundary
- [x] Author template-aligned plan and task docs

### Phase 2: Core Implementation
- [x] Create `handler-memory-search-live-envelope.vitest.ts`
- [x] Mock `executePipeline` with deterministic candidate rows and stage metadata
- [x] Stub only DB/readiness side effects required for the handler to finish
- [x] Assert response envelope and audit JSONL shape
- [x] Capture the degraded-readiness limitation truthfully if the handler still does not expose it

### Phase 3: Verification
- [x] Run focused Vitest
- [x] Run TypeScript no-emit check
- [x] Run strict spec validator
- [x] Write implementation summary and update continuity
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Behavioral unit | Direct `handleMemorySearch` response envelope with deterministic pipeline fixture | Vitest |
| Audit integration | Real `recordSearchDecision` append to temp JSONL path | Vitest + `node:fs` |
| Static verification | Type compatibility across test and existing MCP server code | `npx tsc --noEmit` |
| Packet validation | Level 1 packet hygiene and metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `010-vestigial-embedding-readiness-gate-removal` | Internal | Green | Direct handler tests would time out without it |
| `executePipeline` mock boundary | Internal | Green | Keeps test deterministic without asserting retrieval correctness |
| `SPECKIT_SEARCH_DECISION_AUDIT_PATH` | Runtime env | Green | Required to prove handler audit emission without touching default data files |
| `degradedReadiness` memory_search wiring | Internal | Yellow | Current handler does not pass degraded readiness into the envelope; test must not fake this with builder mocks |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Focused Vitest or TypeScript check cannot pass without runtime/harness changes, or test requires misleading mocks to satisfy the contract.
- **Procedure**: Remove the new test file and packet docs from this packet, then report the blocking handler seam as a P1 follow-up with source evidence.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
