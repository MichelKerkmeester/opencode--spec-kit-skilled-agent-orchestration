---
title: "Feature Specification: 008-hydra-db-based-features"
description: "Level 3 delivery record for HydraDB-inspired memory-state capabilities in system-spec-kit and the Spec Kit Memory MCP server."
trigger_phrases:
  - "hydra"
  - "memory state"
  - "lineage"
  - "governance"
  - "shared memory"
  - "markovian"
  - "session transitions"
  - "graph walk"
  - "ingestion lifecycle"
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
importance_tier: "critical"
contextType: "decision"
---
# Feature Specification: 008-hydra-db-based-features

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This document records the delivered Level 3 HydraDB-inspired memory-state implementation for `system-spec-kit` and the Spec Kit Memory MCP server. The six planned phases are shipped in the live runtime and were re-verified locally on 2026-03-16.

**Delivered runtime**: versioned lineage state, unified graph-aware retrieval, adaptive shadow ranking, hierarchical scope governance, governed ingest and retention controls, shared-memory rollout controls, and supporting telemetry/checkpoint behavior.

**Surface note**: lineage and `asOf` resolution are currently exposed as internal storage APIs plus save/search integration. This spec does not claim a standalone public `memory_query` MCP tool is shipped.

**Key Decisions**: evolutionary extension of the existing MCP server, internal lineage API surface retained, governance-before-collaboration enforcement, and truth-sync documentation aligned to the runtime as the source of truth.

**Critical Dependencies**: local research docs in this folder, existing MCP storage/retrieval subsystems, and policy/governance design decisions.

[Assumes: HydraDB architecture guidance is inferred from publicly available HydraDB pages and blog content, not from HydraDB source code.]
[Assumes: Any HydraDB details referenced here are treated as design inspiration to validate locally, not as implementation facts about this repository.]

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-13 |
| **Updated** | 2026-03-16 |
| **Branch** | `022-hybrid-rag-fusion` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current Memory MCP stack has strong retrieval and memory primitives, but no single end-to-end state model that guarantees lineage, temporal correctness, strict hierarchy boundaries, and governed collaboration. That gap limits reliability for long-running multi-agent workflows and enterprise governance requirements.

### Purpose
Record the shipped six-phase implementation, its verification evidence, and the remaining explicit non-goals so completion claims stay truthful and reproducible.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delivered first-class versioned memory state, lineage tracking, and deterministic `asOf` resolution via internal storage APIs.
- Delivered unified graph-aware retrieval across causal, entity, and summary signals.
- Delivered adaptive retrieval feedback capture and bounded shadow-ranking behavior.
- Delivered hierarchical tenant, user or agent, session, and shared-space governance controls.
- Delivered governed ingestion, retention, cascade deletion, shared-memory rollout controls, and rollback-compatible verification.
- Truth-sync of the parent Hydra spec pack to the actual runtime, tests, and operator documentation.

### Out of Scope
- Introducing a new standalone public lineage or `asOf` MCP query tool.
- Reopening or rewriting the research inputs in `research/`.
- Greenfield rewrite of the Memory MCP server.
- Browser or staging deployment work beyond local verification evidence.

### Representative Runtime Surfaces

