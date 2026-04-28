---
title: "Feature Specification: 006 Search Query RAG Optimization"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2"
description: "Measurement-first remediation for Phase C search, query intelligence, and RAG fusion findings. This sub-phase adds the search-quality harness and telemetry-only query-plan contract before any ranking or rerank behavior changes."
trigger_phrases:
  - "006 search query rag optimization"
  - "search quality harness"
  - "query plan telemetry"
  - "rag optimization measurement"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/006-search-query-rag-optimization"
    last_updated_at: "2026-04-28T21:02:24Z"
    last_updated_by: "codex"
    recent_action: "Completed search-quality harness and telemetry-only QueryPlan implementation"
    next_safe_action: "Use harness data before behavior changes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/search-quality/"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/query/query-plan.ts"
    session_dedup:
      fingerprint: "sha256:006-search-query-rag-optimization-20260428"
      session_id: "006-search-query-rag-optimization-20260428"
      parent_session_id: "019-search-query-rag-optimization-research"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-answered A for this exact sub-phase."
      - "Phase C report says Phase D must be measurement-first and telemetry-only for query-plan emission."
---
# Feature Specification: 006 Search Query RAG Optimization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-28 |
| **Branch** | `main` |
| **Parent** | `026-graph-and-context-optimization/000-release-cleanup/005-review-remediation` |
| **Source Research** | `026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/019-search-query-rag-optimization-research` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase C found no surviving P0 regression and no current-runtime regression, but it did find that search optimization lacks shared outcome evidence. The two P1s scope cleanly: F-001/F-020 require a search-quality harness and corpus before ranking changes, and F-004 requires an explicit query-plan contract before calibrating query intelligence.

### Purpose
Create measurement infrastructure and telemetry-only query planning so future RAG trust-tree, rerank, learned-fusion, CocoIndex, and degraded-readiness work can be evaluated against a shared corpus instead of intuition.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Workstream 1: Search-quality harness and corpus covering v1.0.1/v1.0.2 stress-cell themes plus ambiguous and paraphrase queries.
- Workstream 2: Explicit query-plan contract with telemetry-only emission from query complexity, routing, and intent classification surfaces.
- Update parent PHASE MANIFEST to list this `006-search-query-rag-optimization/` child.
- Focused Vitest coverage for the harness baseline and query-plan emission.
- Typecheck and build verification for the additive TypeScript changes.

