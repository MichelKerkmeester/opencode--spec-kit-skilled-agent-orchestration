---
title: "Feature Specification: 015-hydra-db-based-features"
description: "Level 3 roadmap for HydraDB-inspired memory-state capabilities in system-spec-kit and the Spec Kit Memory MCP server."
trigger_phrases:
  - "hydra"
  - "memory state"
  - "lineage"
  - "governance"
  - "shared memory"
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
importance_tier: "critical"
contextType: "decision"
---
# Feature Specification: 015-hydra-db-based-features

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This document defines a Level 3 roadmap for evolving `system-spec-kit` and the Spec Kit Memory MCP server toward a HydraDB-inspired memory-state architecture. It is a planning artifact for future implementation and does not claim these roadmap features already exist.

**Present (today)**: the MCP server already includes useful primitives (hybrid retrieval, causal edges, history/conflict logs, working memory, access tracking, ingest queue), but they are distributed across subsystems.

**Target (roadmap)**: unify those primitives into first-class versioned memory state with lineage, graph-aware retrieval, adaptive feedback loops, hierarchical scope isolation, governed ingestion/lifecycle controls, and shared-memory collaboration spaces.

**Key Decisions**: evolutionary extension of the existing MCP server, lineage-first milestone ordering, governance-before-collaboration enforcement.

**Critical Dependencies**: local research docs in this folder, existing MCP storage/retrieval subsystems, and policy/governance design decisions.

[Assumes: HydraDB architecture guidance is inferred from publicly available HydraDB pages and blog content, not from HydraDB source code.]
[Assumes: Any HydraDB details referenced here are treated as design inspiration to validate locally, not as implementation facts about this repository.]

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-13 |
| **Updated** | 2026-03-13 |
| **Branch** | `022-hybrid-rag-fusion` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current Memory MCP stack has strong retrieval and memory primitives, but no single end-to-end state model that guarantees lineage, temporal correctness, strict hierarchy boundaries, and governed collaboration. That gap limits reliability for long-running multi-agent workflows and enterprise governance requirements.

### Purpose
Define an implementation-ready roadmap that turns the current memory toolset into a coherent memory-state platform while preserving backward compatibility and rollout safety.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Roadmap for first-class versioned memory state and lineage.
- Roadmap for unified graph-aware retrieval across causal/entity/summary signals.
- Roadmap for self-improving retrieval loops from access/outcome/correction signals.
- Roadmap for hierarchical isolation across tenant/user/agent/session boundaries.
- Roadmap for governed ingestion with provenance, temporal markers, retention, and deletion.
- Roadmap for shared-memory collaboration spaces with policy controls.
- Sequencing, risks, and verification criteria for future implementation.

### Out of Scope
- Immediate implementation of roadmap phases.
- Claims that Hydra-inspired capabilities are already shipped.
- Greenfield rewrite of the Memory MCP server.
- `implementation-summary.md` creation in this planning step.
- Edits to the two existing research docs in this folder.

### Files Likely to Change (Future Implementation)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Lineage, scope, provenance, retention, and collaboration schema extensions |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/history.ts` | Modify | Event-to-lineage transition mapping |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Modify | Scope/time prefilters and graph-aware candidate fusion hooks |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts` | Modify | Unified graph scoring across causal/entity/summary relations |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts` | Modify | Retrieval outcome and correction signal capture |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Provenance validation and governance gates on ingestion |
| `.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts` | Modify | Retention/deletion pipeline jobs and replay-safe lifecycle |
| `.opencode/skill/system-spec-kit/mcp_server/lib/governance/` | Create | Policy, retention, audit, and deletion enforcement modules |
| `.opencode/skill/system-spec-kit/mcp_server/lib/collab/` | Create | Shared-memory space policy and conflict strategy modules |
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

- **SC-001**: All six focus areas are traceable from `spec.md` to `plan.md` and `tasks.md`.
- **SC-002**: The roadmap explicitly distinguishes present capabilities from target capabilities in all planning docs.
- **SC-003**: At least 90% of tasks in `tasks.md` are implementation-pending, with completed items limited to existing research/planning groundwork.
- **SC-004**: The three ADR decisions are documented and reflected in phase ordering.
- **SC-005**: Checklist confirms planning readiness without claiming implementation test execution.
- **SC-006**: No template placeholders remain in the five planning artifacts.
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
- **Related Baseline Spec**: `../012-feature-catalog/spec.md`
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
| 1 | 001-baseline-and-safety-rails/ | Build/runtime correctness, roadmap-safe capability metadata, checkpoint safety, schema compatibility, and baseline docs/tests | None | Active |
| 2 | 002-versioned-memory-state/ | Append-first lineage, active projection, `asOf` semantics, backfill, and rollback safety | Phase 1 | Draft |
| 3 | 003-unified-graph-retrieval/ | Deterministic causal/entity/summary fusion with score traces and regression coverage | Phases 1-2 | Draft |
| 4 | 004-adaptive-retrieval-loops/ | Shadow-mode feedback learning with bounded updates, promotion gates, and rollback controls | Phases 1-3 | Draft |
| 5 | 005-hierarchical-scope-governance/ | Scope enforcement, governed ingest, retention/deletion lifecycle, and auditability | Phases 1-2 and governance ADR sequencing | Draft |
| 6 | 006-shared-memory-rollout/ | Shared spaces, membership policy, conflict handling, and staged rollout | Phases 3-5 | Draft |

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