| File Path | Layer | Description |
|-----------|-------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Schema | Lineage tables, scope columns, governance audit tables, and shared-space schema support |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts` | Storage | Append-first lineage writes, active projection reads, deterministic `asOf` resolution, and backfill helpers |
| `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts` | Cognitive | Adaptive signal capture, bounded shadow proposals, threshold tuning, and resettable rollback state |
| `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | Governance | Scope normalization, governed-ingest validation, retention metadata, and governance audit writes |
| `.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts` | Collaboration | Shared-space membership, deny-by-default access, conflict recording, and rollout summaries |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts` | Handler | Shared-space CRUD, membership assignment, and rollout-status MCP handlers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define first-class versioned memory state with lineage | Every write maps to append-first version transitions and supports lineage traversal |
| REQ-002 | Provide temporal state query semantics | Query contract includes `asOf` behavior with deterministic version resolution |
| REQ-003 | Unify graph-aware retrieval model | Retrieval path fuses causal/entity/summary signals with bounded deterministic ranking |
| REQ-004 | Enforce hierarchical scope isolation | Read/write/index operations require tenant/user/agent/session scope enforcement |
| REQ-005 | Introduce governed ingestion contract | Ingestion requires provenance fields and temporal markers before persistence |
| REQ-006 | Define retention/deletion lifecycle | Roadmap includes cascade deletion coverage across base and derived memory artifacts |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Add self-improving retrieval loops | Outcome/correction signals feed bounded adaptive ranking with rollback control |
| REQ-008 | Add shared-memory collaboration spaces | Shared spaces include membership policy, isolation boundaries, and conflict strategies |
| REQ-009 | Add roadmap verification framework | Planned verification covers quality, isolation, governance, and rollback readiness |
| REQ-010 | Define rollout gates and kill-switch policy | Each phase has explicit go/no-go criteria and rollback entry points |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All six capability areas are traceable from `spec.md` to `plan.md`, `tasks.md`, and runtime evidence.
- **SC-002**: Parent planning artifacts describe delivered behavior and no longer contradict the shipped implementation state.
- **SC-003**: `tasks.md` references only existing runtime files, truthful globs, or explicitly internal API surfaces.
- **SC-004**: The three ADR decisions remain documented and reflected in the delivered phase ordering.
- **SC-005**: Checklist and implementation summary record the exact local verification commands rerun on 2026-03-16.
- **SC-006**: Feature catalog and manual testing links referenced by the Hydra work resolve to live files.
- **SC-007**: No template placeholders or stale future-implementation claims remain in the parent Hydra pack.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `research/001 - analysis-hydradb-architecture-and-turso-fit.md` | Roadmap quality degrades without architecture baseline | Keep all phase and ADR decisions traceable to this doc |
| Dependency | `research/002 - recommendations-turso-migration-and-hydradb-inspired-roadmap.md` | Prioritization loses evidence basis | Keep priority ordering and acceptance criteria aligned |
| Dependency | Existing MCP schema/retrieval internals | Wrong assumptions may create migration risk | Use phased migrations, shadow reads, and rollback checkpoints |
| Risk | Misreading Hydra public material as exact implementation | Incorrect architecture assumptions | Mark inferred details with `[Assumes: ...]` and validate locally |
| Risk | Scope/governance introduced too late | Data isolation incidents during collaboration rollout | Sequence governance before broad shared-memory enablement |
| Risk | Adaptive retrieval loops overfit noisy feedback | Quality drift or unstable ranking | Start shadow-only, apply confidence bounds, preserve rollback |
| Risk | Cascade deletion incomplete in derived stores | Compliance exposure | Define explicit deletion graph and auditable completion proofs |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Planned retrieval architecture must target <=250ms p95 for representative retrieval scenarios after graph/scope enrichment.
- **NFR-P02**: Governance and lineage checks must add bounded overhead and stay within rollout thresholds defined in plan milestones.

### Security and Isolation
- **NFR-S01**: No cross-scope retrieval leakage across tenant/user/agent/session boundaries.
- **NFR-S02**: Shared-memory access must be deny-by-default and policy-mediated.

### Reliability
- **NFR-R01**: Lineage transitions remain append-first and recoverable after interruption.
- **NFR-R02**: Retention/deletion workflows are resumable and idempotent.

### Governance and Auditability
- **NFR-G01**: Ingestion provenance and temporal markers are mandatory for governed sources.
- **NFR-G02**: Deletion and retention actions produce auditable artifacts.

### Operability
- **NFR-O01**: Each phase has explicit rollback triggers and rollback procedure.
- **NFR-O02**: Observability captures lineage writes, retrieval outcomes, policy decisions, and deletion lifecycle state.

---

## 8. EDGE CASES

### Data Boundaries
- Late-arriving events that supersede earlier facts after temporal ordering has changed.
- Multiple agents writing conflicting updates to the same conceptual fact.
- Missing provenance for imported memory chunks.

### Error Scenarios
- Migration interrupted between lineage table creation and backfill.
- Scope policy lookup unavailable during retrieval.
- Cascade deletion partially succeeds across base and derived tables.

### Behavioral Cases
- Query asks for "latest truth" while also passing historical `asOf` context.
- Shared-space memory references private memory nodes.
- Correction signal contradicts high-confidence retrieval outcomes.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | Multi-subsystem roadmap: storage, retrieval, governance, collaboration |
| Risk | 22/25 | Isolation/compliance plus migration and ranking behavior risks |
| Research | 17/20 | External architecture inference + internal alignment from prior specs |
| Multi-Agent | 12/15 | Collaboration spaces and propagation boundaries |
| Coordination | 13/15 | Strict sequencing dependencies across phases |
| **Total** | **87/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Lineage migration creates retrieval regressions | High | Medium | Dual-write/shadow-read rollout and checkpoint rollback |
| R-002 | Graph fusion increases nondeterministic ranking | Medium | Medium | Deterministic tie-break policy + regression suite |
| R-003 | Scope checks are inconsistent across paths | High | Medium | Central policy middleware + leak test matrix |
| R-004 | Governance and deletion model incomplete | High | Low-Med | Define data-class retention maps before rollout |
| R-005 | Shared memory introduced before controls mature | High | Medium | Gate rollout on ADR-003 and checklist P0 controls |
| R-006 | Adaptive tuning degrades retrieval quality | Medium | Medium | Shadow mode and bounded parameter updates |

---

## 11. USER STORIES

### US-001: Versioned State Lineage (Priority: P0)

**As a** memory platform maintainer, **I want** immutable lineage for memory updates, **so that** I can resolve what was true at any point in time.

**Acceptance Criteria**:
1. ****Given**** a supersede update, when lineage is queried, then both previous and current versions remain visible.
2. ****Given**** an `asOf` query, when retrieval runs, then state reflects that timestamp's valid version.

---

### US-002: Unified Graph Retrieval (Priority: P0)

**As a** retrieval engineer, **I want** causal/entity/summary signals fused in one retrieval path, **so that** ranking behavior is consistent and explainable.

**Acceptance Criteria**:
1. ****Given**** related entity and causal links, when retrieval runs, then both signals contribute through bounded scoring.
2. ****Given**** duplicate candidates from multiple channels, when fusion runs, then deterministic tie-breaking is applied.

---

### US-003: Governed Ingestion and Lifecycle (Priority: P0)

**As a** compliance-focused operator, **I want** provenance, temporal markers, and retention/deletion policies enforced on ingest, **so that** memory operations remain auditable.

**Acceptance Criteria**:
1. ****Given**** ingested content without provenance metadata, when save is attempted, then ingestion is rejected or quarantined.
2. ****Given**** deletion request for scoped memory, when cascade runs, then derived artifacts are removed and audited.

---

### US-004: Adaptive Retrieval Loops (Priority: P1)

**As a** ranking owner, **I want** access/outcome/correction signals to improve retrieval over time, **so that** memory recall quality improves without manual retuning.

**Acceptance Criteria**:
1. ****Given**** explicit correction feedback, when adaptation job runs, then candidate weighting updates within defined safety bounds.
2. ****Given**** rollback trigger, when adaptation is disabled, then previous ranking behavior is restored.

---

### US-005: Shared-Memory Collaboration (Priority: P1)

**As a** multi-agent workflow designer, **I want** shared memory spaces with strict policy boundaries, **so that** agents can collaborate without leaking private context.

**Acceptance Criteria**:
1. ****Given**** private and shared scopes, when retrieval runs in shared mode, then only authorized shared nodes are visible.
2. ****Given**** concurrent writes in a shared space, when conflict policy executes, then resolution follows configured strategy.

---

## 12. OPEN QUESTIONS

- Which existing identifiers are canonical for future hierarchy (`tenant_id`, `workspace_id`, `user_id`, `agent_id`, `session_id`)?
- Should lineage be event-sourced only, or do we need materialized "current state" projections from day one?
- What minimum governance policy set is required before any shared-memory beta?
- Where should retrieval outcome signals be persisted for safe rollback and explainability?
- Which retention/deletion compliance profiles are mandatory in the first implementation wave?
- What rollout guardrail thresholds should block progression between phases?

---

## RELATED DOCUMENTS

- **Hydra Architecture Analysis**: `research/001 - analysis-hydradb-architecture-and-turso-fit.md`
- **Hydra Recommendations**: `research/002 - recommendations-turso-migration-and-hydradb-inspired-roadmap.md`
- **Related Baseline Spec**: `../006-feature-catalog/spec.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---
title: "phase parent section [template:addendum/phase/phase-parent-section.md]"
description: "Template document for addendum/phase/phase-parent-section.md."
trigger_phrases:
  - "phase"
  - "parent"
  - "section"
  - "template"
  - "phase parent section"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_ADDENDUM: Phase - Parent Section -->
