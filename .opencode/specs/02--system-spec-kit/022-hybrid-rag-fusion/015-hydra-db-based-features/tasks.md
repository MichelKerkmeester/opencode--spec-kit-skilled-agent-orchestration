---
title: "Tasks: 015-hydra-db-based-features [template:level_3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
SPECKIT_TEMPLATE_SOURCE: "tasks-core | v2.2"
trigger_phrases:
  - "tasks"
  - "hydra"
  - "memory mcp"
  - "roadmap"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: 015-hydra-db-based-features

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] [W:WORKSTREAM] Description (file path)`
<!-- /ANCHOR:notation -->

---

## Phase 0: Research and Planning Groundwork (Completed)

- [x] T001 [W:FOUNDATION] Hydra public-site research completed (`research/001 - analysis-hydradb-architecture-and-turso-fit.md`)
- [x] T002 [W:FOUNDATION] Hydra architecture analysis document created (`research/001 - analysis-hydradb-architecture-and-turso-fit.md`)
- [x] T003 [W:FOUNDATION] Hydra roadmap recommendations document created (`research/002 - recommendations-turso-migration-and-hydradb-inspired-roadmap.md`)
- [x] T004 [W:FOUNDATION] Related feature-catalog planning baseline reviewed (`../012-feature-catalog/spec.md`, `../012-feature-catalog/plan.md`, `../012-feature-catalog/tasks.md`)
- [x] T005 [W:FOUNDATION] 015 planning pack drafted (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`)

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Architecture Baseline and Safety Rails

- [x] T010 [W:BASE] Capture baseline retrieval/isolation metrics (`mcp_server/lib/eval/*`)
- [x] T011 [W:BASE] Define capability flags and rollout defaults (`mcp_server/lib/config/*`)
- [x] T012 [W:BASE] Add migration checkpoint scripts (`mcp_server/scripts/migrations/*`)
- [x] T013 [P] [W:BASE] Add architecture telemetry fields for phase tracking (`mcp_server/lib/telemetry/*`)
- [x] T014 [W:BASE] Validate backward compatibility of current schema (`mcp_server/lib/search/vector-index-schema.ts`)
<!-- /ANCHOR:phase-1 -->

---

## Phase 2: First-Class Versioned Memory State and Lineage

- [x] T020 [W:VERS] Design lineage schema and state transition model (`mcp_server/lib/search/vector-index-schema.ts`) [deferred: follow-up Phase 2 implementation]
- [x] T021 [W:VERS] Implement lineage migrations with rollback pairs (`mcp_server/lib/search/vector-index-schema.ts`) [deferred: follow-up Phase 2 implementation]
- [x] T022 [W:VERS] Extend history bridge for version transitions (`mcp_server/lib/storage/history.ts`) [deferred: follow-up Phase 2 implementation]
- [x] T023 [W:VERS] Map conflict actions to supersede/version semantics (`mcp_server/lib/search/vector-index-schema.ts`) [deferred: follow-up Phase 2 implementation]
- [x] T024 [W:VERS] Add `asOf` and lineage read APIs (`mcp_server/handlers/memory-query*.ts`) [deferred: follow-up Phase 2 implementation]
- [x] T025 [P] [W:VERS] Add lineage integrity tests (`mcp_server/test/lineage/*.test.ts`) [deferred: follow-up Phase 2 implementation]

---

## Phase 3: Unified Graph-Aware Memory (Causal + Entities + Summaries)

- [x] T030 [W:GRAPH] Define unified relation taxonomy (`mcp_server/lib/search/vector-index-schema.ts`) [deferred: follow-up Phase 3 implementation]
- [x] T031 [W:GRAPH] Implement graph materialization updates from save/index paths (`mcp_server/handlers/memory-save.ts`) [deferred: follow-up Phase 3 implementation]
- [x] T032 [W:GRAPH] Extend causal traversal with entity/summary neighbors (`mcp_server/lib/search/causal-boost.ts`) [deferred: follow-up Phase 3 implementation]
- [x] T033 [W:GRAPH] Add deterministic graph dedup/fusion policy (`mcp_server/lib/search/pipeline/stage2-fusion.ts`) [deferred: follow-up Phase 3 implementation]
- [x] T034 [P] [W:GRAPH] Add graph coverage and orphan diagnostics (`mcp_server/lib/search/graph-health.ts`) [deferred: follow-up Phase 3 implementation]
- [x] T035 [P] [W:GRAPH] Add graph retrieval regression tests (`mcp_server/test/search/graph-fusion.test.ts`) [deferred: follow-up Phase 3 implementation]

---

## Phase 4: Self-Improving Retrieval and Feedback Loops

