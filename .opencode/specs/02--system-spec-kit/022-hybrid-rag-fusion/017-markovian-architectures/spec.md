---
title: "Feature Specification: 017-markovian-architectures"
description: "Bounded first milestone for Markovian retrieval enhancements in hybrid-rag-fusion: trace-only session transitions, bounded graph-walk scoring, and advisory ingestion lifecycle forecasting."
trigger_phrases: ["markovian", "session transitions", "graph walk", "ingestion lifecycle", "hybrid rag fusion"]
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: 017-markovian-architectures
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-14 |
| **Updated** | 2026-03-14 |
| **Branch** | `main` |
| **Parent Spec** | `022-hybrid-rag-fusion` |
| **Intent** | `add_feature` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hybrid-rag-fusion stack already exposes many Markov-compatible primitives (session-aware routing, additive Stage 2 scoring channels, graph-derived signals, provenance traces, and asynchronous ingestion state). What is missing is a tightly scoped first milestone that turns those primitives into implementation-ready behavior without expanding into full planning/runtime redesign.

Prior research identified two stale assumptions to avoid in this milestone:
- Historical shadow scoring was retired and must not be reintroduced.
- Novelty boost is not active in the hot path and must remain out of scope.

### Purpose
Define an implementation-ready first milestone that:
- Adds trace-only session-transition metadata.
- Adds bounded graph-walk score contributions in Stage 2 behind explicit flags.
- Adds advisory ingestion lifecycle forecasting fields (ETA and failure risk).
- Preserves deterministic ranking guarantees and rollback safety.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Trace-only session state transitions for `memory_context` / `memory_search` response traces.
- Bounded Stage 2 graph-walk score contribution with normalization and restart semantics.
- Advisory ingestion lifecycle forecasting over current job queue state.
- Telemetry and provenance expansions so each new signal is inspectable.
- Rollout and rollback rules for a safe first milestone.

### Out of Scope
- Full MDP retrieval policies or planner architectures.
- MCTS-like exploration logic or tree search runtime.
- SSM runtime redesign (including Mamba-like runtime integration).
- Re-enabling retired historical shadow scoring.
- Reintroducing novelty boost into the hot retrieval path.
- Full implementation in planning artifacts; this remains planning-phase documentation.

### Planned Implementation Surface

