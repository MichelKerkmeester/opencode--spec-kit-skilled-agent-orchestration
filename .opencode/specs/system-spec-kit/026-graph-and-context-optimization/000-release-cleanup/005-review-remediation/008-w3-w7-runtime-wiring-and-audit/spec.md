---
title: "Feature Specification: 008 W3-W7 Runtime Wiring and Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
description: "Telemetry-first Phase G remediation that wires W3-W7 search/RAG decisions into a request-scoped SearchDecisionEnvelope and durable audit surfaces."
trigger_phrases:
  - "008 w3 w7 runtime wiring and audit"
  - "search decision envelope"
  - "telemetry first runtime wiring"
  - "w3 w7 audit"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/008-w3-w7-runtime-wiring-and-audit"
    last_updated_at: "2026-04-29T04:45:00Z"
    last_updated_by: "codex"
    recent_action: "Initialized Phase G telemetry-first runtime wiring packet from Phase F research findings"
    next_safe_action: "Implement W8 SearchDecisionEnvelope before W12 and downstream audit workstreams"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:008-w3-w7-runtime-wiring-and-audit-20260429"
      session_id: "008-w3-w7-runtime-wiring-and-audit-20260429"
      parent_session_id: "005-review-remediation"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Gate 3 pre-answered A for this exact sub-phase."
      - "Telemetry-first: do not change ranking, refusal, routing, or overfetch behavior by default."
---
# Feature Specification: 008 W3-W7 Runtime Wiring and Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-29 |
| **Branch** | `main` |
| **Parent** | `026-graph-and-context-optimization/000-release-cleanup/005-review-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase F found that W3-W7 exist as useful local artifacts, but runtime decisions remain fragmented: W3 and W6 are test-only, W5 is response-only, W7 is fixture-only, and W4 is underfed by an unknown empty QueryPlan. Without a shared decision envelope, the search stack cannot audit trust, rerank, shadow scoring, CocoIndex calibration, or degraded-readiness state per request.

### Purpose
Add telemetry-first runtime wiring so W3-W7 decisions are observable, durable, and tenant-scoped without changing ranking, refusal, routing, or overfetch behavior by default.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create a typed `SearchDecisionEnvelope` and pure composition helpers.
- Thread real QueryPlan data into W4 Stage 3 rerank gating.
- Persist W5 advisor shadow deltas to an append-only sink and preserve `_shadow` through the Python compatibility shim.
- Wire W6 CocoIndex calibration as telemetry only.
- Add a real degraded-readiness integration test supplement for W7.
- Add decision audit and SLA metric helpers, then call them from `memory_search` and `memory_context`.
- Thread `tenantId`, `userId`, and `agentId` through the decision envelope and audit logs.
- Delete the two empty directory candidates when they are still empty and safe.

### Out of Scope
- Writes under `006/001` license audit packet.
- Any default ranking, refusal, routing, learned-weight, or overfetch behavior change.
- Rewriting or removing existing W3-W7 modules.
- Network-dependent CocoIndex, model, or reranker calls.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Create/Modify | Phase G packet docs and continuity. |
| `description.json`, `graph-metadata.json` | Create/Modify | Discovery and graph metadata. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-decision-envelope.ts` | Create | W8 request-scoped decision envelope. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/decision-audit.ts` | Create | W13 audit sink and SLA metrics. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts` | Modify | Add QueryPlan and decision-envelope telemetry slots to pipeline contracts. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | Modify | Pass real QueryPlan into W4 rerank gate and expose decision metadata. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Modify | Build and audit SearchDecisionEnvelope for memory search requests. |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` | Modify | Build and audit SearchDecisionEnvelope for memory context requests. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/shadow/shadow-sink.ts` | Create | W9 append-only shadow delta sink with rotation. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts` | Modify | Persist emitted `_shadow` deltas. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` | Modify | Preserve `_shadow` in the compatibility output. |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/` | Create/Modify | W8/W10/W11/W13 tests plus W4 update. |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/` | Create/Modify | W9 sink and Python passthrough tests. |
| `.opencode/skill/system-spec-kit/mcp_server/tmp-test-fixtures/specs/` | Delete | Empty-folder cleanup if still empty. |
| `.opencode/skill/system-spec-kit/specs/.../007-search-rag-measurement-driven-implementation/measurements/` | Delete | Duplicate empty stub cleanup if still empty. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve telemetry-first behavior. | No default ranking, refusal, routing, learned-weight, or overfetch behavior changes. |
| REQ-002 | Create W8 SearchDecisionEnvelope. | Envelope version 1 carries request, scope identity, QueryPlan, W3/W4/W5/W6/W7 telemetry, timestamp, and latency. |
| REQ-003 | Wire W12 real QueryPlan into W4. | Stage 3 uses the upstream QueryPlan instead of an unknown empty plan; tests assert complex-query and high-authority triggers fire. |
| REQ-004 | Persist W9 advisor shadow deltas. | `_shadow` records append to JSONL and rotate over 10 MB; Python compatibility preserves `_shadow`. |
| REQ-005 | Wire W11 CocoIndex calibration as telemetry only. | `calibrateCocoIndexOverfetch` has a production consumer and recommended multiplier appears in envelope telemetry without changing effective overfetch. |
| REQ-006 | Add W10 real degraded-readiness integration coverage. | Test drives an actual isolated code-graph degraded state and reflects it into `degradedReadiness`. |
| REQ-007 | Add W13 audit and SLA helpers. | `memory_search` and `memory_context` emit one structured decision audit row per uncached/completed request path where an envelope exists. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Tenant scope is threaded into decision telemetry. | `tenantId`, `userId`, and `agentId` pass through pipeline config, envelope, W3/W4/W6 inputs, and audit rows as metadata only. |
| REQ-009 | Existing W3-W7 modules remain intact. | Existing tests still pass; modules are consumed or extended, not removed or rewritten. |
| REQ-010 | Empty-folder cleanup is resolved. | Both candidates are deleted if still empty, or rationale is documented in implementation-summary. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: W3 `buildTrustTree` has at least one production consumer through the envelope composer.
- **SC-002**: W4 Stage 3 rerank gate receives a real QueryPlan from pipeline config.
- **SC-003**: W5 `_shadow` persists to an append-only sink and survives Python compatibility translation.
- **SC-004**: W6 `calibrateCocoIndexOverfetch` has at least one production consumer and emits telemetry only.
- **SC-005**: W7 gains a real degraded code-graph integration supplement while existing fixture cells remain supplemental.
- **SC-006**: Focused Vitest, typecheck, build, and strict validator exit 0.