<!-- Append to parent spec.md after SCOPE section -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Scope | Dependencies | Status |
|-------|--------|-------|--------------|--------|
| 1 | 001-baseline-and-safety-rails/ | Build/runtime correctness, roadmap-safe capability metadata, checkpoint safety, schema compatibility, and baseline docs/tests | None | Complete |
| 2 | 002-versioned-memory-state/ | Append-first lineage, active projection, `asOf` semantics, backfill, and rollback safety | Phase 1 | Complete |
| 3 | 003-unified-graph-retrieval/ | Deterministic causal/entity/summary fusion with score traces and regression coverage | Phases 1-2 | Complete |
| 4 | 004-adaptive-retrieval-loops/ | Shadow-mode feedback learning with bounded updates, promotion gates, and rollback controls | Phases 1-3 | Complete |
| 5 | 005-hierarchical-scope-governance/ | Scope enforcement, governed ingest, retention/deletion lifecycle, and auditability | Phases 1-2 and governance ADR sequencing | Complete |
| 6 | 006-shared-memory-rollout/ | Shared spaces, membership policy, conflict handling, and staged rollout | Phases 3-5 | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-baseline-and-safety-rails | 002-versioned-memory-state | MCP build path, roadmap-safe flags, checkpoint helpers, compatibility checks, and docs are aligned | `npm run build`, focused Vitest sweep, manual phase-smoke commands |
| 002-versioned-memory-state | 003-unified-graph-retrieval | Lineage contract, active projection, `asOf` semantics, and rollback drills are stable | Lineage integrity tests, backfill drills, temporal-query verification |
| 003-unified-graph-retrieval | 004-adaptive-retrieval-loops | Unified graph scoring is deterministic, explainable, and benchmarked | Retrieval regression corpus, determinism suite, latency checks |
| 004-adaptive-retrieval-loops | 005-hierarchical-scope-governance | Shadow-mode learning is bounded, auditable, and rollback-safe | Shadow evaluation reports, bounded-update tests, rollback drill |
| 005-hierarchical-scope-governance | 006-shared-memory-rollout | Isolation, governed ingest, retention/deletion, and audit proofs all pass | Leak matrix, audit validation, lifecycle drills, rollback evidence |
<!-- /ANCHOR:phase-map -->

