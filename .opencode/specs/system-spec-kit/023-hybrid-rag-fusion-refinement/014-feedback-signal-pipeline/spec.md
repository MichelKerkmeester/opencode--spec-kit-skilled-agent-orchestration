---
title: "Feature Specification: Feedback Signal Pipeline [system-spec-kit/023-hybrid-rag-fusion-refinement/014-feedback-signal-pipeline/spec]"
description: "Audit-backed specification for the feedback signal pipeline. Syncs the packet to the current implementation and verification evidence for result_cited, follow_on_tool_use, query_reformulated, and same_topic_requery."
trigger_phrases:
  - "feedback signals"
  - "feedback events"
  - "result cited"
  - "follow on tool use"
  - "query reformulated"
  - "same topic requery"
  - "implicit feedback"
  - "feedback pipeline"
importance_tier: "critical"
contextType: "implementation"
---
# Feature Specification: Feedback Signal Pipeline

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
| **Created** | 2026-04-03 |
| **Parent** | `system-spec-kit/023-hybrid-rag-fusion-refinement` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The feedback signal pipeline is implemented in the current repo, but this packet no longer matched the shipped code or the available verification evidence. The markdown still described a planned `memory-context.ts` hook and a `0.6` reformulation threshold, while the live implementation uses a dispatcher-level sticky-session fallback in `context-server.ts` and Jaccard thresholds of `0.3 <= similarity < 0.8` for `query_reformulated` and `>= 0.8` for `same_topic_requery`.

The packet also failed validation because `spec.md` had an orphaned `questions` anchor and `tasks.md` / `checklist.md` were missing required Level 2 anchor sections. Without a truth-sync pass, the packet could not be closed or relied on as an accurate record of the implementation.

### Purpose
Synchronize this packet with the current repo so the implementation, verification status, and remaining gaps are all stated accurately and validator-cleanly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Document the actual feedback pipeline wiring in `memory-search.ts`, `query-flow-tracker.ts`, and `context-server.ts`
- Record the current verification evidence from rerun TypeScript and Vitest commands
- Mark packet work complete only where the current repo evidence supports it
- Repair packet template/anchor drift so the Level 2 validator can evaluate the folder cleanly

