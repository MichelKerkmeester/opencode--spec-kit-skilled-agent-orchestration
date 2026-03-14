---
title: "Implementation Plan: 017-markovian-architectures"
description: "Execution plan for first-milestone Markovian enhancements: trace-only transitions, bounded Stage 2 graph-walk scoring, and advisory ingestion lifecycle forecasting."
trigger_phrases: ["implementation plan", "markovian", "graph walk", "session transitions", "ingestion forecast"]
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: 017-markovian-architectures
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Core Runtime** | Spec Kit Memory MCP server |
| **Storage** | SQLite-backed index + queue/state tables |
| **Test Framework** | Vitest |
| **Delivery Model** | Feature-flagged bounded rollout |

### Plan Outcome
This plan translates research into a bounded first milestone with three concrete deliverables:
1. Trace-only session-transition inference for `memory_context` / `memory_search`.
2. Bounded graph-walk additive scoring in Stage 2 behind explicit rollout controls.
3. Advisory ingestion lifecycle forecasting (ETA and failure-risk) from queue state.

Core code for these contracts is implemented and full targeted verification passed, including deterministic rerun and rollout hardening coverage.

The milestone does not include full MDP/MCTS/SSM-runtime work, and it does not reintroduce retired shadow scoring or novelty boost hot-path behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:scope-guardrails -->
## 2. SCOPE GUARDRAILS

### Explicit Non-Goals
- No planner-runtime architecture (MDP, MCTS, policy learning loops).
- No SSM runtime or inference stack redesign.
- No reactivation of historical shadow scoring.
- No novelty boost reintroduction in the retrieval hot path.

### In-Milestone Decision Boundaries
- Transition inference is trace-only in this milestone.
- Transition payload stays in trace surfaces (and trace-gated telemetry diagnostics), not non-trace metadata.
- Graph-walk contribution is additive, bounded, and reversible.
- Forecasts are advisory and confidence-scored, not operational blockers.
- Graduation to broader adaptive runtime behavior is post-milestone work.
<!-- /ANCHOR:scope-guardrails -->

---

<!-- ANCHOR:quality-gates -->
## 3. QUALITY GATES

### Definition of Ready (Planning -> Implementation)
- [x] Bounded first-milestone scope documented in `spec.md`.
- [x] File-level implementation surfaces identified.
- [x] Testing surfaces mapped to concrete Vitest suites.
- [x] Numbered feature branch exists (`017-markovian-architectures`).
- [x] Existing caveats preserved (memory save used JSON fallback and skipped semantic indexing).

### Definition of Done (Implementation Completion Target)
- [x] Transition trace contract implemented and tested.
- [x] Graph-walk bounded scoring implemented and tested.
- [x] Ingestion lifecycle forecast contract implemented and tested.
- [x] Focused verification confirms transition + graph-walk diagnostics telemetry contracts.
- [x] Deterministic ranking and rollback drill checks pass.
- [x] Documentation updates reflect final implementation reality.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 4. EXECUTION ARCHITECTURE

### Implementation Pattern
Extend existing handlers/pipeline incrementally using feature flags and trace-first observability. Keep all additions additive and reversible.

### Workstreams
- **WS1 Transition Trace**: infer and expose transition metadata in trace path only.
- **WS2 Graph-Walk Stage 2**: compute bounded bonus with normalization/restart semantics.
- **WS3 Lifecycle Forecasting**: derive advisory ETA/risk from queue state.
- **WS4 Observability + Safety**: telemetry, envelope formatting, and rollback controls.

### Data Flow
```text
memory_context
   -> build sessionTransition { previousState, currentState, confidence, signalSources, reason? }
   -> forward sessionTransition into memory_search

memory_search
   -> cache + dedup path
   -> post-cache transition injection (trace path)
   -> stage1
   -> stage2 (+ optional bounded graph bonus)
   -> stage3/stage4 deterministic ordering
   -> trace formatter + retrieval telemetry (transitionDiagnostics + graphWalkDiagnostics)

memory_ingest status
   -> queue lifecycle state
   -> forecast helper
   -> advisory ETA/risk fields + caveat
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phase-plan -->
## 5. PHASE PLAN

Status snapshot: Phases 1-5 are implemented and verified for this milestone.

### Phase 1: Preflight and Contract Freeze

**Objective**: Implemented contract/flag freeze for baseline-safe rollout behavior.

**Target files**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`

**Exit criteria**:
- Graph-walk rollout flag constants and defaults documented.
- Transition traces explicitly routed through existing `includeTrace` / response-trace controls (no dedicated transition-trace flag).
- Ranking invariants and additive cap rules defined.
- Baseline telemetry markers recorded for comparison.

### Phase 2: Transition Trace Implementation

**Objective**: Implemented trace-only session-transition inference without changing routing behavior.

