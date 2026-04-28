---
title: "Implementation Plan: 006 Search Query RAG Optimization"
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2"
description: "Three-phase implementation plan for measurement-first search-quality infrastructure, telemetry-only query-plan emission, and planned workstream handoff."
trigger_phrases:
  - "006 search query rag optimization plan"
  - "search harness plan"
  - "query plan telemetry plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-search-query-rag-optimization"
    last_updated_at: "2026-04-28T21:02:24Z"
    last_updated_by: "codex"
    recent_action: "Completed three-phase Phase D implementation plan"
    next_safe_action: "Plan workstreams 3-7 from harness data"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/search-quality/"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/query/query-plan.ts"
    session_dedup:
      fingerprint: "sha256:006-search-query-rag-optimization-plan-20260428"
      session_id: "006-search-query-rag-optimization-20260428"
      parent_session_id: "019-search-query-rag-optimization-research"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 006 Search Query RAG Optimization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js ESM |
| **Framework** | MCP server runtime under `system-spec-kit` |
| **Storage** | None for new harness baseline; production memory DB untouched |
| **Testing** | Vitest, TypeScript compiler, spec validator |

### Overview
This packet implements Phase D as measurement-first infrastructure. Phase 1 creates a deterministic search-quality harness; Phase 2 adds a telemetry-only `QueryPlan` contract to existing query intelligence surfaces; Phase 3 documents workstreams 3-7 as planned follow-up work rather than prematurely changing ranking behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase C report read end-to-end.
- [x] Active Finding Registry and Planning Packet cross-checked.
- [x] Gate 3 target folder pre-approved by user.
- [x] Target authority excludes `006/001` license audit packet.

### Definition of Done
- [x] Harness corpus, runner, metrics, and baseline test exist.
- [x] Query-plan contract emits from classifier, router, and intent classifier without behavior changes.
- [x] Workstreams 3-7 documented as planned with rationale.
- [x] Focused Vitest, typecheck, build, and strict validators recorded.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive telemetry plus test-infrastructure harness.

### Key Components
- **Search-quality corpus**: Small deterministic fixtures derived from v1.0.1/v1.0.2 stress themes, ambiguous queries, and paraphrases.
- **Harness runner**: Injectable per-channel runner model for `memory_search`, `code_graph_query`, and `skill_graph_query`; captures latency, candidate sets, policy survival, and relevance.
- **Metrics module**: Pure metric functions for precision@k, recall@k, p50/p95/p99 latency, refusal survival, and citation quality.
- **QueryPlan module**: Typed contract and small builders used by classifier/router/intent surfaces.

### Data Flow
A corpus query enters the harness, each configured channel runner returns candidates or an error, and the harness computes final relevance and policy observations for metric summarization. Separately, runtime query classification and routing construct `QueryPlan` telemetry next to existing classification and route results; downstream callers can inspect it but existing channel selection remains unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Harness
- [x] Create `tests/search-quality/corpus.ts` fixture corpus.
- [x] Create `tests/search-quality/harness.ts` injectable runner and capture model.
- [x] Create `tests/search-quality/metrics.ts` pure metric functions.
- [x] Create `tests/search-quality/baseline.vitest.ts` deterministic baseline assertions.

### Phase 2: Query-Plan Telemetry
- [x] Create `lib/query/query-plan.ts` typed contract and builders.
- [x] Wire complexity telemetry in `query-classifier.ts`.
- [x] Wire channel and artifact telemetry in `query-router.ts`.
- [x] Wire intent telemetry in `intent-classifier.ts`.
- [x] Create `tests/query-plan-emission.vitest.ts`.

### Phase 3: Workstream 3-7 Planning
- [x] Document workstreams 3-7 as planned follow-ups in spec and implementation summary.
- [x] Update parent phase manifest with child 006.
- [x] Record finding disposition table.
- [x] Run validators and final metadata status update.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Metric functions and query-plan builders | Vitest |
| Harness baseline | Deterministic channel-runner corpus | Vitest |
| Integration-adjacent | Classifier/router/intent query-plan emission | Vitest |
| Static | TypeScript contract and ESM import compatibility | `npm run typecheck`, `npm run build` |
| Documentation | L2 packet and source research packet strict validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase C research report | Internal | Green | Source of finding scope and workstream ranking. |
| Existing query classifier/router/intent modules | Internal | Green | Query-plan wiring points. |
| Vitest/TypeScript config | Internal | Green | Required verification commands. |
| Spec validator | Internal | Green | Required final packet validation. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Focused tests, typecheck, or build fail after two bounded fix attempts, or any behavior change is detected in routing decisions.
- **Procedure**: Remove additive query-plan fields and new harness files from this packet, restore parent manifest entry if the packet is abandoned, and document residuals in implementation-summary.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 Harness ─────────────┐
                             ├──► Phase 3 Planned Workstreams + Verification
Phase 2 Query Plan Telemetry ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Harness | Phase C report | Baseline metrics, future rerank/trust-tree work |
| Query Plan Telemetry | Existing classifier/router/intent contracts | Future learned routing and trust telemetry |
| Planned Workstreams | Harness and query-plan docs | Completion summary |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Harness | Medium | 2-4 hours |
| Query Plan Telemetry | Medium | 2-4 hours |
| Planning + Verification | Medium | 1-2 hours |
| **Total** | | **5-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No production database migrations.
- [ ] No new feature flags required.
- [ ] No ranking/rerank/fusion behavior changes.

### Rollback Procedure
1. Revert additive query-plan imports and `queryPlan` result fields.
2. Remove new harness test directory and query-plan test.
3. Re-run focused query classifier/router/intent tests.
4. Re-run spec validator for the packet.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