| Surface | File Path | Planned Change |
|--------|-----------|----------------|
| Context handler | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` | Infer and emit trace-only transition metadata |
| Search handler | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Propagate transition and graph-walk trace fields |
| Ingest handler | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts` | Expose advisory lifecycle forecast payload |
| Trace formatter | `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts` | Include Markovian trace sections with source attribution |
| Stage 2 pipeline | `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Add bounded graph-walk additive contribution |
| Graph signal helper | `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts` | Add normalization/restart helpers for bounded walk scoring |
| Feature flags | `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts` | Introduce/extend explicit Markovian rollout switches |
| Retrieval telemetry | `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts` | Record transition and graph-walk observability fields |
| Queue state | `.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts` | Add lifecycle forecast derivation support |
| Adaptive policy surface | `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts` | Reuse bounded rollout surface if/when graduation is attempted |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Trace-only session transition support | Response trace can report previous state, inferred state, transition confidence, and source signal through existing `includeTrace` / response-trace controls; no live routing override occurs |
| REQ-002 | Bounded Stage 2 graph-walk signal | Graph-walk contribution is additive, capped, flag-guarded, and computed with deterministic normalization/restart behavior |
| REQ-003 | Deterministic ranking contract preserved | Stage 4 ordering and tie-break behavior remain deterministic with graph-walk enabled and disabled |
| REQ-004 | Advisory ingestion lifecycle forecasting | Ingest status can return ETA and failure-risk forecasts with confidence/caveat metadata; no blocking failures on sparse data |
| REQ-005 | Rollback safety | Feature flags can disable Markovian additions without schema-destructive rollback |
| REQ-006 | Stale-feature guardrail | Planning and implementation artifacts explicitly keep shadow scoring retired and novelty boost inactive |

### P1 - Required (complete or explicitly deferred)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Provenance trace clarity | `includeTrace` output clearly labels transition and graph-walk signal sources |
| REQ-008 | Telemetry contract | Retrieval telemetry captures graph-walk contribution and transition-inference diagnostics |
| REQ-009 | Evaluation baseline | Plan defines baseline/candidate comparisons for ranking quality, determinism, and latency |
| REQ-010 | Graduation boundary | Adaptive rollout is defined as optional post-milestone progression, not part of base milestone deliverable |
| REQ-011 | File-level task decomposition | `tasks.md` contains phase-based, file-aware implementation tasks |
| REQ-012 | Readiness caveat preservation | Branch prerequisite (`main` -> numbered feature branch) and low-quality memory save caveat remain documented |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:contracts -->
## 5. FUNCTIONAL CONTRACTS

### 5.1 Session Transition Trace Contract

Returned only when trace is requested via existing controls (`includeTrace=true` / response-trace controls). No dedicated transition-trace feature flag is introduced in this milestone.

| Field | Type | Description | Notes |
|-------|------|-------------|-------|
| `sessionTransition.previousState` | string \| null | Prior inferred state label | Null for cold start |
| `sessionTransition.currentState` | string \| null | Current inferred state label | Trace-only, no routing enforcement |
| `sessionTransition.confidence` | number | Inference confidence in [0, 1] | Clamped and deterministic |
| `sessionTransition.signalSources` | string[] | Input signals used for inference | No raw sensitive payload |
| `sessionTransition.reason` | string \| null | Human-readable explanation | Optional when evidence is weak |

### 5.2 Graph-Walk Contribution Contract

| Field | Type | Description | Notes |
|-------|------|-------------|-------|
| `graphContribution.raw` | number | Raw graph-walk score before normalization | Internal trace/debug value |
| `graphContribution.normalized` | number | Normalized score used for additive contribution | Stable across equal inputs |
| `graphContribution.appliedBonus` | number | Final additive bonus applied in Stage 2 | Hard-capped by config/flag |
| `graphContribution.capApplied` | boolean | Whether bonus cap clipped the value | Required for diagnostics |
| `graphContribution.rolloutState` | string | `off`, `trace_only`, or `bounded_runtime` | Mirrors flag state |

### 5.3 Ingestion Lifecycle Forecast Contract

| Field | Type | Description | Notes |
|-------|------|-------------|-------|
| `forecast.etaSeconds` | number \| null | Estimated completion time in seconds | Null when insufficient history |
| `forecast.etaConfidence` | number \| null | Confidence in ETA estimate [0, 1] | Optional on sparse queue |
| `forecast.failureRisk` | number \| null | Predicted failure risk [0, 1] | Advisory only |
| `forecast.riskSignals` | string[] | Signals contributing to risk estimate | Safe, non-sensitive summaries only |
| `forecast.caveat` | string \| null | Explanation when forecast quality is limited | Must be present when confidence is low |
<!-- /ANCHOR:contracts -->

---

<!-- ANCHOR:success-criteria -->
## 6. SUCCESS CRITERIA

- **SC-001**: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` stay synchronized on first-milestone-only scope.
- **SC-002**: Planning artifacts define concrete contracts for transition trace, graph contribution, and lifecycle forecast outputs.
- **SC-003**: All planned changes map to real MCP server files and real Vitest suites.
- **SC-004**: Deterministic ranking protections and rollback controls are explicit, testable, and not optional.
- **SC-005**: Shadow scoring remains retired and novelty boost remains inactive in all planned paths.
- **SC-006**: Branch prerequisite and memory-save quality caveats remain visible as readiness constraints.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Stage 2 p95 latency regression from graph-walk scoring stays within agreed bound during bounded-runtime mode.
- **NFR-P02**: Trace-only session inference overhead is negligible when trace is disabled and bounded when trace is enabled.

### Reliability
- **NFR-R01**: Deterministic ordering is preserved across repeated runs for identical inputs and flags.
- **NFR-R02**: Forecast generation degrades gracefully (null/limited fields + caveat) for sparse or volatile queue history.

### Security & Privacy
- **NFR-S01**: Trace payloads include no sensitive raw session content beyond current provenance policy.
- **NFR-S02**: All Markovian behavior remains kill-switchable via feature flags.

### Maintainability
- **NFR-M01**: Contracted fields are centralized in trace formatter/handler surfaces to avoid schema drift.
- **NFR-M02**: New behavior is covered by focused handler/pipeline tests, not only integration smoke tests.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Session Trace Edge Cases
- Empty or first-turn session should not emit overconfident state transitions.
- Missing `sessionId` must produce null/omitted transition trace fields without throwing.
- Ephemeral session IDs must not infer long-horizon continuity.

### Graph-Walk Edge Cases
- Sparse or disconnected graph segments must not inflate candidate bonuses.
- Missing seed/restart context should keep contribution at zero or near zero.
- Cap logic must clamp extreme graph signals predictably.

