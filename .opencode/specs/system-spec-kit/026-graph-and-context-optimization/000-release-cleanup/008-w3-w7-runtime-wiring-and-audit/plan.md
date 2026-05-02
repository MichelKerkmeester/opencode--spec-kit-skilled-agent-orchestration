---
title: "Implementation Plan: 008 W3-W7 Runtime Wiring and Audit"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2"
description: "Phased telemetry-first implementation for W8-W13, beginning with the SearchDecisionEnvelope contract and then wiring QueryPlan, shadow deltas, CocoIndex calibration, degraded-readiness, and decision audit."
trigger_phrases:
  - "008 implementation plan"
  - "search decision envelope plan"
  - "w8 w13 runtime wiring"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/008-w3-w7-runtime-wiring-and-audit"
    last_updated_at: "2026-04-29T04:45:00Z"
    last_updated_by: "codex"
    recent_action: "Authored Phase G plan before runtime edits"
    next_safe_action: "Implement Phase 1 W8 envelope contract"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:008-w3-w7-runtime-wiring-and-audit-plan-20260429"
      session_id: "008-w3-w7-runtime-wiring-and-audit-20260429"
      parent_session_id: "005-review-remediation"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Implementation order: W8, W12, W9, W11, audit/SLA, W10, cleanup, tenant threading."
---
# Implementation Plan: 008 W3-W7 Runtime Wiring and Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript ESM, Python compatibility shim |
| **Framework** | MCP server runtime, Vitest |
| **Storage** | Append-only JSONL audit/shadow sinks; existing SQLite remains behavior source |
| **Testing** | Focused Vitest plus Python compatibility suite/test |

### Overview
Implement telemetry-first runtime wiring for Phase F W3-W7 findings. The SearchDecisionEnvelope is the central composition object; all downstream changes attach decisions to that envelope and audit it without changing live ranking, refusal, routing, or overfetch behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase F research report read end-to-end.
- [x] File:line evidence cross-checked against current runtime files.
- [x] Gate 3 pre-answer accepted for this exact sub-phase.

### Definition of Done
- [ ] W8-W13 deliverables implemented or documented as known limitations.
- [ ] Tests pass for new and touched search-quality/advisor paths.
- [ ] `npm run typecheck` and `npm run build` exit 0.
- [ ] Strict validator exits 0 for this sub-phase.
- [ ] `implementation-summary.md` cites closure evidence with file:line references.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Telemetry-first composition around existing pipeline and handler boundaries.

### Key Components
- **SearchDecisionEnvelope**: Request-scoped telemetry contract with pure attach/build helpers.
- **Pipeline QueryPlan slot**: Carries upstream QueryPlan into Stage 3 so W4 can see real routing intelligence.
- **Advisor shadow sink**: Append-only durable record of W5 shadow deltas.
- **Decision audit**: Append-only runtime audit row plus pure SLA metric computation.
- **Degraded-readiness integration**: Real isolated code-graph state exercise that can populate envelope telemetry.

### Data Flow
`memory_search` builds query intelligence and a pipeline config, the pipeline populates rerank and calibration telemetry, the handler composes a SearchDecisionEnvelope, and the audit sink records the envelope. `memory_context` composes a lighter envelope from context routing metadata and records it at response exit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: W8 SearchDecisionEnvelope
- [ ] Create `lib/search/search-decision-envelope.ts`.
- [ ] Add typed envelope fields for request identity, QueryPlan, W3/W4/W5/W6/W7 telemetry, timestamp, and latency.
- [ ] Implement pure builder and attach helpers.
- [ ] Add W8 unit tests for empty, full, and partial composition.

### Phase 2: W12 QueryPlan to W4 Stage 3
- [ ] Add `queryPlan?: QueryPlan` to `PipelineConfig`.
- [ ] Build and pass actual QueryPlan from `memory-search.ts`.
- [ ] Replace `createEmptyQueryPlan({ complexity: 'unknown' })` in Stage 3 with config QueryPlan fallback.
- [ ] Expose rerank gate decision in Stage 3 metadata.
- [ ] Update W4 tests to assert real QueryPlan triggers.