### Out of Scope
- Workstream 3, composed RAG trust tree: PLANNED because it needs harness data first.
- Workstream 4, conditional rerank: PLANNED because rerank promotion needs corpus-backed precision and latency evidence.
- Workstream 5, advisor shadow learned weights: PLANNED because learned weights must compare against harness labels first.
- Workstream 6, CocoIndex overfetch calibration: PLANNED because it needs a duplicate-heavy corpus beyond this first baseline.
- Workstream 7, code graph degraded-readiness stress cells: PLANNED because those should reuse the harness pattern after this packet lands.
- Ranking, fusion, rerank, refusal, citation, or routing behavior changes.
- Any edit under `006/001` license audit packet or prior 026 closure tally changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create/Modify | L2 remediation specification and continuity. |
| `plan.md` | Create | Three-phase implementation plan. |
| `tasks.md` | Create/Modify | Atomic task ledger grouped by phase. |
| `checklist.md` | Create/Modify | P0/P1/P2 verification gates. |
| `implementation-summary.md` | Create | Final finding disposition and command evidence. |
| `description.json` | Create/Modify | Packet metadata for graph and memory discovery. |
| `graph-metadata.json` | Create/Modify | Parent/dependency metadata for graph traversal. |
| `../spec.md` | Modify | Add this child to the PHASE MANIFEST. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/corpus.ts` | Create | Fixture corpus for harness baseline. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/harness.ts` | Create | Channel-runner harness and capture model. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/metrics.ts` | Create | Precision, recall, latency, refusal, and citation metrics. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/search-quality/baseline.vitest.ts` | Create | Baseline harness assertions over the small corpus. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/query/query-plan.ts` | Create | Typed query-plan contract and builder helpers. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-classifier.ts` | Modify | Emit complexity query-plan telemetry. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts` | Modify | Emit selected/skipped channel and routing-reason query-plan telemetry. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts` | Modify | Emit intent query-plan telemetry. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/query-plan-emission.vitest.ts` | Create | Canonical query-pattern query-plan assertions. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve measurement-first boundary. | No ranking, fusion, rerank, refusal, citation, or routing behavior changes land in this packet. |
| REQ-002 | Preserve target authority. | Writes stay under this sub-phase, allowed runtime/test paths, and the parent manifest; no writes to `006/001` license audit packet. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Build search-quality harness infrastructure. | Corpus, harness, metrics, and baseline Vitest exist under `mcp_server/tests/search-quality/`. |
| REQ-004 | Capture required harness dimensions. | Harness captures per-channel candidates, final relevance, citation policy, refusal policy, and latency. |
| REQ-005 | Add explicit query-plan contract. | `QueryPlan` includes `intent`, `complexity`, `artifactClass`, `authorityNeed`, `selectedChannels`, `skippedChannels`, `routingReasons`, and `fallbackPolicy`. |
| REQ-006 | Keep query-plan emission telemetry-only. | Existing classifier/router return shapes are only extended with `queryPlan`; selected channels and intent outcomes remain unchanged. |
| REQ-007 | Verify focused tests, typecheck, and build. | New focused Vitest files, `npm run typecheck`, and `npm run build` exit 0. |

### P2 - Advisory

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Preserve source-report synthesis. | Implementation summary maps F-001/F-020 and F-004 closed, and records F-002..F-019 as planned/deferred by workstream. |
| REQ-009 | Validate this packet and source research packet. | Strict validator exits 0 for this sub-phase and the 019 research packet, or residuals are recorded after bounded fixes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Search-quality harness runs against a small deterministic corpus without production database mutation.
- **SC-002**: Baseline metrics include precision@k, recall@k, p50/p95/p99 latency, refusal-survival, and citation-quality.
- **SC-003**: Query-plan telemetry is well-formed for simple, moderate, complex, ambiguous, and paraphrase query patterns.
- **SC-004**: Existing query routing behavior is unchanged except for additive telemetry fields.
- **SC-005**: Focused Vitest, typecheck, build, and strict validators are green or exact residuals are recorded.

### Acceptance Scenarios

1. **Given** the harness runs on deterministic fixtures, when a query has expected relevant IDs, then precision and recall reflect the channel candidates without touching production databases.
2. **Given** a weak-retrieval fixture expects refusal, when the harness evaluates policy survival, then unsupported citation behavior fails the refusal-survival metric.
3. **Given** a canonical simple/moderate/complex query, when the router returns existing channels, then the query-plan records selected and skipped channels without changing them.
4. **Given** an ambiguous or paraphrased intent query, when intent classification returns telemetry, then the query-plan records intent and routing reasons for later calibration.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Query-plan object accidentally drives behavior. | Could violate telemetry-only directive. | Keep builders pure and return extra fields only; tests compare selected channels to existing route behavior. |
| Risk | Harness becomes a fake benchmark. | Could imply runtime regression measurement occurred. | Baseline test asserts infrastructure and deterministic metrics only; implementation summary states runtime regression measurement is deferred. |
| Dependency | Existing query classifier/router/intent surfaces. | Query-plan fields must be populated without circular imports. | Put shared types/helpers in `lib/query/query-plan.ts` and use one-way imports from search modules. |
| Risk | Strict validator exposes legacy debt in source research packet. | Could block completion despite implementation correctness. | Make bounded fixes only inside target authority; record exact residual if outside authority. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Query-plan builders must be synchronous, deterministic, and bounded by local string/list operations.
- **NFR-P02**: Harness baseline must not assert production runtime latency budgets in this packet.

### Security
- **NFR-S01**: No network calls or credential-dependent test paths.
- **NFR-S02**: Fixture corpus contains only repo-local synthetic or prior stress-cell references.

### Reliability
- **NFR-R01**: Focused tests must be deterministic and isolated from production memory databases.
- **NFR-R02**: Existing routing decisions must remain backward-compatible for callers that ignore `queryPlan`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty query: query-plan falls back to complex/unknown-safe metadata matching existing classifier fallback behavior.
- Explicit intent: query-plan records the supplied intent without forcing learned routing.
- Disabled complexity router: selected channels remain full pipeline and fallback policy records full-pipeline behavior.

### Error Scenarios
- Channel runner throws in harness: capture channel error and continue scoring other channels.
- Missing citations in weak retrieval case: citation-quality metric must fail that case.
- Refusal expected but answer proceeds: refusal-survival metric must fail that case.

### State Transitions
- Planned workstreams 3-7 stay planned until harness data exists.
- Completion moves packet status from `in_progress` to `complete` only after tests/build/validators are recorded.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | New test harness, one runtime contract module, and three additive wiring points. |
| Risk | 13/25 | Telemetry-only code has low behavior risk, but public result shapes expand. |
| Research | 16/20 | Phase C report must be synthesized against active findings and planning packet. |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The prompt pre-approved the spec folder and restricted this packet to workstreams 1 and 2.
<!-- /ANCHOR:questions -->