**Target files**:
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`

**Exit criteria**:
- `memory_context` forwards `sessionTransition` and `memory_search` injects it post-cache when trace is enabled.
- Null-safe behavior for missing/sparse session state.
- No behavior changes when trace path is disabled.

### Phase 3: Stage 2 Graph-Walk Contribution

**Objective**: Implement bounded graph-walk bonus in Stage 2 with deterministic behavior.

**Target files**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`

**Exit criteria**:
- Graph bonus is bounded and flag-gated.
- Deterministic ordering contract holds.
- Graph diagnostics expose `raw`, `normalized`, `appliedBonus`, `capApplied`, and `rolloutState` (`off|trace_only|bounded_runtime`).

### Phase 4: Ingestion Lifecycle Forecasting

**Objective**: Implement advisory ETA/failure-risk forecasts from existing queue state.

**Target files**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`

**Exit criteria**:
- Forecast fields are available in status responses.
- Sparse/noisy history degrades to null/caveat safely.
- No ingest status call failures from forecast path.

### Phase 5: Validation and Rollout Readiness

**Objective**: Complete broader rollout hardening, deterministic rerun coverage, and graduation readiness artifacts.

**Target files**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/*.vitest.ts` (targeted suites below)

**Exit criteria**:
- [x] Rollback drill path documented and testable.
- [x] Evaluation criteria and baseline comparison defined.
- [x] Bounded-runtime rollout remains optional and reversible.
<!-- /ANCHOR:phase-plan -->

---

<!-- ANCHOR:test-strategy -->
## 6. TEST STRATEGY

### Core Suites
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/job-queue.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts`

### Validation Matrix

| Validation Type | Goal | Minimum Evidence |
|----------------|------|------------------|
| Unit | Contract logic correctness | Transition/graph/forecast helper assertions |
| Handler | API contract stability | Trace and status payload snapshots |
| Pipeline | Ranking determinism | Repeat-run ordering equivalence checks |
| Rollout | Safe enable/disable | Feature flag off-path equals baseline |
| Regression | Legacy behavior preservation | No reintroduction of retired shadow scoring/novelty boost |
<!-- /ANCHOR:test-strategy -->

---

<!-- ANCHOR:rollout -->
## 7. ROLLOUT AND ROLLBACK

### Rollout Ladder
1. `off`: baseline behavior only.
2. `trace_only`: transition and graph trace visible, no ranking impact.
3. `bounded_runtime`: bounded graph bonus enabled behind explicit flag.

Resolution: `SPECKIT_GRAPH_WALK_ROLLOUT` controls explicit rollout state; when unset, rollout resolves to `bounded_runtime` only if graph signals are enabled, otherwise `off`.

### Kill Switches
- Set `SPECKIT_GRAPH_WALK_ROLLOUT=off` (or disable graph signals) to remove graph-walk runtime impact.
- Disable response traces (`includeTrace` / response-trace controls) for transition visibility.
- Disable forecast emission path for ingest status.

### Rollback Procedure
1. Disable all Markovian flags.
2. Validate baseline ordering behavior and ingest responses.
3. Re-run targeted deterministic and contract suites.
4. Keep adaptive rollout proposals bounded or disabled until root cause is resolved.
<!-- /ANCHOR:rollout -->

---

<!-- ANCHOR:dependencies -->
## 8. DEPENDENCIES AND CAVEATS

| Dependency/Caveat | Status | Impact | Mitigation |
|-------------------|--------|--------|------------|
| Numbered feature branch `017-markovian-architectures` | Closed | Prerequisite satisfied for implementation and verification | Keep branch active for any post-milestone follow-on specs |
| Prior research artifacts | Available | Needed for rationale and guardrails | Keep citations and constraints aligned |
| Existing trace envelope support | Available | Needed for inspectable rollout while keeping transition payload trace-only | Route new fields through `includeTrace` path and avoid non-trace transition metadata |
| Existing graph/Stage 2 substrate | Available | Needed for bounded graph bonus | Keep additive-only integration |
| Memory save quality caveat (JSON fallback, skipped semantic indexing) | Open caveat | Resume context may be weaker than ideal | Keep caveat documented; treat memory as partial context only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Phase | Complexity | Estimate |
|-------|------------|----------|
| Phase 1: Preflight and contracts | Complete | 0 days remaining |
| Phase 2: Transition trace | Complete | 0 days remaining |
| Phase 3: Bounded graph-walk Stage 2 | Complete | 0 days remaining |
| Phase 4: Lifecycle forecasting | Complete | 0 days remaining |
| Phase 5: Validation and rollout readiness | Complete | 0 days remaining |
| **Total** | | **0 days remaining** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:next -->
## 10. NEXT EXECUTION POINTER

- Primary execution checklist is tracked in `tasks.md`.
- Planning/readiness state is tracked in `checklist.md`.
- Milestone implementation and validation are complete on `017-markovian-architectures`.
<!-- /ANCHOR:next -->