### Acceptance Scenarios

- **Given** a memory search request with routing telemetry, when Stage 3 evaluates conditional rerank, then the rerank gate receives the real QueryPlan and records its decision without changing rank behavior unless existing rerank prerequisites already allow it.
- **Given** advisor recommendations emit `_shadow`, when the handler returns output, then each shadow delta is also appended to the durable sink and the Python compatibility shim preserves the shadow payload.
- **Given** CocoIndex-like candidates with duplicate paths, when calibration telemetry is computed, then the recommended multiplier is attached to the SearchDecisionEnvelope without changing the effective runtime multiplier by default.
- **Given** an isolated degraded code graph, when `code_graph_query` returns a blocked envelope, then W10 test code reflects the real readiness state into `degradedReadiness` rather than using static fixture output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Envelope grows response payloads. | Medium | Attach concise telemetry and store full audit row in JSONL. |
| Risk | Stage 3 rerank tests can accidentally require cross-encoder behavior. | Medium | Assert gate metadata and pure helper behavior, not model output. |
| Risk | Shadow sink writes during tests. | Low | Make sink path configurable in tests and fail-open in runtime. |
| Dependency | Existing code-graph isolation helpers. | Medium | Reuse `initDb(tempDir)` sweep pattern from existing degraded tests. |
| Dependency | Strict spec validator. | Low | Keep Level 2 anchors and metadata aligned with templates. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Envelope and audit writes must be fail-open and must not block search results on sink errors.
- **NFR-P02**: Audit and shadow rotation must cap JSONL growth without synchronous heavy cleanup.

### Security
- **NFR-S01**: Scope identity fields are audit metadata only; no authorization or ranking decisions may branch on them in this packet.
- **NFR-S02**: Audit rows must avoid secrets and store only bounded request/decision metadata.

### Reliability
- **NFR-R01**: Missing sinks, filesystem errors, and unavailable graph state must degrade to omitted telemetry or warnings, not handler failure.
- **NFR-R02**: New tests must use isolated temp paths and not mutate the live code graph DB.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty result sets: envelope still records QueryPlan, trust tree, rerank decision, and latency.
- Cached responses: audit may be limited to response-level metadata because the pipeline did not execute.
- Missing QueryPlan: Stage 3 falls back to an explicit telemetry-only unknown plan, never an implicit empty plan hidden from callers.

### Error Scenarios
- Shadow sink unavailable: advisor output still returns `_shadow`; warning only.
- Audit sink unavailable: search/context responses still return.
- Code graph unavailable: `degradedReadiness` captures canonical readiness and trust state when the test or runtime supplies it.

### State Transitions
- Rotation: `shadow-deltas.jsonl` and search audit JSONL rotate when size exceeds the configured cap.
- Partial completion: unfinished workstreams are documented in `implementation-summary.md` known limitations rather than promoted silently.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Multiple runtime handlers, search pipeline, advisor shim, tests, docs. |
| Risk | 16/25 | Telemetry-only changes reduce behavioral blast radius. |
| Research | 16/20 | Phase F provided full findings; this packet cross-checks current code reality. |
| **Total** | **54/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None blocking. Behavior promotion for W5/W6 remains a future measurement decision outside this packet.
<!-- /ANCHOR:questions -->