---

## Merged Section: 017-markovian-architectures

> **Merge note (2026-03-14)**: The content below was originally in `017-markovian-architectures/spec.md` (Level 2, Implemented). It documents the bounded first milestone that turns 015's roadmap primitives into concrete implementations: trace-only session transitions, bounded graph-walk scoring, and advisory ingestion lifecycle forecasting. Branch: `017-markovian-architectures`. The 017 spec folder has been absorbed into 015 to reduce folder count.

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
| **Status** | Implemented and verified (100% milestone complete) |
| **Created** | 2026-03-14 |
| **Updated** | 2026-03-14 |
| **Branch** | `017-markovian-architectures` |
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
- Trace-only session transitions where `memory_context` forwards `sessionTransition` into `memory_search` and `memory_search` injects transition trace data post-cache.
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
- Broader rollout-hardening and deterministic rerun coverage beyond the focused first-milestone implementation.

### Planned Implementation Surface

| Surface | File Path | Planned Change |
|--------|-----------|----------------|
| Context handler | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` | Infer transition metadata and forward `sessionTransition` to `memory_search` (trace-enabled path only) |
| Search handler | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` | Own post-cache transition injection and graph-walk diagnostics/trace propagation |
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
| REQ-001 | Trace-only session transition support | Response trace reports `sessionTransition = { previousState, currentState, confidence, signalSources, reason? }` through existing `includeTrace` / response-trace controls; `previousState` is null on cold start (no sentinel strings), no live routing override occurs, and transition payload is excluded from non-trace metadata |
| REQ-002 | Bounded Stage 2 graph-walk signal | Graph-walk contribution is additive, capped, flag-guarded, and computed with deterministic normalization/restart behavior |
| REQ-003 | Deterministic ranking contract preserved | Stage 4 ordering and tie-break behavior remain deterministic with graph-walk enabled and disabled |
| REQ-004 | Advisory ingestion lifecycle forecasting | Ingest status can return ETA and failure-risk forecasts with confidence/caveat metadata; no blocking failures on sparse data |
| REQ-005 | Rollback safety | Feature flags can disable Markovian additions without schema-destructive rollback |
| REQ-006 | Stale-feature guardrail | Planning and implementation artifacts explicitly keep shadow scoring retired and novelty boost inactive |

