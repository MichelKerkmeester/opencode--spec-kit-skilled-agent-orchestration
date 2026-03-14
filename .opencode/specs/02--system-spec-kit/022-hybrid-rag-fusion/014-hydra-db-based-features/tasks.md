---
title: "Tasks: 014-hydra-db-based-features [template:level_3/tasks.md]"
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
# Tasks: 014-hydra-db-based-features

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
- [x] T004 [W:FOUNDATION] Related feature-catalog planning baseline reviewed (`../011-feature-catalog/spec.md`, `../011-feature-catalog/plan.md`, `../011-feature-catalog/tasks.md`)
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

- [x] T020 [W:VERS] Design lineage schema and state transition model (`mcp_server/lib/search/vector-index-schema.ts`)
- [x] T021 [W:VERS] Implement lineage migrations with rollback pairs (`mcp_server/lib/search/vector-index-schema.ts`)
- [x] T022 [W:VERS] Extend history bridge for version transitions (`mcp_server/lib/storage/history.ts`)
- [x] T023 [W:VERS] Map conflict actions to supersede/version semantics (`mcp_server/lib/search/vector-index-schema.ts`)
- [x] T024 [W:VERS] Add `asOf` and lineage read APIs (`mcp_server/handlers/memory-query*.ts`)
- [x] T025 [P] [W:VERS] Add lineage integrity tests (`mcp_server/test/lineage/*.test.ts`)

---

## Phase 3: Unified Graph-Aware Memory (Causal + Entities + Summaries)

- [x] T030 [W:GRAPH] Define unified relation taxonomy (`mcp_server/lib/search/vector-index-schema.ts`)
- [x] T031 [W:GRAPH] Implement graph materialization updates from save/index paths (`mcp_server/handlers/memory-save.ts`)
- [x] T032 [W:GRAPH] Extend causal traversal with entity/summary neighbors (`mcp_server/lib/search/causal-boost.ts`)
- [x] T033 [W:GRAPH] Add deterministic graph dedup/fusion policy (`mcp_server/lib/search/pipeline/stage2-fusion.ts`)
- [x] T034 [P] [W:GRAPH] Add graph coverage and orphan diagnostics (`mcp_server/lib/search/graph-health.ts`)
- [x] T035 [P] [W:GRAPH] Add graph retrieval regression tests (`mcp_server/test/search/graph-fusion.test.ts`)

---

## Phase 4: Self-Improving Retrieval and Feedback Loops

- [x] T040 [W:LEARN] Define retrieval outcome event schema (`mcp_server/lib/search/vector-index-schema.ts`)
- [x] T041 [W:LEARN] Emit outcome events from search handlers (`mcp_server/handlers/memory-search.ts`)
- [x] T042 [W:LEARN] Connect access tracker signals to adaptation input (`mcp_server/lib/storage/access-tracker.ts`)
- [x] T043 [W:LEARN] Add bounded adaptive ranking policy engine (`mcp_server/lib/search/adaptive-ranking.ts`)
- [x] T044 [W:LEARN] Add shadow-mode evaluation runner (`mcp_server/lib/eval/adaptive-shadow.ts`)
- [x] T045 [P] [W:LEARN] Add rollback-safe parameter history (`mcp_server/lib/search/vector-index-schema.ts`)
- [x] T046 [P] [W:LEARN] Add feedback loop safety tests (`mcp_server/test/search/adaptive-ranking.test.ts`)

---

## Phase 5: Hierarchical Scopes and Governance (Isolation Before Collaboration)

- [x] T050 [W:SCOPE] Add hierarchical scope columns and indexes (`mcp_server/lib/search/vector-index-schema.ts`)
- [x] T051 [W:SCOPE] Build centralized scope predicate builder (`mcp_server/lib/governance/scope-policy.ts`)
- [x] T052 [W:SCOPE] Enforce scope checks in Stage 1 candidate generation (`mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`)
- [x] T053 [W:SCOPE] Enforce scope checks in lexical fallback path (`mcp_server/lib/search/sqlite-fts.ts`)
- [x] T054 [W:SCOPE] Enforce scope checks in save/update handlers (`mcp_server/handlers/memory-save.ts`)
- [x] T055 [P] [W:SCOPE] Add isolation leak test matrix (`mcp_server/test/security/scope-isolation.test.ts`)
- [x] T056 [W:GOV] Define ingestion provenance contract (`mcp_server/lib/governance/provenance.ts`)
- [x] T057 [W:GOV] Add provenance + temporal marker validation (`mcp_server/handlers/memory-save.ts`)
- [x] T058 [W:GOV] Extend durable queue for retention/deletion operations (`mcp_server/lib/ops/job-queue.ts`)
- [x] T059 [W:GOV] Implement retention and cascade deletion executors (`mcp_server/lib/governance/*`)