### Phase 3: W9 Advisor Shadow Sink
- [ ] Add append-only JSONL sink with 10 MB rotation.
- [ ] Record `_shadow` deltas from `advisor-recommend.ts`.
- [ ] Preserve `_shadow` through `skill_advisor.py` compatibility output.
- [ ] Add append, rotation, and passthrough tests.

### Phase 4: W11 CocoIndex Calibration Telemetry
- [ ] Consume `calibrateCocoIndexOverfetch` in production code.
- [ ] Emit recommended multiplier into envelope/pipeline telemetry.
- [ ] Keep effective overfetch behavior unchanged unless existing opt-in flag is enabled.
- [ ] Add telemetry assertion tests.

### Phase 5: W13 Audit and SLA Metrics
- [ ] Add `decision-audit.ts` with append-only audit and pure SLA aggregation.
- [ ] Wire `memory_search` and `memory_context` to record envelopes at request end.
- [ ] Add audit row and SLA metric tests.

### Phase 6: W10 Real Degraded-Readiness Integration
- [ ] Add a search-quality integration test using an isolated real code graph DB.
- [ ] Issue actual `code_graph_query`.
- [ ] Assert degraded readiness is captured in SearchDecisionEnvelope.
- [ ] Keep W7 fixture cells as fixture-only supplements.

### Phase 7: Cleanup and Tenant Scope Threading
- [ ] Delete confirmed empty directories.
- [ ] Thread `tenantId`, `userId`, and `agentId` through envelope/audit metadata only.
- [ ] Document cleanup dispositions in `implementation-summary.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | W8 envelope helpers, W9 sink, W13 SLA computation | Vitest |
| Integration | W4 real QueryPlan, W10 degraded code graph, audit row write | Vitest |
| Compatibility | Python `_shadow` passthrough | Python via Vitest or direct Python test |
| Validation | Spec folder strict compliance | `validate.sh --strict` |
| Build | Type and emitted JS integrity | `npm run typecheck`, `npm run build` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase F research report | Internal | Green | Scope and evidence source. |
| W3-W7 modules from Phase E | Internal | Green | Existing contracts to consume. |
| Code graph isolated DB helpers | Internal | Green | Needed for W10 real degraded test. |
| Filesystem JSONL sinks | Internal | Green | Needed for W9/W13 audit. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Focused tests, typecheck, build, or strict validator fail and cannot be fixed within the attempt budget.
- **Procedure**: Revert this packet's telemetry/audit modules and handler imports as a single scoped change; existing W3-W7 modules remain intact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
W8 Envelope -> W12 QueryPlan/W4 -> W9 Shadow
      |              |              |
      v              v              v
W11 Calibration -> W13 Audit/SLA -> W10 Degraded Test -> Cleanup + Tenant Threading
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| W8 | None | W12, W11, W13, W10 |
| W12 | W8 | W4 closure |
| W9 | W8 | W5 closure |
| W11 | W8 | W6 closure |
| W13 | W8, W12, W9, W11 | Audit closure |
| W10 | W8 | W7 closure |
| Cleanup | None | Packet completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| W8 Envelope | Medium | 1-2 hours |
| W12 QueryPlan/W4 | Medium | 1-2 hours |
| W9 Shadow Sink | Medium | 1-2 hours |
| W11 Calibration | Medium | 1 hour |
| W13 Audit/SLA | Medium | 1-2 hours |
| W10 Integration | Medium | 1-2 hours |
| Verification | High | 1-3 hours |
| **Total** | | **7-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Behavior changes reviewed as telemetry-only.
- [ ] Audit/shadow sinks use fail-open writes.
- [ ] Existing W3-W7 tests remain green.

### Rollback Procedure
1. Remove handler wiring for `recordSearchDecision` and envelope attachment.
2. Remove new envelope/audit/shadow modules if necessary.
3. Restore Stage 3 QueryPlan fallback only if W4 tests expose a compatibility issue.
4. Re-run focused tests and strict validator.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Delete generated local JSONL audit files if test/runtime runs create them.
<!-- /ANCHOR:enhanced-rollback -->