### P1 - Required (complete or explicitly deferred)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Provenance trace clarity | `includeTrace` output clearly labels transition and graph-walk signal sources, and transition payload remains trace-scoped |
| REQ-008 | Telemetry contract | Retrieval telemetry emits `transitionDiagnostics` and `graphWalkDiagnostics` with stable field names and rollout attribution |
| REQ-009 | Evaluation baseline | Plan defines baseline/candidate comparisons for ranking quality, determinism, and latency |
| REQ-010 | Graduation boundary | Adaptive rollout is defined as optional post-milestone progression, not part of base milestone deliverable |
| REQ-011 | File-level task decomposition | `tasks.md` contains phase-based, file-aware implementation tasks |
| REQ-012 | Readiness caveat preservation | Branch prerequisite (`main` -> numbered feature branch) and low-quality memory save caveat remain documented |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:contracts -->
## 5. FUNCTIONAL CONTRACTS

### 5.1 Session Transition Trace Contract

Wire contract: `sessionTransition = { previousState, currentState, confidence, signalSources, reason? }`.

Returned only when trace is requested via existing controls (`includeTrace=true` / response-trace controls). `memory_context` forwards this payload into `memory_search`, and `memory_search` owns post-cache transition injection. No dedicated transition-trace feature flag is introduced in this milestone.

| Field | Type | Description | Notes |
|-------|------|-------------|-------|
| `previousState` | string \| null | Prior inferred state label | Null for cold start; sentinel strings are not used |
| `currentState` | string \| null | Current inferred state label | Trace-only, no routing enforcement |
| `confidence` | number | Inference confidence in [0, 1] | Clamped and deterministic |
| `signalSources` | string[] | Input signals used for inference | No raw sensitive payload |
| `reason` | string \| null | Human-readable explanation | Optional when evidence is weak |

### 5.2 Graph-Walk Diagnostics Contract

Graph diagnostics expose `raw`, `normalized`, `appliedBonus`, `capApplied`, and `rolloutState`.

| Field | Type | Description | Notes |
|-------|------|-------------|-------|
| `graphContribution.raw` | number | Raw graph-walk score before normalization | Internal trace/debug value |
| `graphContribution.normalized` | number | Normalized score used for additive contribution | Stable across equal inputs |
| `graphContribution.appliedBonus` | number | Final additive bonus applied in Stage 2 | Hard-capped by config/flag |
| `graphContribution.capApplied` | boolean | Whether bonus cap clipped the value | Required for diagnostics |
| `graphContribution.rolloutState` | string | `off`, `trace_only`, or `bounded_runtime` | Resolved via `SPECKIT_GRAPH_WALK_ROLLOUT` |

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
| Dependency | Numbered feature branch `017-markovian-architectures` | Satisfied for current implementation | Keep follow-up hardening work on this branch until checklist completion |
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
| REQ-008 | `tests/retrieval-telemetry.vitest.ts`, `tests/search-flags.vitest.ts` | Telemetry captures transition/graph diagnostics and rollout-state semantics without schema breaks |
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
| Research Translation | 15/20 | Strong prior research with full milestone translation and verification completed |
| Coordination | 8/10 | Requires synchronized updates across spec/plan/tasks/checklist |
| **Total** | **59/80** | **Level 2 (high-detail planning)** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

- None for this milestone. Future rollout-policy tuning and telemetry-depth expansion belong to later specs.
<!-- /ANCHOR:questions -->