---

<!-- ANCHOR:phase-3 -->
## Phase 6: Shared Memory, Verification, and Rollout Readiness

- [x] T060 [W:HIVE] Design shared-context space schema (`mcp_server/lib/search/vector-index-schema.ts`)
- [x] T061 [W:HIVE] Add shared-space membership and role policies (`mcp_server/lib/governance/shared-policy.ts`)
- [x] T062 [W:HIVE] Implement shared-memory read/write handlers (`mcp_server/handlers/memory-share*.ts`)
- [x] T063 [W:HIVE] Implement collaboration conflict strategies (`mcp_server/lib/collab/conflict-strategy.ts`)
- [x] T064 [P] [W:HIVE] Add private-vs-shared propagation tests (`mcp_server/test/collab/shared-memory.test.ts`)
- [x] T065 [W:VER] Execute architecture verification checklist (`checklist.md`)
- [x] T066 [W:VER] Run performance/isolation benchmark suite (`mcp_server/lib/eval/*`)
- [x] T067 [W:VER] Run rollback drill for each capability flag (`mcp_server/scripts/rollback/*`)
- [x] T068 [W:VER] Sync spec/plan/tasks/checklist/ADR artifacts after implementation (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`)
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

- Status: All phases (1-6) implemented. Code and tests verified 2026-03-14.
- Stale deferred annotations removed from T020-T068 during verification (implementation confirmed by 156 passing tests across 13 test files).

---

## Merged Section: 017-markovian-architectures Tasks

> **Merge note (2026-03-14)**: Originally `017-markovian-architectures/tasks.md`.

# Tasks: 017-markovian-architectures
<!-- SPECKIT_LEVEL: 2 -->
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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Preflight and Contract Freeze

- [x] T001 Create numbered feature branch and re-run prerequisites (`.opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh`)
- [x] T002 Define graph-walk rollout flag constants and defaults (`.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`)
- [x] T003 Validate graph-specific rollout gate alignment (`.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts`)
- [x] T004 Define additive cap and ordering invariants for Stage 2 (`.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts`)
- [x] T005 Capture transition/graph telemetry diagnostic fields used for before/after comparisons (`.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`)
- [x] T006 Confirm explicit exclusions remain documented (no MDP/MCTS/SSM; no shadow scoring/novelty hot path) (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Session Transition Trace

- [x] T010 Add transition inference helper and wiring point behind existing `includeTrace` / response-trace controls (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`)
- [x] T011 Propagate transition metadata through search handler response pipeline (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`)
- [x] T012 Add transition trace envelope fields and null-safe serialization (`.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`)
- [x] T017 Confirm no dedicated transition-trace feature flag is added in this milestone (`spec.md`, `plan.md`)
- [x] T013 [P] Emit transition observability fields in telemetry (`.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`)
- [x] T014 Add handler tests for missing/ephemeral/reused `sessionId` behavior (`.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts`)
- [x] T015 Add context-level transition trace contract tests (`.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.vitest.ts`)
- [x] T016 Add response-envelope tests for trace field presence/absence (`.opencode/skill/system-spec-kit/mcp_server/tests/mcp-response-envelope.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Bounded Graph-Walk Stage 2

- [x] T020 Add or refine normalized/restart-aware graph-walk helpers (`.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts`)
- [x] T021 Integrate bounded additive graph bonus into the existing Stage 2 hook (`.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts`, existing `stage2-fusion.ts` seam reused)
- [x] T022 Ensure ranking contract caps and tie behavior remain deterministic (`.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts`)
- [x] T023 Verify graph contribution metadata remains wired through the existing search handler payload path (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`)
- [x] T024 Extend trace formatter with graph contribution details and cap attribution (`.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts`)
- [x] T025 [P] Emit graph contribution telemetry fields (`.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`)
- [x] T026 Add Stage 2 deterministic ordering regression tests (`.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts`)
- [x] T027 Add graph signal normalization/cap tests (`.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts`)
- [x] T028 Add graph feature-eval coverage for bounded rollout (`.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts`)
- [x] T029 Add trace formatting tests for graph contribution payload (`.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Ingestion Lifecycle Forecasting

- [x] T030 Add queue-based ETA/failure-risk forecast helper(s) (`.opencode/skill/system-spec-kit/mcp_server/lib/ops/job-queue.ts`)
- [x] T031 Surface advisory forecast fields in ingest handler responses (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts`)
- [x] T032 Add confidence/caveat fallback logic for sparse history (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts`)
- [x] T033 [P] Add optional lifecycle telemetry instrumentation (`.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts`)
- [x] T034 Add queue forecast unit tests (`.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-ingest.vitest.ts`)
- [x] T035 Add edge-case tests for cold/sparse/failure-prone queue states (`.opencode/skill/system-spec-kit/mcp_server/tests/job-queue-state-edge.vitest.ts`)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Validation, Rollout, and Documentation Sync

- [x] T040 Validate rollout membership and flag gating behavior (`.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts`)
- [x] T041 Keep adaptive-ranking integration bounded and optional for post-milestone graduation (`.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/adaptive-ranking.ts`)
- [x] T042 Verify no reintroduction of retired shadow scoring or novelty boost hot-path logic (`.opencode/skill/system-spec-kit/mcp_server/tests/mpab-quality-gate-integration.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/cold-start.vitest.ts`)
- [x] T043 Run targeted test suite for transition, graph, envelope, telemetry, deterministic reruns, rollout flags, and retirement regression contracts (`npx vitest run tests/search-flags.vitest.ts tests/stage2-fusion.vitest.ts tests/feature-eval-graph-signals.vitest.ts tests/search-results-format.vitest.ts tests/memory-context.vitest.ts tests/handler-memory-ingest.vitest.ts tests/retrieval-telemetry.vitest.ts tests/mpab-quality-gate-integration.vitest.ts tests/cold-start.vitest.ts tests/rollout-policy.vitest.ts tests/adaptive-ranking.vitest.ts tests/graph-roadmap-finalization.vitest.ts`)
- [x] T044 Perform deterministic rerun checks with graph flag off/on (`.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`)
- [x] T045 Confirm rollback drill instructions and kill switches are current (`plan.md`, `checklist.md`)
- [x] T046 Update planning docs with implementation deltas after coding (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`)
- [x] T047 Save fresh context via generator and verify indexing state (`node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`)
- [x] T048 Synchronize external feature catalog and manual-testing coverage for transition trace, graph-walk rollout, and advisory forecast scenarios (`.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md`, `.opencode/skill/system-spec-kit/feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md`, `.opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/05-async-ingestion-job-lifecycle.md`, `.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md`, `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:blockers -->
## Active Blockers

- [x] B001 Numbered feature branch created: current branch is `017-markovian-architectures`.
- [x] B002 Prior memory artifact quality caveat is tracked outside this runtime-sync task state.
- [x] B003 Follow-up work for deterministic reruns, rollout hardening, and untouched-surface dependent tasks is complete (`T003`-`T004`, `T015`, `T022`, `T026`, `T028`-`T029`, `T033`, `T040`-`T044`).
<!-- /ANCHOR:blockers -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0/P1 planning checklist items are either complete or explicitly deferred with approval.
- [x] Core first-milestone code paths for transition trace, bounded graph-walk scoring, and advisory forecasting are implemented.
- [x] All tasks required for first milestone are marked `[x]` or explicitly deferred.
- [x] No `[B]` blocked tasks remain without mitigation plan.
- [x] Focused Vitest suites pass for transition/graph/forecast/envelope coverage.
- [x] Scope remains bounded to first milestone (no MDP/MCTS/SSM-runtime expansion).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Readiness Checklist**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