### Forecasting Edge Cases
- Brand-new queues with little history should return advisory caveat and partial/null forecast fields.
- Sudden failure bursts should increase risk score without blocking status responses.
- Forecast helper failures must not fail ingest status calls.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:risks -->
## 9. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Research artifacts in this spec folder | Planning loses rationale and guardrails | Keep planning docs linked to refreshed research outputs |
| Dependency | Existing trace/provenance envelope support | New signals become opaque | Route all new fields through `includeTrace` contracts |
| Dependency | Numbered feature branch not created (`main`) | Implementation start is blocked by workflow prerequisite | Create numbered branch before `/spec_kit:implement` |
| Risk | Stage 2 graph signal destabilizes ranking | Quality regressions and trust loss | Use additive caps, deterministic tests, and rollout gates |
| Risk | Trace interpretation overreach | Inferred states mistaken for enforced behavior | Keep transition reporting trace-only and clearly labeled |
| Risk | Forecast confidence noise | Misleading operations guidance | Emit confidence and caveat fields; advisory-only semantics |
| Risk | Scope creep toward planner runtime | Delivery delay and uncontrolled complexity | Keep MDP/MCTS/SSM-runtime explicitly out of scope |
| Risk | Memory artifact quality caveat ignored | Resume context may be weaker than expected | Keep low-quality JSON-fallback caveat visible in checklist/plan |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:validation -->
## 10. VALIDATION MATRIX

| Requirement | Primary Test Surface | Expected Assertion |
|------------|----------------------|--------------------|
| REQ-001 | `tests/memory-context.vitest.ts`, `tests/handler-memory-context.vitest.ts` | Transition trace emitted correctly with/without `sessionId` |
| REQ-002 | `tests/stage2-fusion.vitest.ts`, `tests/graph-signals.vitest.ts` | Graph-walk bonus normalized, capped, and flag-gated |
| REQ-003 | `tests/stage2-fusion.vitest.ts`, `tests/mcp-response-envelope.vitest.ts` | Ordering/tie behavior stable and deterministic |
| REQ-004 | `tests/job-queue.vitest.ts`, `tests/job-queue-state-edge.vitest.ts` | Forecast fields degrade safely under sparse/noisy history |
| REQ-005 | `tests/rollout-policy.vitest.ts`, `tests/adaptive-ranking.vitest.ts` | Flag-off path returns baseline behavior and clean rollback |
| REQ-007 | `tests/search-results-format.vitest.ts` | Trace output includes source attribution for new fields |
| REQ-008 | `tests/scoring-observability.vitest.ts` | Telemetry captures graph/transition details without schema breaks |
<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 11. ACCEPTANCE SCENARIOS

### AS-001 Trace-Only Session Transition Metadata
- **Given** a `memory_context` request with `includeTrace=true` and a reusable `sessionId`,
- **When** transition inference resolves previous/current state with sufficient evidence,
- **Then** response trace includes transition fields and confidence while retrieval behavior remains unchanged.

### AS-002 Bounded Graph-Walk Contribution in Stage 2
- **Given** graph-walk rollout is in `bounded_runtime` mode and Stage 2 receives candidates with graph context,
- **When** graph-walk scoring is computed,
- **Then** Stage 2 applies only an additive capped bonus and keeps deterministic ordering contracts intact.

### AS-003 Advisory Forecast Degradation on Sparse Queue History
- **Given** ingestion status is requested for a queue with insufficient historical observations,
- **When** lifecycle forecasting runs,
- **Then** response includes null/partial forecast fields plus caveat text instead of failing the status call.

### AS-004 Safe Rollback to Baseline
- **Given** Markovian rollout flags are disabled after a rollback trigger,
- **When** search and ingest status paths execute,
- **Then** baseline behavior is restored, transition/graph forecast additions are suppressed per flag policy, and no schema-destructive rollback is required.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 19/25 | Multiple handlers, Stage 2 fusion, telemetry, and queue forecasting paths |
| Risk | 17/25 | Determinism and rollback safety are critical to trust and reversibility |
| Research Translation | 15/20 | Strong prior research, remaining work is contract and rollout precision |
| Coordination | 8/10 | Requires synchronized updates across spec/plan/tasks/checklist |
| **Total** | **59/80** | **Level 2 (high-detail planning)** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

- Should default rollout start in `trace_only` before allowing `bounded_runtime`, or allow direct bounded runtime behind disabled-by-default flag?
- Should lifecycle forecasts expose two confidences (`etaConfidence`, `failureConfidence`) or keep one confidence plus caveat text?
<!-- /ANCHOR:questions -->