### Out of Scope
- Runtime code changes in `mcp_server/`
- New benchmark collection or new live MCP runtime exercises beyond existing repo evidence
- Rewriting the underlying feedback scoring or ranking graduation logic

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/feedback/query-flow-tracker.ts` | Create (implemented) | Bounded session cache, Jaccard similarity flow detection, `result_cited`, and `follow_on_tool_use` helpers |
| `mcp_server/handlers/memory-search.ts` | Modify (implemented) | Search-path wiring for `trackQueryAndDetect()` and `logResultCited()` |
| `mcp_server/context-server.ts` | Modify (implemented) | Sticky `lastKnownSessionId` fallback for `follow_on_tool_use` when the next tool call is sessionless |
| `mcp_server/tests/context-server.vitest.ts` | Modify (implemented) | Handler-level regression coverage for the sticky session fallback |
| `mcp_server/tests/query-flow-tracker.vitest.ts` | Modify (implemented) | Dedicated tracker/unit coverage, including the fixed snake_case ledger assertions and DB-level packet flow test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `result_cited` events are emitted for `includeContent` search results | `memory-search.ts` calls `logResultCited()` when `includeContent` is true and `shownIds.length > 0` |
| REQ-002 | `follow_on_tool_use` events are emitted after a recent search even when the follow-on tool lacks `sessionId` | `context-server.ts` retains `lastKnownSessionId` and passes it to `logFollowOnToolUse()` for non-search tools |
| REQ-003 | All five implicit feedback event types stay on the existing feedback ledger path | `feedback-ledger.ts` enumerates `search_shown`, `result_cited`, `query_reformulated`, `same_topic_requery`, and `follow_on_tool_use`, and the passing ledger suite verifies them |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Query reformulation detection matches shipped tracker logic | `query-flow-tracker.ts` uses Jaccard token similarity with `0.3 <= similarity < 0.8` for `query_reformulated` |
| REQ-005 | Same-topic requery detection matches shipped tracker logic | `query-flow-tracker.ts` uses `similarity >= 0.8`, `MIN_QUERY_LENGTH = 3`, `DEDUP_WINDOW_MS = 1000`, and `TTL_MS = 10 minutes` |
| REQ-006 | Signals remain shadow-only until future ranking graduation | The pipeline can keep `feedbackSignalsApplied` at `off` while still logging events to the feedback ledger |
| REQ-007 | Dedicated tracker regression coverage is green | `TMPDIR=/Users/michelkerkmeester/.tmp/vitest-tmp npx vitest run tests/query-flow-tracker.vitest.ts tests/context-server.vitest.ts tests/feedback-ledger.vitest.ts` exits 0 |
| REQ-008 | The `<5ms` async overhead claim is backed by recorded evidence | Benchmark output shows sub-5ms average and p95 for the packet signal path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet accurately describes the shipped feedback pipeline wiring in `memory-search.ts`, `query-flow-tracker.ts`, and `context-server.ts`.
- **SC-002**: The packet records current passing verification for typecheck and the combined three-file Vitest rerun (`query-flow-tracker`, `context-server`, `feedback-ledger`).
- **SC-003**: The packet records current benchmark evidence supporting the `<5ms` async-overhead claim.
- **SC-004**: The folder passes the Level 2 spec validator after the anchor/template repairs in this audit.

### Acceptance Scenarios

**Given** `memory_search` runs with `includeContent: true` and returns result IDs,
**When** the post-search feedback hook executes,
**Then** `memory-search.ts` logs `result_cited` via `logResultCited()` without creating a new storage path.

**Given** a user runs `memory_search` and then a non-search tool such as `memory_stats`,
**When** the second tool call lacks `sessionId`,
**Then** `context-server.ts` uses `lastKnownSessionId` to correlate and emit `follow_on_tool_use`.

**Given** two same-session queries arrive more than one second apart,
**When** Jaccard similarity is between `0.3` and `<0.8` or `>= 0.8`,
**Then** the tracker emits `query_reformulated` or `same_topic_requery` respectively.

**Given** implicit feedback logging remains shadow-only,
**When** the pipeline runs normally,
**Then** events are stored in `feedback_events` while `feedbackSignalsApplied` may still remain `off`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `feedback-ledger.ts` event schema and confidence mapping | Core event storage depends on the existing ledger contract | Keep packet evidence tied to the current ledger tests and event enum |
| Dependency | `context-server.ts` sticky-session fallback | `follow_on_tool_use` depends on dispatcher-level session retention | Keep stdio-only limitation documented and rely on the existing regression test |
| Risk | Sticky-session follow-on correlation depends on stdio-style single-client behavior | Future multi-client transports could need explicit session binding | Keep the limitation documented even though current tests and historical live evidence pass |
| Risk | Historical live MCP evidence was not freshly rerun in this markdown refresh | Overstating a fresh live restart verification would be inaccurate | Keep the prior live sequence dated and identified as earlier evidence in the summary |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Feedback logging remains asynchronous and fail-safe on the search path.
- **NFR-P02**: The `<5ms` latency claim must remain backed by recorded benchmark output, not inferred from code structure alone.

### Reliability
- **NFR-R01**: Feedback logging failures must never break search or tool dispatch.
- **NFR-R02**: Session-scoped query history must honor the shipped 10 minute TTL and 50-entry bound.

### Observability
- **NFR-O01**: The packet distinguishes current-pass reruns from prior live MCP evidence.
- **NFR-O02**: The packet records unresolved verification gaps explicitly instead of converting them to assumptions.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or missing result IDs: `memory-search.ts` skips malformed `shownIds` before feedback emission.
- Very short queries: `query-flow-tracker.ts` skips queries shorter than 3 characters.
- Rapid duplicate queries: entries inside the 1 second dedup window do not emit reformulation or requery events.

### Error Scenarios
- Search-path feedback failure: `memory-search.ts` wraps the implicit feedback block in `try/catch`.
- Follow-on dispatch failure: `context-server.ts` wraps `logFollowOnToolUse()` in `try/catch`.
- Tracker regression drift: the dedicated `query-flow-tracker.vitest.ts` suite now covers snake_case ledger rows and a DB-level packet flow spanning citation, follow-on tool use, and reformulation.

### State Transitions
- Sessionless follow-on tools: `lastKnownSessionId` provides sticky correlation for stdio/single-client usage.
- Shadow-only rollout: event logging can succeed while ranking metadata still reports `feedbackSignalsApplied: off`.
- Packet closure attempt: packet may close with current evidence, but future changes should preserve the benchmark-backed performance envelope and the sticky-session follow-on coverage.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Three runtime surfaces plus packet truth-sync across five markdown files |
| Risk | 11/25 | Completion depends on evidence discipline because implementation and docs drifted |
| Research | 6/20 | Moderate audit work to reconcile shipped code, tests, and prior live-runtime evidence |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None at packet closeout. Future work would only be needed if the transport model changes or if the benchmark harness should be formalized into a checked-in script.
<!-- /ANCHOR:questions -->