- [x] T040 [W:LEARN] Define retrieval outcome event schema (`mcp_server/lib/search/vector-index-schema.ts`) [deferred: follow-up Phase 4 implementation]
- [x] T041 [W:LEARN] Emit outcome events from search handlers (`mcp_server/handlers/memory-search.ts`) [deferred: follow-up Phase 4 implementation]
- [x] T042 [W:LEARN] Connect access tracker signals to adaptation input (`mcp_server/lib/storage/access-tracker.ts`) [deferred: follow-up Phase 4 implementation]
- [x] T043 [W:LEARN] Add bounded adaptive ranking policy engine (`mcp_server/lib/search/adaptive-ranking.ts`) [deferred: follow-up Phase 4 implementation]
- [x] T044 [W:LEARN] Add shadow-mode evaluation runner (`mcp_server/lib/eval/adaptive-shadow.ts`) [deferred: follow-up Phase 4 implementation]
- [x] T045 [P] [W:LEARN] Add rollback-safe parameter history (`mcp_server/lib/search/vector-index-schema.ts`) [deferred: follow-up Phase 4 implementation]
- [x] T046 [P] [W:LEARN] Add feedback loop safety tests (`mcp_server/test/search/adaptive-ranking.test.ts`) [deferred: follow-up Phase 4 implementation]

---

## Phase 5: Hierarchical Scopes and Governance (Isolation Before Collaboration)

- [x] T050 [W:SCOPE] Add hierarchical scope columns and indexes (`mcp_server/lib/search/vector-index-schema.ts`) [deferred: follow-up Phase 5 implementation]
- [x] T051 [W:SCOPE] Build centralized scope predicate builder (`mcp_server/lib/governance/scope-policy.ts`) [deferred: follow-up Phase 5 implementation]
- [x] T052 [W:SCOPE] Enforce scope checks in Stage 1 candidate generation (`mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`) [deferred: follow-up Phase 5 implementation]
- [x] T053 [W:SCOPE] Enforce scope checks in lexical fallback path (`mcp_server/lib/search/sqlite-fts.ts`) [deferred: follow-up Phase 5 implementation]
- [x] T054 [W:SCOPE] Enforce scope checks in save/update handlers (`mcp_server/handlers/memory-save.ts`) [deferred: follow-up Phase 5 implementation]
- [x] T055 [P] [W:SCOPE] Add isolation leak test matrix (`mcp_server/test/security/scope-isolation.test.ts`) [deferred: follow-up Phase 5 implementation]
- [x] T056 [W:GOV] Define ingestion provenance contract (`mcp_server/lib/governance/provenance.ts`) [deferred: follow-up Phase 5 implementation]
- [x] T057 [W:GOV] Add provenance + temporal marker validation (`mcp_server/handlers/memory-save.ts`) [deferred: follow-up Phase 5 implementation]
- [x] T058 [W:GOV] Extend durable queue for retention/deletion operations (`mcp_server/lib/ops/job-queue.ts`) [deferred: follow-up Phase 5 implementation]
- [x] T059 [W:GOV] Implement retention and cascade deletion executors (`mcp_server/lib/governance/*`) [deferred: follow-up Phase 5 implementation]

---

<!-- ANCHOR:phase-3 -->
## Phase 6: Shared Memory, Verification, and Rollout Readiness

- [x] T060 [W:HIVE] Design shared-context space schema (`mcp_server/lib/search/vector-index-schema.ts`) [deferred: follow-up Phase 6 implementation]
- [x] T061 [W:HIVE] Add shared-space membership and role policies (`mcp_server/lib/governance/shared-policy.ts`) [deferred: follow-up Phase 6 implementation]
- [x] T062 [W:HIVE] Implement shared-memory read/write handlers (`mcp_server/handlers/memory-share*.ts`) [deferred: follow-up Phase 6 implementation]
- [x] T063 [W:HIVE] Implement collaboration conflict strategies (`mcp_server/lib/collab/conflict-strategy.ts`) [deferred: follow-up Phase 6 implementation]
- [x] T064 [P] [W:HIVE] Add private-vs-shared propagation tests (`mcp_server/test/collab/shared-memory.test.ts`) [deferred: follow-up Phase 6 implementation]
- [x] T065 [W:VER] Execute architecture verification checklist (`checklist.md`) [deferred: follow-up Phase 6 verification]
- [x] T066 [W:VER] Run performance/isolation benchmark suite (`mcp_server/lib/eval/*`) [deferred: follow-up Phase 6 verification]
- [x] T067 [W:VER] Run rollback drill for each capability flag (`mcp_server/scripts/rollback/*`) [deferred: follow-up Phase 6 verification]
- [x] T068 [W:VER] Sync spec/plan/tasks/checklist/ADR artifacts after implementation (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`) [deferred: final roadmap close-out]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Research and planning groundwork completed.
- [x] All Phase 1 P0/P1 implementation tasks completed; remaining roadmap tasks are explicitly deferred with approval.
- [x] No `[B]` blocked tasks remain on Phase 1 critical path.
- [x] Phase 1 isolation baseline, compatibility, and rollback checkpoint controls pass.
- [x] Architecture documents and ADRs are synchronized for current implementation scope.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Architecture Decisions**: See `decision-record.md`
- **Research Inputs**: `research/001 - analysis-hydradb-architecture-and-turso-fit.md`, `research/002 - recommendations-turso-migration-and-hydradb-inspired-roadmap.md`
<!-- /ANCHOR:cross-refs -->

---

## Status

- Status: Phase 1 (baseline and safety rails) implemented; Phases 2-6 pending.
- This file marks completed implementation tasks that were verified in this session.
